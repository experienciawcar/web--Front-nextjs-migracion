import Image from "next/image";

import logoSantander from "@/modules/shared/assets/hero/logo-santander.png";
import logoWcarWhite from "@/modules/shared/assets/hero/logo-wcar-white.svg";
import heroWatermark from "@/modules/shared/assets/hero/watermark.svg";
import DiagonalLinesComponent from "@/modules/shared/components/DiagonalLinesComponent";

import logoWcarWhiteMobile from "../assets/hero/logo-wcar-white-mobile.svg";
import heroShape from "../assets/hero/shape.svg";

/**
 * Gradiente del diseño, con su ángulo y paradas exactas. Solo hace falta en
 * desktop: en mobile ya viene incorporado en la imagen exportada (ver nota en
 * el bloque mobile).
 */
const GRADIENT_DESKTOP =
  "linear-gradient(72.64deg, rgba(0,0,0,0.8) 5.22%, rgba(0,0,0,0) 41.56%)";

/**
 * Hero de la vista Sobre Nosotros.
 *
 * Desktop (frame 26:7624, 1440x526) y mobile (nodos sueltos bajo 2:213) son
 * layouts distintos, no el mismo con otro tamaño: cambian la foto, el ángulo
 * del degradado, la posición de la forma negra y la marca de agua. Por eso van
 * como dos bloques y no como uno con clases responsive.
 *
 * El corte es `xl` (1280px) para seguir al navbar, que ya usa ese breakpoint.
 */
export default function AboutHeroComponent() {
  return (
    <>
      {/* ---------- Mobile (frame 393) ---------- */}
      {/* z-10 porque el isotipo naranja se sale por abajo del hero y tiene que
          quedar por encima del fondo blanco de la sección siguiente. */}
      <section className="relative z-10 xl:hidden" aria-label="WCAR y Santander">
        {/* El diseño mobile es 393x193. Se conserva la proporción en vez de una
            altura fija porque la foto va estirada (ver nota abajo): con altura
            fija y ancho variable se deformaría al crecer el viewport. */}
        <div className="relative aspect-[393/193] w-full overflow-hidden">
          {/* Aquí la foto es el export del nodo 2:225 y no su imagen de
              relleno, porque el nodo mobile apila dos rellenos y el degradado:
              reconstruirlo a mano daba una diferencia de 52/255 contra el
              render de Figma, y con el export baja a 1. Eso implica que el
              degradado ya viene incorporado en el archivo, por eso aquí no hay
              capa de gradiente como sí la hay en desktop.
              El export ya viene recortado a la parte visible (786x386 = el
              canvas de 393x193 a 2x), así que va a ancho completo y no al
              131.8% del nodo. Comprobado escala por escala contra el render:
              al 100% la diferencia es 0.96/255 y al 131.8% sube a 25.75. */}
          <Image
            src="/assets/about-us/hero/jeeps-mobile.png"
            alt=""
            aria-hidden
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />

          {/* Forma negra: en el diseño arranca en x=299 y se sale 16px por la
              derecha del canvas de 393. */}
          <Image
            src={heroShape}
            alt=""
            aria-hidden
            className="absolute top-[4.54%] right-[-4.18%] h-[104%] w-[28.11%]"
          />
        </div>

        {/* Todo lo que sigue va en porcentajes y no en px: la versión mobile
            del diseño tiene que servir hasta 1279px (el proyecto corta en xl),
            y no hay frame de tablet en Figma. Con porcentajes el bloque escala
            proporcionalmente, exacto a 393px y predecible más arriba.

            Este SVG trae dos piezas en una sola caja de 68x158: el wordmark
            "wcar" blanco arriba (sobre la foto) y el isotipo naranja abajo (ya
            sobre el blanco), con vacío en medio. Así lo exporta Figma, así que
            no puede ir dentro del contenedor con overflow-hidden de la foto. */}
        <Image
          src={logoWcarWhiteMobile}
          alt="WCAR"
          className="absolute top-[52.38%] left-[15.78%] h-[81.82%] w-[17.51%]"
        />
        <span
          aria-hidden
          className="absolute top-[45.08%] left-[36.69%] h-[11.48%] w-[0.24%] bg-white/60"
        />
        <Image
          src={logoSantander}
          alt="Santander"
          className="absolute top-[45.55%] left-[40.34%] h-[10.04%] w-[28.05%]"
        />
      </section>

      {/* ---------- Desktop (frame 1440) ---------- */}
      <section
        className="relative hidden h-[526px] w-full overflow-hidden xl:block"
        aria-label="WCAR y Santander"
      >
        {/* Estirada, no recortada: el relleno de Figma ocupa los 1440x526 del
            nodo deformando la foto (que es 1024x577). Comprobado contra el
            render: estirada da una diferencia de 1.3/255 y con object-cover
            de 33+. Por encima de 1440px el estirado se acentúa, pero recortar
            sacaría los jeeps del encuadre.
            TODO: la foto original solo mide 1024x577, así que a 1440px ya
            entra algo blanda. Pedir a diseño que la vuelva a subir en alta. */}
        <Image
          src="/assets/about-us/hero/jeeps.png"
          alt=""
          aria-hidden
          fill
          sizes="100vw"
          className="object-fill"
          priority
        />
        <div aria-hidden className="absolute inset-0" style={{ backgroundImage: GRADIENT_DESKTOP }} />

        {/* Marca de agua "W wcar" en trazo, al 40% de opacidad ya dentro del SVG.
            Va anclada al centro del canvas (x=51 de 1440, o sea -669 desde el
            centro), igual que el rayado y el lockup: pegada a la ventana, en
            pantallas anchas se separaba del lockup que va encima. */}
        <Image
          src={heroWatermark}
          alt=""
          aria-hidden
          className="absolute top-[51px] left-1/2 ml-[-669px] h-[206.42px] w-[637px]"
        />

        {/* Forma negra inclinada del borde derecho. La rotación y el sesgo son
            del diseño: el SVG solo trae el cuadrilátero sin transformar. */}
        <div className="absolute top-[-0.5px] right-[-37.52px] flex h-[543.81px] w-[290.52px] items-center justify-center">
          <div className="flex-none rotate-[-4.53deg] skew-x-[-0.43deg]">
            <Image src={heroShape} alt="" aria-hidden className="h-[525.11px] w-[253.79px]" />
          </div>
        </div>

        {/* Rayado diagonal sobre la foto. Va anclado al centro del canvas
            (x=616 de 1440) para que no se despegue en pantallas anchas. */}
        <DiagonalLinesComponent className="absolute top-[245px] left-1/2 ml-[-104px] h-[56px] w-[254px]" />

        {/* Lockup wcar | Santander. Los dos espacios entre piezas son de 29px
            en el diseño, así que sale con flex en vez de posiciones absolutas. */}
        <div className="absolute inset-x-0 top-[128px]">
          <div className="container-wcar flex items-center gap-[29px]">
            <Image src={logoWcarWhite} alt="WCAR" className="h-12 w-[149.13px]" />
            <span aria-hidden className="h-12 w-[2px] bg-white/60" />
            <Image src={logoSantander} alt="Santander" className="h-[42px] w-[239px]" />
          </div>
        </div>
      </section>
    </>
  );
}
