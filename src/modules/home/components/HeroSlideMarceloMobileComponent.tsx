import Image from "next/image";

import { HERO_MOBILE_HEIGHT } from "../constants/hero-carousel";
import marcaAgua from "../assets/hero-mobile/marcelo-marca-agua.svg";
import wcarLogo from "../assets/hero-mobile/marcelo-wcar-logo.svg";

/**
 * Slide "Marcelo Cezán se une a nuestro equipo de wcar" del banner en MOBILE
 * (`< md`). Diseño real: Figma "Wcar Website - 2026", página "mobile 400"
 * (nodo 121:4524, 393 x 7844): a diferencia de los otros dos slides oscuros
 * (Santander y Colserauto, que en su marco mobile solo traían el arte), ESTE
 * trae el hero completo con su texto. Coordenadas de Figma medidas menos 98
 * (donde termina el `Nav mobile` de ese marco; aquí el navbar es aparte).
 *
 * Lockup arriba (nodo 121:5243, "Group 1171276150"): el isotipo wcar
 * (121:5244, 108,2 x 34,8) + una raya vertical (121:5250) + el logo de
 * Santander en rojo (121:5251, "image 60", 160 x 28). Aparece también en el
 * slide de escritorio de Santander, pero aquí es propio de este mobile: el
 * Figma de escritorio de Marcelo (117:3615) no lo trae, así que no es un
 * sobrante — se confirmó con el usuario y se agregó.
 *
 * Ojo con una pieza que SÍ es sobrante de duplicar la página de otro slide:
 * el rótulo bajo la foto, que en ese Figma dice "wcar transparencia y
 * tecnología" (121:4544, el de la portada, sin actualizar) en vez de "Marcelo
 * Cezán se une…". El rótulo real de este slide lo pone `HeroCarouselComponent`
 * solo (usa `tabTitle`/`tabSubtitle`), no se copia de aquí.
 *
 * Dos grupos, aparte por cómo deben crecer en pantallas más anchas de 393
 * (guía §4.2 y §8, "un elemento a ancho fijo dentro de un layout mobile"):
 * - El FONDO (foto, tarjeta, marca de agua, triángulo, Marcelo): va suelto,
 *   fuera del `max-w-[600px]` de más abajo, con `inset-x-0` — a TODO el ancho
 *   real de la ventana, no solo hasta 600. Encerrarlo en el mismo `max-w-600`
 *   que el texto dejaba franjas del fondo negro del slide a los lados en
 *   cualquier ancho mayor a 600 (el texto se queda quieto en su columna, pero
 *   la tarjeta y la foto no llegaban al borde real de la pantalla).
 * - El TEXTO (lockup, título, párrafo) sí se queda en una columna centrada de
 *   hasta 600 (como en los otros dos slides oscuros): no tendría sentido que
 *   las letras se estiraran sin límite en una pantalla ancha.
 *
 * Piezas:
 * - Tarjeta gris claro (`#f6f7f9`, nodo 121:5080): un rectángulo con la
 *   esquina inferior derecha cortada en diagonal (`M0,0 H393 V349,095 H113,5
 *   L0,473 V0`, de ahí el `clip-path`), para que la foto de abajo asome por
 *   ese corte. En Figma mide 393 y arranca en top=2 (sobre un lienzo también
 *   de 393): aquí va a `top-0`, no a esos 2px, porque en cualquier ancho
 *   dejaba una tira de 2px del fondo negro del slide bajo el navbar.
 * - Marca de agua "wcar" al 32 % (121:5081, 539 x 120 en top=52,left=-24):
 *   sale ya con su opacidad horneada en el SVG.
 * - Título (121:5253, top=125): 28/32 bold, igual color y cursiva que el de
 *   escritorio: "Marcelo Cezán" + "se une a" en negro, "nuestro equipo de"
 *   naranja cursiva medio, "wcar" naranja sin cursiva.
 * - Párrafo (121:5255, top=210): 14 semibold `gray-dark`.
 * - Foto de fondo (`marcelo-oficina.webp`): NO es del nodo 121:4538 de Figma
 *   (ese es el que arma `marcelo.webp`, el que sigue usando el slide de
 *   escritorio) — es una foto de la oficina más nítida que el usuario pasó
 *   aparte, sin recorte de Figma detrás. Como no viene con coordenadas de
 *   diseño, el `top-[340px]` salió a ojo contra el render. El alto de la caja,
 *   en cambio, NO es un número fijo: es `aspect-[1288/1268]` (la proporción
 *   real de la foto, casi cuadrada). Con un alto fijo que no calzara con esa
 *   proporción, `object-contain` sí mostraba la foto entera pero dejaba un
 *   hueco vacío arriba/abajo (se veía el fondo negro del slide asomando, y el
 *   velo oscuro de abajo —pensado para que se lea el rótulo, ver
 *   `HeroCarouselComponent`— caía sobre parte de la foto en vez de solo su
 *   borde). Con la caja ya del tamaño exacto de la foto no sobra ni falta
 *   espacio y no hace falta `object-contain`.
 * - Marcelo de cerca, ENCIMA de la foto de fondo (121:5259, 212 x 336 visible
 *   — el nodo mide 276 pero arranca en x=-64, fuera del lienzo, así que solo
 *   se ve esa franja): es OTRA foto, no la misma. Por Figma iría en top=299
 *   (397 menos 98); se corrió a top=269, los mismos 30 px que se subió la foto
 *   de fondo, para conservar la distancia entre las dos que trae el diseño.
 *   `download_assets` la exporta compuesta sobre blanco (sin alfa), pero el
 *   PNG crudo detrás (el `rawImage`, no el `export`; `imageTransform` leído
 *   con `use_figma` de solo lectura, guía §14) SÍ trae la silueta recortada
 *   con alfa real (Marcelo ya viene editado sobre transparente, sin fondo de
 *   estudio): recortarlo con `figma_imagen.py aplicar --alfa` (guía §14, "una
 *   foto YA recortada con transparencia") da `marcelo-persona.webp` limpio, en
 *   vez del rectángulo blanco que da recortar a mano el `export` ya aplanado.
 *   `--alfa` de paso limpia el halo claro que deja el color de fábrica (el
 *   fondo de estudio) que Figma no premultiplica en los píxeles ya
 *   transparentes: sin eso se filtraba al borde de la silueta al reescalar o
 *   comprimir, sobre todo notorio contra el naranja de atrás. Se sumó también
 *   `--sin-perdida` (WebP sin pérdida): comprobado a pixel contra el export y
 *   contra un render real no se veía ningún halo, pero un WebP CON pérdida
 *   comprime el canal alfa igual que el de color, y no todos los navegadores
 *   lo decodifican con la misma precisión — sin pérdida quita ese riesgo del
 *   todo (a cambio de un archivo más pesado, aceptable en una silueta chica).
 * - Triángulo naranja DETRÁS de Marcelo (121:5085, `#FF8000`, 139,5 x 244,5:
 *   un lado recto a la izquierda y la punta a la derecha, a media altura —
 *   `clip-path: polygon(0 0, 0 100%, 100% 50%)`). Como queda tapado casi
 *   entero por la foto de Marcelo (solo asoma alrededor de su silueta), sus
 *   coordenadas de Figma no se podían leer directo del render (lo que se ve
 *   ahí es la MEZCLA del triángulo con lo que lo tapa): se ubicó reconstruyendo
 *   el triángulo a partir de dónde aparece y desaparece el naranja en varias
 *   columnas del render de Figma (`verificar-figma-contra-render`), no de la
 *   cuenta directa de su posición en la página.
 *
 * La caja de la foto de fondo (top=340 + su alto según `aspect-ratio`, unos
 * 386 a 393 según el ancho real) pasa un poco de los `HERO_MOBILE_HEIGHT`
 * (620) del banner: se corta por abajo, como en los otros slides.
 */
