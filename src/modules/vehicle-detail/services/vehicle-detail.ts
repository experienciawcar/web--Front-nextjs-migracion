import { vehicleHref } from "@/modules/shared/constants/routes";
import { apiUrl } from "@/modules/shared/services/api";
import {
  getWarranty,
  toImage,
  toVehicle,
} from "@/modules/shared/services/vehicles";
import type {
  Vehicle,
  VehicleDto,
  VehicleImage,
} from "@/modules/shared/types/vehicle";

import {
  CHARACTERISTIC_ICONS,
  CHARACTERISTIC_ITEMS,
  EQUIPMENT_ITEMS,
  EQUIPMENT_ORDER,
  HISTORY_ITEMS,
  HISTORY_ORDER,
  SAFETY_ITEMS,
  SAFETY_ORDER,
  TRACTION_LABELS,
  type FeatureDefinition,
} from "../constants/features";
import type {
  VehicleClaims,
  VehicleDescriptionRowDto,
  VehicleDetail,
  VehicleDetailDto,
  VehicleDetailWarranty,
  VehicleExpertise,
  VehicleFeature,
} from "../types/vehicle-detail";

/** Las fotos llevan URLs firmadas de 24 h (las variantes `srcset` no, pero el respaldo sí): una hora, como los demás servicios. */
const REVALIDATE_SECONDS = 60 * 60;

/** Cuántos vehículos relacionados se piden a la tarjeta (el backend manda decenas). */
const RELATED_LIMIT = 8;

const numberFormat = new Intl.NumberFormat("es-CO", {
  maximumFractionDigits: 0,
});

/** "HYUNDAI CRETA GLS 1.6 MT" → "Hyundai Creta Gls 1.6 Mt", como lo hacía el sitio anterior. */
function toTitleCase(text: string): string {
  return text
    .split(" ")
    .map((word) =>
      word ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase() : word,
    )
    .join(" ");
}

function formatMoney(amount: number): string {
  return `$ ${numberFormat.format(amount)}`;
}

function parseAmount(value: string | number | null | undefined): number {
  const amount =
    typeof value === "number" ? value : Number.parseFloat(value ?? "");
  return Number.isFinite(amount) && amount > 0 ? amount : 0;
}

/** "gasolina" → "A gasolina" (así se lee en el diseño); lo que no se conoce, con su mayúscula. */
function formatFuel(fuel: string | null | undefined): string | null {
  const value = fuel?.trim().toLowerCase();
  if (!value) return null;
  const labels: Record<string, string> = {
    gasolina: "A gasolina",
    diesel: "Diésel",
    diésel: "Diésel",
    gas: "A gas",
    electrico: "Eléctrico",
    eléctrico: "Eléctrico",
    hibrida: "Híbrido",
    hibrido: "Híbrido",
    híbrido: "Híbrido",
  };
  return labels[value] ?? value.charAt(0).toUpperCase() + value.slice(1);
}

