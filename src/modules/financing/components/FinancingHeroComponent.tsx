import Image from "next/image";

import logoSantander from "@/modules/shared/assets/hero/logo-santander.png";
import logoWcarWhite from "@/modules/shared/assets/hero/logo-wcar-white.svg";
import ButtonComponent from "@/modules/shared/components/ButtonComponent";
import DiagonalLinesComponent from "@/modules/shared/components/DiagonalLinesComponent";
import { ROUTES } from "@/modules/shared/constants/routes";

import watermark from "../assets/hero/watermark-wcar.svg";
import watermarkIsotipo from "../assets/hero/watermark-isotipo.svg";

/**
 * Caja de la foto del hero. La foto y el recorte de las dos personas comparten
 * este "escenario": un bloque de 906 x 596 (la proporción a la que Figma pone la
 * foto) que ocupa todo el ancho de la caja y va centrado, saliéndose por arriba
 * y por abajo (o por los lados si la caja es más angosta que alto x 1,52). Es un
 * `object-cover` con la geometría a la vista, para que el recorte quede pegado a
 * la foto a cualquier ancho de ventana: con `object-cover` suelto, el recorte
 * (una imagen aparte, con su propia caja) se desalinearía al crecer la caja en
 * pantallas anchas.
 *
 * En mobile la caja es 906 : 596 y el escenario la llena exacta. En desktop
 * arranca en x=533 del lienzo y sangra a la derecha hasta el borde de la
 * ventana. Se usa dos veces porque la forma negra va ENTRE la foto y el recorte
 * (no comparten contexto de apilamiento).
 */
function HeroPhotoStage({
  className = "",
  decorative = false,
  children,
}: {
  className?: string;
  /** El recorte repite lo que ya dice la foto: se esconde a los lectores de pantalla. */
  decorative?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      aria-hidden={decorative || undefined}
      className={`grid-cols-[100%] grid-rows-[100%] place-items-center overflow-hidden xl:absolute xl:inset-y-0 xl:right-[calc(50%-50vw)] xl:left-[533.3px] xl:aspect-auto xl:w-auto ${className}`}
    >
      <div className="relative aspect-[906/596] w-full max-md:aspect-auto max-md:h-full xl:min-w-[775px]">{children}</div>
    </div>
  );
}

