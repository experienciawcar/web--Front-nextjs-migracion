import type { Metadata } from "next";

import CatalogComponent from "@/modules/catalog/components/CatalogComponent";
import { CATALOG_TRUCKS } from "@/modules/catalog/constants/catalogs";
import { getCatalogFilterOptions } from "@/modules/catalog/services/options";
import { buildPageMetadata } from "@/modules/shared/utils/seo";

export const metadata: Metadata = buildPageMetadata({
  title: CATALOG_TRUCKS.seo.title,
  description: CATALOG_TRUCKS.seo.description,
  path: "/compra-tu-camion",
});
// TODO(negocio/backend): esta variante muestra 0 resultados reales hasta que el
// backend tenga una categoría de camión (ver CATALOG_TRUCKS). ¿Vale la pena
// indexarla mientras tanto? Decidir con negocio (fila de la tarea 11 del plan).

/**
 * Catálogo "Compra tu camión": `CatalogComponent` con `CATALOG_TRUCKS`
 * (`bodyTypeId: "21"`, un id que hoy no existe en el backend, a propósito —
 * ver el comentario en `catalog/constants/catalogs.ts`). Ver
 * `docs/planes/compra-tu-carro.md`.
 */
export default async function BuyTruckPage() {
  const options = await getCatalogFilterOptions();

  return (
    <main className="flex-1">
      <CatalogComponent config={CATALOG_TRUCKS} options={options} />
    </main>
  );
}
