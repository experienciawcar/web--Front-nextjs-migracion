/**
 * Asesor tal como lo entrega GET /api/advisors/. Solo se declaran los campos
 * que usa la sección; la respuesta trae además `created_at` y `phone`.
 */
export type AdvisorDto = {
  id: number;
  name_full: string;
  job_title?: string | null;
  description?: string | null;
  image?: string | null;
  /**
   * Id de la sede a la que pertenece el asesor.
   *
   * TODO: este campo NO existe todavía en el backend. Hoy ni los asesores traen
   * su sede ni las sedes (GET /api/sedes/) traen sus asesores, así que no hay
   * cómo agruparlos. Se declara con el nombre y el tipo que tendría una llave
   * foránea de Django; si el backend lo llama distinto, se cambia aquí y en
   * `toTeamMember`, y nada más.
   */
  sede?: number | null;
};

/** Sede tal como la entrega GET /api/sedes/. Solo lo que usa la sección. */
export type SedeDto = {
  id: number;
  name: string;
  active: boolean;
};

/** Sede: cada una es una pestaña del selector, con su propio equipo. */
export type Sede = {
  id: number;
  /** Nombre a secas ("Bogotá"); el "wcar" de la pestaña lo pone el componente. */
  name: string;
};

/** Persona del equipo, ya normalizada para pintarla en una tarjeta. */
export type TeamMember = {
  id: number;
  /** Nombre completo. La primera palabra se pinta en naranja. */
  name: string;
  /** Cargo. Nunca viene vacío: si el backend no lo trae, ver `getTeam`. */
  role: string;
  /** Texto de la tarjeta, junto al icono de ubicación. Vacío si no hay. */
  description: string;
  /** URL firmada de la foto, o null si el asesor no tiene. */
  photoUrl: string | null;
  /** Sede del asesor, o null si el backend no la manda (ver `AdvisorDto`). */
  sedeId: number | null;
};

/**
 * Lo que necesita la sección. Si `sedes` viene vacío no hay pestañas y
 * `members` se muestra completo.
 */
export type Team = {
  sedes: Sede[];
  members: TeamMember[];
};