function formatDate(value: string): string {
  const date = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("es-CO", {
    timeZone: "UTC",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/** Texto de la garantía para la tarjeta de datos y el acordeón. */
function toDetailWarranty(dto: VehicleDetailDto): VehicleDetailWarranty | null {
  const base = getWarranty(dto as VehicleDto);
  if (!base) return null;
  const copy = {
    standard: {
      short: "Por 6 meses",
      title: "Garantía de 6 meses",
      bullet: "Garantía 6 meses",
    },
    factory: {
      short: "De fábrica",
      title: "Garantía de fábrica",
      bullet: "Garantía de fábrica",
    },
    oneYear: {
      short: "Por 1 año",
      title: "Garantía de 1 año",
      bullet: "Garantía 1 año",
    },
  }[base.tone];
  return { label: base.label, tone: base.tone, ...copy };
}

/** Todas las fotos, la principal primero y sin repetir (la firma cambia en cada respuesta). */
function toImages(dto: VehicleDetailDto): VehicleImage[] {
  const images: VehicleImage[] = [];
  const seen = new Set<string>();
  const add = (image: VehicleImage | null) => {
    if (!image) return;
    const key = image.src.split("?")[0];
    if (seen.has(key)) return;
    seen.add(key);
    images.push(image);
  };
  add(toImage(dto.image_first_srcset, dto.image_first));
  for (const file of dto.files ?? [])
    add(toImage(file.image_srcset, file.image));
  return images;
}

/** Los `types_claims` llegan como un JSON en texto; si no se puede leer, no hay tipos. */
function parseClaimTypes(raw: string | null | undefined): string[] {
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    const list = Array.isArray(parsed) ? parsed : [parsed];
    return list
      .map((entry) => {
        if (typeof entry === "string") return entry.trim();
        if (entry && typeof entry === "object") {
          const record = entry as Record<string, unknown>;
          const text = record.name ?? record.type ?? record.label;
          return typeof text === "string" ? text.trim() : "";
        }
        return "";
      })
      .filter(Boolean);
  } catch {
    return [];
  }
}

function toRowMap(
  rows: VehicleDescriptionRowDto[] | null | undefined,
): Map<number, string> {
  const map = new Map<number, string>();
  for (const row of rows ?? []) {
    const value = row.content?.trim();
    if (value && !map.has(row.item)) map.set(row.item, value);
  }
  return map;
}

function toFeatures(
  order: number[],
  catalog: Record<number, FeatureDefinition>,
  values: Map<number, string>,
): VehicleFeature[] {
  const features: VehicleFeature[] = [];
  for (const item of order) {
    const definition = catalog[item];
    const value = values.get(item);
    if (!definition || !value) continue;
    features.push({
      label: definition.label,
      value: definition.kind === "date" ? formatDate(value) : value,
      icon: definition.icon,
    });
  }
  return features;
}

/** Datos de "Características": los del vehículo mismo, con lo que cargue el equipo encima. */
function toCharacteristics(
  dto: VehicleDetailDto,
  bodyType: string,
  transmission: string,
  values: Map<number, string>,
): VehicleFeature[] {
  const isMotorcycle = values.has(46);
  const traction =
    dto.traction != null ? TRACTION_LABELS[dto.traction] : undefined;
  const candidates: {
    label: string;
    value: string | null | undefined;
    icon: VehicleFeature["icon"];
  }[] = [
    {
      label: "Cilindraje",
      value: values.get(43) ?? dto.engine,
      icon: CHARACTERISTIC_ICONS.engine,
    },
    {
      label: "Tipo de combustible",
      value: values.get(44) ?? formatFuel(dto.fuel_type),
      icon: CHARACTERISTIC_ICONS.fuel,
    },
    {
      label: "Tipo de caja",
      value: values.get(45) ?? transmission,
      icon: CHARACTERISTIC_ICONS.transmission,
    },
    {
      label: "Tipo de motocicleta",
      value: values.get(46),
      icon: CHARACTERISTIC_ICONS.bodyType,
    },
    {
      label: "Tipo de vehículo",
      value: isMotorcycle ? null : bodyType,
      icon: CHARACTERISTIC_ICONS.bodyType,
    },
    {
      label: "Chasis de motocicleta",
      value: values.get(47),
      icon: CHARACTERISTIC_ICONS.traction,
    },
    {
      label: CHARACTERISTIC_ITEMS[8].label,
      value: isMotorcycle ? null : values.get(8),
      icon: CHARACTERISTIC_ITEMS[8].icon,
    },
    {
      label: CHARACTERISTIC_ITEMS[7].label,
      value: values.get(7),
      icon: CHARACTERISTIC_ITEMS[7].icon,
    },
    {
      label: "Tracción",
      value: isMotorcycle ? null : traction,
      icon: CHARACTERISTIC_ICONS.traction,
    },
  ];
  return candidates.flatMap((c) =>
    c.value ? [{ label: c.label, value: c.value, icon: c.icon }] : [],
  );
}

function toClaims(
  dto: VehicleDetailDto,
  values: Map<number, string>,
): VehicleClaims {
  const amount = parseAmount(dto.amount_claims) || parseAmount(values.get(6));
  return {
    reported: values.get(2) ?? (dto.claims ? "Si" : "No"),
    types: parseClaimTypes(dto.types_claims),
    amount: amount ? formatMoney(amount) : null,
  };
}

/**
 * Con `automas_pdf` el visor muestra ese PDF. Sin él, la fuente se decide al abrir el visor, en
 * el servidor (`getExpertise`): Automás por placa, luego la imagen de Colserauto por su id.
 */
function toExpertise(dto: VehicleDetailDto): VehicleExpertise {
  return dto.automas_pdf
    ? { kind: "pdf", url: dto.automas_pdf }
    : { kind: "lookup" };
}

/** El vehículo del backend como lo pinta la ficha; `null` si no se puede mostrar (inactivo, sin precio o sin fotos). */
export function toVehicleDetail(dto: VehicleDetailDto): VehicleDetail | null {
  const listPrice = parseAmount(dto.price);
  const discountPrice = parseAmount(dto.discount_price);
  const images = toImages(dto);
  if (
    !dto.car?.trim() ||
    listPrice === 0 ||
    images.length === 0 ||
    dto.active === false
  )
    return null;

  const hasDiscount = discountPrice > 0 && discountPrice < listPrice;
  const bodyType = dto.type?.type?.trim() || dto.body_type?.trim() || "";
  const name = toTitleCase(dto.car.trim());
  const transmission = dto.transmission === 1 ? "Automática" : "Manual";
  const values = toRowMap(dto.description_list);
  const plate = dto.tuition?.trim();

  return {
    id: dto.id,
    name,
    bodyType,
    year: dto.year || null,
    mileage:
      dto.mileage != null ? `${numberFormat.format(dto.mileage)} Km` : null,
    transmission,
    city: dto.sede_car?.name?.trim() || "Bogotá",
    price: formatMoney(hasDiscount ? discountPrice : listPrice),
    previousPrice: hasDiscount ? formatMoney(listPrice) : null,
    priceValue: hasDiscount ? discountPrice : listPrice,
    mileageValue: dto.mileage ?? null,
    brand: dto.brand_car?.brand?.trim() || null,
    stockId: `${dto.type_negotiation ?? ""}${dto.id}`,
    viewers: dto.quantityPersons ?? 0,
    tag:
      dto.tag_car && dto.tag_car.id !== 6 && dto.tag_car.tag
        ? {
            id: dto.tag_car.id,
            name: dto.tag_car.tag,
            color: dto.tag_car.color || "#000000",
          }
        : null,
    warranty: toDetailWarranty(dto),
    happinessWarranty: Boolean(dto.garantie7Day),
    images,
    engine: dto.engine?.trim() || null,
    fuel: formatFuel(dto.fuel_type),
    plateEnd: plate ? plate.slice(-1) : null,
    claims: toClaims(dto, values),
    expertise: toExpertise(dto),
    aiDescription: dto.description_ai?.trim() || null,
    history: toFeatures(HISTORY_ORDER, HISTORY_ITEMS, values),
    characteristics: toCharacteristics(dto, bodyType, transmission, values),
    safety: toFeatures(SAFETY_ORDER, SAFETY_ITEMS, values),
    equipment: toFeatures(EQUIPMENT_ORDER, EQUIPMENT_ITEMS, values),
    comments:
      dto.description_list?.find((row) => row.list === 5)?.content?.trim() ||
      null,
    href: vehicleHref({ id: dto.id, type: bodyType, name }),
  };
}

/**
 * Un vehículo por su id (GET /cars/{id}/). Devuelve `null` si no existe, está
 * inactivo o no se puede pintar: la página responde 404 (el sitio anterior lo
 * mandaba al inicio, lo que esconde el error a los buscadores). Cualquier otro
 * fallo del backend lanza: así el error no se queda cacheado como si el
 * vehículo no existiera.
 */
export async function getVehicleDetail(
  id: number,
): Promise<VehicleDetail | null> {
  const url = apiUrl(`/cars/${id}/`);
  const response = await fetch(url, {
    next: { revalidate: REVALIDATE_SECONDS },
  });
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`GET ${url} respondió ${response.status}`);
  const dto: VehicleDetailDto = await response.json();
  return toVehicleDetail(dto);
}

/**
 * Vehículos relacionados (GET /cars-related/{id}/, con barra final: sin ella el
 * backend redirige). Devuelve las mismas tarjetas del catálogo. Si falla, `[]` y
 * la sección no se pinta.
 * Este es el endpoint que usaba el carrusel "Vehículos relacionados" del sitio
 * anterior; el otro (`POST /v2/brands`) no se usa (`docs/DETALLE_VEHICULO.md` §7.20-21).
 */
export async function getRelatedVehicles(id: number): Promise<Vehicle[]> {
  const url = apiUrl(`/cars-related/${id}/`);
  try {
    const response = await fetch(url, {
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (!response.ok)
      throw new Error(`GET ${url} respondió ${response.status}`);
    const list: VehicleDto[] = await response.json();
    const vehicles: Vehicle[] = [];
    for (const dto of list) {
      if (dto.id === id) continue;
      const vehicle = toVehicle(dto);
      if (vehicle) vehicles.push(vehicle);
      if (vehicles.length === RELATED_LIMIT) break;
    }
    return vehicles;
  } catch (error) {
    console.error("No se pudieron cargar los vehículos relacionados:", error);
    return [];
  }
}
