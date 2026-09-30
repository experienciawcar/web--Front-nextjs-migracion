import Image from "next/image";

import iconEvaluation from "../assets/summary/icono-evaluacion.webp";
import type { VehicleExpertise } from "../types/vehicle-detail";

import VehicleExpertiseComponent from "./VehicleExpertiseComponent";

/**
 * Tarjeta "Evaluación del vehículo": cabecera naranja con el ícono de documento, "wcar" y el
 * título, y debajo la explicación y el botón "VER PERITAJE".
 *
 * Figma "Evaluación del vehículo" (89:4825): 776 x 400, blanca con borde de 1 px `#c2d3ed` y
 * esquinas de 8; cabecera `orange` de 160 con el ícono a 70 del borde, "wcar" de 32 Bold y
 * "Evaluación del vehiculo" de 44 Bold blancos (a 193 del borde); cuerpo con el título de 22
 * Bold, un párrafo de 16 Medium `gray-dark` en 614 de ancho y el botón cian centrado.
 *
 * TODO: el diseño 89:4207 trae relleno en el párrafo ("Nibh quisque suscipit…"); se usó el texto
 * real del marco hermano 238:4492 ("El peritaje es un dictamen técnico…"). "vehiculo" sin tilde
 * en el título es errata del diseño y se reprodujo. El ícono es un recorte del export de Figma
 * sobre el naranja de la cabecera (un solo bitmap).
 */
export default function VehicleEvaluationComponent({
  vehicleId,
  expertise,
  vehicleName,
}: {
  vehicleId: number;
  expertise: VehicleExpertise | null;
  vehicleName: string;
}) {
  return (
    <section
      aria-labelledby="evaluacion-title"
      className="overflow-hidden rounded-lg border border-[#c2d3ed] bg-white"
    >
      <div className="flex items-center gap-5 bg-orange px-6 py-8 xl:h-40 xl:gap-[43px] xl:px-[70px] xl:py-0">
        <Image
          src={iconEvaluation}
          alt=""
          aria-hidden
          className="h-auto w-[60px] shrink-0 xl:w-[85px]"
        />
        <div className="text-white">
          <p className="text-[24px] leading-tight font-bold xl:text-[32px]">
            wcar
          </p>
          <h2
            id="evaluacion-title"
            className="text-[28px] leading-tight font-bold xl:text-[44px]"
          >
            Evaluación del vehiculo
          </h2>
        </div>
      </div>
      <div className="flex flex-col items-center px-6 py-8 text-center xl:px-[82px] xl:pt-10 xl:pb-9 xl:text-left">
        <div className="xl:w-[614px]">
          <h3 className="text-[20px] leading-7 font-bold text-dark-gray xl:text-[22px]">
            Toda la información exacta del vehículo en un documento
          </h3>
          <p className="mt-4 text-body leading-6 font-medium text-gray-dark">
            El peritaje es un dictamen técnico elaborado por expertos en la
            materia de estudio. En nuestra página web puedes descargar el
            documento oficial completo en formato PDF.
          </p>
          <div className="mt-8 flex">
            <VehicleExpertiseComponent
              vehicleId={vehicleId}
              expertise={expertise}
              vehicleName={vehicleName}
              variant="card"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
