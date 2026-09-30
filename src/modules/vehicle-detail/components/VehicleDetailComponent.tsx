import type { VehicleDetail } from "../types/vehicle-detail";
import { buildVehicleJsonLd } from "../utils/seo";

import RelatedVehiclesLoaderComponent from "./RelatedVehiclesLoaderComponent";
import VehicleFeaturesComponent from "./VehicleFeaturesComponent";
import VehicleFinancingComponent from "./VehicleFinancingComponent";
import VehicleSpecsComponent from "./VehicleSpecsComponent";
import VehicleStickyBarComponent from "./VehicleStickyBarComponent";
import VehicleTopComponent from "./VehicleTopComponent";

/**
 * La ficha de un vehículo (`/compra-tu-carro/<tipo>/<nombre>/<id>`): de arriba abajo, galería y
 * resumen, "Detalles del Vehículo", "Características del vehículo" con el acordeón y la
 * evaluación, "Financia tu Vehículo" y "Vehículos relacionados".
 *
 * Diseño: Figma "Wcar Website - 2026", página "Compra tu carro / Detalles del vehículo", marco
 * "Página carro -desktop 1449" (89:4207, 1440 x 4684) y su mobile "Página carro -mobile 405"
 * (89:4840, 393 x 6017). Ojo: en la misma página hay otra versión más nueva (238:4492, mobile
 * 252:7188) con favoritos, el botón "Financiar", "¿Tienes vehículo? Úsalo de cuota inicial" y seis
 * datos más; se hizo la 89:4207 porque es la que se pasó como referencia. Plan y registro:
 * `docs/planes/detalle-vehiculo.md`.
 *
 * Datos: `GET /cars/{id}/` (todo el vehículo, con `description_list`) y
 * `GET /cars-related/{id}/` (este, desde el navegador: tarda ~24 s, ver `RelatedVehiclesLoaderComponent`). Comportamiento del sitio anterior que se conserva o se cambia:
 * `docs/DETALLE_VEHICULO.md`.
 */
export default function VehicleDetailComponent({
  vehicle,
}: {
  vehicle: VehicleDetail;
}) {
  return (
    <main className="flex-1">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: buildVehicleJsonLd(vehicle) }}
      />
      <VehicleTopComponent vehicle={vehicle} />
      <VehicleSpecsComponent vehicle={vehicle} />
      <VehicleFeaturesComponent vehicle={vehicle} />
      <VehicleFinancingComponent />
      <RelatedVehiclesLoaderComponent vehicleId={vehicle.id} />
      <VehicleStickyBarComponent tagName={vehicle.tag?.name} />
    </main>
  );
}
