import type { StaticImageData } from "next/image";

import type {
  VehicleFileDto,
  VehicleImage,
  VehicleImageSrcsetDto,
  VehicleWarrantyTone,
} from "@/modules/shared/types/vehicle";

/** Una fila de `description_list` (o de GET /description-car/{id}/): un dato suelto de la ficha. */
export type VehicleDescriptionRowDto = {
  /** Grupo: 1 historial, 2 características, 3 seguridad, 4 accesorios, 5 comentarios. */
  list: number;
  /** Qué dato es (1 propietarios, 4 SOAT, 12 sillas…); ver `constants/features.ts`. */
  item: number;
  content: string | null;
};

/**
 * Vehículo tal como lo entrega GET /api/v2/cars/{id}/. Solo los campos que usa la
 * ficha. `description_list` ya trae lo mismo que GET /description-car/{id}/
 * (verificado con un vehículo real), así que no hace falta la segunda llamada
 * que hacía el sitio anterior.
 *
 * Ojo: `tuition` es la PLACA COMPLETA. La ficha nunca la muestra ni la manda al
 * navegador: el servicio solo conserva su último carácter.
 */
export type VehicleDetailDto = {
  id: number;
  car: string;
  year: number | null;
  mileage: number | null;
  transmission: number | null;
  price: string | null;
  discount_price?: string | null;
  active?: boolean;
  engine?: string | null;
  /** 0 trasera, 1 4x4, 2 delantera, 3 4x2. */
  traction?: number | null;
  /** "gasolina", "diesel"… */
  fuel_type?: string | null;
  tuition?: string | null;
  /** La marca ("Hyundai") viene dentro de `brand_car.brand`. */
  brand_car?: { brand?: string | null } | null;
  type?: { type?: string | null } | null;
  body_type?: string | null;
  /** Id de la sede (la v2 no trae el objeto `sede_car`); el nombre sale de GET /sedes/. */
  sede?: number | null;
  tag_car?: { id: number; tag: string; color?: string | null } | null;
  warranty?: boolean | null;
  warranty_type?: string | null;
  type_warranty?: string | null;
  garantie7Day?: boolean | null;
  factory_warranty_coverage?: string | null;
  quantityPersons?: number | null;
  /** Prefijo del stock ("CF") que va delante del id en "Stock ID". */
  type_negotiation?: string | null;
  claims?: boolean | null;
  /** Un JSON en texto (`["Menos cuantía"]`), a veces vacío o inválido. */
  types_claims?: string | null;
  amount_claims?: string | number | null;
  id_colserauto?: string | number | null;
  automas_pdf?: string | null;
  description_ai?: string | null;
  image_first?: string | null;
  image_first_srcset?: VehicleImageSrcsetDto[] | null;
  files?: VehicleFileDto[] | null;
  description_list?: VehicleDescriptionRowDto[] | null;
};

/** Un dato de la ficha ya listo para pintar: ícono, etiqueta y valor. */
export type VehicleFeature = {
  label: string;
  value: string;
  icon: StaticImageData;
};

/** Cómo se muestra la garantía. `null` = el vehículo no tiene. */
export type VehicleDetailWarranty = {
  /** Insignia sobre la tarjeta: "Garantía de 6 meses", "Garantía de fábrica"… */
  label: string;
  tone: VehicleWarrantyTone;
  /** Para la tarjeta de datos: "Por 6 meses", "De fábrica", "Por 1 año". */
  short: string;
  /** Título en el acordeón de garantías: "Garantía de 6 meses". */
  title: string;
  /** Viñeta de la tarjeta de resumen: "Garantía 6 meses". */
  bullet: string;
};

/**
 * De dónde sale el peritaje que se muestra en el visor: el PDF propio del vehículo, o `lookup`
 * (sin PDF): el servidor lo busca al abrir el visor, con la placa, que nunca sale de allí
 * (`services/expertise.ts`, `GET /api/peritaje/{id}`).
 */
export type VehicleExpertise =
  { kind: "pdf"; url: string } | { kind: "lookup" };

export type VehicleClaims = {
  /** "Si" / "No", tal como lo carga el equipo (o "No" si no hay dato). */
  reported: string;
  types: string[];
  /** Monto ya formateado ("$ 1.330.000") o `null`. */
  amount: string | null;
};

/** El vehículo de la ficha, normalizado. */
export type VehicleDetail = {
  id: number;
  /** Nombre en "Title Case": el backend lo manda en mayúsculas. */
  name: string;
  bodyType: string;
  year: number | null;
  mileage: string | null;
  transmission: "Automática" | "Manual";
  city: string;
  price: string;
  previousPrice: string | null;
  /** Lo que se cobra, en pesos, y el kilometraje: para los datos estructurados (JSON-LD). */
  priceValue: number;
  mileageValue: number | null;
  brand: string | null;
  /** "CF188747": el prefijo de negociación y el id, pegados (así lo mostraba el sitio anterior). */
  stockId: string;
  /** Personas que han visto el vehículo (`quantityPersons`), tal cual. */
  viewers: number;
  /** Etiqueta de estado. `id` 5 fuera de estándar, 7 reservado, 11 preventa. */
  tag: { id: number; name: string; color: string } | null;
  warranty: VehicleDetailWarranty | null;
  /** Garantía de felicidad: 7 días o 300 km para devolverlo. */
  happinessWarranty: boolean;
  images: VehicleImage[];
  engine: string | null;
  fuel: string | null;
  /** Último carácter de la placa (o `null`); la placa completa no sale del servidor. */
  plateEnd: string | null;
  claims: VehicleClaims;
  expertise: VehicleExpertise | null;
  aiDescription: string | null;
  /** Secciones del acordeón que salen del backend; solo las que tienen datos. */
  history: VehicleFeature[];
  characteristics: VehicleFeature[];
  safety: VehicleFeature[];
  equipment: VehicleFeature[];
  comments: string | null;
  href: string;
};
