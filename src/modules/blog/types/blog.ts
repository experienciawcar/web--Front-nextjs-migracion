/**
 * Un artículo tal como lo entrega `GET /api/post/` (listado) y `GET /api/post/{id}/`
 * (`post` del detalle). Solo los campos que se leen: el backend manda más (`user`, `content`,
 * `car_ids`, `updated_at`...). Mezcla convenciones: `created_at`/`url_post` en snake_case y
 * `photoUrl`/`tagName`/`metaTitle` en camelCase.
 */
export type BlogPostDto = {
  id: number;
  title: string;
  tagName: string | null;
  created_at: string;
  updated_at: string | null;
  photoUrl: string | null;
  active: boolean;
  /** Slug que administra el backoffice, con espacios ("Kia Soluto usado en Colombia"). */
  url_post: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  /** Filtro de vehículos del artículo: un JSON serializado dos veces (un string dentro de un string). */
  json_filter_cars: string | null;
};

/** `GET /api/post/?page=N`: 20 artículos por página; `main_post` es el destacado. */
export type BlogListDto = {
  blogs?: BlogPostDto[];
  main_post?: BlogPostDto | null;
  num_pages?: number;
};

/** Un párrafo del detalle. `file` es una foto, o un video si `type_file` es verdadero. */
export type BlogParagraphDto = {
  id: number;
  order: number;
  active?: boolean;
  title_paragraph: string | null;
  /** El título va como `<h3>` en vez de `<h2>`. */
  title_h3: boolean;
  /** HTML del editor (CKEditor). */
  content: string | null;
  file: string | null;
  type_file: boolean;
};

export type BlogDetailDto = {
  post?: BlogPostDto;
  paragraphs?: BlogParagraphDto[];
};

/** Un artículo listo para pintar en una tarjeta o en el destacado. */
export type BlogPost = {
  id: number;
  title: string;
  /** Slug con guiones, el del enlace y el del sitemap. */
  slug: string;
  href: string;
  /** Categoría para mostrar ("wcar news"); `null` si el artículo no tiene. */
  tag: string | null;
  /** Categoría en minúsculas, la que viaja en `?tag=`. Vacía si no tiene. */
  tagKey: string;
  isPress: boolean;
  /** "septiembre 28, 2026" (tarjeta). */
  dateLabel: string;
  /** "28 de septiembre de 2026" (destacado y detalle). */
  dateLongLabel: string;
  dateIso: string;
  /** Última edición; sirve de `lastmod` del sitemap y `dateModified` del JSON-LD. */
  updatedIso: string;
  photoUrl: string | null;
};

export type BlogIndex = {
  posts: BlogPost[];
  mainPost: BlogPost | null;
};

export type BlogParagraph = {
  id: number;
  title: string | null;
  titleLevel: 2 | 3;
  html: string;
  /** Foto o video adjunto. */
  file: { url: string; isVideo: boolean } | null;
};

export type BlogArticle = {
  post: BlogPost;
  metaTitle: string;
  metaDescription: string | null;
  paragraphs: BlogParagraph[];
  /** Body para `POST /v2/filter-cars/` con los vehículos del artículo; `null` si no configuró ninguno. */
  vehicleFilter: Record<string, unknown> | null;
};
