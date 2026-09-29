import Image from "next/image";

import logoWcarPanel from "@/modules/shared/assets/logos/logo-wcar-panel.svg";

import brilloEntreCarros from "../assets/cambio-de-vehiculo/brillo-entre-carros.svg";

/**
 * Lo que va sobre la foto del panel naranja, en unidades `cqw` (1 % del ancho del
 * panel): a 568 px de ancho (desktop) 1cqw = 5,68 px y las medidas de Figma salen
 * exactas; más angosto, todo escala igual (mobile). Cada valor es px ÷ 568 × 100.
 */
const SHINE = "left-[11.972cqw] top-[42.254cqw] w-[46.283cqw] h-[30.81cqw]";

/**
 * Sección "Cambia tu vehículo con wcar": el panel naranja con la foto de dos carros
 * plateados, el logo, el lema y las dos flechas de intercambio, y a su derecha el
 * panel oscuro con el título y el texto.
 *
 * Fuente: Figma "Wcar Website - 2026", nodo 193:8183. Medidas en px del lienzo de 1440
 * con y=0 en el borde superior del panel oscuro (y=2251 de la página):
 * - Panel oscuro (`dark-gray`, "Rectangle 4270" 199:11774): x=696 hasta la ventana,
 *   444 de alto (hasta y=2695, donde arranca el gris de "Financia tu Vehículo").
 *   Su contenido arranca en x=783: raya cian de 115 x 4 en y=65, 10 debajo el
 *   eyebrow "Financia tu vehículo" (14/22 Bold `gray`), 10 más abajo el título de
 *   36/44 en `gray-light` ("Cambia tu vehículo con wcar") y, en cursiva Medium cian,
 *   "y obtén un bono BRUTAL" (marco de 134 de alto), y a 39 el párrafo de 16/24
 *   `gray-light`, cinco renglones en una caja de 421 (en y=238).
 * - Panel naranja (marco "Frame 587" 195:11647): **568 x 568 en (128,-124)**, o sea
 *   sobresale 124 px hacia arriba, sobre el blanco de "Financia tu garantía", y pisa
 *   la barra negra de esa sección (`z-20` contra el `z-10` de la barra). Es un marco
 *   compuesto:
 *   · Fondo: la foto (Gemini, PNG de 2752 x 1536, recortada en un cuadrado) con
 *     ajustes de imagen de Figma (saturación +67 %, tinte +27 %) y siete
 *     degradados encima (seis naranjas que la funden con el fondo por los lados y
 *     abajo, una franja negra al pie). **Se exportó ya compuesta** (nodo 199:11772
 *     a 2x, WebP de 1136 x 1136) en vez de replicar los siete degradados en CSS:
 *     los ángulos y paradas salen de matrices de Figma y son frágiles; el archivo
 *     pesa ~40 KB por ser todo degradado suave.
 *   · Brillo entre los carros ("Rectangle 4269" 199:11770): una forma con degradado
 *     naranja (de #FFAD44 opaco a #D14D0B transparente) y desenfoque de 20, al 90 %,
 *     en (88,260) de 223 x 135 (el SVG trae los 20 px de desenfoque de margen:
 *     263 x 175 en (68,240)). En Figma su relleno es de modo `overlay`, pero como
 *     el nodo lleva desenfoque de capa el modo se resuelve dentro del propio nodo y
 *     el resultado es un velo NORMAL: medido contra el render, `overlay` sobre la
 *     foto daba 7,3/255 de diferencia y el velo normal 2,4 (sin el brillo, 13,7).
 *   · Rayado blanco (Lines 13px, en modo TILE a 17 px) en (101,468) de 467 x 100 al
 *     50 %.
 *   · Logo (66,51) de 149 x 48; lema en (66,139), caja de 411, Urbanist Bold 32 blanco
 *     y "pago y llévate uno nuevo" en Medium cursiva, con el interlineado normal.
 *   · Dos flechas de 38 x 38: en (296,270) y, girada 180°, en (233,380). En Figma son
 *     un PNG 3D azul con ajustes de imagen (exposición, tinte, temperatura,
 *     saturación) que lo dejan blanco; el WebP (`flecha-de-cambio.webp`, 76 x 76 con
 *     alfa, 1 KB) trae el color ya ajustado (ajuste polinómico contra el render, error
 *     medio < 1/255 en sus 314 píxeles opacos). La sombra de Figma (60 60 100 al 8 %)
 *     no se dibuja: a ese desenfoque no se ve.
 *
 * Mobile (no hay diseño): el panel naranja a todo el ancho arriba (sin salirse de la
 * sección) y el oscuro debajo.
 *
 * TODO: la foto trae una marca de agua de Gemini (una estrella) en la esquina inferior
 * derecha del original; el recorte del diseño la deja fuera, pero conviene pedir la foto
 * definitiva. "Financia tu vehículo" lleva tilde en Figma (el plan la daba sin ella).
 */
