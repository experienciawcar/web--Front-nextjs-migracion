import AppLinkComponent from "@/modules/shared/components/AppLinkComponent";

import { BLOG_PAGE_SIZE, PRESS_POST_ID, PRESS_TAG } from "../services/blog";
import type { BlogPost } from "../types/blog";
import { blogListHref } from "../utils/href";
import BlogCardComponent from "./BlogCardComponent";
import BlogFiltersComponent from "./BlogFiltersComponent";
import BlogPaginationComponent from "./BlogPaginationComponent";

/**
 * "Últimos artículos": título, barra de filtros y cuadrícula de tarjetas paginada.
 *
 * El filtro y la página llegan ya resueltos por la URL (`tag`, `page`). Con categoría se filtra
 * sobre TODOS los artículos y se pagina de a 20 (el backend no filtra); sin ella es el orden del
 * backend. `tag=prensa` es "Sala de Prensa" (el artículo de id 50). Las categorías del
 * desplegable son las de todos los artículos, no las de la página.
 *
 * Diseño (captura): contenido de 1296 de ancho, cuadrícula de 4 columnas de 306 con 24 de
 * separación. Tablet 2-3 columnas y mobile una, adaptado sin diseño. Sin coincidencias se avisa
 * (el sitio anterior dejaba la cuadrícula vacía).
 */
export default function BlogListComponent({
  posts,
  page,
  tag,
}: {
  posts: BlogPost[];
  page: number;
  tag: string;
}) {
  const tags = [...new Set(posts.map((post) => post.tagKey).filter(Boolean))];
  const filtered =
    tag === PRESS_TAG
      ? posts.filter((post) => post.id === PRESS_POST_ID)
      : tag
        ? posts.filter((post) => post.tagKey === tag)
        : posts;

  const numPages = Math.max(Math.ceil(filtered.length / BLOG_PAGE_SIZE), 1);
  const current = Math.min(page, numPages);
  const visible = filtered.slice((current - 1) * BLOG_PAGE_SIZE, current * BLOG_PAGE_SIZE);

  return (
    <section aria-labelledby="blog-list-title" className="bg-white">
      <div className="mx-auto w-full max-w-[calc(1296px+4rem)] px-8 pt-12 pb-20 md:pt-6">
        <h2 id="blog-list-title" className="reveal text-heading-1 font-bold text-dark-gray">
          Últimos artículos
        </h2>
        <div className="reveal mt-3">
          <BlogFiltersComponent tags={tags} tag={tag} />
        </div>

        {visible.length === 0 ? (
          <div className="mt-12 text-center">
            <p className="text-body font-medium text-dark-gray">No encontramos artículos en esta categoría.</p>
            <AppLinkComponent href={blogListHref()} className="mt-2 inline-block font-bold text-orange underline">
              Ver todos los artículos
            </AppLinkComponent>
          </div>
        ) : (
          <ul className="mt-8 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {visible.map((post) => (
              <li key={post.id}>
                <BlogCardComponent post={post} />
              </li>
            ))}
          </ul>
        )}

        <BlogPaginationComponent page={current} numPages={numPages} tag={tag} />
      </div>
    </section>
  );
}
