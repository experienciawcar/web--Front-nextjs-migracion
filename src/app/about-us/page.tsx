import type { Metadata } from "next";

import AboutHeroComponent from "@/modules/about/components/AboutHeroComponent";
import AlliesComponent from "@/modules/shared/components/AlliesComponent";
import CompanyIntroComponent from "@/modules/about/components/CompanyIntroComponent";
import FootprintComponent from "@/modules/about/components/FootprintComponent";
import FounderComponent from "@/modules/about/components/FounderComponent";
import MissionVisionComponent from "@/modules/about/components/MissionVisionComponent";
import StatsComponent from "@/modules/about/components/StatsComponent";
import TeamComponent from "@/modules/about/components/TeamComponent";
import TestimonialsComponent from "@/modules/about/components/TestimonialsComponent";
import ValuesComponent from "@/modules/about/components/ValuesComponent";
import DiagonalLinesComponent from "@/modules/shared/components/DiagonalLinesComponent";

export const metadata: Metadata = {
  title: "Sobre Nosotros | WCAR",
  description:
    "Conoce a WCAR: nuestra misión, nuestro equipo, nuestras sedes y los aliados que respaldan la compra y venta de vehículos usados con transparencia.",
};

/**
 * Vista Sobre Nosotros. La ruta es /about-us porque es la que ya apunta el
 * navbar (`ROUTES.aboutUs` en constants/routes), no /sobre-nosotros.
 *
 * Diseño: frames "nosotros _ desktop 1440" (2:4) y "mobile 393" (2:213) del
 * archivo de Figma "Wcar Website - 2026".
 *
 * Faltan por agregar, en el orden del diseño: Contacto. El Footer ya no va
 * aquí: es global y vive en el layout.
 */
export default function AboutUsPage() {
  return (
    <main className="flex-1">
      <AboutHeroComponent />
      <CompanyIntroComponent />

      {/* La barra negra lateral no pertenece a ninguna sección: mide 303x2296
          y va de y=727 a y=3023, o sea que cruza el final de "Nuestra
          Empresa", toda "Nuestros Datos", toda "Misión & visión" y el arranque
          del "Fundador". Por eso vive en este contenedor y no dentro de una
          sección, y por eso su alto es fijo: en el diseño la barra termina a
          media sección del fundador, no al final de un bloque.

          Capas en "Nuestra Empresa": el fondo blanco de su tarjeta queda por
          debajo de la barra (z-20), o taparía la barra en el tramo bajo la
          foto, pero la foto del edificio va por encima (z-30, ver
          CompanyIntroComponent): la barra pasa por detrás de ella y no le
          tapa la esquina inferior izquierda.

          Aquí dentro va también el Fundador, que es la última que cruza.

          Centrado: el diseño mide 1440 y todo va en píxeles desde su borde
          izquierdo (barra en x=0, etiquetas en x=111, contenido en x=435). Sin
          más, en una pantalla ancha esas piezas se quedaban pegadas a la
          ventana mientras el hero, "Nuestra Empresa" y el fundador, que sí van
          en `container-wcar`, se centraban: la barra ya no se solapaba con la
          foto del edificio. Por eso el lienzo de 1440 va centrado y los
          fondos (la barra hacia la izquierda, los paneles grises hacia la
          derecha) sangran hasta el borde de la ventana, igual que ya hacía el
          panel del fundador. El `overflow-x-clip` evita el scroll horizontal
          que causaría ese sangrado: 100vw incluye la barra de scroll. */}
      <div className="relative z-20 xl:mt-[42px] xl:overflow-x-clip">
        <div className="relative mx-auto xl:max-w-[1440px]">
          <div
            aria-hidden
            className="absolute top-[-328px] hidden h-[2296px] bg-dark-gray xl:left-[calc(50%-50vw)] xl:block xl:w-[calc(303px+50vw-50%)]"
          >
            <DiagonalLinesComponent className="absolute top-0 left-0 h-[343px] w-[60px]" />
          </div>

          <StatsComponent />

          {/* 27px de aire entre el panel gris de Datos y esta seccion. */}
          <div className="xl:pt-[27px]">
            <MissionVisionComponent />
          </div>

          {/* 57px de aire entre las columnas de Misión & visión y la foto del
              fundador, que es lo que arranca esta sección. */}
          <div className="xl:pt-[57px]">
            <FounderComponent />
          </div>
        </div>
      </div>

      <TeamComponent />
      <FootprintComponent />
      <AlliesComponent />
      <TestimonialsComponent />
      <ValuesComponent />
    </main>
  );
}
