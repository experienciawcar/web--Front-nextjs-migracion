"use client";

import { useRouter } from "next/navigation";
import { useCallback, useLayoutEffect, useRef, useState } from "react";

import { getVehicleImages } from "../services/vehicle-images";
import type { VehicleImage } from "../types/vehicle";

/** Sin barra de scroll: se desliza con el dedo o con las flechas. */
const SIN_SCROLLBAR = "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden";

/** Puntos visibles a la vez (ventana deslizante alrededor de la foto activa). */
const MAX_DOTS = 5;
/** Sin eventos de scroll durante este tiempo se da el desplazamiento por terminado. */
const SETTLE_MS = 130;

/** Se compara sin el query string: las URLs firmadas cambian de firma según el endpoint. */
const imageKey = (image: VehicleImage) => image.src.split("?")[0];

/** Suma las fotos nuevas a las que ya hay, sin repetir. */
function mergeImages(
  current: VehicleImage[],
  incoming: VehicleImage[],
): VehicleImage[] {
  const seen = new Set(current.map(imageKey));
  const added = incoming.filter((image) => {
    const key = imageKey(image);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  return added.length > 0 ? [...current, ...added] : current;
}

function ChevronIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 12 12"
      className={`size-3 ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7.5 2 3.5 6l4 4" />
    </svg>
  );
}

/**
 * Una foto con su placeholder: el fondo pulsa (skeleton) hasta que la imagen carga y entonces
 * aparece con un fade de 0,4 s. Si ya venía cargada (caché) no espera al evento `onLoad`.
 */
function SlideImage({
  image,
  alt,
  sizes,
  eager,
}: {
  image: VehicleImage;
  alt: string;
  sizes: string;
  eager: boolean;
}) {
  const [loaded, setLoaded] = useState(false);
  const attach = useCallback((node: HTMLImageElement | null) => {
    if (node?.complete && node.naturalWidth > 0) setLoaded(true);
  }, []);

  return (
    <div className={`size-full ${loaded ? "" : "animate-pulse bg-gray/20"}`}>
      {/* Ver el JSDoc de `VehicleGalleryComponent`: el backend ya sirve la foto a varios anchos. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={attach}
        src={image.src}
        srcSet={image.srcSet}
        sizes={image.srcSet ? sizes : undefined}
        alt={alt}
        width={1200}
        height={800}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        draggable={false}
        onLoad={() => setLoaded(true)}
        className={`size-full object-cover transition-opacity duration-[400ms] ${loaded ? "opacity-100" : "opacity-0"}`}
      />
    </div>
  );
}

/**
 * Galería de fotos de la tarjeta de un vehículo (`docs/car-card-imagenes-y-garantia.md` §1): un
 * carrusel de `scroll-snap` (una foto por pantalla) con flechas que aparecen al pasar el mouse y
 * puntos abajo. Es la parte interactiva de `VehicleCardComponent`; el resto queda en servidor.
 *
 * - **Loop infinito**: se clonan los extremos (`[última, ...fotos, primera]`). Al asentarse el
 *   scroll sobre un clon se salta, sin animación, a la foto real equivalente: como son idénticas,
 *   no se nota.
 * - **Carga perezosa del resto**: el listado trae unas pocas fotos. Al intentar avanzar (flecha o
 *   deslizar) se piden todas, una sola vez, a `GET /v2/car-images/{id}/` y se suman sin repetir.
 * - **Puntos**: como máximo `MAX_DOTS`, en una ventana alrededor de la foto activa.
 * - Las flechas y los puntos solo existen si hay más de una foto; las flechas quedan ocultas hasta
 *   el hover o el foco por teclado (en pantallas táctiles se desliza con el dedo).
 * - Tocar una foto lleva al detalle: la galería va por encima del enlace del nombre para poder
 *   deslizarse, así que las fotos llevan su propio `onClick`. No son enlaces a propósito: serían
 *   más paradas de teclado por tarjeta, y quien navega con teclado ya tiene el enlace del nombre.
 * - Las fotos son `<img>` con el `srcset` del backend y no `next/image`: el backend ya sirve cada
 *   una a seis anchos (`/api/v2/img/<ancho>/…`) y esa es la optimización.
 * - `raised` sube los puntos cuando hay una franja pegada al borde inferior ("Vehículo por ingresar").
 *
 * Reutilizar la instancia con otro vehículo no es un caso: quien la use debe pasarle
 * `key={vehicle.id}`, así el estado (fotos, posición) nace de nuevo con cada vehículo.
 */
export default function VehicleGalleryComponent({
  vehicleId,
  images: initialImages,
  name,
  href,
  sizes,
  raised = false,
}: {
  vehicleId: number;
  images: VehicleImage[];
  name: string;
  href: string;
  /** Ancho al que SE VE la foto (atributo `sizes`). */
  sizes: string;
  raised?: boolean;
}) {
  const router = useRouter();
  const trackRef = useRef<HTMLDivElement>(null);
  const settleTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );
  const allRequested = useRef<Promise<void> | null>(null);
  /** Cuántas fotos reales hay AHORA: el temporizador de `handleScroll` no puede leer la cantidad de cuando se armó. */
  const imageCount = useRef(initialImages.length);

  const [images, setImages] = useState(initialImages);
  const [activeIndex, setActiveIndex] = useState(0);

  const hasCarousel = images.length > 1;
  const slides = hasCarousel
    ? [images[images.length - 1], ...images, images[0]]
    : images;
  const firstRealIndex = hasCarousel ? 1 : 0;

  useLayoutEffect(() => {
    imageCount.current = images.length;
  }, [images.length]);

  // Sobre la primera foto real (después del clon inicial), antes de pintar: sin parpadeo.
  useLayoutEffect(() => {
    const track = trackRef.current;
    if (track && hasCarousel)
      track.scrollTo({
        left: track.clientWidth,
        behavior: "instant" as ScrollBehavior,
      });
    // Solo al aparecer el carrusel: cuando llegan más fotos el scroll no se toca.
  }, [hasCarousel]);

  // Si cambia el ancho de la tarjeta (girar el celular, redimensionar la ventana) el scroll queda
  // en los mismos píxeles pero cada foto mide otra cosa: se vuelve a poner sobre la foto activa.
  const activeRef = useRef(0);
  useLayoutEffect(() => {
    activeRef.current = activeIndex;
  }, [activeIndex]);
  useLayoutEffect(() => {
    const track = trackRef.current;
    if (!track || !hasCarousel) return;
    let lastWidth = track.clientWidth;
    const observer = new ResizeObserver(() => {
      if (track.clientWidth === lastWidth) return;
      lastWidth = track.clientWidth;
      clearTimeout(settleTimer.current);
      track.scrollTo({
        left: (activeRef.current + 1) * lastWidth,
        behavior: "instant" as ScrollBehavior,
      });
    });
    observer.observe(track);
    return () => observer.disconnect();
  }, [hasCarousel]);

  const loadAllImages = useCallback(() => {
    allRequested.current ??= getVehicleImages(vehicleId).then((all) => {
      if (all.length > 0) setImages((current) => mergeImages(current, all));
    });
    return allRequested.current;
  }, [vehicleId]);

  function handleScroll() {
    const track = trackRef.current;
    if (!track || !hasCarousel) return;
    const width = track.clientWidth;
    if (width === 0) return;

    // Índice en el DOM (con clones) → índice lógico entre las fotos reales.
    const domIndex = Math.round(track.scrollLeft / width);
    setActiveIndex((domIndex - 1 + images.length) % images.length);

    clearTimeout(settleTimer.current);
    settleTimer.current = setTimeout(() => {
      if (domIndex === 0)
        track.scrollTo({
          left: images.length * width,
          behavior: "instant" as ScrollBehavior,
        });
      else if (domIndex === images.length + 1)
        track.scrollTo({ left: width, behavior: "instant" as ScrollBehavior });
    }, SETTLE_MS);
  }

  async function goStep(direction: 1 | -1) {
    const track = trackRef.current;
    if (!track) return;
    const loading = loadAllImages();
    // Retroceder desde la primera foto va a la ÚLTIMA: hay que saber cuál es antes de moverse.
    if (direction === -1 && activeIndex === 0) await loading;
    track.scrollBy({ left: direction * track.clientWidth, behavior: "smooth" });
  }

  const dotsStart = Math.max(
    0,
    Math.min(activeIndex - Math.floor(MAX_DOTS / 2), images.length - MAX_DOTS),
  );
  const visibleDots = images.slice(dotsStart, dotsStart + MAX_DOTS);

  return (
    <div className="group/gallery absolute inset-0 z-10">
      <div
        ref={trackRef}
        onScroll={handleScroll}
        onTouchMove={() => void loadAllImages()}
        // `scroll-auto` anula el `scroll-behavior: smooth` de la página: haría visible el salto entre clones.
        className={`flex size-full scroll-auto snap-x snap-mandatory overflow-x-auto ${SIN_SCROLLBAR}`}
      >
        {slides.map((image, index) => {
          const isClone =
            hasCarousel && (index === 0 || index === slides.length - 1);
          return (
            <div
              key={`${imageKey(image)}-${index}`}
              onClick={() => router.push(href)}
              aria-hidden={isClone || undefined}
              className="size-full shrink-0 cursor-pointer snap-center"
            >
              <SlideImage
                image={image}
                alt={index === firstRealIndex ? name : ""}
                sizes={sizes}
                eager={index === firstRealIndex}
              />
            </div>
          );
        })}
      </div>

      {hasCarousel && (
        <>
          <button
            type="button"
            aria-label="Foto anterior"
            onClick={() => goStep(-1)}
            className="absolute top-1/2 left-2 grid size-8 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-gray-dark opacity-0 shadow-[0_1px_4px_rgba(0,0,0,0.25)] transition-opacity group-hover/gallery:opacity-100 focus-visible:opacity-100"
          >
            <ChevronIcon />
          </button>
          <button
            type="button"
            aria-label="Foto siguiente"
            onClick={() => goStep(1)}
            className="absolute top-1/2 right-2 grid size-8 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-gray-dark opacity-0 shadow-[0_1px_4px_rgba(0,0,0,0.25)] transition-opacity group-hover/gallery:opacity-100 focus-visible:opacity-100"
          >
            <ChevronIcon className="rotate-180" />
          </button>

          <div
            role="group"
            aria-label={`Foto ${activeIndex + 1} de ${images.length}`}
            className={`pointer-events-none absolute left-1/2 flex -translate-x-1/2 items-center gap-1 ${raised ? "bottom-[34px]" : "bottom-2"}`}
          >
            {visibleDots.map((image, offset) => (
              <span
                key={imageKey(image)}
                className={`rounded-full shadow-[0_0_2px_rgba(0,0,0,0.4)] ${
                  dotsStart + offset === activeIndex
                    ? "size-[7px] bg-white"
                    : "size-[6px] bg-white/60"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
