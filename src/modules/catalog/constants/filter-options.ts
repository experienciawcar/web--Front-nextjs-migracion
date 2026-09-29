/**
 * Combustible, transmisión, tracción y años: sin endpoint (confirmado contra
 * el backend real, `GET /type-cars/` no los trae y no hay ningún otro que los
 * liste), listas fijas como ya hacía la SPA anterior.
 */

/** Valores tal cual los trae cada vehículo en `fuel_type` (no hay id). */
export const FUEL_TYPES = [
  { value: "gasolina", label: "Gasolina" },
  { value: "diesel", label: "Diésel" },
  { value: "hibrido", label: "Híbrido" },
  { value: "electrico", label: "Eléctrico" },
  { value: "gas", label: "Gas" },
] as const;

/** `1` = automática, `0` = manual: así lo espera el backend. */
export const TRANSMISSIONS = [
  { value: 1, label: "Automática" },
  { value: 0, label: "Manual" },
] as const;

/**
 * Deducido contando resultados reales por id y mirando el nombre de los
 * vehículos que trae cada uno (no está documentado en el código de la SPA
 * anterior que pasó el usuario, que solo dice "enum, sin endpoint"):
 * `traction=0` son las motos (no aplica), `traction=1` son los "4X4" del
 * nombre, `traction=3` los "4X2" del nombre. `traction=2` es el resto
 * (sedanes/hatchbacks sin "4X" en el nombre): se etiqueta "Delantera" por ser
 * lo más común en ese segmento, pero **no está confirmado** — si el sidebar
 * real de wcar.co muestra otras etiquetas, corregir aquí.
 * TODO: confirmar las etiquetas exactas con diseño/negocio.
 */
export const TRACTIONS = [
  { value: "1", label: "4x4" },
  { value: "2", label: "Delantera" },
  { value: "3", label: "4x2" },
] as const;

const CURRENT_YEAR = new Date().getFullYear();

/** 2000 hasta el año actual, más reciente primero (como en la SPA anterior). */
export const YEARS: number[] = Array.from({ length: CURRENT_YEAR - 2000 + 1 }, (_, i) => CURRENT_YEAR - i);
