/** Marca tal como la entrega GET /v2/brands/. Trae más campos (imagen, modelos); solo se declaran los que usa este formulario. */
export type BrandDto = {
  id: number;
  brand: string;
};

/** Marca lista para el `<select>` de "Datos del carro". */
export type Brand = { id: string; name: string };