/**
 * Hero de la vista Financiación: banner negro con el lockup wcar | Santander, el
 * título "Financia hasta el *100% de tu vehículo*" y la foto de dos personas
 * firmando una solicitud, con la forma negra en diagonal, la marca de agua
 * "wcar" y el triángulo cian de la esquina.
 *
 * Fuente: Figma "Wcar Website - 2026", nodo 193:8183, marco "Frame 277"
 * (193:8212), 1440 x 509 desde y=128 (bajo el navbar). Todas las medidas de
 * abajo salen de Figma y del render del marco (no de las capturas; la
 * `1-hero-y-pasos.png` coincide) y están en px del lienzo de 1440:
 * - Foto (nodo "Rectangle 18", 193:8213): caja de 1439 x 509 con la JPEG de
 *   4096 x 2731 en modo CROP: `imageTransform` [[1,588; 0; -0,5886]; [0; 0,8545;
 *   0,0723]] = la foto mostrada a 906 x 596 en (533,-43), o sea un `object-fill`
 *   (un 1,4 % más ancha que su proporción) en un escenario de esas medidas
 *   (ver `HeroPhotoStage`); se ve desde x=533 porque la forma negra tapa lo de la
 *   izquierda. Trae **ajustes de imagen** de Figma (contraste +47 %, saturación
 *   +44 %, tinte +6 %) que CSS no puede hacer: el WebP los lleva horneados
 *   (ajuste polinómico de color contra el render, error medio 2-3/255;
 *   `figma_imagen.py`). Encima, el segundo relleno: un degradado a negro que en
 *   el borde derecho vale 74,3 % de negro y llega a 0 % en x=1164
 *   (`gradientTransform` t = -3,8787·u + 4,1361; lo confirmé columna a columna
 *   contra el render), o sea 275 px desde el borde de la ventana.
 * - Forma negra (195:9806): cuadrilátero (0,0)-(965,0)-(515,509)-(0,509), es
 *   decir un rectángulo hasta x=515 que sangra a la izquierda y una cuña
 *   diagonal a su derecha. Negro puro (Figma la pinta #010101).
 * - Recorte de las personas (195:9810, "DSC04239 1"): la misma foto pero
 *   recortada del fondo (PNG con alfa de 1752 x 1168), en una caja de 339 x 393
 *   en (599,29), con la misma geometría de la foto (906 x 596 en (533,-43)) y
 *   **otros** ajustes de imagen (contraste +33 %, saturación +31 %, tinte +19 %:
 *   por eso el hombre se ve más morado que en la foto de abajo) y un degradado
 *   de negro al 90 % que oscurece su borde superior (hasta y≈107). Va POR
 *   ENCIMA de la forma negra para que el brazo y el hombro del hombre sobresalgan
 *   de la diagonal; el resto ya está en la foto y no se duplica. El WebP (678 x
 *   786, alfa) es la caja ya recortada, con el color y el degradado de arriba
 *   horneados en el RGB (el alfa queda como estaba: en el diseño el degradado
 *   también vela lo de detrás, pero esa esquinita se desalinearía a >1440).
 * - Triángulo cian (195:10871): vértices (1110,509), (1440,509) y (1440,182),
 *   a 45° (medido en el render; Figma lo trae rotado -3,29° y sesgado, y el
 *   resultado visible es este). Sangra a la derecha.
 * - Rayado blanco (Lines 13px): (475,453) 724 x 56, en la diagonal "\" (el
 *   tile viene en "/") y por debajo de la forma negra y del triángulo.
 * - Marca de agua "wcar" (195:10874): SVG de 808 x 180 en (-103,106), blanca al
 *   24 % (ya dentro del SVG), cortada por la izquierda del lienzo.
 * - Lockup (195:9823): logo wcar 149 x 48 en (124,62), raya vertical de 2 x 48
 *   en (302,58) `rgba(144,163,191,0.3)` y Santander 200 x 35 en (333,64): las
 *   tres piezas a alturas distintas (no centradas entre sí), como en Figma.
 *   No es el lockup de Sobre Nosotros/Sedes (allí Santander mide 239 x 42 y la
 *   raya es `white/60`): no se comparte.
 * - `<h1>` (193:8217): Urbanist SemiBold 50/55, caja de 465 en (124,141):
 *   "Financia hasta el" en blanco y "100% de tu vehículo" en cursiva regular
 *   cian. Párrafo (195:10877): Medium 18/22, `gray-light`, caja de 434 en
 *   (124,281). Botón `primary` en (124,366) de 205 x 48.
 * - Hay además una "Line H" naranja de 77 x 4 en (124,208) que el render no
 *   muestra (queda oculta): no se dibuja.
 *
 * Teléfono (< 768, marco "Frame 596" 204:7761 de "financiación - 394", 393 x 626
 * desde y=96): el mismo lenguaje en chico, en px del marco. Lockup centrado
 * (wcar 91,8 x 29,5, raya de 1,2, Santander 123 x 21,5; 47 de arriba), `<h1>` de
 * 32/40 en (31,118), párrafo de 280 de ancho en 16/22 (y=223), la foto a 508 x
 * 338,7 en (-32,247) con la forma negra por encima (diagonal de (0,469) a
 * (393,257), medida sobre el render), el recorte de las personas encima de la
 * forma, el isotipo de 281 x 312 al 10 % en (-43,25), el triángulo cian (393,543)
 * -(393,626)-(225,626), el rayado de los últimos 40 px y el botón de 205 x 48
 * centrado, a 522 del borde de arriba (se monta sobre la foto). De 768 a 1279
 * (sin diseño) sigue el apilado de siempre: texto arriba y foto abajo.
 *
 * TODO: destino del botón "Solicita tu crédito" (hoy `ROUTES.contact`); el
 * diseño no lo dice y en el sitio anterior era un `<button>` que abría un
 * formulario.
 * TODO: confirmar con diseño el voseo formal del párrafo ("Póngase", "le informaremos"),
 * distinto del tuteo del resto del sitio. (El botón lleva "CRÉDITO" con tilde en Figma;
 * la captura del plan decía "CREDITO" por su baja resolución.)
 */
