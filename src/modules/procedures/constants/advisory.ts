import { ROUTES } from "@/modules/shared/constants/routes";

/**
 * Teléfono de asesoría del recuadro negro. Es el del sitio anterior
 * (`tel:573018063302` en wcar.co/tramites-de-vehiculos) y no es el que trae
 * `CONTACT_INFO` (+57 324 4001212).
 * TODO: confirmar con diseño/negocio que ese es el número de asesoría de trámites
 * y no un resto del sitio anterior.
 */
export const ADVISORY_PHONE = {
  /** Como se lee, con el paréntesis del diseño. */
  label: "(+57) 301 8063302",
  /** Formato internacional, sin espacios. */
  href: "tel:+573018063302",
} as const;

/**
 * Los tres botones del recuadro, en el orden del diseño.
 *
 * En el sitio anterior solo "Contacta a un asesor" era un enlace (a `/contacto`).
 * Los otros dos abrían un modal con un formulario (nombre, tipo y número de
 * documento, placa y monto o plan) que llamaba a `garantie-security/` del backend
 * y mandaba a pagar a eCollect: un flujo de pago que este proyecto todavía no
 * tiene. Destinos provisionales:
 * - "Compra tu seguro" → wcarseguros.com, el mismo destino que "Seguros" del
 *   navbar y del footer.
 * - "Adquiere tu garantía" → la sección "Garantias y seguros" de Taller.
 * TODO: apuntar los dos a su formulario/modal de compra cuando exista (flujo de
 * pago incluido) y confirmar con diseño el destino mientras tanto.
 *
 * TODO: confirmar con diseño el copy: "garantia" va sin tilde en el diseño (y en
 * el sitio anterior); el botón lo pone en mayúsculas, así que se leería "GARANTÍA".
 */
export const ADVISORY_ACTIONS = [
  { id: "advisor", label: "Contacta a un asesor", href: ROUTES.contact, newTab: false },
  { id: "insurance", label: "Compra tu seguro", href: ROUTES.insurance, newTab: true },
  { id: "warranty", label: "Adquiere tu garantia", href: `${ROUTES.workshop}#garantias-title`, newTab: false },
] as const;
