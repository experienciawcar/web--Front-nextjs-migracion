import type { BlogPost } from "../types/blog";
import BlogCardComponent from "./BlogCardComponent";

/**
 * "Artículos relacionados" al pie de un artículo: hasta cuatro de la misma categoría, con las
 * mismas tarjetas del listado. Es enlazado interno entre artículos (`docs/DETALLE_BLOG.md` §3.3 y
 * hallazgo 16). No está en la captura del diseño del detalle.
 * TODO: confirmar con diseño si va, o quitarlo de la página.
 */
export default function BlogRelatedComponent({ posts }: { posts: BlogPost[] }) {
  if (posts.length === 0) return null;

  return (
    <section aria-labelledby="blog-related-title" className="bg-white">
      <div className="mx-auto w-full max-w-[calc(1296px+4rem)] px-8 pb-16">
        <div className="reveal">
          <span aria-hidden className="block h-1 w-[77px] bg-orange" />
          <h2
            id="blog-related-title"
            className="mt-4 text-[28px] leading-9 font-bold text-dark-gray xl:text-subheadline-1 xl:leading-11"
          >
            Artículos <span className="font-normal text-orange italic">relacionados</span>
          </h2>
        </div>
        <ul className="mt-8 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
          {posts.map((post) => (
            <li key={post.id}>
              <BlogCardComponent post={post} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
