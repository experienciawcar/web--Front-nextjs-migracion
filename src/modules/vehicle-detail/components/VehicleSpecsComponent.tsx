import Image, { type StaticImageData } from "next/image";

import iconFuel from "../assets/specs/icon-combustible.webp";
import iconWarranty from "../assets/specs/icon-garantia.svg";
import iconMileage from "../assets/specs/icon-kilometraje.svg";
import iconYear from "../assets/specs/icon-modelo.svg";
import iconMotor from "../assets/specs/icon-motor.svg";
import iconTransmission from "../assets/specs/icon-transmision.svg";
import type { VehicleDetail } from "../types/vehicle-detail";

import CredirapidoBannerComponent from "./CredirapidoBannerComponent";

type Spec = { label: string; value: string; icon: StaticImageData };

function toSpecs(vehicle: VehicleDetail): Spec[] {
  const specs: (Spec | null)[] = [
    vehicle.warranty
      ? { label: "Garantia", value: vehicle.warranty.short, icon: iconWarranty }
      : null,
    vehicle.mileage
      ? { label: "Kilometraje", value: vehicle.mileage, icon: iconMileage }
      : null,
    vehicle.year
      ? { label: "Modelo", value: String(vehicle.year), icon: iconYear }
      : null,
    vehicle.engine
      ? { label: "Motor", value: vehicle.engine, icon: iconMotor }
      : null,
    {
      label: "Transmisión",
      value: vehicle.transmission,
      icon: iconTransmission,
    },
    vehicle.fuel
      ? { label: "Combustible", value: vehicle.fuel, icon: iconFuel }
      : null,
  ];
  return specs.filter((spec): spec is Spec => spec !== null);
}

/**
 * "Detalles del Vehículo": el título con su raya, el banner Credirápido a la derecha y, sobre un
 * panel gris, las seis tarjetas de datos (garantía, kilometraje, modelo, motor, transmisión y
 * combustible).
 *
 * Figma 89:4207, en px del lienzo de 1440 con y=823 en el borde superior de la sección (panel
 * blanco de 198, luego un panel `gray-light` de 220 que acaba en y=1241): la raya de 77 x 4 en
 * y=893 y el título de 36/44 debajo ("Vehículo" en `orange` cursiva regular), el banner de 568 x
 * 120 en (730, 865) —alineado 18 px adentro del margen derecho—, y las tarjetas de 176 x 176 con
 * 8 de radio en y=1043, x=142 con 20 de separación (6 x 176 + 5 x 20 = 1156, o sea 18 px adentro
 * de cada margen). Dentro de cada tarjeta: el ícono de 48 a 34 del borde, la etiqueta de 16 Bold
 * `gray-dark` (y+88) y el valor de 22 Bold (y+118), centrados.
 *
 * Una tarjeta sin dato (sin motor, sin garantía) no se pinta: la cuadrícula se reparte entre las
 * que hay. Mobile (no hay diseño de esta tarjeta): dos columnas.
 *
 * TODO: erratas del diseño reproducidas: "Garantia" sin tilde en la etiqueta de la primera
 * tarjeta ("Transmisión" y "Kilometraje" sí la llevan). Y el diseño muestra "Mecanica" y
 * "11000 Km" como ejemplo; aquí sale "Mecánica" (con tilde, como el resto del sitio) y el
 * kilometraje con puntos de miles.
 */
export default function VehicleSpecsComponent({
  vehicle,
}: {
  vehicle: VehicleDetail;
}) {
  const specs = toSpecs(vehicle);

  return (
    <section aria-labelledby="detalles-title">
      <div className="bg-white">
        <div className="container-wcar flex flex-col gap-8 pt-10 pb-10 xl:flex-row xl:items-start xl:justify-between xl:pt-[42px] xl:pb-9">
          <div className="reveal xl:pt-7">
            <span aria-hidden className="block h-1 w-[77px] bg-orange" />
            <h2
              id="detalles-title"
              className="mt-4 text-[28px] leading-9 font-bold text-dark-gray xl:text-subheadline-1 xl:leading-11"
            >
              Detalles del{" "}
              <span className="font-normal text-orange italic">Vehículo</span>
            </h2>
          </div>
          <div className="reveal xl:mr-[18px] xl:w-[568px]">
            <CredirapidoBannerComponent />
          </div>
        </div>
      </div>

      <div className="bg-gray-light">
        <div className="container-wcar py-8 xl:py-[22px]">
          <ul className="reveal grid grid-cols-2 gap-3 sm:grid-cols-3 xl:mx-[18px] xl:grid-cols-[repeat(auto-fit,minmax(0,176px))] xl:justify-start xl:gap-5">
            {specs.map((spec) => (
              <li
                key={spec.label}
                className="flex flex-col items-center rounded-lg bg-white px-2 pt-[34px] pb-[34px] text-center xl:h-[176px]"
              >
                <Image
                  src={spec.icon}
                  alt=""
                  aria-hidden
                  className="size-12 object-contain"
                />
                <p className="mt-[6px] text-body leading-6 font-bold text-gray-dark">
                  {spec.label}
                </p>
                <p className="mt-[6px] text-[20px] leading-6 font-bold text-dark-gray xl:text-[22px]">
                  {spec.value}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
