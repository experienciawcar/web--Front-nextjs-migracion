/** Modelo anidado dentro de una marca (`modelcar_set` en GET /v2/brands/). */
export type ModelDto = {
  id: number;
  model: string;
};

/**
 * Marca tal como la entrega GET /v2/brands/. Ya trae sus modelos anidados en
 * `modelcar_set`: a diferencia de la SPA anterior, **no hace falta** pedir
 * `GET /v2/brands/:id` aparte para la cascada marca→modelo.
 */
export type BrandDto = {
  id: number;
  brand: string;
  /** URL firmada de Google Cloud Storage (caduca a las 24 h). */
  image?: string | null;
  modelcar_set?: ModelDto[] | null;
};

export type Model = { id: string; name: string };

/** Marca normalizada, con sus modelos listos para la cascada del filtro. */
export type Brand = { id: string; name: string; imageUrl: string | null; models: Model[] };