export default function FinancingHeroComponent() {
  return (
    <section aria-labelledby="financiacion-hero-title" className="relative isolate overflow-x-clip bg-black">
      {/* El lienzo de 1440 centrado: los px del diseño valen aquí y los fondos
          sangran hasta el borde de la ventana (guía §4.2). */}
      <div className="relative mx-auto flex h-[626px] flex-col md:h-auto xl:block xl:h-[509px] xl:max-w-[1440px]">
        {/* Foto. De 768 a 1279 va debajo del texto; en teléfono, montada bajo la
            forma negra (ver el JSDoc). */}
        <HeroPhotoStage className="relative order-2 grid aspect-[906/596] w-full max-md:absolute max-md:top-[247px] max-md:-left-8 max-md:aspect-[508/338.67] max-md:w-[508px]">
          <Image
            src="/assets/financiacion/hero/asesora-y-cliente-firmando-solicitud.webp"
            alt="Dos personas firmando una solicitud de crédito sobre una mesa, en una oficina de paredes naranjas"
            fill
            preload
            sizes="(min-width: 1280px) calc(50vw + 183px), (min-width: 768px) 100vw, 508px"
            className="object-fill"
          />
        </HeroPhotoStage>
        {/* Oscurece el borde derecho de la foto (solo desktop). */}
        <div
          aria-hidden
          className="absolute inset-y-0 hidden bg-[linear-gradient(to_left,rgb(0_0_0/0.743),transparent_275px)] xl:right-[calc(50%-50vw)] xl:left-[533.3px] xl:block"
        />

        {/* ---------- Decoración de teléfono ---------- */}
        <DiagonalLinesComponent className="absolute top-[586px] left-0 z-10 h-[40px] w-full -scale-x-100 opacity-50 md:hidden" />
        <div
          aria-hidden
          className="absolute top-[543px] right-0 z-20 h-[83px] w-[168px] bg-blue-neon [clip-path:polygon(100%_0,100%_100%,0_100%)] md:hidden"
        />
        <div
          aria-hidden
          className="absolute inset-0 z-30 bg-black [clip-path:polygon(0_0,100%_0,100%_257px,0_469px)] md:hidden"
        />
        <Image
          src={watermarkIsotipo}
          alt=""
          aria-hidden
          className="absolute top-[25px] left-[-43px] z-40 h-[312px] w-[281px] max-w-none md:hidden"
        />

        {/* ---------- Decoración de desktop ---------- */}
        {/* Rayado: por debajo de la forma negra y del triángulo. */}
        <DiagonalLinesComponent className="absolute top-[453px] left-[475px] z-10 hidden h-[56px] w-[724px] -scale-x-100 opacity-50 xl:block" />
        <div
          aria-hidden
          className="absolute top-[182px] right-[calc(50%-50vw)] z-20 hidden h-[327px] w-[330px] bg-blue-neon [clip-path:polygon(100%_0,100%_100%,0_100%)] xl:block"
        />
        {/* Forma negra: el rectángulo que sangra a la izquierda hasta x=515 y la
            cuña de la diagonal hasta x=965. */}
        <div
          aria-hidden
          className="absolute inset-y-0 z-30 hidden bg-black xl:left-[calc(50%-50vw)] xl:block xl:w-[calc(515px+50vw-50%)]"
        />
        <div
          aria-hidden
          className="absolute top-0 left-[515px] z-30 hidden h-[509px] w-[450px] bg-black [clip-path:polygon(0_0,100%_0,0_100%)] xl:block"
        />
        <Image
          src={watermark}
          alt=""
          aria-hidden
          className="absolute top-[106px] left-[-103px] z-40 hidden h-[180px] w-[808px] max-w-none xl:block"
        />

        {/* Las personas, recortadas: por encima de la forma negra. */}
        <HeroPhotoStage
          decorative
          className="z-50 hidden max-md:absolute max-md:top-[247px] max-md:-left-8 max-md:grid max-md:aspect-[508/338.67] max-md:w-[508px] xl:grid"
        >
          <Image
            src="/assets/financiacion/hero/asesora-y-cliente-recorte.webp"
            alt=""
            width={659}
            height={763}
            sizes="(min-width: 1280px) 25vw, (min-width: 768px) 1px, 190px"
            className="absolute top-[12.1%] left-[7.25%] h-[65.97%] w-[37.41%] max-w-none"
          />
        </HeroPhotoStage>

        {/* ---------- Texto ---------- */}
        <div className="order-1 container-wcar pt-[47px] pb-0 md:pt-8 md:pb-10 xl:pt-[58px] xl:pb-0">
          {/* Lockup wcar | Santander. En desktop, tres piezas a alturas
              distintas (medidas de Figma); en mobile, a 2/3 y en fila. */}
          <div className="relative z-40 flex items-center justify-center gap-[18px] md:justify-start md:gap-4 xl:block xl:h-[52px]">
            <Image
              src={logoWcarWhite}
              alt="WCAR"
              className="h-[29.54px] w-[91.77px] md:h-8 md:w-[99.4px] xl:absolute xl:top-1 xl:left-0 xl:h-12 xl:w-[149.13px]"
            />
            <span
              aria-hidden
              className="h-[29.54px] w-[1.23px] bg-gray/30 md:h-8 md:w-[2px] xl:absolute xl:top-0 xl:left-[178.13px] xl:h-12"
            />
            <Image
              src={logoSantander}
              alt="Santander"
              className="h-[21.54px] w-[123px] md:h-[23px] md:w-[133px] xl:absolute xl:top-1.5 xl:left-[209px] xl:h-[35px] xl:w-[200px]"
            />
          </div>

          <h1
            id="financiacion-hero-title"
            className="relative z-40 mt-[39px] text-[32px] leading-10 font-semibold text-white md:mt-8 md:leading-9 xl:mt-[31px] xl:w-[465px] xl:text-[50px] xl:leading-[55px]"
          >
            Financia hasta el <span className="block font-normal text-blue-neon italic">100% de tu vehículo</span>
          </h1>

          <p className="relative z-40 mt-[25px] max-w-[280px] text-body leading-[22px] font-medium text-gray-light md:mt-5 md:max-w-none md:leading-6 xl:mt-[30px] xl:w-[434px] xl:text-[18px] xl:leading-[22px]">
            Póngase en contacto con nosotros y le informaremos sin compromiso de nuestras tarifas y servicios.
          </p>

          <div className="relative z-40 mt-8 max-md:absolute max-md:top-[522px] max-md:left-1/2 max-md:mt-0 max-md:-translate-x-1/2 xl:mt-[41px]">
            {/* TODO: destino del botón (ver el JSDoc). */}
            <ButtonComponent href={ROUTES.contact}>SOLICITA TU CRÉDITO</ButtonComponent>
          </div>
        </div>
      </div>
    </section>
  );
}
