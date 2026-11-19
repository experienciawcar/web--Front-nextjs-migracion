import type { Metadata } from "next";

import { getTermsLinks } from "@/modules/shared/services/terms";

import QuoteWizardComponent from "@/modules/quote/components/QuoteWizardComponent";
import { buildPageMetadata } from "@/modules/shared/utils/seo";

// TODO(seo): confirmar con marketing la palabra clave. Título y descripción se
// adaptaron de "Cotizar - wcar" del sitio anterior (que no traía descripción propia).
export const metadata: Metadata = buildPageMetadata({
  title: "Cotiza tu carro en minutos | WCAR",
  description:
    "Cuéntanos sobre tu vehículo y agenda una cita: cotizamos tu carro usado rápido, seguro y al precio justo con WCAR.",
  path: "/cotizar",
});

/**
 * Vista Cotizar (`ROUTES.quote`, `/cotizar`): el formulario al que llevan los
 * botones "Vende tu carro". Formulario corto de 2 pasos (placa y km, luego
 * contacto) en `QuoteWizardComponent`; contrato con backend en
 * `docs/backend/cotizar-formulario-corto.md`. Ya no pide marca, ciudad, color
 * ni cita: eso lo completa el asesor / el backend por placa.
 */
export default async function QuotePage() {
  const terms = await getTermsLinks();

  // No hay un documento genérico "términos del vendedor" en `GET /api/terms/no-contents/`:
  // son campañas puntuales. El más cercano es "WCAR te compra con amor"; si
  // llega a desactivarse o renombrarse, cae a `ROUTES.contact`.
  const sellerTerms = terms.find((term) => term.title.toLowerCase().includes("te compra")) ?? null;

  return (
    <main className="flex-1">
      <QuoteWizardComponent termsHref={sellerTerms?.href ?? null} />
    </main>
  );
}
