import { apiUrl } from "@/modules/shared/services/api";

import type {
  AutomasDto,
  ExpertiseField,
  ExpertiseFinding,
  ExpertiseReport,
  ExpertiseResult,
} from "../types/expertise";
import type { VehicleDetailDto } from "../types/vehicle-detail";

const REVALIDATE_SECONDS = 60 * 60;

const numberFormat = new Intl.NumberFormat("es-CO", {
  maximumFractionDigits: 0,
});

/** "null", "none", "" y los espacios cuentan como vacío (el backend manda `"null"` en texto). */
function clean(value: string | number | null | undefined): string | null {
  if (value == null) return null;
  const text = String(value).trim();
  return text && !/^(null|none|undefined)$/i.test(text) ? text : null;
}

function toTitleCase(text: string): string {
  return text.toLowerCase().replace(/(^|\s)\S/g, (char) => char.toUpperCase());
}

function money(value: string | null | undefined): string | null {
  const amount = Number.parseFloat(value ?? "");
  return Number.isFinite(amount) && amount > 0
    ? `$ ${numberFormat.format(amount)}`
    : null;
}

function fields(entries: [string, string | null][]): ExpertiseField[] {
  return entries.flatMap(([label, value]) => (value ? [{ label, value }] : []));
}

/** Verde: sin novedad o bien reparado; amarillo: detalle leve; rojo: lo demás. */
function toneOf(state: string): ExpertiseFinding["tone"] {
  const text = state.toUpperCase();
  if (/BUENA|BIEN|ORIGINAL|SIN NOVEDAD|^OK$/.test(text)) return "good";
  if (/REGULAR|RAYON|RAYAD|LEVE|REPINTADO$|DEF\. MEDIA/.test(text))
    return "fair";
  return "bad";
}

/**
 * El certificado de Automás para la ficha. La placa se reduce a su último carácter y el
 * chasis, serial, motor, cliente e identificación ni se copian (regla del sitio: la placa nunca
 * completa y nada de datos personales, `docs/VER_PERITAJE.md` §3.5).
 */
export function toExpertiseReport(dto: AutomasDto): ExpertiseReport {
  const observations = (dto.observations ?? []).flatMap((entry) => {
    const text = clean(entry.descripcion);
    if (!text) return [];
    return text
      .split(/\s*;\s*|\s+-\s+/)
      .map((part) => part.replace(/^[.\s]+|[.\s]+$/g, ""))
      .filter(Boolean);
  });

  const photos = [
    ...new Set(
      [...(dto.images ?? []), ...(dto.photos ?? [])]
        .map((photo) => clean(photo.url))
        .filter((url): url is string => Boolean(url)),
    ),
  ];

  const findings = (dto.visual_inspection ?? []).flatMap((entry) => {
    const item = clean(entry.item);
    const state = clean(entry.estado) ?? clean(entry.description);
    if (!item || !state) return [];
    return [
      {
        item: toTitleCase(item),
        state: toTitleCase(state),
        tone: toneOf(state),
        note: clean(entry.observacion),
      },
    ];
  });

  const brand = clean(dto.brand);
  const line = clean(dto.type);
  const plate = clean(dto.plate);
  const mileage =
    dto.mileage != null ? `${numberFormat.format(dto.mileage)} Km` : null;

  return {
    inspectionNumber: clean(dto.inspection_number) ?? "—",
    date: clean(dto.date),
    center: clean(dto.inspection_center),
    plate: plate ? `••••••${plate.slice(-1)}` : "••••••",
    title: toTitleCase([brand, line].filter(Boolean).join(" ")) || "Vehículo",
    details: fields([
      ["Clase", clean(dto.car_class) && toTitleCase(clean(dto.car_class)!)],
      ["Modelo", clean(dto.model)],
      ["Color", clean(dto.color) && toTitleCase(clean(dto.color)!)],
      ["Kilometraje", mileage],
      [
        "Caja",
        clean(dto.gearbox_type) && toTitleCase(clean(dto.gearbox_type)!),
      ],
      [
        "Combustible",
        clean(dto.fuel_type) && toTitleCase(clean(dto.fuel_type)!),
      ],
      [
        "Cilindraje",
        clean(dto.engine_capacity)
          ? `${numberFormat.format(Number.parseFloat(dto.engine_capacity!))} cc`
          : null,
      ],
      ["Código Fasecolda", clean(dto.fasecolda_code)],
    ]),
    values: fields([
      ["Valor Fasecolda", money(dto.fasecolda_value)],
      ["Valor de mercado", money(dto.market_value)],
      ["Valor de accesorios", money(dto.accessory_value)],
      ["Valor Automás", money(dto.author_value)],
    ]),
    accessories: (dto.accessories ?? []).flatMap((accessory) => {
      const description = clean(accessory.description);
      return description ? [toTitleCase(description)] : [];
    }),
    findings,
    observations,
    photos,
  };
}

async function getVehicleDto(id: number): Promise<VehicleDetailDto | null> {
  const url = apiUrl(`/cars/${id}/`);
  const response = await fetch(url, {
    next: { revalidate: REVALIDATE_SECONDS },
  });
  if (!response.ok) return null;
  return response.json();
}

/** `GET /get-car-automas/{placa}/`: `null` si no hay peritaje (404, vacío o cualquier fallo). */
async function getAutomas(plate: string): Promise<AutomasDto | null> {
  try {
    const response = await fetch(
      apiUrl(`/get-car-automas/${encodeURIComponent(plate)}/`),
      { next: { revalidate: REVALIDATE_SECONDS } },
    );
    if (!response.ok) return null;
    const data: AutomasDto = JSON.parse(
      (await response.text()).replace(/\b(NaN|-?Infinity)\b/g, "null"),
    );
    return clean(data.inspection_number) || clean(data.plate) ? data : null;
  } catch {
    return null;
  }
}

/** Imagen del peritaje de Colserauto: solo si el backend la genera (`GET /create-image-colserauto/{id}/`). */
async function hasColserautoImage(colserautoId: string): Promise<boolean> {
  try {
    const response = await fetch(
      apiUrl(`/create-image-colserauto/${colserautoId}/`),
      {
        method: "HEAD",
      },
    );
    if (response.ok) return true;
    // Si no admite HEAD se prueba con GET.
    if (response.status !== 405) return false;
    return (await fetch(apiUrl(`/create-image-colserauto/${colserautoId}/`)))
      .ok;
  } catch {
    return false;
  }
}

/**
 * El peritaje de un vehículo sin PDF propio, con la misma prioridad del sitio anterior
 * (`docs/VER_PERITAJE.md` §1.2): Automás por placa y, si no hay, la imagen de Colserauto por su
 * id. La placa se usa aquí, en el servidor, y no viaja al navegador.
 * TODO(peritaje): falta el último recurso del sitio anterior, el informe de Colserauto por
 * placa (`POST /v2/colserauto/inspeccion/`); no había placas de prueba que lo devuelvan para
 * confirmar su forma.
 */
export async function getExpertise(id: number): Promise<ExpertiseResult> {
  const dto = await getVehicleDto(id);
  if (!dto) return { kind: "none" };

  const plate = dto.tuition?.trim();
  if (plate) {
    const automas = await getAutomas(plate);
    if (automas) return { kind: "report", report: toExpertiseReport(automas) };
  }

  const colserautoId =
    dto.id_colserauto != null ? String(dto.id_colserauto).trim() : "";
  if (colserautoId && (await hasColserautoImage(colserautoId)))
    return {
      kind: "image",
      url: apiUrl(`/create-image-colserauto/${colserautoId}/`),
    };

  return { kind: "none" };
}
