import Image from "next/image";

import iconExternal from "@/modules/shared/assets/icons/external-link.svg";
import ButtonComponent from "@/modules/shared/components/ButtonComponent";

import { CONTACT_OPTIONS } from "../constants/options";

/**
 * Los tres bloques "Contactar a…": ícono naranja con una raya, título, texto y
 * un botón cian.
 *
 * Desktop (medido en la captura a 1910, coincide con el DOM del sitio anterior):
 * dos columnas de 500px (caja de 1000px centrada) con 16px de relleno, así que
 * el texto ocupa 468px. El tercero queda solo en la primera columna. Entre
 * bloques van 16px.
 * - Ícono en una caja de 32px con 8px arriba y abajo; la raya, de 80x4, a 8px.
 * - Título de 28px bold (interlineado de 34) y 16px hasta el texto.
 * - Texto de 14px con interlineado de 20.
 * - Botón cian de 271x48 centrado en la columna, 16px bajo el texto.
 *
 * Mobile: una sola columna, sin el relleno lateral. El diseño no existe; sigue
 * el sitio anterior (un bloque bajo otro, botón centrado).
 *
 * El botón de 271px de ancho lleva el contenido pegado a la izquierda, como en la
 * captura (el texto arranca a 30px del borde y el ícono queda tras él): con
 * `justify-center`, la variante cian, cada botón se vería con un margen distinto
 * según lo largo de su texto.
 */
export default function ContactOptionsComponent() {
  return (
    <ul className="mx-auto mt-4 grid max-w-[1000px] grid-cols-1 gap-y-4 xl:mt-0 xl:grid-cols-2">
      {CONTACT_OPTIONS.map((option) => (
        <li key={option.id} className="reveal flex flex-col py-4 xl:p-4">
          <div className="my-2 flex items-center gap-2">
            <span className="flex size-8 shrink-0 items-center justify-center">
              <Image src={option.icon} alt="" aria-hidden className={option.iconClassName ?? "size-8"} />
            </span>
            <span aria-hidden className="h-1 w-20 bg-orange" />
          </div>

          <h2 className="mb-4 text-[28px] leading-[34px] font-bold">{option.title}</h2>
          <p className="text-small leading-5">{option.description}</p>

          <ButtonComponent
            href={option.href}
            variant="cyan"
            icon={iconExternal}
            className="mx-auto mt-4 w-[271px] justify-start! pl-7!"
          >
            {option.cta}
          </ButtonComponent>
        </li>
      ))}
    </ul>
  );
}
