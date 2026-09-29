/**
 * Dónde y cuándo se atiende en el taller. Contenido fijo del diseño: no hay
 * endpoint (`/taller/` y `/workshop/` dan 404) y `/sedes/` trae filas de prueba.
 * TODO: cuando el backend traiga las sedes reales, esto sale de ahí (la sede del
 * taller) y esta forma queda como el tipo de vista.
 */
export type WorkshopLocation = {
  address: string;
  hours: string;
};
