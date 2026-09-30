import { apiUrl } from "@/modules/shared/services/api";

import type {
  AutomasDto,
  ExpertiseCategory,
  ExpertiseNoveltyGroup,
  ExpertiseReport,
  ExpertiseResult,
  ExpertiseTone,
} from "../types/expertise";
import { getColserautoReport } from "./colserauto";
import type { VehicleDetailDto } from "../types/vehicle-detail";

const REVALIDATE_SECONDS = 60 * 60;

const DASH = "—";
const MASK = "••••••";

const numberFormat = new Intl.NumberFormat("es-CO", {
  maximumFractionDigits: 0,
});

/** "null", "none", "" y los espacios cuentan como vacío (el backend manda `"null"` en texto). */
function clean(value: string | number | null | undefined): string | null {
  if (value == null) return null;
  const text = String(value).trim();
  return text && !/^(null|none|undefined)$/i.test(text) ? text : null;
}

/** Mayúsculas sin tildes, para comparar textos del backend ("REPARACIÓN" y "REPARACION"). */
function normalize(value: string | null | undefined): string {
  return (clean(value) ?? "")
    .toUpperCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

function sentence(value: string | null | undefined): string {
  const text = (clean(value) ?? "").toLowerCase();
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function toTitleCase(value: string | null | undefined): string {
  return (clean(value) ?? "")
    .toLowerCase()
    .replace(/(^|[\s/(-])([a-záéíóúñ])/g, (_, before: string, char: string) => before + char.toUpperCase());
}

function toNumber(value: string | number | null | undefined): number | null {
  const text = clean(value);
  if (text == null) return null;
  const amount =
    typeof value === "number" ? value : Number(text.replace(/[^\d.-]/g, ""));
  return Number.isFinite(amount) ? amount : null;
}

function money(value: string | number | null | undefined, fallback = DASH): string {
  const amount = toNumber(value);
  return amount == null ? fallback : `$ ${numberFormat.format(amount)}`;
}

/** "2026-09-28" → "2026 / 09 / 28"; "28-Sep-2026" para el campo de detalle. */
function dateParts(value: string | null | undefined) {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(clean(value) ?? "");
  return match ? { year: match[1], month: match[2], day: match[3] } : null;
}

const MONTHS = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

function slashDate(value: string | null | undefined): string {
  const parts = dateParts(value);
  return parts ? `${parts.year} / ${parts.month} / ${parts.day}` : (clean(value) ?? DASH);
}

function shortDate(value: string | null | undefined): string {
  const parts = dateParts(value);
  return parts
    ? `${Number(parts.day)}-${MONTHS[Number(parts.month) - 1] ?? parts.month}-${parts.year}`
    : (clean(value) ?? DASH);
}

/** El dato existe pero no se muestra (chasis, serial, motor, cliente, identificación). */
function hidden(value: string | null | undefined): string {
  return clean(value) ? MASK : DASH;
}

function lastChar(value: string | null | undefined): string {
  return normalize(value).replace(/\s+/g, "").slice(-1) || DASH;
}

function insurable(value: boolean | string | null | undefined): "yes" | "no" | "unknown" {
  if (value === true) return "yes";
  if (value === false) return "no";
  const text = normalize(typeof value === "string" ? value : null);
  if (/^(SI|TRUE|1|ASEGURABLE)$/.test(text)) return "yes";
  if (/^(NO|FALSE|0)$/.test(text)) return "no";
  return "unknown";
}

/** Cada pieza cae en la primera categoría (por prioridad) cuyo patrón encaje; lo demás es carrocería. */
const CATEGORIES: {
  title: string;
  icon: ExpertiseCategory["icon"];
  match: RegExp;
  priority: number;
  empty: string;
}[] = [
  {
    title: "Estructura",
    icon: "structure",
    match: /PARAL|CHASIS|ESTRUCTURA|LARGUERO|BASTIDOR|MONOCASCO|TORRE|COLISION|CHOQUE/,
    priority: 2,
    empty: "No se reportan novedades estructurales",
  },
  {
    title: "Carrocería - Exterior",
    icon: "bodywork",
    match: /.*/,
    priority: 99,
    empty: "No se reportan novedades de carrocería",
  },
  {
    title: "Pintura",
    icon: "paint",
    match: /IMPUREZA|PIEL DE NARANJA|LIJADO|PINTURA|BRILLO|DESCASCAR|CASCARA|BARNIZ/,
    priority: 1,
    empty: "No se reportan novedades de pintura",
  },
  {
    title: "Fuga de fluidos",
    icon: "fluids",
    match: /FUGA|FLUIDO|ACEITE|REFRIGERANT|LIQUIDO|LUBRICANTE|HIDRAULIC/,
    priority: 0,
    empty: "No se reportan fugas",
  },
];

const BY_PRIORITY = [...CATEGORIES].sort((a, b) => a.priority - b.priority);

function categoryOf(item: string) {
  const text = normalize(item);
  return BY_PRIORITY.find((category) => category.match.test(text)) ?? CATEGORIES[1];
}

/** 2 = requiere atención, 1 = leve (lo que no se reconoce), 0 = sin novedad o bien reparado. */
function severityOf(state: string): 0 | 1 | 2 {
  const text = normalize(state);
  if (/^SI$|MALA REPARACION|MAL REPINTADO|MAL ENRASE|DESCUADRE|FISURA|ROTO|QUEBRAD|FALTANTE|OXIDO/.test(text)) return 2;
  if (/^NO$|NO APLICA|BUENA REPARACION|BIEN REPINTADO|ORIGINAL/.test(text)) return 0;
  return 1;
}

const TONES: Record<0 | 1 | 2, ExpertiseTone> = { 0: "good", 1: "fair", 2: "bad" };
const SEVERITY_LABELS: Record<0 | 1 | 2, [string, string]> = {
  2: ["requiere atención", "requieren atención"],
  1: ["leve", "leves"],
  0: ["reparada", "reparadas"],
};

function stateLabel(state: string): string {
  const text = normalize(state);
  if (text === "SI") return "Sí";
  if (text === "NO") return "No";
  return sentence(state);
}

/** Quita los separadores sueltos que trae el backend ("; ; .; TEXTO"). */
function cleanNote(text: string): string {
  return text
    .replace(/[;·]\s*(?=[;·.])/g, "")
    .replace(/^[\s;.·-]+/, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function joined(parts: (string | null | undefined)[], separator = " · "): string {
  return parts
    .map((part) => cleanNote(clean(part) ?? ""))
    .filter(Boolean)
    .join(separator);
}

function claims(value: boolean | string | null | undefined): string {
  if (value == null || value === false || clean(String(value)) == null)
    return "No reporta siniestros ante Fasecolda";
  if (value === true) return "Reporta siniestros ante Fasecolda";
  return /^(NO|0|FALSE|NINGUNO|SIN)/.test(normalize(String(value)))
    ? "No reporta siniestros ante Fasecolda"
    : `Reporta siniestros ante Fasecolda: ${clean(String(value))}`;
}

/**
 * El certificado de Automás para la ficha (`docs/VER_PERITAJE.md` §5.3). La placa se reduce a su
 * último carácter y el chasis, serial, motor, cliente e identificación salen enmascarados (regla
 * del sitio: la placa nunca completa y nada de datos personales, §3.5).
 */
export function toExpertiseReport(dto: AutomasDto): ExpertiseReport {
  const photos = [
    ...new Set(
      [...(dto.images ?? []), ...(dto.photos ?? [])]
        .map((photo) => clean(photo.url))
        .filter((url): url is string => Boolean(url)),
    ),
  ];

  const byCategory = new Map<string, ExpertiseNoveltyGroup["items"]>();
  for (const entry of dto.visual_inspection ?? []) {
    const item = clean(entry.item);
    const state = clean(entry.estado) ?? clean(entry.description);
    if (!item || !state) continue;
    const { title } = categoryOf(item);
    const severity = severityOf(state);
    byCategory.set(title, [
      ...(byCategory.get(title) ?? []),
      { part: sentence(item), state: stateLabel(state), tone: TONES[severity] },
    ]);
  }

  const severityByTone = { good: 0, fair: 1, bad: 2 } as const;
  const categories: ExpertiseCategory[] = CATEGORIES.map((category) => {
    const items = byCategory.get(category.title) ?? [];
    const levels = items.map((item) => severityByTone[item.tone]);
    const worst = Math.max(0, ...levels);
    return {
      label: category.title,
      icon: category.icon,
      tone: items.length === 0 ? "good" : worst >= 2 ? "bad" : "fair",
      summary:
        items.length === 0
          ? "SIN NOVEDADES"
          : `${items.length} ${items.length === 1 ? "NOVEDAD" : "NOVEDADES"}`,
      detail:
        items.length === 0
          ? category.empty
          : ([2, 1, 0] as const)
              .flatMap((level) => {
                const count = levels.filter((value) => value === level).length;
                const [one, many] = SEVERITY_LABELS[level];
                return count ? [`${count} ${count === 1 ? one : many}`] : [];
              })
              .join(" · "),
    };
  });

  const novelties = CATEGORIES.map((category) => ({
    title: category.title,
    items: byCategory.get(category.title) ?? [],
  })).filter((group) => group.items.length > 0);

  const mileage = toNumber(dto.mileage);
  const mileageText = mileage == null ? null : numberFormat.format(mileage);
  const engine = clean(dto.engine_capacity);

  const observations = joined(
    (dto.observations ?? []).map((entry) => {
      const kind = normalize(entry.tipo);
      const text = cleanNote(clean(entry.descripcion) ?? "");
      if (!text) return "";
      return kind && kind !== "RESULTADO" ? `${clean(entry.tipo)}: ${text}` : text;
    }),
    ". ",
  );

  return {
    record: clean(dto.acta) ?? clean(dto.inspection_number) ?? DASH,
    date: slashDate(dto.date),
    plate: lastChar(dto.plate),
    title: joined([toTitleCase(dto.brand), toTitleCase(dto.type)], " ") || "Vehículo",
    insurable: insurable(dto.insurable),
    summary: [
      joined([toTitleCase(dto.body_type), joined([toTitleCase(dto.car_class), clean(dto.model)], " ")]),
      joined([toTitleCase(dto.color), mileageText ? `${mileageText} Km` : ""]),
    ].filter(Boolean),
    service: [
      clean(dto.requested_service)
        ? `Servicio solicitado: ${sentence(dto.requested_service)}`
        : "",
      claims(dto.fasecolda_claims),
    ].filter(Boolean),
    photos: photos.slice(0, 3),
    annexPhotos: photos.slice(3),
    categories,
    novelties,
    totalNovelties: novelties.reduce((sum, group) => sum + group.items.length, 0),
    observations,
    accessories: (dto.accessories ?? []).map((accessory) => ({
      quantity: numberFormat.format(toNumber(accessory.quantity) ?? 1),
      description: toTitleCase(accessory.description) || DASH,
      brand: toTitleCase(accessory.brand) || null,
      value: money(accessory.value, "$ 0"),
    })),
    values: [
      { title: "VALOR AUTOMÁS", subtitle: "Avalúo del peritaje", value: money(dto.author_value, "$ 0") },
      { title: "VALOR FASECOLDA", subtitle: "Referencia oficial de mercado", value: money(dto.fasecolda_value, "$ 0") },
      { title: "VALOR ACCESORIOS", subtitle: "Suma de los accesorios registrados", value: money(dto.accessory_value, "$ 0") },
      {
        title: "VALOR MERCADO",
        subtitle: toNumber(dto.market_value) ? "Valor comercial estimado" : "No reportado en este peritaje",
        value: money(dto.market_value, "$ 0"),
      },
    ],
    type: normalize(joined([clean(dto.type), engine], " / ")) || DASH,
    details: [
      ["PLACA", lastChar(dto.plate)],
      ["MARCA", clean(dto.brand) ?? DASH],
      ["MODELO", clean(dto.model) ?? DASH],
      ["CLASE", toTitleCase(dto.car_class) || DASH],
      ["CARROCERÍA", toTitleCase(dto.body_type) || DASH],
      ["COLOR", toTitleCase(dto.color) || DASH],
      ["NACIONALIDAD", toTitleCase(dto.nationality) || DASH],
      ["N° CHASIS", hidden(dto.chassis_number)],
      ["N° SERIAL", hidden(dto.serial_number)],
      ["N° MOTOR", hidden(dto.engine)],
      ["CÓD. FASECOLDA", clean(dto.fasecolda_code) ?? DASH],
      ["CILINDRAJE", engine ? `${engine} cc` : DASH],
      ["TIPO CAJA", toTitleCase(dto.gearbox_type) || DASH],
      ["COMBUSTIBLE", toTitleCase(dto.fuel_type) || DASH],
      ["TIPO PINTURA", toTitleCase(dto.paint_type) || DASH],
      ["SERVICIO", toTitleCase(dto.service_type) || DASH],
      ["KILOMETRAJE", mileageText ? `${mileageText} km` : DASH],
      ["CLAVE", clean(dto.key) ?? DASH],
      ["N° INSPECCIÓN", clean(dto.inspection_number) ?? DASH],
      ["FECHA DE INSPECCIÓN", shortDate(dto.date)],
      ["CENTRO INSPECCIÓN", toTitleCase(dto.inspection_center) || DASH],
      ["TURNO", clean(dto.turn) ?? DASH],
      ["RESULTADO", sentence(dto.result) || DASH],
      ["SERVICIO SOLICITADO", sentence(dto.requested_service) || DASH],
      ["N° DE SERVICIO", clean(dto.service_number) ?? DASH],
      ["SOLICITADO POR", toTitleCase(dto.requested_by) || DASH],
      ["CLIENTE", hidden(dto.client)],
      ["IDENTIFICACIÓN", hidden(dto.identification)],
      ["ASEGURADORA", clean(dto.insurance_company) ?? DASH],
      ["ASEGURABLE", { yes: "Sí", no: "No", unknown: DASH }[insurable(dto.insurable)]],
      ["INTERMEDIARIO", clean(dto.intermediary) ?? DASH],
      ["SUCURSAL", clean(dto.branch) ?? DASH],
    ].map(([label, value]) => ({ label, value })),
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
 * (`docs/VER_PERITAJE.md` §1.2): Automás por placa, la imagen de Colserauto por su id y, como
 * último recurso, el informe de Colserauto por placa (`POST /v2/colserauto/inspeccion/`). La placa
 * se usa aquí, en el servidor, y no viaja al navegador.
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

  if (plate) {
    const colserauto = await getColserautoReport(plate);
    if (colserauto) return { kind: "colserauto", report: colserauto };
  }

  return { kind: "none" };
}
