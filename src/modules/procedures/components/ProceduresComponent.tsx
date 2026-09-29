import Image from "next/image";

import ProceduresAdvisoryComponent from "./ProceduresAdvisoryComponent";
import ProceduresListComponent from "./ProceduresListComponent";

/**
 * Sección "Trámites de vehículos": la foto del hero a todo el ancho, la tarjeta
 * blanca con el acordeón montada sobre su borde inferior y, a la derecha, el
 * párrafo y el recuadro negro de asesoría.
 *
 * Diseño: captura del desktop (1910 de ancho) de la página de trámites del sitio
 * anterior (wcar.co/tramites-de-vehiculos), sin el navbar ni el footer, y el DOM de
 * ese sitio medido con Chrome a 393, 768, 1440 y 1910; no hay nodo de Figma ni
 * diseño mobile. Las medidas de cada pieza están en su componente.
 *
 * Foto: `cruce-de-autopistas-de-noche.webp`, la `bg_procedures.jpg` del sitio
 * anterior (1440 x 526, la que usa en desktop) pasada a WebP (1 MB → 112 KB). El
 * archivo solo mide 1440 de ancho: a 1900 se ve ampliada 1,3 veces, igual que en
 * wcar.co.
 * TODO(imagen): pedir la foto a 2x (2880 de ancho) para pantallas anchas y retina.
 *
 * Desktop (`xl`, 1280): la foto es proporcional a la ventana (1440 x 526 → 2,74:1,
 * `img-fluid w-100` en el sitio anterior). Debajo, una rejilla de 1320 de ancho
 * máximo, centrada, con tres columnas 7/1/4 de 12: la tarjeta (746 con 12 de margen a
 * cada lado, ver `ProceduresListComponent`) sube 168 px sobre la foto (`-mt-42`,
 * los 12em de 14 px del sitio anterior) y la columna de la derecha (440) arranca a
 * la altura de la foto, no de la tarjeta. Es una rejilla y no bloques apilados
 * porque el margen negativo de un hijo de la rejilla no se propaga al contenedor
 * (con bloques, colapsa y sube también la columna derecha).
 *
 * Mobile: el sitio anterior cambiaba a dos columnas a los 768 px; aquí el
 * breakpoint de desktop es `xl` (1280) y por debajo va una sola columna, de 720 de
 * ancho máximo y centrada (a 393 son los 369 del sitio anterior más 12 de margen a cada
 * lado). La foto es la misma (no la `bg_procedures_mobile.jpg` de 393 x 254 del
 * sitio anterior, que a 2x se ve borrosa) recortada con `object-cover` a la
 * proporción de esa (393:254, con un tope de 420 de alto), y la tarjeta sube 42 px
 * (3em de 14 px) en vez de 168.
 * TODO: confirmar con diseño el mobile y la tablet.
 *
 * La tarjeta lleva `relative z-10`: sin él, la foto (un elemento en línea) se pintaría
 * por encima de su fondo blanco. La sección no lleva relleno abajo: el recuadro
 * negro de la derecha acaba pegado al footer, como en el diseño.
 */
export default function ProceduresComponent() {
  return (
    <section aria-labelledby="procedures-title">
      <Image
        src="/assets/tramites/hero/cruce-de-autopistas-de-noche.webp"
        alt="Vista aérea, de noche, de un cruce de autopistas con carros iluminados en naranja y azul"
        width={1440}
        height={526}
        sizes="100vw"
        preload
        className="block aspect-[393/254] max-h-[420px] w-full object-cover xl:aspect-[1440/526] xl:max-h-none"
      />

      <div className="mx-auto grid max-w-[720px] grid-cols-1 xl:max-w-[1320px] xl:grid-cols-[minmax(0,7fr)_minmax(0,1fr)_minmax(0,4fr)]">
        <div className="relative z-10 mx-3 -mt-[42px] xl:-mt-[168px]">
          <ProceduresListComponent />
        </div>
        <div className="xl:col-start-3">
          <ProceduresAdvisoryComponent />
        </div>
      </div>
    </section>
  );
}
