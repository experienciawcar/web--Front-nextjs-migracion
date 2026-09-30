import Image from "next/image";

import logo from "../assets/banner/credirapido-logo.svg";

/**
 * Banner "Credirápido" de la ficha: tarjeta blanca con el logo (ícono de cronómetro, "Credirápido"
 * y "Financiación hasta $25 Millones", un solo SVG del diseño), una franja naranja abajo con
 * "¡Aprobación inmediata en 5 minutos!" y, en la esquina de arriba a la derecha, dos rayas
 * diagonales (naranja y negra).
 *
 * Figma "Frame 564" (89:4803): 568 x 120, blanco; el logo (323 x 50) centrado a 17 del borde
 * superior; la franja, de 38 de alto pegada abajo, con el texto de 20 Bold blanco; las rayas son dos
 * rectángulos de 119 x 10 girados 45°, uno naranja y otro `dark-gray`, recortados por la esquina.
 * Las rayas se estimaron de la captura (el rectángulo girado no se puede leer del Figma por su
 * `x`/`y` local): quedan a ~46 px de la esquina.
 *
 * Lleva al bloque "Financia tu Vehículo" de la misma página (`#financiacion`), que es el ancla que
 * el sitio anterior ponía en la viñeta "Financia hasta $15 millones en 3 minutos".
 * TODO: confirmar con negocio adónde debe llevar el banner.
 */
export default function CredirapidoBannerComponent({
  className = "",
}: {
  className?: string;
}) {
  return (
    <a
      href="#financiacion"
      className={`relative block h-[120px] w-full max-w-[568px] overflow-hidden rounded-lg bg-white shadow-[0_7px_14px_rgba(211,218,226,0.4)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange ${className}`}
    >
      <Image
        src={logo}
        alt="Credirápido: financiación hasta $25 millones"
        className="absolute top-[17px] left-1/2 h-[50px] w-[323px] max-w-none -translate-x-1/2"
      />
      <span
        aria-hidden
        className="absolute inset-x-0 bottom-0 flex h-[38px] items-center justify-center bg-orange text-[18px] leading-6 font-bold text-white xl:text-[20px]"
      >
        ¡Aprobación inmediata en 5 minutos!
      </span>
      {/* Las dos rayas de la esquina. */}
      <span
        aria-hidden
        className="absolute top-0 right-0 size-[58px]"
        style={{
          background:
            "linear-gradient(45deg, transparent 0 58%, var(--color-orange) 58% 72%, transparent 72% 76%, var(--color-dark-gray) 76% 90%, transparent 90%)",
        }}
      />
    </a>
  );
}
