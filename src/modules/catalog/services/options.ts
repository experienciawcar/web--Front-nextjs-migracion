import { getVehicleTypes } from "@/modules/shared/services/vehicle-types";
import type { VehicleType } from "@/modules/shared/types/vehicle-types";

import type { Brand } from "../types/brand";
import type { ColorOption, SedeOption, TagOption } from "../types/filter-options";
import { getBrands } from "./brands";
import { getColors } from "./colors";
import { getSedes } from "./sedes";
import { getTags } from "./tags";

/** Todo lo que llenan los acordeones del sidebar, salvo los que ya son listas fijas (`constants/filter-options.ts`). */
export type CatalogFilterOptions = {
  brands: Brand[];
  colors: ColorOption[];
  tags: TagOption[];
  sedes: SedeOption[];
  vehicleTypes: VehicleType[];
};

/**
 * Pide las 5 listas de opciones en paralelo. Se llama **en servidor**
 * (`page.tsx` de cada ruta, no en `CatalogComponent`): son datos que cambian
 * poco (revalidan cada hora, como el resto de servicios del sitio) y pedirlos
 * en el cliente añadiría una espera extra al abrir la página. Solo la
 * búsqueda de vehículos (`searchVehicles`, que sí cambia con cada filtro) va
 * en el cliente.
 */
export async function getCatalogFilterOptions(): Promise<CatalogFilterOptions> {
  const [brands, colors, tags, sedes, vehicleTypes] = await Promise.all([
    getBrands(),
    getColors(),
    getTags(),
    getSedes(),
    getVehicleTypes(),
  ]);
  return { brands, colors, tags, sedes, vehicleTypes };
}
