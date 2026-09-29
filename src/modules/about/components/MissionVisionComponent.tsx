import Image from "next/image";

import iconCar from "@/modules/shared/assets/icons/car.svg";
import iconLike from "@/modules/shared/assets/icons/like.svg";
import iconPlay from "@/modules/shared/assets/icons/play.svg";
import iconStarBadge from "@/modules/shared/assets/icons/star-badge.svg";
import CarouselDotsComponent from "@/modules/shared/components/CarouselDotsComponent";
import FeatureCardComponent from "@/modules/shared/components/FeatureCardComponent";
import InlineEyebrowComponent from "@/modules/shared/components/InlineEyebrowComponent";
import SideLabelComponent from "@/modules/shared/components/SideLabelComponent";

/**
 * Las dos columnas. Ojo con `descriptionClassName` en la de misión: en Figma su
 * párrafo va con interlineado 22 y el de visión con 24, que es el del estilo
 * "Description Regular 2" del sistema. O sea que el de misión es la desviación.
 * Se respeta tal cual para no separarse del diseño.
 */
const COLUMNAS = [
  {
    id: "mision",
    eyebrow: "Misión",
    anchoMobile: "w-[260px]",
    icon: iconStarBadge,
    title: "¿Cuál es nuestra misión en el mundo?",
    descriptionClassName: "leading-[22px]",
    description:
      "WCAR emerge no solo como una empresa, sino como un movimiento que busca revolucionar la compra y venta de autos usados en Latinoamérica. Nuestra misión trasciende la mera venta, enfocándonos en transacciones seguras y empoderadoras para el consumidor. Nos posicionamos en el núcleo de la transformación del sector, fusionando transparencia brutal y tecnología al alcance de todos para otorgar al usuario control total y claridad en cada transacción.",
  },
  {
    id: "vision",
    eyebrow: "Visión",
    anchoMobile: "w-[329px]",
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
export default function MissionVisionComponent() {
  return (
    <section aria-label="Misión y visión" className="relative">
      <div className="px-8 pt-0 xl:px-0 xl:pl-[435px]">
        <SideLabelComponent
          regular="Misión"
          italic="& visión"
          className="reveal reveal-left hidden xl:absolute xl:top-[99px] xl:left-[111px] xl:block"
        />

        {/* Texto de relleno: en Figma sigue con lorem ipsum.
            TODO: falta el copy real. */}
        <p className="reveal text-center text-small font-bold text-gray xl:ml-14 xl:text-left">
          Nibh quisque suscipit fermentum
        </p>

        {/* "¿Que hace wcar?" va sin tilde en Figma.
            TODO: confirmar con diseño, parece un error de ortografía. */}
        <FeatureCardComponent
          icon={iconCar}
          title="¿Que hace wcar?"
          titleAs="h3"
          className="reveal mt-[15px] justify-center xl:mt-2 xl:justify-start"
        />

        {/* TODO: hoy es solo la miniatura. Falta la URL del video y el
            reproductor; el diseño no define el estado de reproducción. */}
        <figure className="reveal relative mt-[34px] aspect-[787/443] w-full xl:mt-[31px] xl:w-[787px]">
          <Image
            src="/assets/about-us/mision/video.jpg"
            alt="Equipo de WCAR en una de las sedes"
            fill
            sizes="(min-width: 1280px) 787px, 100vw"
            className="rounded-lg object-cover"
          />
          <Image
            src={iconPlay}
            alt=""
            aria-hidden
            className="absolute top-1/2 left-1/2 size-12 -translate-x-1/2 -translate-y-1/2 xl:size-[60px]"
          />
        </figure>

        {/* Carrusel en mobile, dos columnas en desktop. El margen negativo deja
            que las diapositivas lleguen al borde de la pantalla. */}
        {/* En desktop las dos columnas ocupan 787px en total (381 + 25 + 381),
            el mismo ancho del video. Sin ese límite el contenedor llega hasta
            el borde de la pantalla y las columnas salen 110px más anchas. */}
        <div className="reveal mt-8 -mr-8 flex snap-x snap-mandatory gap-[23px] overflow-x-auto pr-8 xl:mt-[50px] xl:mr-0 xl:grid xl:w-[787px] xl:grid-cols-2 xl:gap-[25px] xl:overflow-visible xl:pr-0">
          {COLUMNAS.map((columna) => (
            <div
              key={columna.id}
              className={`flex shrink-0 snap-start flex-col gap-4 xl:w-auto xl:gap-10 ${columna.anchoMobile}`}
            >
              {/* Sangrado para que quede a plomo con el título, no con el
                  icono. En Figma "Misión" va así pero "Visión" quedó alineado
                  al icono; se unifica con el criterio de "Misión", que es el
                  que parece intencional. */}
              <InlineEyebrowComponent className="ml-14">{columna.eyebrow}</InlineEyebrowComponent>
              <FeatureCardComponent
                icon={columna.icon}
                title={columna.title}
                description={columna.description}
                descriptionClassName={`whitespace-pre-line ${columna.descriptionClassName}`}
              />
            </div>
          ))}
        </div>

        <CarouselDotsComponent total={2} className="mt-16 justify-center xl:hidden" />
      </div>
    </section>
  );
}
