"use client";

import { useRouter } from "next/navigation";

import { useCarousel } from "../hooks/useCarousel";
import type { VehicleImage } from "../types/vehicle";

/** Sin barra de scroll: se desliza con el dedo, con las flechas o con las rayas. */
const SIN_SCROLLBAR = "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden";

function ChevronIcon({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 12 12" className={`size-3 ${className}`} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7.5 2 3.5 6l4 4" />
    </svg>
  );
}

/**
 * Galería de fotos de la tarjeta de un vehículo: las fotos en un carrusel de
 * `scroll-snap` (una por pantalla), con flechas que aparecen al pasar el mouse y
 * unos puntos abajo que dicen en cuál va. Es la parte interactiva de
 * `VehicleCardComponent`; el resto de la tarjeta queda en servidor.
 *
 * - Las flechas y los puntos solo existen si hay más de una foto. Las flechas
 *   quedan ocultas hasta el hover (o el foco por teclado); en pantallas táctiles
 *   se desliza con el dedo.
 * - Tocar una foto lleva al detalle. La tarjeta entera es clicable por el enlace
 *   del nombre, pero la galería va por encima de esa capa para poder deslizarse,
 *   así que las fotos llevan su propio `onClick`. No son enlaces a propósito:
 *   serían cinco paradas de teclado más por tarjeta, y quien navega con teclado
 *   ya tiene el enlace del nombre.
 * - Las fotos son `<img>` con el `srcset` del backend y no `next/image`: el
 *   backend ya sirve cada foto a seis anchos (`/api/v2/img/<ancho>/…`) y esa es la
 *   optimización; pasarlas por el optimizador de Next volvería a procesar cada
 *   foto en cada URL firmada que cambia cada hora.
 * - `raised` sube los puntos cuando hay una franja pegada al borde inferior
 *   ("Vehículo por ingresar").
 */
export default function VehicleGalleryComponent({
  images,
  name,
  href,
  sizes,
  raised = false,
}: {
  images: VehicleImage[];
  name: string;
  href: string;
  /** Ancho al que SE VE la foto (atributo `sizes`). */
  sizes: string;
  raised?: boolean;
}) {
  const router = useRouter();
  const [ref, carousel] = useCarousel<HTMLDivElement>();
  const many = images.length > 1;

  return (
    <div className="group/gallery absolute inset-0 z-10">
      <div ref={ref} className={`flex size-full snap-x snap-mandatory overflow-x-auto ${SIN_SCROLLBAR}`}>
        {images.map((image, index) => (
          <div key={image.src} onClick={() => router.push(href)} className="size-full shrink-0 cursor-pointer snap-center">
            {/* Ver el JSDoc: el backend ya sirve la foto a varios anchos. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image.src}
              srcSet={image.srcSet}
              sizes={image.srcSet ? sizes : undefined}
              alt={index === 0 ? name : ""}
              width={1200}
              height={800}
              loading="lazy"
              decoding="async"
              draggable={false}
              className="size-full object-cover"
            />
          </div>
        ))}
      </div>

      {many && (
        <>
          <button
            type="button"
            aria-label="Foto anterior"
            disabled={!carousel.canPrev}
            onClick={carousel.prev}
            className="absolute top-1/2 left-2 grid size-8 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-gray-dark opacity-0 shadow-[0_1px_4px_rgba(0,0,0,0.25)] transition-opacity group-hover/gallery:opacity-100 focus-visible:opacity-100 disabled:hidden"
          >
            <ChevronIcon />
          </button>
          <button
            type="button"
            aria-label="Foto siguiente"
            disabled={!carousel.canNext}
            onClick={carousel.next}
            className="absolute top-1/2 right-2 grid size-8 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-gray-dark opacity-0 shadow-[0_1px_4px_rgba(0,0,0,0.25)] transition-opacity group-hover/gallery:opacity-100 focus-visible:opacity-100 disabled:hidden"
          >
            <ChevronIcon className="rotate-180" />
          </button>

          <div
            role="group"
            aria-label={`Foto ${carousel.position + 1} de ${carousel.positions}`}
            className={`pointer-events-none absolute left-1/2 flex -translate-x-1/2 items-center gap-1 ${raised ? "bottom-[34px]" : "bottom-2"}`}
          >
            {images.map((image, index) => (
              <span
                key={image.src}
                className={`rounded-full shadow-[0_0_2px_rgba(0,0,0,0.4)] ${
                  index === carousel.position ? "size-[7px] bg-white" : "size-[6px] bg-white/60"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
