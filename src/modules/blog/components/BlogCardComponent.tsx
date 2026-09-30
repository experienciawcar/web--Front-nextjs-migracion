import Image from "next/image";
import Link from "next/link";

import type { BlogPost } from "../types/blog";
import { capitalizeWords } from "../utils/content";

/**
 * Tarjeta de un artículo del listado: caja blanca de borde gris claro (306 de ancho en el
 * diseño), foto de 272 x 153 con la categoría en una pestaña blanca de texto naranja sobre su
 * esquina, título de 16 medium (hasta tres renglones) y la fecha abajo con un punto gris.
 * Toda la tarjeta es el enlace.
 *
 * El artículo de prensa (id 50) se rotula "Prensa" en vez de su categoría (regla del sitio
 * anterior). Sin categoría no hay pestaña.
 */
export default function BlogCardComponent({ post }: { post: BlogPost }) {
  const label = post.isPress ? "Prensa" : post.tag ? capitalizeWords(post.tag) : null;

  return (
    <article className="reveal relative flex h-full flex-col border border-[#e6e9ef] bg-white p-4">
      <div className="relative aspect-[272/153] w-full bg-gray-light">
        {post.photoUrl && (
          <Image
            src={post.photoUrl}
            alt=""
            aria-hidden
            fill
            sizes="(min-width: 1280px) 272px, (min-width: 1024px) 25vw, (min-width: 640px) 45vw, 90vw"
            className="object-cover"
          />
        )}
      </div>
      {label && (
        <span className="absolute top-4 left-0 rounded-r-[3px] bg-white px-2 py-1 text-small font-medium leading-none text-orange">
          {label}
        </span>
      )}
      <h3 className="mt-4 line-clamp-3 min-h-[72px] text-body font-bold text-dark-gray">
        <Link href={post.href} className="after:absolute after:inset-0">
          {post.title}
        </Link>
      </h3>
      <p className="mt-auto flex items-center gap-2 pt-6 pl-3 text-small font-medium text-gray">
        <span aria-hidden className="size-1 bg-gray" />
        <time dateTime={post.dateIso}>{post.dateLabel}</time>
      </p>
    </article>
  );
}
