import Image from "next/image";

import iconWarranty from "../assets/vehicle/icon-warranty.svg";
import type { VehicleWarrantyTone } from "../types/vehicle";

/** Colores de la etiqueta por cobertura. */
const TONE_STYLES: Record<VehicleWarrantyTone, string> = {
  // La de 6 meses es la estándar: verde "label" con borde oscuro.
  standard: "border-dark-gray bg-label-green text-dark-gray",
  factory: "border-orange bg-orange text-white",
  oneYear: "border-black bg-label-yellow text-black",
};

/**
 * Etiqueta de garantía ("Garantía de 6 meses"). Lleva el mismo radio que
 * `ButtonComponent` (esquinas grandes arriba a la derecha y abajo a la
 * izquierda) para que ambos se lean como la misma familia. La posición la pone
 * quien la usa con `className` (p. ej. sobre la foto de la tarjeta).
 */
export default function WarrantyBadgeComponent({
  label,
  tone = "standard",
  className = "",
}: {
  label: string;
  tone?: VehicleWarrantyTone;
  className?: string;
}) {
  return (
    <span
      className={`flex h-[32px] items-center gap-2 rounded-tr-[30px] rounded-bl-[30px] border py-1 pr-5 pl-4 text-caption leading-[22px] font-semibold whitespace-nowrap ${TONE_STYLES[tone]} ${className}`}
    >
      <Image
        src={iconWarranty}
        alt=""
        aria-hidden
        className={`h-6 w-5 ${tone === "factory" ? "brightness-0 invert" : ""}`}
      />
      {label}
    </span>
  );
}
