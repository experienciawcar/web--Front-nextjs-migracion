import type { Metadata } from "next";

import { getTermsLinks } from "@/modules/shared/services/terms";

import QuoteWizardComponent from "@/modules/quote/components/QuoteWizardComponent";
import { getAvailableDates } from "@/modules/quote/services/booking";
import { getBrands } from "@/modules/quote/services/brands";
import { getColors } from "@/modules/quote/services/colors";
import { getDepartments } from "@/modules/quote/services/departments";
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
 * botones "Vende tu carro" de `/vende-tu-carro` y la pestaña global "Contacta
 * un asesor". Sin Figma: 3 capturas del usuario de `wcar.co/cotizar`
 * (`docs/planes/cotizar/`) para los pasos 1-3, más un documento técnico que
 * leyó el código fuente real de la SPA anterior (rutas, campos exactos,
 * validadores, el endpoint que de verdad crea la cotización y sus bugs
 * conocidos). Plan de trabajo: `docs/planes/cotizar.md`.
 *
 * A diferencia del sitio anterior (que repartía esto en 3 páginas con una
 * navegación rota: el envío real ocurría en una pantalla de "agendar cita"
 * aparte, después de una navegación optimista que no esperaba la respuesta
 * del cálculo), aquí es **una sola vista de 4 pasos** en un único componente
 * cliente (`QuoteWizardComponent`): Datos personales, Datos del carro,
 * Ubicación y detalles (era "Enviar formulario" en el diseño; ya no termina
 * ahí) y Agenda tu cita (nuevo, sin captura: el backend exige fecha y hora
 * para crear el registro — confirmado con `GET /sale-cars/`, donde los 6.003
 * registros reales nunca traen esos campos nulos). El envío real solo ocurre
 * al confirmar el paso 4, y espera la respuesta antes de mostrar nada.
 *
 * Los catálogos que no dependen de una elección previa (marcas, colores,
 * departamentos, fechas disponibles) se piden aquí, en el servidor, y bajan
 * ya resueltos; los que sí dependen de una elección (versiones de una marca,
 * ciudades de un departamento, horas de una fecha) se piden desde el cliente
 * al cambiar el campo del que dependen.
 *
 * No se replican: la llamada fire-and-forget a Kommo (CRM) del sitio
 * anterior (sin evidencia de que siga vigente ni credenciales que verificar
 * aquí) ni la página huérfana `/cotizar/resultado` (a la que ninguna
 * navegación real llegaba). El éxito se muestra en la misma tarjeta.
 * TODO(negocio): confirmar si hace falta el lead a Kommo y con qué credenciales.
 */
export default async function QuotePage() {
  const [brands, colors, departments, dates, terms] = await Promise.all([
    getBrands(),
    getColors(),
    getDepartments(),
    getAvailableDates(),
    getTermsLinks(),
  ]);

  // No hay un documento genérico "términos del vendedor" en `GET /api/terms/no-contents/`
  // (confirmado contra el backend real): son campañas puntuales. El más cercano a
  // este formulario (vender el carro a wcar) es "WCAR te compra con amor"; si
  // llega a desactivarse o renombrarse, cae a `ROUTES.contact`.
  const sellerTerms = terms.find((term) => term.title.toLowerCase().includes("te compra")) ?? null;

  return (
    <main className="flex-1">
      <QuoteWizardComponent brands={brands} colors={colors} departments={departments} dates={dates} termsHref={sellerTerms?.href ?? null} />
    </main>
  );
}
