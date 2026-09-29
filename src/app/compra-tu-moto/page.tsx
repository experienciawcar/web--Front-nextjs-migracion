import type { Metadata } from "next";

import CatalogComponent from "@/modules/catalog/components/CatalogComponent";
import { CATALOG_MOTORCYCLES } from "@/modules/catalog/constants/catalogs";
import { getCatalogFilterOptions } from "@/modules/catalog/services/options";
import { buildPageMetadata } from "@/modules/shared/utils/seo";

export const metadata: Metadata = buildPageMetadata({
  title: CATALOG_MOTORCYCLES.seo.title,
  description: CATALOG_MOTORCYCLES.seo.description,
  path: "/compra-tu-moto",
});

/**
 * Catálogo "Compra tu moto": `CatalogComponent` con `bodyTypeId: "18"` fijo
 * (`CATALOG_MOTORCYCLES`), el filtro "Tipo" no se muestra. Ver
 * `docs/planes/compra-tu-carro.md`.
 */
export default async function BuyMotorcyclePage() {
  const options = await getCatalogFilterOptions();

  return (
    <main className="flex-1">
      <CatalogComponent config={CATALOG_MOTORCYCLES} options={options} />
    </main>
  );
}
