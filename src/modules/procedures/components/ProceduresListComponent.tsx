import { PROCEDURES } from "../constants/procedures";
import AccordionIconComponent from "./AccordionIconComponent";

/**
 * La tarjeta blanca de "Trámites de *vehículos*": el título, la introducción y el
 * acordeón de los seis trámites. Es la que se monta sobre la foto del hero (ver
 * `ProceduresComponent`, que la posiciona).
 *
 * Fuente: captura del desktop (1910 de ancho) de wcar.co/tramites-de-vehiculos y
 * el DOM de ese sitio medido con Chrome (no hay Figma ni diseño mobile). Medidas a
 * 1910 y a 1440 (iguales) en px:
 * - Tarjeta de 746 de ancho (la columna de 770 menos 12 de margen a cada lado) con 48 de
 *   relleno: el contenido mide 650.
 * - Rayita naranja de 56 x 2,8 (redondeada) arriba a la izquierda y, a 7 px, el
 *   `<h1>` en Medium, con el interlineado de 1,2 y 8 px de margen abajo. Su
 *   tamaño es fluido, como en el sitio anterior: `calc(1.3rem + .6vw)`
 *   (23,2 px a 393, 29,4 a 1440 y 32,3 a 1910). "vehículos" en cursiva naranja.
 * - Introducción de 14/20 (4 renglones a 650) con 48 de separación al acordeón.
 * - Cada elemento: filete de #cdd6da abajo (y arriba el primero); cabecera de 53
 *   (14 de relleno arriba y abajo) con el título en 20/24 Bold a 16 del borde y un
 *   ícono de 25 a 16 del otro. Abierto, la cabecera lleva otro filete abajo y el
 *   texto (14/20) va a 24 de los lados con 16 arriba y abajo (16 a los lados en
 *   mobile).
 *
 * Acordeón nativo, sin JavaScript: `<details name="procedures">` (el `name` hace
 * que abrir uno cierre el otro, como el estado `open` del sitio anterior; todos
 * arrancan cerrados) con `group-open:` para cambiar el "+" por la "×" (ver
 * `AccordionIconComponent`: van en línea, sin peticiones). Sin animación de apertura.
 *
 * El título de cada trámite es un `<h2>` dentro del `<summary>` (el contenido de
 * un `<summary>` admite encabezados): así los seis trámites cuentan en el
 * esquema de la página, como en el sitio anterior, y el texto llega en el HTML
 * aunque esté cerrado.
 *
 * Mobile: la tarjeta va a todo el ancho menos 12 de margen, con 24 de relleno
 * arriba y abajo y 16 a los lados (como en el sitio anterior).
 *
 * TODO: confirmar con diseño el copy de la introducción: "poniendo tu disposición"
 * (¿"a tu disposición"?) y "wcar" en minúsculas, tal cual el diseño.
 */
export default function ProceduresListComponent() {
  return (
    <div className="bg-white px-4 py-6 xl:p-12">
      <div className="reveal relative pt-[7px] pr-[14px] pb-[7px] before:absolute before:top-0 before:left-0 before:h-[2.8px] before:w-14 before:rounded-[10px] before:bg-orange">
        <h1
          id="procedures-title"
          className="mb-2 text-[calc(1.3rem+0.6vw)] leading-[1.2] font-medium text-dark-gray"
        >
          Trámites de <span className="text-orange italic">vehículos</span>
        </h1>
      </div>

      <p className="reveal pb-12 text-small leading-5 text-dark-gray">
        Los trámites de tránsito en Colombia son procesos que requieren el cumplimiento de ciertos requisitos, que
        pueden ser fáciles o difíciles dependiendo del organismo donde se vaya a realizar. En wcar te facilitamos la
        vida poniendo tu disposición nuestro personal experto para acompañarte en el proceso que necesites hacer:
      </p>

      <div className="reveal border-t border-[#cdd6da]">
        {PROCEDURES.map((procedure) => (
          <details key={procedure.id} name="procedures" className="group border-b border-[#cdd6da]">
            <summary className="flex cursor-pointer items-center justify-between py-[14px] text-dark-gray marker:content-none group-open:border-b group-open:border-[#cdd6da] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange [&::-webkit-details-marker]:hidden">
              <h2 className="ml-4 flex-1 pr-5 text-xl leading-6 font-bold text-dark-gray">{procedure.title}</h2>
              <AccordionIconComponent />
            </summary>
            <p className="mx-4 py-4 text-small leading-5 text-dark-gray xl:mx-6">{procedure.description}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
