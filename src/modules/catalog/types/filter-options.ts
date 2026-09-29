/** Color tal como lo entrega GET /v2/colors/. */
export type ColorDto = { id: number; name: string; hex: string };
/** El filtro manda el **nombre**, no el id (verificado contra el backend real). */
export type ColorOption = { name: string; hex: string };

/** Etiqueta de disponibilidad tal como la entrega GET /v2/tags/. */
export type TagDto = { id: number; tag: string; color?: string | null };
export type TagOption = { id: string; name: string; color: string };

/** Sede tal como la entrega GET /sedes/. */
export type SedeDto = { id: number; name: string; active?: boolean };
export type SedeOption = { id: string; name: string };
