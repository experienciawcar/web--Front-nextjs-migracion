import { apiUrl } from "@/modules/shared/services/api";

import type {
  BlogArticle,
  BlogDetailDto,
  BlogIndex,
  BlogListDto,
  BlogParagraph,
  BlogPost,
  BlogPostDto,
} from "../types/blog";

/**
 * Cada cuánto se vuelve a pedir el blog. Las fotos vienen como URLs firmadas que caducan a las
 * 24 h y quedan dentro de la página cacheada: una hora, como los demás servicios.
 */
const REVALIDATE_SECONDS = 60 * 60;

/** Artículos por página del listado: los que entrega el backend en cada `?page=`. */
export const BLOG_PAGE_SIZE = 20;

/** "Sala de Prensa": el único artículo de prensa es el id 50 (regla del sitio anterior). */
export const PRESS_POST_ID = 50;
export const PRESS_TAG = "prensa";

const TIME_ZONE = "America/Bogota";
const dateFormatter = new Intl.DateTimeFormat("es-CO", {
  timeZone: TIME_ZONE,
  day: "numeric",
  month: "long",
  year: "numeric",
});

function formatDate(iso: string): { short: string; long: string } {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return { short: "", long: "" };
  const parts = Object.fromEntries(dateFormatter.formatToParts(date).map((part) => [part.type, part.value]));
  return {
    short: `${parts.month} ${parts.day}, ${parts.year}`,
    long: `${parts.day} de ${parts.month} de ${parts.year}`,
  };
}

/** El slug del enlace: el que administra el backoffice con los espacios cambiados por guiones (igual que el sitemap del sitio anterior). */
function toSlug(dto: BlogPostDto): string {
  return (dto.url_post || dto.title).trim().replace(/\s+/g, "-");
}

/** Enlace a un artículo. El `id` viaja en la query (el backend no resuelve por slug), pero sin él la página lo busca por slug. */
export function blogArticleHref(id: number, slug: string): string {
  return `/blog/${encodeURIComponent(slug)}?id=${id}`;
}

function toPost(dto: BlogPostDto): BlogPost {
  const dates = formatDate(dto.created_at);
  const slug = toSlug(dto);
  const tag = dto.tagName?.trim() || null;
  return {
    id: dto.id,
    title: dto.title.trim(),
    slug,
    href: blogArticleHref(dto.id, slug),
    tag,
    tagKey: tag?.toLowerCase() ?? "",
    isPress: dto.id === PRESS_POST_ID,
    dateLabel: dates.short,
    dateLongLabel: dates.long,
    dateIso: dto.created_at,
    updatedIso: dto.updated_at || dto.created_at,
    photoUrl: dto.photoUrl || null,
  };
}

async function fetchJson<T>(path: string, init?: RequestInit): Promise<T> {
  const url = apiUrl(path);
  const response = await fetch(url, { next: { revalidate: REVALIDATE_SECONDS }, ...init });
  if (!response.ok) {
    throw new Error(`${init?.method ?? "GET"} ${url} respondió ${response.status}`);
  }
  return response.json();
}

/**
 * Todos los artículos activos, del más reciente al más antiguo, y el destacado (`main_post`).
 *
 * Se piden todas las páginas del backend (`GET /post/?page=N`, hoy 10) y no solo la que se ve:
 * así el filtro por categoría y "Sala de Prensa" buscan en el catálogo completo (el sitio anterior
 * solo filtraba los 20 de la página cargada) y un enlace `/blog/<slug>` sin `?id=` (el del sitemap)
 * se puede resolver. Las respuestas se cachean una hora.
 *
 * Si el backend falla devuelve el listado vacío y el error queda en el log.
 */
export async function getBlogIndex(): Promise<BlogIndex> {
  try {
    const first = await fetchJson<BlogListDto>("/post/?page=1");
    const numPages = Math.max(first.num_pages ?? 1, 1);

    const rest = await Promise.all(
      Array.from({ length: numPages - 1 }, (_, index) =>
        fetchJson<BlogListDto>(`/post/?page=${index + 2}`).catch((error) => {
          console.error(`No se pudo cargar la página ${index + 2} del blog:`, error);
          return { blogs: [] } as BlogListDto;
        }),
      ),
    );

    const posts = [first, ...rest]
      .flatMap((page) => page.blogs ?? [])
      .filter((dto) => dto.active === true)
      .map(toPost);

    return { posts, mainPost: first.main_post ? toPost(first.main_post) : null };
  } catch (error) {
    console.error("No se pudo cargar el blog:", error);
    return { posts: [], mainPost: null };
  }
}

