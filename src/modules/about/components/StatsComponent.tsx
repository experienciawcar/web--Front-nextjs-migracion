import iconCar from "@/modules/shared/assets/icons/car.svg";
import FeatureCardComponent from "@/modules/shared/components/FeatureCardComponent";
import SideLabelComponent from "@/modules/shared/components/SideLabelComponent";
import StarRatingComponent from "@/modules/shared/components/StarRatingComponent";

import { getStats } from "../services/stats";
import type { FigureStat, RatingStat } from "../types/stats";

/** Sombra de las tarjetas, tal cual el diseño. */
const SOMBRA = "drop-shadow-[0px_7px_7px_rgba(211,218,226,0.4)]";

/** Tarjeta de calificación (nodos 59:3988 y 60:4063). 200x187 en desktop. */
function RatingCard({ stat }: { stat: RatingStat }) {
  return (
    <div
      className={`reveal flex flex-col justify-center gap-4 rounded-lg bg-white py-6 pr-[29px] pl-7 xl:h-[187px] xl:w-[200px] ${SOMBRA}`}
    >
      <div className="flex flex-col justify-center">
        {/* 32px no está en la escala tipográfica del proyecto: en Figma es un
            tamaño suelto, sin estilo de texto asociado. */}
        <p className="text-[32px] leading-none font-bold text-dark-gray">{stat.score}</p>
        <StarRatingComponent value={stat.stars} className="mt-1" />
      </div>

      <span aria-hidden className="border-t border-gray" />

      <p className="opacity-90">
        <span className="block text-[22px] leading-6 font-semibold text-dark-gray">
          {stat.source}
        </span>
        <span className="block text-body leading-6 text-gray-dark">{stat.detail}</span>
      </p>
    </div>
  );
}

/**
 * Tarjeta de cifra (nodos 59:4005 y 60:4040). 313x82 en desktop.
 *
 * Las dos tarjetas del diseño NO usan la misma tipografía: "#1" va a 32px con
 * 16px de separación, mientras que "+ 2.900" va a 28px, con -1px de tracking y
 * 12px de separación. No es un sistema, es un ajuste a mano para que la cifra
 * larga entrara en los 311px de la tarjeta. Se generaliza por largo del texto
 * para que siga funcionando cuando las cifras vengan del backend: con los
 * datos actuales reproduce exactamente las dos tarjetas de Figma.
 */
function FigureCard({ stat }: { stat: FigureStat }) {
  const cifraLarga = stat.value.length > 3;

  return (
    // El ancho es fijo y el contenido desborda el padding: en Figma la tarjeta
    // mide 313px pero su contenido pide 279 sobre 263 disponibles, y el
    // justify-center reparte ese exceso a ambos lados, dejando unos 15px
    // efectivos en vez de 24. Con `min-width` en lugar de `width` la tarjeta
    // crecía 18px y se despegaba del diseño.
    <div
      className={`reveal flex items-center rounded-lg bg-white px-6 py-4 xl:h-[82px] xl:w-[313px] xl:justify-center ${cifraLarga ? "gap-3" : "gap-4"} ${SOMBRA}`}
    >
      <p
        className={`shrink-0 leading-none font-bold whitespace-nowrap text-dark-gray ${cifraLarga ? "text-[28px] tracking-[-1px]" : "text-[32px]"}`}
      >
        {stat.value}
      </p>
      <span aria-hidden className="self-stretch border-l border-gray" />
      {/* Sin cortar: en el diseño cada renglón va en una línea. Con el ancho
          fijo de 313px del nodo, "Vehículos vendidos / y reservados en 3 años"
          se partía en cuatro renglones y estiraba la tarjeta. */}
      <p className="opacity-90 xl:whitespace-nowrap">
        <span className="block text-[20px] leading-6 font-semibold text-dark-gray">
          {stat.title}
        </span>
        <span className="block text-body leading-6 text-gray-dark">{stat.detail}</span>
      </p>
    </div>
  );
}

/**
 * Sección "Nuestros Datos".
 *
 * Desktop (nodos 58:3861, 59:3964 y siguientes): el panel gris claro arranca
 * en x=303, justo donde termina la barra negra lateral, y llega al borde
 * derecho. La barra negra NO se dibuja aquí: cruza también Misión & visión y
 * el arranque del Fundador, así que la pone el contenedor de la página. Por
 * eso el fondo de esta sección empieza en 303 y no en 0, para no taparla.
 *
 * Mobile: esta sección NO EXISTE en Figma; el diseño salta de "Nuestra
 * Empresa" directo a "¿Qué hace wcar?". La adaptación replica las
 * convenciones que el propio diseño mobile ya usa en la sección equivalente
 * (testimonios, nodo 37:9733):
 *   - fondo gris claro a todo el ancho,
 *   - la etiqueta lateral baja a título normal, con la línea naranja,
 *   - 64px de aire arriba y abajo y 24px entre bloques,
 *   - las cuatro tarjetas se apilan a ancho completo en vez de ir en grilla:
 *     a 329px de contenido no caben dos por fila, porque la de calificación
 *     necesita 167px solo de contenido más sus 57px de padding.
 * El layout interno de cada tarjeta se conserva; solo cambia cómo se reparten.
 */
export default async function StatsComponent() {
  const { ratings, figures } = await getStats();

  return (
    <section className="relative">
      {/* Fondo: a todo el ancho en mobile; en desktop arranca donde termina la
          barra negra para no pisarla y sangra a la derecha hasta el borde de
          la ventana (la sección va dentro del lienzo centrado de 1440, ver
          la página). */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gray-light xl:right-[calc(50%-50vw)] xl:left-[303px]"
      />

      <div className="relative px-8 py-16 xl:px-0 xl:pt-9 xl:pb-[59px] xl:pl-[435px]">
        {/* En desktop la etiqueta se sale del panel y se apoya sobre la barra
            negra (x=111). Va posicionada respecto a este contenedor, que en
            desktop arranca en x=0. */}
        <SideLabelComponent
          regular="Nuestros"
          italic="Datos"
          className="reveal reveal-left xl:absolute xl:top-9 xl:left-[111px]"
        />

        <div className="mt-6 xl:mt-0">
          <FeatureCardComponent
            icon={iconCar}
            title="¿Qué estadísticas tenemos en el mercado?"
            titleAs="h3"
            className="reveal"
          />

          {/* El texto abre comilla y no la cierra: así está en Figma.
              TODO: confirmar con diseño, parece un error de copy. */}
          <p className="reveal mt-3 max-w-[793px] text-body leading-[22px] font-medium text-gray-dark opacity-80 xl:ml-14">
            {`"Con años de experiencia en el sector, WCAR se ha posicionado como una plataforma de prestigio y confianza. Nuestro mayor aval es nuestro historial de éxito; a continuación, compartimos una muestra de ello`}
          </p>

          <div className="mt-6 flex flex-col gap-6 xl:mt-[22px] xl:ml-[70px] xl:flex-row xl:items-start xl:gap-7">
            {ratings.map((stat) => (
              <RatingCard key={stat.id} stat={stat} />
            ))}
            <div className="flex flex-col gap-6 xl:gap-[25px]">
              {figures.map((stat) => (
                <FigureCard key={stat.id} stat={stat} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
