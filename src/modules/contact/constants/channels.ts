import { CONTACT_INFO, CONTACT_MAPS_URL } from "@/modules/shared/constants/contact";

import iconClock from "../assets/canales/icon-clock.svg";
import iconMail from "../assets/canales/icon-mail.svg";
import iconPhone from "../assets/canales/icon-phone.svg";
import type { ContactChannel } from "../types/contact";

/**
 * Los tres datos de contacto directo, en el orden del diseño.
 *
 * TODO: confirmar con diseño el ícono de la dirección. Dibuja un reloj (como el
 * sitio anterior), que es de un horario, no de un lugar; el pin de las sedes
 * (`headquarters/assets/`) sería lo esperable.
 */
export const CONTACT_CHANNELS: ContactChannel[] = [
  { id: "email", label: CONTACT_INFO.email, href: `mailto:${CONTACT_INFO.email}`, icon: iconMail },
  { id: "phone", label: CONTACT_INFO.phone, href: CONTACT_INFO.phoneHref, icon: iconPhone },
  { id: "address", label: CONTACT_INFO.address, href: CONTACT_MAPS_URL, newTab: true, icon: iconClock },
];
