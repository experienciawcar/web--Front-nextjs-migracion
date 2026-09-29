import Image from "next/image";

import iconExternal from "@/modules/shared/assets/icons/external-link.svg";
import ButtonComponent from "@/modules/shared/components/ButtonComponent";

import iconPhone from "../assets/asesoria/icon-telefono.svg";
import { ADVISORY_ACTIONS, ADVISORY_PHONE } from "../constants/advisory";

/**
 * La columna de la derecha: un párrafo y, debajo, el recuadro negro "Hablemos /
 * ¿Necesitas asesoría?" con el teléfono y los tres botones.
 *
 * Fuente: la captura del desktop de wcar.co/tramites-de-vehiculos y su DOM
 * medido (ver `ProceduresListComponent`). En desktop la columna mide 440 (4 de
 * 12) con 16 de relleno a los lados y 48 arriba, así que el párrafo (14/20, tres
 * renglones a 408) arranca a la altura del hero + 48. Del párrafo al recuadro
 * hay 48. El recuadro mide 408 de ancho, es negro y lleva 28 de relleno (352 de
 * contenido); **acaba pegado al footer**, sin espacio debajo (por eso la sección
 * no lleva relleno abajo).
 *
 * Dentro del recuadro:
 * - "Hablemos": 14 blanco, con una raya cian de 42 x 1,4 a su izquierda (a 7 px).
 * - "¿Necesitas asesoría?": 24/34 Regular blanco, fluido bajo `xl` como el
 *   sitio anterior (`calc(1.275rem + .3vw)`: 21,6 a 393). Es un `<h2>`.
 * - El teléfono: el auricular cian (24) centrado en una caja de 80 y, a 4 px, dos
 *   renglones de 14/20 blancos ("Si tienes alguna pregunta" / número). Es un
 *   enlace `tel:`.
 * - Tres botones a la izquierda, uno bajo otro: "Contacta a un asesor" (naranja,
 *   con el ícono de enlace externo) y dos cian.
 *
 * Los botones son `ButtonComponent` (48 de alto, mayúsculas y negrita de 14): son
 * unos 8 px más altos y con texto más liviano que los del sitio anterior (40 y 42
 * de alto, 16 en regular), a favor del sistema de botones del rediseño.
 *
 * Mobile: sin diseño. Como en el sitio anterior, el párrafo lleva 16 de margen y
 * el recuadro va a todo el ancho de la columna.
 *
 * Los destinos de los botones y el teléfono son provisionales: ver
 * `constants/advisory.ts`.
 */
export default function ProceduresAdvisoryComponent() {
  return (
    <aside aria-label="Asesoría" className="pt-12 xl:px-4">
      <p className="reveal px-4 text-small leading-5 text-dark-gray xl:px-0">
        Al igual que con todos nuestros productos, queremos brindarte servicio personalizado, con toma de firmas e
        improntas a domicilio, además de un precio razonable y agilidad.
      </p>

      <div className="reveal mt-12 bg-black p-7 text-white">
        <div className="flex items-center gap-[7px] text-small leading-5">
          <span aria-hidden className="h-[1.4px] w-[42px] bg-blue-neon" />
          Hablemos
        </div>

        <h2 className="text-[calc(1.275rem+0.3vw)] leading-[1.4286] font-normal xl:text-2xl">¿Necesitas asesoría?</h2>

        <a
          href={ADVISORY_PHONE.href}
          className="mt-4 flex items-center pr-6 text-small leading-5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-neon"
        >
          <span className="flex w-20 shrink-0 justify-center">
            <Image src={iconPhone} alt="" aria-hidden className="size-6" />
          </span>
          <span className="pl-1">
            Si tienes alguna pregunta
            <br />
            {ADVISORY_PHONE.label}
          </span>
        </a>

        <div className="mt-6 flex flex-col items-start gap-4">
          {ADVISORY_ACTIONS.map((action) => (
            <ButtonComponent
              key={action.id}
              href={action.href}
              newTab={action.newTab}
              variant={action.id === "advisor" ? "primary" : "cyan"}
              icon={action.id === "advisor" ? iconExternal : undefined}
            >
              {action.label}
            </ButtonComponent>
          ))}
        </div>
      </div>
    </aside>
  );
}
