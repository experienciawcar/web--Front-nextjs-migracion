"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import ButtonComponent from "@/modules/shared/components/ButtonComponent";
import CarouselArrowsComponent from "@/modules/shared/components/CarouselArrowsComponent";
import type { VehicleImage } from "@/modules/shared/types/vehicle";

/** Sin barra de scroll: la tira de miniaturas se desliza con el dedo o la rueda. */
const SIN_SCROLLBAR = "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden";

function ArrowIcon({ flip = false }: { flip?: boolean }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 16 16"
      className={`size-4 ${flip ? "rotate-180" : ""}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 8h11M9 3.5 13.5 8 9 12.5" />
    </svg>
  );
}

function ArrowButton({
  label,
  onClick,
  side,
  className = "",
}: {
  label: string;
  onClick: () => void;
  side: "left" | "right";
  className?: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={`absolute top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-lg bg-white/90 text-gray-dark shadow-[0_2px_8px_rgba(0,0,0,0.18)] transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange xl:size-12 ${side === "left" ? "left-3 xl:left-4" : "right-3 xl:right-4"} ${className}`}
    >
      <ArrowIcon flip={side === "left"} />
    </button>
  );
}

/**
 * Una foto con su skeleton: el fondo pulsa hasta que la imagen carga y entonces aparece con un
 * fundido corto. Si ya venía cargada (caché) no espera al evento `onLoad`. Quien la use debe
 * pasarle `key={image.src}` para que el estado nazca de nuevo con cada foto.
 */
function LoadingImage({
  image,
  alt,
  sizes,
  eager = false,
  className = "size-full object-cover",
}: {
  image: VehicleImage;
  alt: string;
  sizes: string;
  eager?: boolean;
  className?: string;
}) {
  const [loaded, setLoaded] = useState(false);
  const attach = useCallback((node: HTMLImageElement | null) => {
    if (node?.complete && node.naturalWidth > 0) setLoaded(true);
  }, []);

  return (
    <span
      className={`block size-full ${loaded ? "" : "animate-pulse bg-gray/20"}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={attach}
        src={image.src}
        srcSet={image.srcSet}
        sizes={sizes}
        alt={alt}
        width={1200}
        height={800}
        loading={eager ? "eager" : "lazy"}
        fetchPriority={eager ? "high" : undefined}
        decoding="async"
        draggable={false}
        onLoad={() => setLoaded(true)}
        className={`${className} transition-opacity duration-300 motion-reduce:transition-none ${loaded ? "opacity-100" : "opacity-0"}`}
      />
    </span>
  );
}

/**
 * Galería de la ficha de un vehículo: la foto grande con flechas (dan la vuelta), la tira de
 * miniaturas debajo y, al tocar la foto, un visor a pantalla completa.
 *
 * Figma "Página carro -desktop 1449" (89:4207): la foto es de 787 x 510 con 8 de radio y las
 * miniaturas, de 77 x 44 con 8 de radio, arrancan 23 px más abajo y se reparten el ancho (8 a
 * la vista, paso de 101). Las flechas son cuadros blancos de 48 a 16 px del borde, centrados en
 * vertical. En mobile (89:4840) la foto es de 329 x ~223 y las miniaturas, de 140 x 90.
 *
 * - Las fotos son `<img>` con el `srcset` que ya sirve el backend a seis anchos, y no
 *   `next/image` (mismo criterio que `VehicleGalleryComponent`).
 * - Solo la primera foto se pide con `eager`; el resto, perezosas.
 * - El visor es un `<dialog>` nativo (`showModal()`: foco atrapado, Esc y fondo inerte solos);
 *   con las flechas del teclado se pasa de foto.
 * - Sin fotos de más, las flechas y la tira no se pintan (no habría a dónde ir).
 *
 * `overlay` es lo que va sobre la esquina de la foto (la etiqueta de estado).
 */
