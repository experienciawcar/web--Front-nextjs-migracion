import type { Metadata } from "next";

import BlogHeroComponent from "@/modules/blog/components/BlogHeroComponent";
import BlogListComponent from "@/modules/blog/components/BlogListComponent";
import { getBlogIndex } from "@/modules/blog/services/blog";
import { blogListHref } from "@/modules/blog/utils/href";
import { buildPageMetadata } from "@/modules/shared/utils/seo";

type PageProps = {
  searchParams: Promise<{ page?: string; tag?: string }>;
};

function parsePage(value: string | undefined): number {
  const page = Number(value);
  return Number.isInteger(page) && page > 0 ? page : 1;
}

/**
 * TODO(seo): título y descripción escritos desde el diseño; confirmar con marketing la palabra
 * clave. El canonical de cada página del listado es ella misma (`?page=N`); el filtro por
 * categoría no cambia el canonical: es el mismo listado, filtrado.
 */
export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const { page } = await searchParams;
  return buildPageMetadata({
    title: "Blog WCAR | Guías y noticias de autos usados",
    description:
      "Guías de compra, consejos de financiación y noticias sobre autos usados en Colombia. Lee el blog de WCAR y decide con información.",
    path: blogListHref({ page: parsePage(page) }),
  });
}

/**
 * Vista Blog: el artículo destacado (`main_post`) y el listado paginado con filtro por categoría.
 * Contrato y reglas del sitio anterior en `docs/MODULO_BLOG.md`; diseño: captura del desktop
 * 1920 (sin Figma ni mobile).
 *
 * La página y la categoría viajan en la URL (`?page=`, `?tag=`), no en estado. El `<h1>` está
 * oculto: el diseño no trae un título de página, y el del destacado es el de un artículo.
 * TODO: confirmar con diseño si el listado lleva un título visible.
 */
export default async function BlogPage({ searchParams }: PageProps) {
  const { page, tag } = await searchParams;
  const { posts, mainPost } = await getBlogIndex();

  return (
    <main className="flex-1">
      <h1 className="sr-only">Blog WCAR: guías y noticias de autos usados</h1>
      {mainPost && <BlogHeroComponent post={mainPost} />}
      <BlogListComponent posts={posts} page={parsePage(page)} tag={(tag ?? "").toLowerCase()} />
    </main>
  );
}
