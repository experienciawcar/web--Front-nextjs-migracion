import type { Metadata } from "next";

import CatalogComponent from "@/modules/catalog/components/CatalogComponent";
import { CATALOG_VANS } from "@/modules/catalog/constants/catalogs";
import { getCatalogFilterOptions } from "@/modules/catalog/services/options";
import { buildPageMetadata } from "@/modules/shared/utils/seo";

export const metadata: Metadata = buildPageMetadata({
  title: CATALOG_VANS.seo.title,
  description: CATALOG_VANS.seo.description,
  path: "/compra-tu-van",
});

/**
 * Catálogo "Compra tu van": `CatalogComponent` con `bodyTypeId: "22"` fijo
 * (`CATALOG_VANS`), el filtro "Tipo" no se muestra. Ver
 * `docs/planes/compra-tu-carro.md`.
 */
export default async function BuyVanPage() {
  const options = await getCatalogFilterOptions();

  return (
    <main className="flex-1">
      <CatalogComponent config={CATALOG_VANS} options={options} />
    </main>
  );
}
