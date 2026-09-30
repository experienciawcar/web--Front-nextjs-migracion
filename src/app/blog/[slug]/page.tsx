import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";

import BlogArticleComponent from "@/modules/blog/components/BlogArticleComponent";
import BlogRelatedComponent from "@/modules/blog/components/BlogRelatedComponent";
import BlogVehiclesComponent from "@/modules/blog/components/BlogVehiclesComponent";
import { blogArticleHref, findBlogPostBySlug, getBlogArticle, getRelatedBlogPosts } from "@/modules/blog/services/blog";
import { getBlogVehicles } from "@/modules/blog/services/blog-vehicles";
import { buildPageMetadata, SITE_NAME, SITE_URL } from "@/modules/shared/utils/seo";

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ id?: string }>;
};

function safeDecode(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

/**
 * El artículo de la URL. El `id` llega en `?id=` (los enlaces del listado) y manda; sin él (el
 * sitemap y los buscadores entran por `/blog/<slug>`) se busca el artículo por su slug entre todos
 * los del blog. Devuelve también el slug que venía en la URL, para redirigir al canónico.
 */
async function loadArticle({ params, searchParams }: PageProps) {
  const [{ slug }, { id }] = await Promise.all([params, searchParams]);
  const requestedSlug = safeDecode(slug);
  let articleId = /^\d+$/.test(id ?? "") ? Number(id) : null;
  const hasId = articleId !== null;
  if (articleId === null) {
    articleId = (await findBlogPostBySlug(requestedSlug))?.id ?? null;
  }
  const article = articleId === null ? null : await getBlogArticle(articleId);
  return { article, requestedSlug, hasId };
}

const articlePath = (slug: string) => `/blog/${encodeURIComponent(slug)}`;

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const { article } = await loadArticle(props);
  if (!article) return {};

  const base = buildPageMetadata({
    title: article.metaTitle,
    description: article.metaDescription ?? article.post.title,
    path: articlePath(article.post.slug),
  });
  // La portada es una URL firmada de 24 h y la página se cachea 1 h: vigente para los scrapers de
  // vista previa. Sin ella, la imagen genérica del sitio.
  const photo = article.post.photoUrl;
  return {
    ...base,
    openGraph: {
      ...base.openGraph,
      type: "article",
      publishedTime: article.post.dateIso,
      modifiedTime: article.post.updatedIso,
      ...(photo ? { images: [{ url: photo, alt: article.post.title }] } : {}),
    },
    twitter: { ...base.twitter, ...(photo ? { images: [photo] } : {}) },
  };
}

/**
 * Detalle de un artículo del blog: `GET /post/{id}/`, el carrusel "Vehículos en venta" con el
 * filtro del backoffice y "Artículos relacionados". Lo que pedía `docs/DETALLE_BLOG.md`, resuelto
 * aquí de fábrica por ser Next (HTML con contenido y metas desde el servidor):
 * - Artículo inexistente o inactivo → 404 real (el sitio anterior: spinner eterno con 200).
 * - Un solo canonical: si el slug de la URL no es el del artículo (otra capitalización, otro
 *   texto) se redirige (308) al canónico, y el `?id=` solo es un atajo.
 * - `title`/`description` del backoffice (con la descripción cayendo al primer párrafo), Open
 *   Graph `article` con la portada, `twitter:card`, JSON-LD `BlogPosting` y `BreadcrumbList`.
 * - Sin `meta keywords`/`meta title` (sin valor SEO).
 */
export default async function BlogArticlePage(props: PageProps) {
  const { article, requestedSlug, hasId } = await loadArticle(props);
  if (!article) notFound();

  if (requestedSlug !== article.post.slug) {
    permanentRedirect(hasId ? blogArticleHref(article.post.id, article.post.slug) : articlePath(article.post.slug));
  }

  const [vehicles, related] = await Promise.all([
    getBlogVehicles(article.vehicleFilter),
    getRelatedBlogPosts(article.post),
  ]);

  const url = `${SITE_URL}${articlePath(article.post.slug)}`;
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: article.post.title,
      description: article.metaDescription ?? undefined,
      image: article.post.photoUrl ?? undefined,
      datePublished: article.post.dateIso,
      dateModified: article.post.updatedIso,
      inLanguage: "es-CO",
      mainEntityOfPage: url,
      author: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
      publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` },
        { "@type": "ListItem", position: 3, name: article.post.title, item: url },
      ],
    },
  ];

  return (
    <main className="flex-1">
      {jsonLd.map((data) => (
        <script
          key={data["@type"]}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
        />
      ))}
      <BlogArticleComponent article={article} />
      <BlogVehiclesComponent vehicles={vehicles} />
      <BlogRelatedComponent posts={related} />
    </main>
  );
}
