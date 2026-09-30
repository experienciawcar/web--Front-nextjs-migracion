/** Un dato rotulado del peritaje ("MARCA", "BMW"). */
export type ExpertiseField = { label: string; value: string };

/** Semáforo de una pieza o de una categoría: verde, amarillo (leve) o rojo (requiere atención). */
export type ExpertiseTone = "good" | "fair" | "bad";

/** Una de las 4 filas del "Diagnóstico de inspección" (siempre están las cuatro). */
export type ExpertiseCategory = {
  label: string;
  icon: "structure" | "bodywork" | "paint" | "fluids";
  tone: ExpertiseTone;
  /** "3 NOVEDADES" o "SIN NOVEDADES". */
  summary: string;
  /** "1 leve · 2 reparadas" o el texto de "sin novedades". */
  detail: string;
};

/** Las piezas con novedad de una categoría, en "Novedades encontradas". */
export type ExpertiseNoveltyGroup = {
  title: string;
  items: { part: string; state: string; tone: ExpertiseTone }[];
};

export type ExpertiseAccessory = {
  quantity: string;
  description: string;
  brand: string | null;
  value: string;
};

export type ExpertiseValue = { title: string; subtitle: string; value: string };

/**
 * El certificado de Automás ya listo para pintar (sin datos sensibles): la placa es solo su
 * último carácter y chasis, serial, motor, cliente e identificación salen como "••••••".
 */
export type ExpertiseReport = {
  /** Número de acta (o de inspección). */
  record: string;
  /** "2026 / 09 / 28". */
  date: string;
  plate: string;
  title: string;
  insurable: "yes" | "no" | "unknown";
  /** Líneas bajo el título: "Automovil 2020", "Gris Metalizado · 74.342 Km". */
  summary: string[];
  /** "No reporta siniestros ante Fasecolda". */
  service: string[];
  /** Las 3 fotos de la portada y el resto, para el anexo fotográfico. */
  photos: string[];
  annexPhotos: string[];
  categories: ExpertiseCategory[];
  novelties: ExpertiseNoveltyGroup[];
  totalNovelties: number;
  observations: string;
  accessories: ExpertiseAccessory[];
  values: ExpertiseValue[];
  /** "118I F40 SPORT LINE TP 1500CC T CT / 1499.00". */
  type: string;
  details: ExpertiseField[];
};

export type ColserautoSpec = { name: string; on: boolean; extra: string };

/**
 * El informe de Colserauto ya listo para pintar (`POST /v2/colserauto/inspeccion/`). La placa se
 * reduce a su último carácter y VIN, chasis, motor y serie también (como en el sitio de referencia).
 */
export type ColserautoReport = {
  inspectionNumber: string;
  date: string;
  servicePackage: string;
  insurable: boolean;
  plate: string;
  /** Promedio de los resultados de inspección (0-100) o `null` si no hay ninguno. */
  score: number | null;
  meta: ExpertiseField[];
  vehicleHeading: string;
  vehicleRows: ExpertiseField[];
  identifiers: ExpertiseField[];
  specsBar: ExpertiseField[];
  results: { system: string; percent: number | null }[];
  specs: ColserautoSpec[];
  accessories: { name: string; exists: boolean | null; existsLabel: string; value: string }[];
  regulatory: { type: string; ok: boolean; date: string }[];
  fasecolda: { code: string; nationality: string; description: string; value: string };
  appraisal: { commercial: string; bodyDeduction: string; otherDeduction: string; final: string };
  claims: { label: string; value: string; ok: boolean }[];
  claimDetails: { type: string; date: string; value: string; note: string }[];
  background: { code: string; description: string }[];
};

/** Lo que responde `GET /api/peritaje/{id}` cuando el vehículo no trae PDF. */
export type ExpertiseResult =
  | { kind: "report"; report: ExpertiseReport }
  | { kind: "colserauto"; report: ColserautoReport }
  | { kind: "image"; url: string }
  | { kind: "none" };

/** Respuesta cruda de `GET /get-car-automas/{placa}/` (solo lo que se usa). */
export type AutomasDto = {
  body_type?: string | null;
  nationality?: string | null;
  paint_type?: string | null;
  service_type?: string | null;
  chassis_number?: string | null;
  serial_number?: string | null;
  engine?: string | null;
  client?: string | null;
  identification?: string | null;
  insurance_company?: string | null;
  insurable?: boolean | string | null;
  intermediary?: string | null;
  branch?: string | null;
  key?: string | null;
  turn?: string | null;
  result?: string | null;
  requested_by?: string | null;
  requested_service?: string | null;
  service_number?: string | null;
  fasecolda_claims?: boolean | string | null;
  acta?: string | null;
  car_class?: string | null;
  brand?: string | null;
  type?: string | null;
  model?: string | null;
  gearbox_type?: string | null;
  engine_capacity?: string | null;
  fuel_type?: string | null;
  mileage?: number | null;
  color?: string | null;
  inspection_number?: string | null;
  date?: string | null;
  inspection_center?: string | null;
  plate?: string | null;
  market_value?: string | null;
  author_value?: string | null;
  accessory_value?: string | null;
  fasecolda_code?: string | null;
  fasecolda_value?: string | null;
  accessories?:
    | {
        brand?: string | null;
        description?: string | null;
        quantity?: number | null;
        value?: string | null;
      }[]
    | null;
  images?: { url?: string | null }[] | null;
  photos?: { url?: string | null }[] | null;
  visual_inspection?:
    | {
        item?: string | null;
        estado?: string | null;
        description?: string | null;
        observacion?: string | null;
      }[]
    | null;
  observations?: { tipo?: string | null; descripcion?: string | null }[] | null;
};
