import type { WorkshopLocation } from "../types/workshop-location";

/**
 * Dirección y horario de "¿Dónde nos ubicamos?", tal cual del diseño.
 *
 * Ojo: la dirección del diseño es la del Punto de Venta Morato; en
 * `/nuestras-sedes` el Taller Morato figura en otra. Se dejó la del diseño.
 *
 * | Dato     | Diseño (Taller)                   | `/nuestras-sedes` (Taller Morato) |
 * |----------|-----------------------------------|-----------------------------------|
 * | Dirección| Cl. 98a #69b 35, Bogotá, Colombia | Cr 69b #98-28, Bogotá, Colombia   |
 * | Horario  | Lunes a Sabado de 9 a.m. - 6p.m.  | (el de la sede)                   |
 *
 * TODO: confirmar con diseño/marketing cuál es la dirección del taller y el
 * horario ("Sabado" sin tilde y "6p.m." sin espacio, tal cual del diseño).
 */
export const WORKSHOP_LOCATION: WorkshopLocation = {
  address: "Cl. 98a #69b 35, Bogotá, Colombia",
  hours: "Lunes a Sabado de 9 a.m. - 6p.m.",
};

/**
 * El mapa embebido: la búsqueda de la dirección en Google Maps con
 * `output=embed`, que no necesita clave de API. `z=10` da una vista de la región
 * (Bogotá y alrededores), como la de la captura, en vez de una calle: el mapa
 * mide solo 146 de alto.
 * TODO: confirmar con marketing el pin/ficha real del taller (la captura del
 * diseño muestra dos pines, uno en Bogotá y otro hacia el norte).
 */
export function getWorkshopMapUrl({ address }: WorkshopLocation): string {
  return `https://www.google.com/maps?q=${encodeURIComponent(address)}&z=10&hl=es&output=embed`;
}
