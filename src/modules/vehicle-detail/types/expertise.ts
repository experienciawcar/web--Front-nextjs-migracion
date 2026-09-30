/** Un dato rotulado del peritaje ("Marca", "JEEP"). */
export type ExpertiseField = { label: string; value: string };

/** Una pieza revisada en la inspección visual y cómo salió. */
export type ExpertiseFinding = {
  item: string;
  state: string;
  tone: "good" | "fair" | "bad";
  note: string | null;
};

/** El certificado de Automás ya listo para pintar (sin datos sensibles). */
export type ExpertiseReport = {
  inspectionNumber: string;
  date: string | null;
  center: string | null;
  /** "••••••7": solo el último carácter de la placa. */
  plate: string;
  title: string;
  details: ExpertiseField[];
  values: ExpertiseField[];
  accessories: string[];
  findings: ExpertiseFinding[];
  observations: string[];
  photos: string[];
};

/** Lo que responde `GET /api/peritaje/{id}` cuando el vehículo no trae PDF. */
export type ExpertiseResult =
  | { kind: "report"; report: ExpertiseReport }
  | { kind: "image"; url: string }
  | { kind: "none" };

/** Respuesta cruda de `GET /get-car-automas/{placa}/` (solo lo que se usa). */
export type AutomasDto = {
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
