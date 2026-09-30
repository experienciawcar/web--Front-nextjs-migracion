"use client";

import { useRef, useState } from "react";

import iconLike from "@/modules/shared/assets/icons/like.svg";
import iconStarBadge from "@/modules/shared/assets/icons/star-badge.svg";
import FeatureCardComponent from "@/modules/shared/components/FeatureCardComponent";
import InlineEyebrowComponent from "@/modules/shared/components/InlineEyebrowComponent";

const COLUMNAS = [
  {
    id: "mision",
    eyebrow: "Misión",
    icon: iconStarBadge,
    title: "¿Cuál es nuestra misión en el mundo?",
    descriptionClassName: "leading-[22px]",
    description:
      "WCAR emerge no solo como una empresa, sino como un movimiento que busca revolucionar la compra y venta de autos usados en Latinoamérica. Nuestra misión trasciende la mera venta, enfocándonos en transacciones seguras y empoderadoras para el consumidor. Nos posicionamos en el núcleo de la transformación del sector, fusionando transparencia brutal y tecnología al alcance de todos para otorgar al usuario control total y claridad en cada transacción.",
  },
  {
    id: "vision",
    eyebrow: "Visión",
    icon: iconLike,
    title: "Y nuestra visión…",
    descriptionClassName: "leading-6",
    description:
      "Convertirnos en el referente en LATAM de la industria a través de la transparencia.\nNuestra visión es posicionarnos entre las tres principales compañías en LATAM de la industria automotriz, elevando la consciencia social. Buscamos impactar no solo a nuestros clientes, sino a toda la comunidad involucrada en la compra-venta de vehículos, fomentando la importancia de acceder a información detallada. Nuestro objetivo es disminuir la asimetría de información, reducir fricciones y eliminar costos ocultos, garantizando transacciones transparentes, informadas y justas.",
  },
];

/**
 * Sección "Misión & visión".
 *
 * Desktop (nodos 2:203 a 2:210, 37:8474, 37:9144): etiqueta lateral sobre la
 * barra negra, luego el video y las dos columnas lado a lado, cada una de
 * 381px con 25px en medio (787px en total, el mismo ancho del video).
 *
 * Mobile: las dos columnas se vuelven un carrusel con 23px de separación, de
 * modo que la siguiente asoma 78px por la derecha (nodos 37:9192, 37:9193 y el
 * "slider" 37:9208). El desplazamiento va con scroll-snap y sin JavaScript,
 * según lo acordado de maquetar estático primero.
 *
 * Las diapositivas NO miden lo mismo: 260px la de misión y 329px la de visión.
 * Es raro para un carrusel, pero es lo que hace el diseño y tiene sentido:
 * al darle más ancho al texto más largo, las dos quedan de alto parecido. Con
 * ambas a 260px, la de visión se estiraba y dejaba un hueco de 130px debajo de
 * la de misión, porque el contenedor toma la altura de la más alta.
 *
 * En mobile el diseño NO incluye el título "Misión & visión": salta del
 * párrafo de introducción al video. Se respeta, y la sección se nombra con
 * aria-label para no dejarla sin identificar en lectores de pantalla.
 */
/**
 * Misión y visión. En desktop son dos columnas de 381 (con su eyebrow amarillo
 * arriba, ver `MissionVisionComponent`). En mobile pasan a **pestañas** "Misión |
 * Visión": un solo bloque a ancho completo (329) con el icono, el título y TODO el
 * texto, en vez del carrusel anterior (columna de 260 muy alta y la otra cortada
 * por el borde).
 *
 * Las dos paneles se apilan en la misma celda de una cuadrícula y la inactiva va
 * `invisible`: así la sección mide siempre lo que el panel más largo y
 * no salta al cambiar de pestaña. Patrón WAI-ARIA de pestañas: `tablist`, flechas
 * izquierda/derecha, Inicio/Fin y solo la activa en el orden de tabulación.
 *
 * TODO: confirmar con diseño (el marco mobile 2:213 trae el carrusel, no pestañas).
 */
export default function MissionVisionTabsComponent() {
  const [activa, setActiva] = useState(0);
  const tabs = useRef<Array<HTMLButtonElement | null>>([]);

  const seleccionar = (indice: number) => {
    const destino = (indice + COLUMNAS.length) % COLUMNAS.length;
    setActiva(destino);
    tabs.current[destino]?.focus();
  };

  return (
    <div className="reveal mt-8 pb-16 xl:mt-[50px] xl:w-[787px] xl:pb-0">
      <div
        role="tablist"
        aria-label="Misión y visión"
        className="grid grid-cols-2 border-b border-gray/30 xl:hidden"
        onKeyDown={(evento) => {
          if (evento.key === "ArrowRight") seleccionar(activa + 1);
          else if (evento.key === "ArrowLeft") seleccionar(activa - 1);
          else if (evento.key === "Home") seleccionar(0);
          else if (evento.key === "End") seleccionar(COLUMNAS.length - 1);
          else return;
          evento.preventDefault();
        }}
      >
        {COLUMNAS.map((columna, indice) => (
          <button
            key={columna.id}
            ref={(nodo) => {
              tabs.current[indice] = nodo;
            }}
            id={`tab-${columna.id}`}
            type="button"
            role="tab"
            aria-selected={activa === indice}
            aria-controls={`panel-${columna.id}`}
            tabIndex={activa === indice ? 0 : -1}
            onClick={() => setActiva(indice)}
            className={`-mb-px h-12 cursor-pointer border-b-[3px] text-small font-bold transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-orange motion-reduce:transition-none ${
              activa === indice ? "border-orange text-dark-gray" : "border-transparent text-gray"
            }`}
          >
            {columna.eyebrow}
          </button>
        ))}
      </div>

      <div className="mt-6 grid xl:mt-0 xl:grid-cols-2 xl:gap-[25px]">
        {COLUMNAS.map((columna, indice) => (
          <div
            key={columna.id}
            id={`panel-${columna.id}`}
            role="tabpanel"
            aria-labelledby={`tab-${columna.id}`}
            className={`col-start-1 row-start-1 flex flex-col gap-4 transition-opacity duration-200 motion-reduce:transition-none xl:col-auto xl:row-auto xl:gap-10 xl:visible xl:opacity-100 ${
              activa === indice ? "opacity-100" : "invisible opacity-0"
            }`}
          >
            {/* Sangrado para que quede a plomo con el título, no con el icono. En
                Figma "Misión" va así pero "Visión" quedó alineado al icono; se
                unifica con el criterio de "Misión". Solo desktop: en mobile lo
                reemplaza la pestaña. */}
            <InlineEyebrowComponent className="ml-14 hidden xl:flex">{columna.eyebrow}</InlineEyebrowComponent>
            <FeatureCardComponent
              icon={columna.icon}
              title={columna.title}
              description={columna.description}
              descriptionClassName={`whitespace-pre-line ${columna.descriptionClassName}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
