import Image from "next/image";

import iconClock from "../assets/card/icon-clock.svg";
import iconPin from "../assets/card/icon-pin.svg";
import type { Headquarters } from "../types/headquarters";

import HeadquartersNameComponent from "./HeadquartersNameComponent";
import HeadquartersViewButtonComponent from "./HeadquartersViewButtonComponent";

/**
 * Tarjeta de una sede. Medidas del diseño desktop (medidas de captura, ver
 * `HeadquartersListComponent`): 381x622, foto de 381x313 arriba y, debajo, la
 * marca en naranja + el nombre (dos líneas de 22/30), una raya, la dirección y
 * el horario (ícono de 24 + texto de 16/24, con 22 de aire entre filas; a 14px
 * la fila salía 14% más angosta que en la captura) y el botón VER de ancho
 * completo, con 40 de aire debajo.
 * - Con el texto de 16px, una dirección larga (Caribe, Cajicá) se parte en dos
 *   líneas y su fila de tarjetas crece; el diseño solo trae direcciones cortas.
 * - En las tarjetas con la marca en línea, el título parte las líneas como el
 *   navegador (codicioso), salvo donde `balanceTitle` pide balancearlas: en
 *   "wcar Caribe compra o vende tu auto" el corte codicioso deja "auto" solo y
 *   el diseño lo parte después de "compra".
 *
 * - El título ocupa siempre dos líneas de alto (`min-h-[60px]`) para que las
 *   rayas de las tarjetas de una fila queden alineadas aunque una tenga una
 *   sola línea.
 * - Las tarjetas de una misma fila miden lo mismo (el grid las estira) y el
 *   botón queda pegado abajo (`mt-auto`), así que una dirección larga que se
 *   parte en dos líneas (Caribe) hace crecer la fila y no descuadra el botón.
 * - Si la sede no trae horario, no se pinta la fila (`schedule: null`).
 * - "VER" abre el modal de la sede (`HeadquartersViewButtonComponent`).
 * - La foto es decorativa (`alt=""`): el nombre de la sede está justo debajo.
 * - El botón usa la variante `primary` (token `orange`, #FF8000: el mismo naranja
 *   que se ve en la captura).
 */
export default function HeadquartersCardComponent({ headquarters }: { headquarters: Headquarters }) {
  const { id, brand, name, inlineBrand, balanceTitle, address, schedule, photo, photoPosition } = headquarters;

  return (
    <li className="reveal flex flex-col overflow-hidden rounded-lg bg-white shadow-[0_4px_20px_rgba(30,30,30,0.05)] xl:min-h-[622px]">
      <div className="relative aspect-[381/313] w-full shrink-0">
        <Image
          src={photo}
          alt=""
          aria-hidden
          fill
          sizes="(min-width: 1280px) 381px, (min-width: 768px) 50vw, 100vw"
          className="object-cover"
          style={{ objectPosition: photoPosition }}
        />
      </div>

      <div className="flex flex-1 flex-col px-5 pt-6 pb-10">
        <h3
          className={`min-h-[60px] text-heading-1 font-bold text-dark-gray ${balanceTitle ? "text-balance" : ""}`}
        >
          <HeadquartersNameComponent brand={brand} name={name} inlineBrand={inlineBrand} />
        </h3>

        <hr className="mt-5 h-px border-0 bg-gray/40" />

        <ul className="mt-6 flex flex-col gap-[22px] text-body font-medium text-gray-dark">
          <li className="flex items-center gap-2">
            <Image src={iconPin} alt="" aria-hidden className="size-6 shrink-0" />
            <span>{address}</span>
          </li>
          {schedule && (
            <li className="flex items-center gap-2">
              <Image src={iconClock} alt="" aria-hidden className="size-6 shrink-0" />
              <span>{schedule}</span>
            </li>
          )}
        </ul>

        <div className="mt-auto pt-5">
          <HeadquartersViewButtonComponent id={id} label={`${brand} ${name}`} />
        </div>
      </div>
    </li>
  );
}
