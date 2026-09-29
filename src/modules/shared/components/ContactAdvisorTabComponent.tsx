import ButtonComponent from "./ButtonComponent";
import { ROUTES } from "../constants/routes";

/**
 * Pestaña "Contacta un asesor", fija al borde derecho de la ventana con el
 * texto girado 90° hacia la derecha.
 *
 * Es el botón cian con sus esquinas de siempre (arriba a la derecha y abajo a
 * la izquierda) girado 90°: queda redondeada la esquina de arriba a la
 * izquierda, que es la que se ve, y la de abajo a la derecha queda fuera de la
 * ventana. Mide 40 de alto (16px regular, sin mayúsculas) y se corre un 40% de
 * su largo a la derecha, como en el sitio anterior (`right: 0; top: 37%;
 * transform: translateX(40%) rotate(90deg)`): quedan a la vista unos 37px de
 * grosor y unos 172 de largo, y `translate` va antes de `rotate` en las
 * utilidades de Tailwind, igual que en esa transformación.
 *
 * En el sitio anterior estaba en todas las páginas (es del layout) y abría un
 * modal: "¡Hola, soy Wanda! ¿Por qué medio deseas comunicarte con un asesor?",
 * con tres canales (formulario, WhatsApp y videollamada). Aquí también está en
 * el layout (`app/layout.tsx`, junto al navbar y el footer): el diseño la
 * repite igual en Contacto y en el Inicio (nodo 671:14414), así que es global
 * y no de una vista.
 * TODO: confirmar con diseño qué hace: hoy lleva a `ROUTES.quote`, lo mismo que
 * "Contacta un asesor" del bloque de venta de vehículo.
 *
 * No se muestra bajo `xl`: sobre el texto de una pantalla de 393px taparía las
 * últimas letras de cada renglón. El diseño mobile no existe.
 * TODO: confirmar con diseño.
 */
export default function ContactAdvisorTabComponent() {
  return (
    <div className="fixed top-[37%] right-0 z-30 hidden translate-x-[40%] rotate-90 xl:block">
      <ButtonComponent
        href={ROUTES.quote}
        variant="cyan"
        className="h-10! px-4! text-body! font-normal! normal-case!"
      >
        Contacta un asesor
      </ButtonComponent>
    </div>
  );
}
