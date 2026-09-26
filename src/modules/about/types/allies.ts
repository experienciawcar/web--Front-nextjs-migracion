/**
 * Aliado tal como lo entrega GET /api/partners/. La respuesta trae además
 * `created_at`, que la sección no usa.
 */
export type PartnerDto = {
  id: number;
  /** Nombre de la empresa ("Banco Santander"). */
  partner: string;
  /**
   * URL firmada del logo. Es un PNG de 150x150 con el logo centrado dentro y
   * fondo transparente (uno, Chevyplan, mide 600x600 y es opaco).
   */
  image?: string | null;
};

/** Aliado listo para pintar: un logo con su nombre. */
export type Ally = {
  id: number;
  name: string;
  logoUrl: string;
};