export default function FinancingTradeInComponent() {
  return (
    <section aria-labelledby="cambio-title" className="relative overflow-x-clip xl:h-[444px]">
      <div className="relative mx-auto flex flex-col xl:block xl:h-full xl:max-w-[1440px]">
        {/* Panel oscuro (desktop): del borde x=696 a la ventana. */}
        <div
          aria-hidden
          className="absolute inset-y-0 hidden bg-dark-gray xl:right-[calc(50%-50vw)] xl:left-[696px] xl:block"
        />

        {/* ---------- Panel naranja ---------- */}
        <div className="relative aspect-square w-full overflow-hidden bg-orange [container-type:inline-size] xl:absolute xl:top-[-124px] xl:left-[128px] xl:z-20 xl:size-[568px]">
          <Image
            src="/assets/financiacion/cambio-de-vehiculo/dos-carros-sobre-fondo-naranja.webp"
            alt="Dos carros plateados, una camioneta y un hatchback, sobre un fondo naranja de estudio"
            fill
            sizes="(min-width: 1280px) 568px, 100vw"
            className="object-cover"
          />
          <Image
            src={brilloEntreCarros}
            alt=""
            aria-hidden
            className={`absolute max-w-none ${SHINE}`}
          />
          <div
            aria-hidden
            className="absolute top-[82.394cqw] left-[17.782cqw] h-[17.606cqw] w-[82.218cqw] bg-[url('/assets/shared/lines-13px-white.png')] bg-size-[2.993cqw_2.993cqw] opacity-50"
          />
          <Image
            src={logoWcarPanel}
            alt="WCAR"
            className="absolute top-[8.979cqw] left-[11.62cqw] h-auto w-[26.255cqw]"
          />
          <p className="absolute top-[24.472cqw] left-[11.62cqw] w-[72.359cqw] text-[5.634cqw] leading-[normal] font-bold text-white">
            Usa tu auto como parte de <span className="font-medium italic">pago y llévate uno nuevo</span>
          </p>
          <Image
            src="/assets/financiacion/cambio-de-vehiculo/flecha-de-cambio.webp"
            alt=""
            aria-hidden
            width={76}
            height={76}
            className="absolute top-[47.535cqw] left-[52.113cqw] size-[6.69cqw] max-w-none"
          />
          <Image
            src="/assets/financiacion/cambio-de-vehiculo/flecha-de-cambio.webp"
            alt=""
            aria-hidden
            width={76}
            height={76}
            className="absolute top-[66.901cqw] left-[41.021cqw] size-[6.69cqw] max-w-none rotate-180"
          />
        </div>

        {/* ---------- Panel oscuro: contenido ---------- */}
        <div className="bg-dark-gray px-8 py-12 xl:absolute xl:top-[65px] xl:left-[783px] xl:w-[472px] xl:bg-transparent xl:p-0">
          <span aria-hidden className="block h-1 w-[115px] bg-blue-neon" />
          <p className="mt-2.5 text-small font-bold text-gray">Financia tu vehículo</p>
          <h2
            id="cambio-title"
            className="mt-2.5 text-[32px] leading-[38px] font-bold text-gray-light xl:text-subheadline-1 xl:leading-11"
          >
            Cambia tu vehículo con wcar
            <span className="block font-medium text-blue-neon italic">y obtén un bono BRUTAL</span>
          </h2>
          <p className="mt-6 text-body font-medium text-gray-light xl:mt-[39px] xl:w-[421px]">
            Deja tu vehículo actual como parte de pago, financia la diferencia con nuestras tasas preferenciales y llévate
            tu auto nuevo hoy mismo. ¿El toque final? Te regalamos un BONO BRUTAL de descuento directo al precio. ¡No
            dejes pasar esta oportunidad y súbete al auto de tus sueños!
          </p>
        </div>
      </div>
    </section>
  );
}
