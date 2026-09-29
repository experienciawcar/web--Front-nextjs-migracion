import type { Metadata } from "next";

import WorkshopAdditionalServicesComponent from "@/modules/workshop/components/WorkshopAdditionalServicesComponent";
import WorkshopGalleryComponent from "@/modules/workshop/components/WorkshopGalleryComponent";
import WorkshopHeroComponent from "@/modules/workshop/components/WorkshopHeroComponent";
import WorkshopLocationComponent from "@/modules/workshop/components/WorkshopLocationComponent";
import WorkshopPostSalesComponent from "@/modules/workshop/components/WorkshopPostSalesComponent";
import WorkshopWarrantyComponent from "@/modules/workshop/components/WorkshopWarrantyComponent";
import WorkshopWhatWeDoComponent from "@/modules/workshop/components/WorkshopWhatWeDoComponent";

export const metadata: Metadata = {
  title: "Taller | WCAR",
  description:
    "Taller WCAR en Bogotá: mantenimiento preventivo, talleres especializados por marca y modelo, garantías y servicios adicionales para tu vehículo.",
};

/**
 * Vista Taller. La ruta es /taller porque es la que ya apunta el navbar
 * (`ROUTES.workshop` en constants/routes).
 *
 * Diseño: Figma "Wcar Website - 2026", nodo 188:8089 (desktop 1440; las medidas
 * de las secciones salieron primero de cinco capturas en `docs/planes/taller/` y
 * luego se corrigieron con las cifras de Figma, ver el JSDoc de cada una). No hay
 * diseño mobile: se adaptó con el criterio de la guía §4.3. Plan de trabajo:
 * `docs/planes/taller.md`.
 *
 * Están todas las secciones del diseño y todas las imágenes (fotos en
 * `public/assets/taller/`, íconos en `src/modules/workshop/assets/`). El Footer no
 * va aquí: es global y vive en el layout.
 */
export default function WorkshopPage() {
  return (
    <main className="flex-1">
      <WorkshopHeroComponent />
      <WorkshopWhatWeDoComponent />
      <WorkshopPostSalesComponent />
      <WorkshopWarrantyComponent />
      <WorkshopAdditionalServicesComponent />
      <WorkshopLocationComponent />
      <WorkshopGalleryComponent />
    </main>
  );
}
