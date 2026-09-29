import type { Metadata } from "next";

import FeatureServicesComponent from "@/modules/home/components/FeatureServicesComponent";
import FeaturedVehiclesComponent from "@/modules/home/components/FeaturedVehiclesComponent";
import HeroComponent from "@/modules/home/components/HeroComponent";
import HeroSearchSectionComponent from "@/modules/home/components/HeroSearchSectionComponent";
import TransparencyComponent from "@/modules/home/components/TransparencyComponent";
import AlliesComponent from "@/modules/shared/components/AlliesComponent";
import { buildPageMetadata } from "@/modules/shared/utils/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "WCAR | Compra y vende tu vehículo seguro en Colombia",
  description:
    "Compra, vende y financia vehículos usados con garantía. Peritaje, trámites, seguros y taller en un solo lugar.",
  path: "/",
});

/**
 * Inicio. Diseño: Figma "Wcar Website - 2026", página "Home - 2.0", frame
 * "desktop 1484" (nodo 671:11438, 1440 x 5958). Reemplaza al diseño anterior
 * (nodo 671:13789, ya sin usar): el hero es más bajo y sin botones propios (se
 * movieron a la tarjeta de búsqueda que cuelga de él), "Nuestra Empresa" (el
 * carrusel de 5 cualidades) desapareció y en su lugar Transparencia termina en
 * un panel "Razones para comprar y vender con wcar". Mobile: página "mobile 398"
 * del mismo Figma (nodo 701:54961); el hero, "Compra online…", "Razones para
 * comprar…", la foto "Transparencia brutal" y el banner de cambia-tu-vehículo salen
 * de ella (guía §17); lo demás se adapta con el criterio de la guía §4.3 y se marca
 * en cada componente.
 *
 * Orden de las secciones: hero; la tarjeta de búsqueda con sus tres pestañas,
 * las tres tarjetas de introducción y el banner de cambia-tu-vehículo (todo
 * cuelga del hero, `HeroSearchSectionComponent`); Destacados del Catálogo;
 * Transparencia (con "Razones para comprar y vender"); Nuestros servicios; y
 * Nuestros Aliados (compartida con Sobre Nosotros, ver `AlliesComponent`).
 */
export default function Home() {
  return (
    <main className="flex-1">
      <HeroComponent />
      <HeroSearchSectionComponent />
      <FeaturedVehiclesComponent />
      <TransparencyComponent />
      <FeatureServicesComponent />
      <AlliesComponent />
    </main>
  );
}
