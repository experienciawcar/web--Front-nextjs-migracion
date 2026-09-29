import type { Metadata } from "next";

import HeadquartersHeroComponent from "@/modules/headquarters/components/HeadquartersHeroComponent";
import HeadquartersListComponent from "@/modules/headquarters/components/HeadquartersListComponent";
import HeadquartersModalProvider from "@/modules/headquarters/components/HeadquartersModalProvider";
import { HEADQUARTERS } from "@/modules/headquarters/constants/headquarters";
import { buildPageMetadata } from "@/modules/shared/utils/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Nuestras Sedes | WCAR",
  description:
    "Conoce las sedes de WCAR y encuentra el concesionario más cercano para comprar, vender o mantener tu carro.",
  path: "/nuestras-sedes",
});

/**
 * Vista Nuestras Sedes. La ruta es /nuestras-sedes porque es la que ya apunta
 * el navbar (`ROUTES.headquarters` en constants/routes).
 *
 * Diseño: captura del desktop 1440 de la vista (no hay node-id de Figma ni
 * diseño mobile todavía).
 *
 * Faltan por agregar, en el orden del diseño: todo lo que sigue a la
 * cuadrícula de sedes. El Footer no va aquí: es global y vive en el layout.
 */
export default function HeadquartersPage() {
  return (
    <main className="flex-1">
      {/* El modal de las sedes lo abren el botón del banner (la más cercana) y el
          VER de cada tarjeta, que están en secciones distintas: el proveedor
          envuelve las dos. */}
      <HeadquartersModalProvider headquarters={HEADQUARTERS}>
        <HeadquartersHeroComponent />
        <HeadquartersListComponent />
      </HeadquartersModalProvider>
    </main>
  );
}
