import Image from "next/image";

import DiagonalLinesComponent from "@/modules/shared/components/DiagonalLinesComponent";
import SectionEyebrowComponent from "@/modules/shared/components/SectionEyebrowComponent";

import ParallelogramsComponent from "./ParallelogramsComponent";

/**
 * Las cuatro fotos de la galería, en el orden del diseño (fila de arriba y fila
 * de abajo, de izquierda a derecha). Cada `className` es el tamaño de la caja en
 * desktop (Figma, nodo 193:6426); en mobile todas son 4:3 a todo el ancho.
 *
 * `position` es el `object-position` del recorte de Figma: las tres primeras son
 * "FILL" (`object-cover` centrado) y la cuarta es un recorte que enseña el 87 %
 * superior de la foto (Figma: imageTransform de alto 0,874 desde arriba). `sizes`
 * es el ANCHO A QUE SE VE la foto, no el de su caja: con `object-cover` la foto
 * se escala por el lado que más pide (la nave roja, de 468 x 386, se ve a 579 de
 * ancho) y un `sizes` de la caja serviría una versión borrosa.
 *
 * La foto 3 es el mismo mecánico de "Garantías y seguros" (mismo relleno de
 * imagen en Figma): una sola en disco, la de `garantias/`.
 */
const PHOTOS = [
  {
    id: "camioneta-gris-capo-abierto",
    src: "/assets/taller/nuestro-taller/camioneta-gris-capo-abierto.webp",
    alt: "Un mecánico revisa el motor de una camioneta gris con el capó abierto, con el carro de herramientas al frente",
    className: "xl:h-[386px] xl:w-[629px]",
    sizes: "(min-width: 1280px) 629px, 100vw",
    position: "object-center",
  },
  {
    id: "nave-nissan-roja",
    src: "/assets/taller/nuestro-taller/nave-nissan-roja.webp",
    alt: "Nave del taller con un Nissan rojo al frente y otros carros en elevadores",
    className: "xl:h-[386px] xl:w-[468px]",
    sizes: "(min-width: 1280px) 579px, 100vw",
    position: "object-center",
  },
  {
    id: "mecanico-junto-al-elevador",
    src: "/assets/taller/garantias/mecanico-junto-al-elevador.webp",
    alt: "Un mecánico de overol junto a un elevador, con una bolsa de herramientas y una aceitera",
    className: "xl:h-[341px] xl:w-[512px]",
    sizes: "(min-width: 1280px) 512px, 100vw",
    position: "object-center",
  },
  {
    id: "nave-vehiculos-en-elevadores",
    src: "/assets/taller/nuestro-taller/nave-vehiculos-en-elevadores.webp",
    alt: "Nave del taller con un Nissan rojo con el capó abierto y otros carros en los elevadores",
    className: "xl:h-[341px] xl:w-[585px]",
    sizes: "(min-width: 1280px) 585px, 100vw",
    position: "object-top",
  },
];

/**
 * Sección "Nuestro taller": el título y un mosaico de cuatro fotos sobre un
 * rayado gris que sangra a la derecha.
 *
 * Fuente: captura del desktop 1440 (`docs/planes/taller/5-nuestro-taller.png`,
 * calibrada con el marco: x de captura = 2 + 0,641 × X) y, para las fotos, el
 * Figma (nodo 188:8089, grupo 193:6426). Sin diseño mobile. Medidas (px de diseño,
 * ±1,5 salvo lo que diga "Figma"), con y=0 en el borde superior del marco,
 * que es el de la sección (y=3215 del marco de Figma, donde acaba "¿Dónde nos
 * ubicamos?") y que mide 1119 (Figma: hasta donde arranca el footer, en 4334; la
 * captura daba 1098 y todo 25 px más arriba):
 * - Contenido de 1114 de ancho a partir de x=157 (Figma; 158 en la captura; no del contenedor de 124: en la
 *   captura la raya, el título y las fotos arrancan ahí).
 * - Eyebrow con la raya en y=81 (Figma; la captura daba 56), título de 36/44 (ink 214 de ancho) en la misma
 *   estructura que en el resto de secciones y las fotos 79 px debajo, en y=226.
 * - Fotos (Figma): fila de arriba de 386 de alto, con 629 y 468 de ancho; fila de
 *   abajo de 341, con 512 y 585. Separación de 16 entre fotos y entre filas (la
 *   captura había dado 387/469, 343/586 y 14).
 * - Rayado gris: x=504 hasta la ventana y de y=125 a 843 (Figma: 718 de alto), por
 *   debajo de las fotos.
 * - Dos paralelogramos amarillos (`ParallelogramsComponent`) en (1166,147): el de
 *   abajo queda casi tapado por la foto de arriba a la derecha.
 *
 * Mobile: no hay diseño. Se adaptó (guía §4.3): una columna con las cuatro fotos en
 * 4:3 a todo el ancho, sin rayado ni paralelogramos. No hay carrusel ni modal: el
 * diseño no los trae.
 */
export default function WorkshopGalleryComponent() {
  return (
    <section aria-labelledby="galeria-title" className="relative overflow-x-clip xl:h-[1119px]">
      {/* Lienzo de 1440. `isolate` para mandar el rayado y los paralelogramos
          detrás de las fotos con z-index negativo (un absoluto pinta por encima
          del contenido estático). */}
      <div className="relative isolate mx-auto xl:h-[1119px] xl:max-w-[1440px]">
        <DiagonalLinesComponent
          variant="gray"
          className="absolute top-[125px] left-[504px] -z-10 hidden h-[718px] opacity-50 xl:right-[calc(50%-50vw)] xl:block"
        />
        <ParallelogramsComponent className="absolute top-[147px] left-[1166px] -z-10 hidden xl:block" />

        <div className="container-wcar py-16 xl:pt-[81px] xl:pb-0">
          <div className="xl:ml-[33px]">
            <SectionEyebrowComponent className="reveal xl:gap-2.5!">Conoce nuestro taller</SectionEyebrowComponent>

            <h2 id="galeria-title" className="reveal mt-[11px] text-subheadline-1 font-bold text-dark-gray">
              Nuestro taller
            </h2>

            <ul className="mt-10 grid gap-4 xl:mt-[79px] xl:flex xl:w-[1114px] xl:flex-wrap xl:gap-4">
              {PHOTOS.map((photo) => (
                <li key={photo.id} className="reveal">
                  <div className={`relative aspect-[4/3] w-full overflow-hidden xl:aspect-auto ${photo.className}`}>
                    <Image src={photo.src} alt={photo.alt} fill sizes={photo.sizes} className={`object-cover ${photo.position}`} />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
