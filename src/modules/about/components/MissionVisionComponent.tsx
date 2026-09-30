import Image from "next/image";

import iconCar from "@/modules/shared/assets/icons/car.svg";
import iconPlay from "@/modules/shared/assets/icons/play.svg";
import FeatureCardComponent from "@/modules/shared/components/FeatureCardComponent";
import SideLabelComponent from "@/modules/shared/components/SideLabelComponent";

import MissionVisionTabsComponent from "./MissionVisionTabsComponent";

/**
 * Las dos columnas. Ojo con `descriptionClassName` en la de misión: en Figma su
 * párrafo va con interlineado 22 y el de visión con 24, que es el del estilo
 * "Description Regular 2" del sistema. O sea que el de misión es la desviación.
 * Se respeta tal cual para no separarse del diseño.
 */
export default function MissionVisionComponent() {
  return (
    <section aria-label="Misión y visión" className="relative">
      <div className="px-8 pt-5 xl:px-0 xl:pt-0 xl:pl-[435px]">
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

        {/* Pestañas en mobile, dos columnas en desktop (787px en total, el mismo
            ancho del video). */}
        <MissionVisionTabsComponent />
      </div>
    </section>
  );
}
