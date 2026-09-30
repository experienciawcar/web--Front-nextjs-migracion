import ButtonComponent from "@/modules/shared/components/ButtonComponent";

import { PRESS_TAG } from "../services/blog";
import { blogListHref } from "../utils/href";
import { capitalizeWords } from "../utils/content";

/**
 * Barra "Últimos artículos": el desplegable de categorías con "Filtrar" y, a la derecha, "Sala de
 * Prensa". Es un formulario GET a `/blog` (sin JavaScript): el filtro y la página viven en la URL,
 * así se pueden compartir y el botón "atrás" desde un artículo vuelve al mismo listado. El sitio
 * anterior los guardaba en estado y perdía todo al recargar.
 *
 * "Sala de Prensa" alterna `?tag=prensa`: con el filtro puesto vuelve a "Todos".
 *
 * Diseño (captura 1920): select de 400 x 48 con borde gris claro y chevron a la derecha, "Filtrar"
 * naranja de 110 al lado y "Sala de Prensa" negro de 170 pegado a la derecha del ancho de 1296.
 */
export default function BlogFiltersComponent({ tags, tag }: { tags: string[]; tag: string }) {
  const pressActive = tag === PRESS_TAG;

  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <form action="/blog" method="get" className="flex flex-wrap items-center gap-3">
        <div className="relative w-full sm:w-[400px]">
          <label htmlFor="blog-tag" className="sr-only">
            Categoría
          </label>
          <select
            id="blog-tag"
            name="tag"
            defaultValue={tags.includes(tag) ? tag : ""}
            className="h-12 w-full appearance-none rounded-[3px] border border-[#d9d9d9] bg-white px-3 pr-10 text-body font-medium text-dark-gray"
          >
            <option value="">Todos</option>
            {tags.map((item) => (
              <option key={item} value={item}>
                {capitalizeWords(item)}
              </option>
            ))}
          </select>
          <svg
            viewBox="0 0 24 24"
            aria-hidden
            className="pointer-events-none absolute top-1/2 right-3 size-5 -translate-y-1/2 text-dark-gray"
          >
            <path
              d="m6 9 6 6 6-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <ButtonComponent type="submit" className="w-[110px] justify-center">
          Filtrar
        </ButtonComponent>
      </form>

      <ButtonComponent
        variant="black"
        href={blogListHref({ tag: pressActive ? "" : PRESS_TAG })}
        className="w-[170px]"
      >
        Sala de Prensa
      </ButtonComponent>
    </div>
  );
}
