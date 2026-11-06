import Image, { type StaticImageData } from "next/image";

import iconYear from "../assets/specs/d-anio.svg";
import iconFuel from "../assets/specs/d-combustible.svg";
import iconMileage from "../assets/specs/d-km.svg";
import iconModel from "../assets/specs/d-modelo.svg";
import iconMotor from "../assets/specs/d-motor.svg";
import iconStock from "../assets/specs/d-stock.svg";
import iconTransmission from "../assets/specs/d-transmision.svg";
import iconLocation from "../assets/specs/d-ubicacion.svg";
import type { VehicleDetail } from "../types/vehicle-detail";

type Spec = {
  label: string;
  value: string;
  icon: StaticImageData;
  note?: string;
};

function toSpecs(vehicle: VehicleDetail): Spec[] {
  const year = vehicle.year ? String(vehicle.year) : null;
  const specs: (Spec | null)[] = [
    year ? { label: "Año", value: year, icon: iconYear } : null,
    vehicle.mileage
      ? { label: "Kilometraje", value: vehicle.mileage, icon: iconMileage }
      : null,
    // TODO: el backend solo trae `year`; el diseño muestra "Año" y "Modelo" por separado.
    year ? { label: "Modelo", value: year, icon: iconModel } : null,
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
    { label: "Stock ID", value: vehicle.stockId, icon: iconStock },
    {
      label: "Ubicación",
      value: vehicle.city,
      icon: iconLocation,
      // TODO: confirmar con diseño (erratas reproducidas: "Envió", "pais").
      note: "Envió por todo el pais",
    },
  ];
  return specs.filter((spec): spec is Spec => spec !== null);
}

/**
 * Datos del vehículo bajo la galería: ocho tarjetas blancas de 8 de radio en cuatro columnas
 * (Año, Kilometraje, Modelo, Motor, Transmisión, Combustible, Stock ID y Ubicación).
 *
 * Figma 1542:22997 (marco "Página carro -desktop 1451", 1542:22539): cuadrícula de 1205 x 220 en
 * x=124, y=858, tarjetas de 287 x 98 con 19 de separación horizontal y 24 vertical; ícono de 48
 * (opacidad 80 %), etiqueta de 16 Bold `gray` y valor de 18 SemiBold. Reemplaza al bloque
 * "Detalles del Vehículo" del diseño 89:4207.
 *
 * Una tarjeta sin dato (sin motor, sin combustible) no se pinta. Mobile (sin diseño): una columna, dos desde 560. La nota de Ubicación va en su propia línea (en el diseño sigue a la ciudad y desborda la tarjeta).
 */
export default function VehicleSpecsComponent({
  vehicle,
}: {
  vehicle: VehicleDetail;
}) {
  return (
    <section aria-label="Detalles del vehículo" className="bg-gray-light">
      <div className="container-wcar pb-10 xl:pb-[49px]">
        <ul className="reveal grid grid-cols-1 gap-3 min-[560px]:grid-cols-2 xl:grid-cols-4 xl:gap-x-[19px] xl:gap-y-6">
          {toSpecs(vehicle).map((spec) => (
            <li
              key={spec.label}
              className="flex min-w-0 items-center gap-3 rounded-lg bg-white px-4 py-5 xl:gap-4 xl:py-6 xl:pr-4 xl:pl-6"
            >
              <Image
                src={spec.icon}
                alt=""
                aria-hidden
                className="size-10 shrink-0 opacity-80 xl:size-12"
              />
              <div className="min-w-0">
                <p className="text-body leading-6 font-bold text-gray-dark">
                  {spec.label}
                </p>
                <p className="text-[18px] leading-6 font-semibold break-words text-dark-gray">
                  {spec.value}
                  {spec.note && (
                    <span className="block text-[12px] leading-4 font-bold tracking-[-0.2px] text-[#50a628]">
                      {spec.note}
                    </span>
                  )}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

