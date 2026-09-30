import VehicleCardComponent from "@/modules/shared/components/VehicleCardComponent";
import type { Vehicle } from "@/modules/shared/types/vehicle";
import RelatedVehiclesCarouselComponent from "@/modules/vehicle-detail/components/RelatedVehiclesCarouselComponent";

/**
 * "Vehículos en venta" al pie de un artículo: las tarjetas del catálogo de los vehículos que el
 * backoffice configuró para el post (`getBlogVehicles`), en el mismo carrusel de la ficha del
 * vehículo. Sin vehículos no se pinta (el sitio anterior mostraba el título con un carrusel
 * vacío mientras cargaba o si fallaba).
 */
export default function BlogVehiclesComponent({ vehicles }: { vehicles: Vehicle[] }) {
  if (vehicles.length === 0) return null;

  return (
    <section aria-labelledby="blog-vehicles-title" className="bg-white">
      <div className="container-wcar pb-16">
        <div className="reveal">
          <span aria-hidden className="block h-1 w-[77px] bg-orange" />
          <h2
            id="blog-vehicles-title"
            className="mt-4 text-[28px] leading-9 font-bold text-dark-gray xl:text-subheadline-1 xl:leading-11"
          >
            Vehículos <span className="font-normal text-orange italic">en venta</span>
          </h2>
        </div>
        <div className="reveal mt-8">
          <RelatedVehiclesCarouselComponent>
            {vehicles.map((vehicle) => (
              <li key={vehicle.id} className="w-[280px] shrink-0 snap-start xl:w-[291px]">
                <VehicleCardComponent vehicle={vehicle} sizes="291px" className="h-full" />
              </li>
            ))}
          </RelatedVehiclesCarouselComponent>
        </div>
      </div>
    </section>
  );
}
