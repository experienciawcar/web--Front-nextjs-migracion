/**
 * Tipo de vehículo tal como lo entrega GET /api/type-cars/. Solo se declaran
 * los campos que usa el navbar.
 */
export type TypeCarDto = {
  id: number;
  /** Nombre a mostrar ("SUV", "Camioneta - SUV", "Motocicletas"...). */
  type: string;
  /** Vehículos publicados de ese tipo. */
  car_count: number;
  /** URL firmada de Google Cloud Storage; caduca a las 24 h. */
  image?: string | null;
};

/** Tipo de vehículo ya normalizado, con el enlace a su categoría armado. */
export type VehicleType = {
  id: number;
  name: string;
  count: number;
  imageUrl: string | null;
  href: string;
};