export default function VehicleDetailGalleryComponent({
  images,
  name,
  overlay,
}: {
  images: VehicleImage[];
  name: string;
  overlay?: React.ReactNode;
}) {
  const [index, setIndex] = useState(0);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const thumbsRef = useRef<HTMLDivElement>(null);
  const count = images.length;
  const hasMany = count > 1;
  const current = images[index];

  const go = (step: number) =>
    setIndex((value) => (value + step + count) % count);

  // La miniatura activa siempre a la vista. Se mueve solo la tira (no `scrollIntoView`, que
  // arrastra también la página) y no en el primer pintado.
  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const strip = thumbsRef.current;
    const active = strip?.children[index];
    if (!strip || !(active instanceof HTMLElement)) return;
    const stripBox = strip.getBoundingClientRect();
    const activeBox = active.getBoundingClientRect();
    const start = activeBox.left - stripBox.left + strip.scrollLeft;
    const end = start + activeBox.width;
    if (start < strip.scrollLeft) strip.scrollTo({ left: start });
    else if (end > strip.scrollLeft + strip.clientWidth)
      strip.scrollTo({ left: end - strip.clientWidth });
  }, [index]);

  function handleDialogKey(event: React.KeyboardEvent<HTMLDialogElement>) {
    if (event.key === "ArrowLeft") go(-1);
    if (event.key === "ArrowRight") go(1);
  }

  return (
    <div className="min-w-0">
      <div className="relative aspect-[840/544] overflow-hidden rounded-lg bg-gray-light">
        <button
          type="button"
          aria-label={`Ampliar la foto ${index + 1} de ${count}`}
          onClick={() => dialogRef.current?.showModal()}
          className="block size-full cursor-zoom-in"
        >
          <LoadingImage
            key={current.src}
            image={current}
            alt={index === 0 ? name : `${name}, foto ${index + 1}`}
            sizes="(min-width: 1280px) 850px, 100vw"
            eager={index === 0}
          />
        </button>
        {overlay}
        {hasMany && (
          <CarouselArrowsComponent
            canPrev
            canNext
            onPrev={() => go(-1)}
            onNext={() => go(1)}
            className="absolute right-4 bottom-4"
          />
        )}
      </div>

      {hasMany && (
        <div
          ref={thumbsRef}
          role="group"
          aria-label="Miniaturas de las fotos"
          className={`mt-5 flex gap-4 overflow-x-auto scroll-smooth p-1 -mx-1 xl:gap-5 ${SIN_SCROLLBAR}`}
        >
          {images.map((image, position) => (
            <button
              key={image.src}
              type="button"
              aria-label={`Ver la foto ${position + 1}`}
              aria-current={position === index}
              onClick={() => setIndex(position)}
              className={`h-[60px] w-[100px] shrink-0 overflow-hidden rounded-lg outline-offset-2 transition-opacity focus-visible:outline-2 focus-visible:outline-orange xl:h-[70px] xl:w-[130px] ${position === index ? "outline-2 outline-orange" : "opacity-80 hover:opacity-100"}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image.src}
                srcSet={image.srcSet}
                sizes="130px"
                alt=""
                width={160}
                height={107}
                loading="lazy"
                decoding="async"
                draggable={false}
                className="size-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      <dialog
        ref={dialogRef}
        aria-label={`Fotos de ${name}`}
        onKeyDown={handleDialogKey}
        onClick={(event) => {
          if (event.target === event.currentTarget) dialogRef.current?.close();
        }}
        className="fixed inset-0 m-0 h-dvh max-h-none w-dvw max-w-none overflow-hidden bg-black p-0 backdrop:bg-black"
      >
        <div className="relative grid h-dvh w-dvw place-items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={current.src}
            srcSet={current.srcSet}
            sizes="100vw"
            alt={`${name}, foto ${index + 1} de ${count}`}
            className="max-h-dvh max-w-full object-contain"
          />
          <div className="absolute top-4 right-4">
            <ButtonComponent
              variant="black"
              size="medium"
              onClick={() => dialogRef.current?.close()}
            >
              Cerrar
            </ButtonComponent>
          </div>
          {hasMany && (
            <>
              <ArrowButton
                label="Foto anterior"
                side="left"
                onClick={() => go(-1)}
              />
              <ArrowButton
                label="Foto siguiente"
                side="right"
                onClick={() => go(1)}
              />
              <p className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-3 py-1 text-caption text-white">
                {index + 1} / {count}
              </p>
            </>
          )}
        </div>
      </dialog>
    </div>
  );
}
