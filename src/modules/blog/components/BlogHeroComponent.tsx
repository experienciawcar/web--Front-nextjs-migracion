import Image from "next/image";
import Link from "next/link";

import type { BlogPost } from "../types/blog";

/**
 * Destacado del blog (`main_post` de `GET /post/`): la foto a todo el ancho y, montada sobre su
 * borde de abajo, una tarjeta blanca con el título, la fecha y una flecha naranja. Toda la tarjeta
 * es el enlace al artículo.
 *
 * Diseño: captura del desktop 1920 (sin Figma ni diseño mobile). Foto de 600 de alto que sangra a
 * los lados; tarjeta de 546 de ancho en x=360 (el contenedor de 1200), que se sale 130 de la
 * foto hacia abajo; título de 36/44 medium; flecha de 46 (borde de 2 naranja) a la derecha, sobre
 * la fecha. Mobile: foto de 280 y tarjeta a todo lo ancho, adaptado sin diseño.
 * TODO: pedir el diseño mobile.
 */
export default function BlogHeroComponent({ post }: { post: BlogPost }) {
  return (
    <section aria-label="Artículo destacado" className="flow-root bg-white">
      <div className="relative h-[280px] bg-dark-gray md:h-[600px]">
        {post.photoUrl && (
          <Image
            src={post.photoUrl}
            alt=""
            aria-hidden
            fill
            preload
            sizes="100vw"
            className="object-cover"
          />
        )}
      </div>

      <div className="mx-auto max-w-[1200px] px-4 md:px-0">
        <article className="reveal relative -mt-16 bg-white p-6 md:-mt-[130px] md:w-[546px]">
          <h2 className="text-[26px] leading-9 font-bold text-dark-gray md:text-subheadline-1">
            <Link href={post.href} className="after:absolute after:inset-0">
              {post.title}
            </Link>
          </h2>
          <div className="mt-8 flex items-end justify-between gap-4 md:mt-11">
            <p className="flex items-center gap-2 pl-3 text-small font-medium text-gray">
              <span aria-hidden className="size-1 bg-gray" />
              <time dateTime={post.dateIso}>{post.dateLongLabel}</time>
            </p>
            <svg viewBox="0 0 46 46" aria-hidden className="size-[46px] shrink-0 text-orange">
              <circle cx="23" cy="23" r="21.5" fill="none" stroke="currentColor" strokeWidth="2.5" />
              <path
                d="M13 23h19m-7-7 7 7-7 7"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </article>
      </div>
    </section>
  );
}
