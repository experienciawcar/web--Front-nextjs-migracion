import Image from "next/image";

import isotipoWcar from "@/modules/shared/assets/icons/isotipo-wcar.svg";
import iconLocation from "@/modules/shared/assets/navbar/icon-location.svg";

import type { TeamMember } from "../types/team";

/** Misma sombra que las tarjetas de "Nuestros Datos". */
const SOMBRA = "drop-shadow-[0px_7px_7px_rgba(211,218,226,0.4)]";

/**
 * Tarjeta de una persona: la foto de 280x340 arriba y, debajo, el isotipo con
 * el cargo y el nombre, una línea y el texto con el icono de ubicación.
 *
 * La primera palabra del nombre va en naranja. Si el texto de la tarjeta viene
 * vacío (hoy lo está en todos los asesores) se omite el pie entero, con su
 * línea, en vez de dejar el icono de ubicación solo.
 *
 * Los tamaños de texto salen de medir una captura del diseño, no de Figma:
 * 13px el cargo y 18px el nombre no están en la escala del proyecto.
 * TODO: confirmarlos contra Figma. Ojo también con el color del nombre: en la
 * captura va todo oscuro, y aquí la primera palabra va en naranja porque así
 * se pidió.
 */
export default function TeamCardComponent({ member }: { member: TeamMember }) {
  const [firstName, ...lastNames] = member.name.split(" ");

  return (
    <li
      className={`flex w-[280px] shrink-0 snap-start flex-col overflow-hidden rounded-lg bg-white ${SOMBRA}`}
    >
      {/* La proporción es la del área de foto del diseño (280x340). Las fotos
          del backend miden 282x350, casi igual, y se recortan con object-cover
          anclado arriba para no cortar la cabeza. */}
      <div className="relative aspect-[280/340] w-full bg-light-gray">
        {member.photoUrl && (
          <Image
            src={member.photoUrl}
            alt={`Foto de ${member.name}`}
            fill
            sizes="280px"
            className="object-cover object-top"
          />
        )}
      </div>

      <div className="flex flex-1 flex-col gap-4 px-7 pt-6 pb-5">
        <div className="flex items-center gap-4">
          <Image src={isotipoWcar} alt="" aria-hidden className="h-auto w-8 shrink-0" />
          {/* Separador: gris 200 al 30%, el mismo del fundador. */}
          <span aria-hidden className="h-9 w-[2px] shrink-0 bg-gray-2/30" />
          <div>
            <p className="text-[13px] leading-[18px] font-medium text-gray-2">{member.role}</p>
            <h3 className="text-[18px] leading-6 font-bold text-dark-gray">
              <span className="text-orange">{firstName}</span>
              {lastNames.length > 0 && ` ${lastNames.join(" ")}`}
            </h3>
          </div>
        </div>

        {/* Pegado al fondo: las tarjetas de una fila miden lo mismo, y así las
            líneas del pie quedan alineadas aunque un nombre ocupe dos renglones. */}
        {member.description && (
          <div className="mt-auto flex flex-col gap-4">
            <span aria-hidden className="border-t border-gray-2/30" />
            <p className="flex items-center gap-2 text-small font-medium text-gray-1">
              <Image src={iconLocation} alt="" aria-hidden className="size-8 shrink-0" />
              {member.description}
            </p>
          </div>
        )}
      </div>
    </li>
  );
}
