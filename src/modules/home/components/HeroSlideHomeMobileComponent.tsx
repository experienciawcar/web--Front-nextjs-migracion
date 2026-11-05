import Image from "next/image";

import estrellas from "../assets/hero-mobile/estrellas-resena.svg";
import { HERO_MOBILE_HEIGHT } from "../constants/hero-carousel";

/**
 * Primer slide del banner en MOBILE (`< md`). Diseño: Figma "Wcar Website - 2026",
 * página "Home - 3.0", nodo 1542:21466 ("Banner - mobile", 393 x 481).
 *
 * Fondo: UN WebP 393 x 481 (`mobile/banner.webp`, 1x) compuesto sin el texto a partir
 * del export de cada capa del nodo (foto del jeep, degradados, marca "wcar", triángulo
 * naranja, reflejo y rayado), porque el export del marco trae el texto encima. Entre 394
 * y 767 px de ancho se prolonga a la derecha con su columna de borde
 * (`mobile/banner-borde-der.webp`), que es el muro naranja y luego gris.
 *
 * Todo en px de diseño sobre 393 de ancho:
 * - Título 28/normal bold en (26, 28), 341 de ancho, tracking 0,28: "La Plataforma #1 en /
 *   Ventas de" naranja, "Autos Usados / 100% Online" gris oscuro y "en Colombia" blanco
 *   sobre un rectángulo #1e1e1e de 174 x 32 en (189, 98).
 * - Cifras centradas (centro en x=193,5), arriba en y=144, separadas 16 por rayas de
 *   2 x 72: "4.5", "+10mil" y "+9mil" en 28 extrabold naranja, con etiquetas de 10.
 *
 * El título es un `<p role="heading" aria-level="1">` y no un `<h1>`: el `<h1>` de la
 * página ya está en el slide de escritorio (`HeroSlideHomeComponent`, oculto en
 * mobile); así hay un solo `<h1>` en el HTML y aun así un encabezado accesible aquí.
 *
 * Alto: `HERO_MOBILE_HEIGHT` (620), no los 481 de Figma (ver la constante); bajo la
 * foto (que acaba en 481, ya en gris) queda el gris de la página, donde se montan las
 * rayas del carousel y la tarjeta de búsqueda.
 */
export default function HeroSlideHomeMobileComponent() {
  return (
    <div
      className="relative overflow-hidden bg-gray-light md:hidden"
      style={{ height: HERO_MOBILE_HEIGHT }}
    >
      <div className="absolute top-0 left-[393px] h-[481px] w-[375px] bg-[url('/assets/home/hero/mobile/banner-borde-der.webp')] bg-[length:100%_100%]" />
      <Image
        src="/assets/home/hero/mobile/banner.webp"
        alt="Jeep Wrangler naranja de frente"
        width={393}
        height={481}
        sizes="393px"
        className="absolute top-0 left-0 h-[481px] w-[393px] max-w-none"
      />

      <span
        aria-hidden
        className="absolute top-[98px] left-[189px] h-[32px] w-[174px] bg-dark-gray"
      />
      <p
        role="heading"
        aria-level={1}
        className="absolute top-[28px] left-[26px] w-[341px] text-[28px] leading-[34px] font-bold tracking-[0.28px] whitespace-nowrap text-orange"
      >
        <span className="block">La Plataforma #1 en</span>
        <span className="block">
          Ventas de <span className="text-dark-gray">Autos Usados</span>
        </span>
        <span className="block text-dark-gray">
          100% Online{" "}
          <span className="ml-[3px] text-white">en Colombia</span>
        </span>
      </p>

      <div className="absolute top-[144px] left-[193.5px] flex h-[78px] -translate-x-1/2 items-end gap-4 text-center text-[10px] font-bold tracking-[0.1px] text-dark-gray">
        <div className="flex h-[68px] w-[96px] flex-col items-center">
          <p className="text-[28px] leading-[34px] font-extrabold tracking-[0.28px] text-orange">
            4.5
          </p>
          <p className="mt-2 w-[96px] leading-3">
            <span className="font-medium">+2mil Reseña</span> positivas en google
          </p>
          <Image
            src={estrellas}
            alt="Calificación de 4,5 sobre 5 en Google"
            className="mt-2 h-3 w-20 max-w-none"
          />
        </div>
        <span
          aria-hidden
          className="h-[72px] w-0.5 shrink-0 rounded-[9px] bg-[#90a3bf]/30"
        />
        <p className="flex h-[78px] flex-col items-center justify-center leading-3">
          <span className="text-[28px] leading-[34px] font-extrabold tracking-[0.28px] text-orange">
            +10mil
          </span>
          <span className="font-medium">Vehículos</span>
          <span>vendidos</span>
        </p>
        <span
          aria-hidden
          className="h-[72px] w-0.5 shrink-0 rounded-[9px] bg-[#90a3bf]/30"
        />
        <p className="flex h-[78px] flex-col items-center justify-center leading-3">
          <span className="text-[28px] leading-[34px] font-extrabold tracking-[0.28px] text-orange">
            +9mil
          </span>
          <span className="font-medium">Clientes</span>
          <span>Felices</span>
        </p>
      </div>
    </div>
  );
}
