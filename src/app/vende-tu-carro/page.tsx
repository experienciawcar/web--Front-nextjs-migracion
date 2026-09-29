import type { Metadata } from "next";

import SellBenefitsComponent from "@/modules/sell/components/SellBenefitsComponent";
import SellFaqComponent from "@/modules/sell/components/SellFaqComponent";
import SellHeroComponent from "@/modules/sell/components/SellHeroComponent";
import SellSecurityComponent from "@/modules/sell/components/SellSecurityComponent";
import SellTestimonialsComponent from "@/modules/sell/components/SellTestimonialsComponent";
import { buildPageMetadata } from "@/modules/shared/utils/seo";

// TODO(seo): confirmar con marketing la palabra clave ("vende tu carro usado" por
// defecto). Título y descripción se adaptaron de la página del sitio anterior
// (wcar.co/vende-tu-carro).
export const metadata: Metadata = buildPageMetadata({
  title: "Vende tu Carro en Colombia en 1, 2 por 3 | WCAR",
  description:
    "Vende tu carro rápido y seguro con WCAR: te explicamos todo lo necesario para un negocio rentable en la venta de tu vehículo. ¡Contáctanos!",
  path: "/vende-tu-carro",
});

/**
 * Vista Vende tu Carro. La ruta es /vende-tu-carro porque es la que ya usa
 * `ROUTES.sellCar` (navbar, footer y los CTA "Vende tu carro" del Home).
 *
 * Sin Figma: el diseño de referencia es la propia página del sitio anterior
 * (`https://wcar.co/vende-tu-carro`), medida en vivo con `cdp.py` (viewport
 * 1440) en vez de estimada de capturas. Plan de trabajo: `docs/planes/vende-tu-carro.md`.
 *
 * Dos secciones reutilizan datos reales de otras vistas en vez de traer
 * contenido nuevo: "Preguntas frecuentes" son los mismos `PROCEDURES` de
 * `/tramites-de-vehiculos`, y "Testimonios y Opiniones" son las mismas
 * reseñas de Google (`GET /api/map/`) que ya usa `/about-us`.
 *
 * Están todas las secciones del diseño. El Footer no va aquí: es global y
 * vive en el layout.
 */
export default function SellCarPage() {
  return (
    <main className="flex-1">
      <SellHeroComponent />
      <SellBenefitsComponent />
      <SellSecurityComponent />
      <SellTestimonialsComponent />
      <SellFaqComponent />
    </main>
  );
}
