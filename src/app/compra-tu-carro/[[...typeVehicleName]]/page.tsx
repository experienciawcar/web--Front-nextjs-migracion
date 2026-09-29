import type { Metadata } from "next";

import CatalogComponent from "@/modules/catalog/components/CatalogComponent";
import { CATALOG_CARS } from "@/modules/catalog/constants/catalogs";
import { getCatalogFilterOptions } from "@/modules/catalog/services/options";
import type { CatalogFilters } from "@/modules/catalog/types/filters";
import { buildPageMetadata } from "@/modules/shared/utils/seo";

// Canonical fijo a `/compra-tu-carro`: los segmentos por tipo y los filtros (`?type_vehicle=`)
// muestran el mismo catálogo, y así no compiten entre sí como duplicados.
export const metadata: Metadata = buildPageMetadata({
  title: CATALOG_CARS.seo.title,
  description: CATALOG_CARS.seo.description,
  path: "/compra-tu-carro",
});

/**
 * Catálogo "Compra tu carro". Es la misma página que `/compra-tu-moto`,
 * `/compra-tu-van` y `/compra-tu-camion` (`CatalogComponent`), parametrizada
 * por `CatalogConfig` — ver `docs/planes/compra-tu-carro.md` (§"Idea clave").
 *
 * Ruta como catch-all opcional (`[[...typeVehicleName]]`) porque
 * `getVehicleTypes()` (`shared/services/vehicle-types.ts`) ya arma enlaces de
 * categoría con un segmento aquí (`/compra-tu-carro/camionetas-usadas`, del
 * navbar): sin el catch-all esos 8 enlaces seguirían dando 404. El segmento
 * en sí (`typeVehicleName`) es solo estético/SEO (dos tipos distintos, "SUV"
 * y "Camioneta - SUV", comparten el mismo slug "camionetas-usadas"): **el
 * filtro de verdad viaja por `?type_vehicle=<nombre del tipo>`** en el
 * querystring, no por el segmento — se lee aquí, en servidor, y se resuelve
 * contra `options.vehicleTypes` (que ya se pidió para el sidebar) para
 * encontrar el id real que espera `searchVehicles`. Se hace en el `page.tsx`
 * (con el `searchParams` que ya trae Next) y no con `useSearchParams()` en
 * `CatalogComponent`, para no forzar renderizado dinámico en `/compra-tu-moto`,
 * `/compra-tu-van` y `/compra-tu-camion` (que no lo necesitan y hoy son
 * estáticas — ver el build de la copia aislada).
 *
 * No hay Figma de esta vista: la referencia es `https://wcar.co/compra-tu-carro`
 * en vivo (sin cambios propios de diseño, un port fiel con los tokens del
 * proyecto) — ver la cabecera del plan.
 *
 * Faltan por agregar: imágenes/iconos (tarea 10).
 */
export default async function BuyCarPage({
  searchParams,
}: {
  searchParams: Promise<{ type_vehicle?: string }>;
}) {
  const [options, { type_vehicle: typeVehicleName }] = await Promise.all([getCatalogFilterOptions(), searchParams]);

  const initialFilters: Partial<CatalogFilters> = {};
  if (typeVehicleName) {
    const type = options.vehicleTypes.find((t) => t.name === typeVehicleName);
    // Si el nombre no calza con ninguno (backend caído, o cambió el nombre),
    // se ignora en vez de romper: el catálogo queda sin ese filtro sembrado.
    if (type) initialFilters.bodyTypeIds = [String(type.id)];
  }

  return (
    <main className="flex-1">
      <CatalogComponent config={CATALOG_CARS} options={options} initialFilters={initialFilters} />
    </main>
  );
}
