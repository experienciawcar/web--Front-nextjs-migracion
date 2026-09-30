import type { Metadata } from "next";
import { notFound } from "next/navigation";

import CatalogComponent from "@/modules/catalog/components/CatalogComponent";
import { CATALOG_CARS } from "@/modules/catalog/constants/catalogs";
import { getCatalogFilterOptions } from "@/modules/catalog/services/options";
import type { CatalogFilters } from "@/modules/catalog/types/filters";
import { buildPageMetadata } from "@/modules/shared/utils/seo";

type PageProps = {
  params: Promise<{ typeVehicleName?: string[] }>;
  searchParams: Promise<{ type_vehicle?: string }>;
};

/**
 * Segmentos de categoría (`/compra-tu-carro/<slug>`) que ya traen su filtro, para que la URL limpia
 * dispare banner + acordeón SEO igual que el filtro del sidebar (`docs/SEO_CATALOGO_COMPRA_TU_CARRO.md`
 * §2, puntos 1 y 2). El slug se compara sin tildes ni mayúsculas: el sitio anterior usaba
 * "carros-híbridos-colombia" (con tilde), la variante del sitemap no. Los nombres de tipo son los
 * de `/type-cars/`.
 */
const CATEGORY_SEGMENTS: Record<string, { fuelTypes?: string[]; typeName?: string }> = {
  "carros-hibridos-colombia": { fuelTypes: ["hibrido"] },
  "camionetas-usadas": { typeName: "Camioneta - SUV" },
  "carros-coupe": { typeName: "Coupe" },
  "carros-sedan-usados": { typeName: "Sedan" },
  "hatchback-colombia": { typeName: "Hatchback" },
};

function normalizeSegment(segment: string): string {
  return decodeURIComponent(segment)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

// Canonical fijo a `/compra-tu-carro`: los segmentos por tipo y los filtros (`?type_vehicle=`)
// muestran el mismo catálogo, y así no compiten entre sí como duplicados. La ficha de un
// vehículo tiene el suyo (ver `buildVehicleMetadata`).
export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    title: CATALOG_CARS.seo.title,
    description: CATALOG_CARS.seo.description,
    path: "/compra-tu-carro",
  });
}

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
 *
 * **La ficha de un vehículo ya no se resuelve aquí:** `/compra-tu-carro/<tipo>/<nombre>/<id>` la
 * reescribe `next.config.ts` a `src/app/vehiculo/[id]` (estática, con caché). Cualquier otra ruta
 * de más de un segmento da 404.
 */
export default async function BuyCarPage({ params, searchParams }: PageProps) {
  const { typeVehicleName: segments } = await params;

  if (segments && segments.length > 1) notFound();

  const [options, { type_vehicle: typeVehicleName }] = await Promise.all([getCatalogFilterOptions(), searchParams]);

  const initialFilters: Partial<CatalogFilters> = {};
  const category = segments?.length === 1 ? CATEGORY_SEGMENTS[normalizeSegment(segments[0])] : undefined;
  if (category?.fuelTypes) initialFilters.fuelTypes = category.fuelTypes;

  const requestedTypeName = typeVehicleName ?? category?.typeName;
  if (requestedTypeName) {
    const type = options.vehicleTypes.find((t) => t.name === requestedTypeName);
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
