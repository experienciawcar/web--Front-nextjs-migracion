import iconCar from "@/modules/shared/assets/icons/car.svg";
import { ROUTES } from "@/modules/shared/constants/routes";

import iconLaptop from "../assets/opciones/icon-laptop.svg";
import iconSettings from "../assets/opciones/icon-settings.svg";
import type { ContactOption } from "../types/contact";

/**
 * Las tres maneras de contactar a WCAR, en el orden del diseño. El texto es el
 * del diseño y va tal cual; no viene de ningún endpoint.
 *
 * Los destinos son provisionales: ninguno de los formularios existe todavía.
 * TODO: apuntar cada botón a su formulario cuando se hagan. En el sitio anterior:
 * - "Contactar a la empresa" → `/contacta-a-la-empresa`, una página con formulario.
 * - "Contacta un asesor" → `/cotizar`.
 * - "Contactar al taller" → no era una página: abría un modal "Formulario de
 *   Reserva" (nombre, teléfono, correo, ciudad, qué busca y mensaje). Mientras
 *   tanto lleva a `/taller`, que a su vez lleva aquí: un círculo, no una salida.
 *
 * TODO: confirmar con diseño el copy: "¿Estas vendiendo" va sin tilde en el
 * diseño (¿"Estás"?).
 */
export const CONTACT_OPTIONS: ContactOption[] = [
  {
    id: "company",
    title: "Contactar a la empresa",
    description:
      "Tienes alguna pregunta, comentario o situación en la que podamos ayudarte, haz clic aquí en el botón de abajo.",
    cta: "Contactar a la empresa",
    href: ROUTES.contactCompany,
    icon: iconLaptop,
  },
  {
    id: "sell-vehicle",
    title: "Contactar venta de vehículo",
    description:
      "¿Estas vendiendo tu vehículo? Te ayudamos desde el primer contacto y gestionamos todos los procesos que requiere la venta de tu vehículo.",
    cta: "Contacta un asesor",
    href: ROUTES.quote,
    // El glifo de `car.svg` es el recuadro exacto del auto (22,7x20); el del
    // diseño va con un margen dentro de su caja de 32px y se ve de unos 30px.
    icon: iconCar,
    iconClassName: "size-[30px] object-contain",
  },
  {
    id: "workshop",
    title: "Contactar con mecánico",
    description:
      "¿Necesitas servicio para tu vehículo? Nuestro taller está listo para ayudarte. Completa el formulario y nuestro equipo se pondrá en contacto contigo rápidamente.",
    cta: "Contactar al taller",
    href: ROUTES.workshop,
    icon: iconSettings,
  },
];
