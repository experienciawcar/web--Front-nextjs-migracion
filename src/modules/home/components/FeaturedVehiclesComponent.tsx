import Image from "next/image";

import DiagonalLinesComponent from "@/modules/shared/components/DiagonalLinesComponent";
import VehicleCardComponent from "@/modules/shared/components/VehicleCardComponent";
import { getFeaturedVehicles } from "@/modules/shared/services/vehicles";

import zigzagNaranja from "../assets/decor/zigzag-naranja.svg";
import FeaturedVehiclesCarouselComponent from "./FeaturedVehiclesCarouselComponent";

/**
 * "Destacados del Catálogo": un carrusel de tarjetas de vehículo (GET
 * /api/cars/, ver `getFeaturedVehicles`) bajo un título simple, sobre fondo
 * blanco. Ya no lleva la barra negra lateral del diseño anterior: en el
 * rediseño ("Home 2.0", Figma nodo 671:11438) esa barra es de la sección
 * Transparencia, más abajo, no de esta.
 *
 * Figma: eyebrow de 14 semibold `gray` ("conoce lo mas destacado de nuestro
 * catalogo en esta semana") bajo una raya naranja de 115, y a 32 px el
 * `<h2>` de 36 bold ("Destacados del Catálogo"). El carrusel arranca 53 px
 * después.
 *
 * Decoración a la derecha del título (todo a la derecha del lienzo y pegado al
 * borde de la ventana, como el carrusel):
 * - Rayado gris (671:11654, "Lines 13px", 1014 x 100) desde x=631, a la altura
 *   de la raya naranja del eyebrow.
 * - Zigzag naranja de dos paralelogramos (671:11873, 212 x 207, volteado en
 *   horizontal): en el diseño el marco lo corta por la mitad, así que solo se
 *   ven 106 px, pegados al borde, 58 px por encima de la raya del eyebrow.
 *
 * Textos tal cual del diseño (minúsculas en el eyebrow). TODO: confirmar con
 * diseño.
 *
 * Si el backend no responde o no hay vehículos, la sección no se pinta.
 */
export default async function FeaturedVehiclesComponent() {
  const vehicles = await getFeaturedVehicles();

  if (vehicles.length === 0) return null;

  return (
    <section
      aria-labelledby="featured-title"
      className="relative overflow-x-clip bg-white"
    >
      {/* Lienzo de 1440 centrado para la decoración: las piezas son px del
          diseño y sangran a la derecha hasta la ventana (guía §4.2). `top-[172px]`
          es el relleno de arriba del contenedor (`xl:pt-[172px]`): la raya del
          eyebrow. Ese relleno cuenta que el banner de cambia-tu-vehículo se
          sale 28 px de la sección gris hacia esta (`HeroSearchSectionComponent`):
          172 = 144 (lo que ya había) + 28. En mobile el banner se sale 101 px y
          Figma deja 81 entre su borde de abajo y la raya naranja (banner en
          y=1058, raya en 1139): 182 = 101 + 81. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 hidden xl:block"
      >
        <div className="relative mx-auto h-full max-w-[1440px]">
          <DiagonalLinesComponent
            variant="gray"
            className="absolute top-[172px] right-[calc(50%-50vw)] left-[631px] h-[100px]"
          />
          <div className="absolute top-[114px] right-[calc(50%-50vw)] h-[207px] w-[106px] overflow-hidden">
            <Image
              src={zigzagNaranja}
              alt=""
              className="h-[207px] w-[212px] max-w-none -scale-x-100"
            />
          </div>
        </div>
      </div>

      <div className="container-wcar relative pt-[182px] pb-16 xl:pt-[172px]">
        <span aria-hidden className="block h-[4px] w-[115px] bg-orange" />
        {/* TODO: confirmar con diseño: el eyebrow va en minúsculas. */}
        <p className="reveal mt-4 text-small font-semibold text-gray">
          conoce lo mas destacado de nuestro catalogo en esta semana
        </p>
        <h2
          id="featured-title"
          className="reveal mt-2 text-subheadline-1 font-bold text-dark-gray"
        >
          Destacados del Catálogo
        </h2>

        <div className="reveal mt-8 xl:mt-[53px]">
          <FeaturedVehiclesCarouselComponent>
            {vehicles.map((vehicle) => (
              <li
                key={vehicle.id}
                className="flex w-[291px] shrink-0 snap-start"
              >
                <VehicleCardComponent vehicle={vehicle} className="w-full" />
              </li>
            ))}
          </FeaturedVehiclesCarouselComponent>
        </div>
      </div>
    </section>
  );
}
