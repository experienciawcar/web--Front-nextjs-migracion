"use client";

import FeatureCardComponent from "@/modules/shared/components/FeatureCardComponent";
import { useCarousel } from "@/modules/shared/hooks/useCarousel";

import type { TransparencyFeature } from "../constants/transparency";

/** Sin barra de scroll: se desliza con el dedo o con las rayas. */
const SIN_SCROLLBAR = "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden";

/** Cualidades por página en mobile (Figma 701:55011: tres tarjetas por pantalla). */
const FEATURES_PER_PAGE = 3;

/**
 * Las cualidades de "Compras online con atención personalizada" (`TransparencyComponent`).
 *
 * Desde `md` (tablet y desktop): un grid de las seis, una tarjeta por celda, en una
 * columna hasta 1279 px y en dos (`grid-cols-2`) desde `xl`. Las páginas de abajo
 * son `display: contents` desde `md`, así que para el grid sus `<li>` son hijos
 * directos y solo hay UNA copia del contenido en el documento.
 *
 * Mobile (Figma 701:55011, "mobile 398"): las seis cualidades en dos páginas de
 * tres, en un carrusel de `scroll-snap` que sangra a todo el ancho de la
 * ventana (cada página lleva sus 32 px de margen, así la siguiente entra desde
 * el borde y no desde el margen). Debajo, dos rayas centradas (Figma 701:55026,
 * "Frame 344": 70 de ancho con 16 en medio; la de la página activa en naranja de
 * 3 px y la otra en `gray` de 1 px). Cada raya es un botón (zona de 24 px de
 * alto): regla del proyecto, una raya por posición y clicable.
 *
 * DECISIÓN: el diseño mobile solo dibuja las tres primeras cualidades y las
 * dos rayas; que sean dos páginas de tres (las seis de desktop, en su orden) es
 * la lectura que las cuadra. TODO: confirmar con diseño.
 */
export default function TransparencyFeaturesComponent({
  features,
}: {
  features: TransparencyFeature[];
}) {
  const [ref, carousel] = useCarousel<HTMLDivElement>();

  const pages = Array.from(
    { length: Math.ceil(features.length / FEATURES_PER_PAGE) },
    (_, index) =>
      features.slice(
        index * FEATURES_PER_PAGE,
        (index + 1) * FEATURES_PER_PAGE,
      ),
  );

  return (
    <>
      <div
        ref={ref}
        className={`flex snap-x snap-mandatory overflow-x-auto md:grid md:snap-none md:grid-cols-1 md:gap-y-10 md:overflow-visible xl:grid-cols-2 xl:gap-x-[104px] ${SIN_SCROLLBAR}`}
      >
        {pages.map((page, index) => (
          <ul
            key={index}
            className="flex w-full shrink-0 snap-start flex-col gap-8 px-8 md:contents"
          >
            {page.map((feature) => (
              <li key={feature.id}>
                <FeatureCardComponent
                  icon={feature.icon}
                  title={feature.title}
                  titleItalic={feature.titleItalic}
                  description={feature.description}
                  iconClassName="size-12"
                  mobileCentered
                />
              </li>
            ))}
          </ul>
        ))}
      </div>

      <div className="mt-[52px] flex justify-center gap-4 md:hidden">
        {pages.map((_, index) => (
          <button
            key={index}
            type="button"
            aria-label={`Ir al grupo ${index + 1} de ${pages.length}`}
            aria-current={index === carousel.position}
            onClick={() => carousel.scrollToPosition(index)}
            className="flex h-6 w-[70px] cursor-pointer items-center"
          >
            <span
              aria-hidden
              className={`w-full transition-colors duration-300 motion-reduce:transition-none ${index === carousel.position ? "h-[3px] bg-orange" : "h-px bg-gray"}`}
            />
          </button>
        ))}
      </div>
    </>
  );
}