export default function HeroSlideMarceloMobileComponent() {
  return (
    <div
      className="relative overflow-hidden bg-black md:hidden"
      style={{ height: HERO_MOBILE_HEIGHT }}
    >
      {/* Fondo (foto, tarjeta, marca de agua, triángulo, Marcelo): a todo el
          ancho de la ventana (`inset-x-0`), no encerrado en el `max-w-[600px]`
          del texto. Encerrarlo ahí dejaba franjas del fondo negro del slide a
          los lados en cualquier ancho mayor a 600 (el texto se queda quieto,
          pero la tarjeta y la foto no llegaban al borde real). */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-[340px] aspect-[1288/1268]"
      >
        <Image
          src="/assets/home/hero/mobile/marcelo-oficina.webp"
          alt=""
          fill
          sizes="(max-width: 1279px) 100vw, 1279px"
          className="object-cover"
        />
      </div>

      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-[473px] bg-gray-light"
        style={{
          clipPath: "polygon(0 0, 100% 0, 100% 73.81%, 28.88% 73.81%, 0 100%)",
        }}
      />
      <Image
        src={marcaAgua}
        alt=""
        aria-hidden
        className="absolute top-[52px] left-[-24px] h-[120px] w-[539px] max-w-none"
      />
      <span
        aria-hidden
        className="absolute top-[252px] left-0 h-[244.5px] w-[139.5px] bg-orange"
        style={{ clipPath: "polygon(0 0, 0 100%, 100% 50%)" }}
      />
      <div className="absolute top-[269px] left-0 h-[336px] w-[212px]">
        <Image
          src="/assets/home/hero/mobile/marcelo-persona.webp"
          alt="Marcelo Cezán"
          fill
          sizes="212px"
          className="object-contain object-bottom"
        />
      </div>

      <div className="relative mx-auto h-full w-full max-w-[600px]">
        <div className="absolute top-[49px] left-[38px] flex items-center gap-[19px]">
          <Image
            src={wcarLogo}
            alt=""
            aria-hidden
            className="h-[34.8px] w-auto"
          />
          <span aria-hidden className="h-[34.8px] w-px bg-gray/30" />
          <Image
            src="/assets/home/hero/mobile/santander-wordmark.webp"
            alt="Santander"
            width={160}
            height={28}
            className="h-[28px] w-auto"
          />
        </div>

        <h2 className="absolute top-[125px] left-[19px] max-w-[318px] text-[28px] leading-[32px] font-bold">
          <span className="text-black">Marcelo Cezán </span>
          <span className="font-semibold text-black">se une a </span>
          <span className="font-medium text-orange italic">
            nuestro equipo de{" "}
          </span>
          <span className="text-orange">wcar</span>
        </h2>

        <p className="absolute top-[210px] left-[19px] max-w-[318px] text-[14px] leading-[18px] font-semibold text-gray-dark">
          Marcelo Cezán se une a la familia wcar para garantizarte el mejor
          trato , compra o vende de tu vehículo con total seguridad.
        </p>
      </div>
    </div>
  );
}