/**
 * `json_filter_cars` es un JSON dentro de un string dentro del JSON de la respuesta (doble
 * serialización) con campos vacíos como `""`, `false` y `null`. Se deshace y se limpia para
 * `POST /v2/filter-cars/`, que espera las listas como arreglos (`brand: 126` → `[126]`).
 * `null` si no hay filtro utilizable.
 */
function parseVehicleFilter(raw: string | null): Record<string, unknown> | null {
  if (!raw) return null;
  try {
    let parsed: unknown = JSON.parse(raw);
    if (typeof parsed === "string") parsed = JSON.parse(parsed);
    if (!parsed || typeof parsed !== "object") return null;

    const ARRAY_FIELDS = new Set(["body_type", "brand", "model", "fuel_type", "tag", "sedes", "colors"]);
    const filter: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(parsed)) {
      if (value === null || value === false || value === "" || (Array.isArray(value) && value.length === 0)) continue;
      filter[key] = ARRAY_FIELDS.has(key) && !Array.isArray(value) ? [value] : value;
    }
    return Object.keys(filter).length > 0 ? filter : null;
  } catch {
    return null;
  }
}

/**
 * Descripción de respaldo para un artículo sin `metaDescription`: el texto del primer párrafo con
 * contenido, sin etiquetas, recortado a 155 caracteres en un límite de palabra. `null` si no hay texto.
 */
function descriptionFromParagraphs(paragraphs: BlogParagraph[]): string | null {
  for (const paragraph of paragraphs) {
    const text = paragraph.html
      .replace(/<[^>]*>/g, " ")
      .replace(/&nbsp;/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    if (!text) continue;
    if (text.length <= 155) return text;
    return `${text.slice(0, 155).replace(/\s+\S*$/, "")}…`;
  }
  return null;
}

/**
 * Un artículo con sus párrafos (`GET /post/{id}/`). `null` si no existe, está inactivo o el
 * backend falla (la página responde 404).
 */
export async function getBlogArticle(id: number): Promise<BlogArticle | null> {
  try {
    const detail = await fetchJson<BlogDetailDto>(`/post/${id}/`);
    if (!detail.post || detail.post.active === false) return null;

    const paragraphs: BlogParagraph[] = [...(detail.paragraphs ?? [])]
      .filter((paragraph) => paragraph.active !== false)
      .sort((a, b) => a.order - b.order)
      .map((paragraph) => ({
        id: paragraph.id,
        title: paragraph.title_paragraph?.trim() || null,
        titleLevel: paragraph.title_h3 ? 3 : 2,
        html: paragraph.content ?? "",
        file: paragraph.file ? { url: paragraph.file, isVideo: paragraph.type_file === true } : null,
      }));

    return {
      post: toPost(detail.post),
      metaTitle: detail.post.metaTitle?.trim() || detail.post.title.trim(),
      metaDescription: detail.post.metaDescription?.trim() || descriptionFromParagraphs(paragraphs),
      paragraphs,
      vehicleFilter: parseVehicleFilter(detail.post.json_filter_cars),
    };
  } catch (error) {
    console.error(`No se pudo cargar el artículo ${id}:`, error);
    return null;
  }
}

/** El id de un artículo a partir de su slug, para los enlaces sin `?id=` (sitemap, buscadores). */
export async function findBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const { posts } = await getBlogIndex();
  // Los slugs del sitemap del sitio anterior mezclan mayúsculas y minúsculas: se acepta cualquiera
  // y la página redirige al slug canónico.
  const lower = slug.toLowerCase();
  return posts.find((post) => post.slug === slug) ?? posts.find((post) => post.slug.toLowerCase() === lower) ?? null;
}

/** Hasta `limit` artículos de la misma categoría que `post` (los más recientes), para enlazar entre artículos. */
export async function getRelatedBlogPosts(post: BlogPost, limit = 4): Promise<BlogPost[]> {
  if (!post.tagKey) return [];
  const { posts } = await getBlogIndex();
  return posts.filter((item) => item.tagKey === post.tagKey && item.id !== post.id).slice(0, limit);
}
