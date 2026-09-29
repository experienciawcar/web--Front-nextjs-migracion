"use client";

import Image from "next/image";
import { useState } from "react";

function ArrowButton({
  label,
  disabled,
  onClick,
  flip = false,
  className,
}: {
  label: string;
  disabled: boolean;
  onClick: () => void;
  flip?: boolean;
  className: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      // Sin flecha a la que ir, el fondo se vuelve gris translúcido y la flecha
      // se queda oscura, como la de la izquierda en el diseño. No se baja la
      // opacidad del botón entero: apagaría también la flecha.
      className={`absolute top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-md bg-white text-orange enabled:cursor-pointer disabled:cursor-not-allowed disabled:bg-gray/60 disabled:text-dark-gray focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${className}`}
    >
      <svg
        aria-hidden
        viewBox="0 0 12 12"
        className={`size-5 ${flip ? "rotate-180" : ""}`}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M1.5 6h9M7 2.5 10.5 6 7 9.5" />
      </svg>
    </button>
  );
}

/**
 * Galería del modal de una sede: la foto grande con dos flechas encima (siempre
 * visibles: sin foto a la que ir quedan deshabilitadas) y, debajo, las
 * miniaturas en filas de 5. Con una sola foto no se pintan las miniaturas
 * (sería la misma foto dos veces).
 *
 * Medidas del diseño desktop (captura a escala ~0.576): foto de 480x455 con
 * las esquinas redondeadas, flechas de 44 a 12 del borde, 34 de aire hasta las
 * miniaturas de 77x43, con 22 entre columnas y 32 entre filas.
 * Las miniaturas no marcan la activa en el diseño; aquí lleva un aro blanco.
 */
export default function HeadquartersGalleryComponent({ photos, label }: { photos: string[]; label: string }) {
  const [index, setIndex] = useState(0);
  const last = photos.length - 1;

  return (
    <div>
      <div className="relative aspect-[480/455] w-full overflow-hidden rounded-lg bg-dark-gray">
        <Image
          key={photos[index]}
          src={photos[index]}
          alt={`${label}: foto ${index + 1} de ${photos.length}`}
          fill
          sizes="(min-width: 1280px) 480px, (min-width: 640px) 560px, 100vw"
          className="object-cover"
        />
        <ArrowButton
          label="Foto anterior"
          disabled={index === 0}
          onClick={() => setIndex((i) => Math.max(0, i - 1))}
          flip
          className="left-3"
        />
        <ArrowButton
          label="Foto siguiente"
          disabled={index === last}
          onClick={() => setIndex((i) => Math.min(last, i + 1))}
          className="right-3"
        />
      </div>

      {photos.length > 1 && (
        <ul className="mt-6 grid grid-cols-5 gap-x-3 gap-y-4 xl:mt-[34px] xl:gap-x-[22px] xl:gap-y-8">
          {photos.map((photo, i) => (
            <li key={photo}>
              <button
                type="button"
                aria-label={`Ver la foto ${i + 1}`}
                aria-current={i === index}
                onClick={() => setIndex(i)}
                className={`relative block aspect-[77/43] w-full cursor-pointer overflow-hidden rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${i === index ? "ring-2 ring-white" : ""}`}
              >
                <Image src={photo} alt="" aria-hidden fill sizes="77px" className="object-cover" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
