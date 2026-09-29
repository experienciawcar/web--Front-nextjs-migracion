import type { Metadata } from "next";

import ContactComponent from "@/modules/contact/components/ContactComponent";
import { buildPageMetadata } from "@/modules/shared/utils/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Contacto | WCAR",
  description:
    "Escríbenos o llámanos: contacta a WCAR para resolver tus dudas, vender tu vehículo o llevarlo a nuestro taller.",
  path: "/contacto",
});

/**
 * Vista Contacto (`ROUTES.contact`).
 *
 * Diseño: captura del desktop (1910 de ancho) de la página de contacto del sitio
 * anterior; no hay node-id de Figma ni diseño mobile.
 *
 * Los tres botones de la página llevan a destinos provisionales (los
 * formularios no existen): ver `contact/constants/options.ts`. La pestaña
 * "Contacta un asesor" ya no va aquí: es global y vive en el layout (ver
 * `ContactAdvisorTabComponent`).
 *
 * Faltan por agregar: los formularios a los que llevan los botones
 * (`/contacta-a-la-empresa`, `/cotizar` y el de reserva del taller). El Navbar y
 * el Footer no van aquí: son globales y viven en el layout.
 */
export default function ContactPage() {
  return (
    <main className="flex-1">
      <ContactComponent />
    </main>
  );
}
