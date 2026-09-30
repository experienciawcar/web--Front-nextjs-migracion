import VehicleCardComponent from "@/modules/shared/components/VehicleCardComponent";
import type { Vehicle } from "@/modules/shared/types/vehicle";

import RelatedVehiclesCarouselComponent from "./RelatedVehiclesCarouselComponent";

/**
 * "Vehículos relacionados": las tarjetas del catálogo (`VehicleCardComponent`, la misma de todo el
 * sitio) de los vehículos que devuelve `GET /cars-related/{id}/`, en un carrusel de cuatro a la
 * vista. Sin relacionados no se pinta.
 *
 * Figma 89:4395, px del lienzo de 1440 con y=3459 en el borde superior de la sección (blanca, 699
 * de alto): raya de 77 x 4 en y=53, título de 36/44 ("relacionados" en `orange` cursiva regular)
 * debajo, las tarjetas de 291 x 416 en y=149 y los controles a 43 de ellas.
 *
 * El diseño dibuja las tarjetas con un corazón (favoritos) y "Garantía" arriba; la tarjeta del
 * sitio no lleva corazón por decisión de negocio (ver `VehicleCardComponent`) y la ficha del sitio
 * anterior tampoco tenía favoritos.
 */
export default function RelatedVehiclesComponent({
  vehicles,
}: {
  vehicles: Vehicle[];
}) {
  if (vehicles.length === 0) return null;

  return (
    <section aria-labelledby="relacionados-title" className="bg-white">
      <div className="container-wcar pt-16 pb-16 xl:pt-[53px] xl:pb-[59px]">
        <div className="reveal">
          <span aria-hidden className="block h-1 w-[77px] bg-orange" />
          <h2
            id="relacionados-title"
            className="mt-4 text-[28px] leading-9 font-bold text-dark-gray xl:text-subheadline-1 xl:leading-11"
          >
            Vehículos{" "}
            <span className="font-normal text-orange italic">relacionados</span>
          </h2>
        </div>
        <div className="reveal mt-8">
          <RelatedVehiclesCarouselComponent>
            {vehicles.map((vehicle) => (
              <li
                key={vehicle.id}
                className="w-[280px] shrink-0 snap-start xl:w-[291px]"
              >
                <VehicleCardComponent
                  vehicle={vehicle}
                  sizes="291px"
                  className="h-full"
                />
              </li>
            ))}
          </RelatedVehiclesCarouselComponent>
        </div>
      </div>
    </section>
  );
}
