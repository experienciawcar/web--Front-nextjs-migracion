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
 * Diseño: Figma "Wcar Website - 2026", marco "Página carro -desktop 1451" (1542:22539, 1440 x 4684).
 * Reemplaza a la versión 89:4207: tarjeta de resumen nueva, ocho datos bajo la galería (sin el
 * bloque "Detalles del Vehículo") y "¿Tienes vehículo?". Las secciones de más abajo siguen
 * tal como se hicieron con 89:4207. Mobile: sin marco nuevo, se adaptó el de 89:4840. Plan y
 * registro: `docs/planes/detalle-vehiculo.md`.
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
