import { vehicleHref } from "../constants/routes";
import type {
  Vehicle,
  VehicleDto,
  VehicleImage,
  VehicleImageSrcsetDto,
  VehicleWarrantyTone,
} from "../types/vehicle";
import { apiUrl } from "./api";
import { calculateMonthlyPayment } from "./loan-calculator";

/**
 * Cada cuánto se vuelven a pedir los vehículos. Las URLs firmadas de las fotos
 * caducan a las 24 h y quedan dentro de la página cacheada (la tarjeta usa las
 * variantes sin firma del backend, pero `image` de la galería sí va firmada), así
 * que tiene que ser bastante menos: una hora, como los demás servicios.
 */
const REVALIDATE_SECONDS = 60 * 60;

/** Fotos que se llevan por tarjeta: la principal y hasta cuatro más (una raya por foto). */
const MAX_IMAGES = 5;

/** Ancho al que se pide la foto cuando el navegador no elige otra (`src`). */
const DEFAULT_IMAGE_WIDTH = 480;

/**
 * Plazo y cuota inicial de la cuota estimada que muestra la tarjeta
 * ("$X / Mes", Figma "Destacados del Catálogo"). El diseño trae un ejemplo de
 * cada uno con una cifra distinta ($3.941.000 para un carro de $94.990.000 Y
 * para uno de $194.990.000): no cuadran entre sí, así que son ilustrativos y
 * no una cuota real. Se usan el plazo y la cuota inicial que ya estaban
 * documentados para esta calculadora en el resto del sitio.
 * TODO: confirmar con negocio el plazo, la cuota inicial y si esta cuota debe
 * ir en la tarjeta.
 */
const LOAN_TERM_MONTHS = 60;
const DOWN_PAYMENT_RATIO = 0.3;

const numberFormat = new Intl.NumberFormat("es-CO", { maximumFractionDigits: 0 });

/** "$ 61.990.000": con un espacio después del signo, como en el sitio anterior. */
function formatPrice(amount: number): string {
  return `$ ${numberFormat.format(amount)}`;
}

/** Un precio del backend ("41990000.00") como número; 0 si falta o no es válido. */
function parsePrice(value: string | null | undefined): number {
  const amount = Number.parseFloat(value ?? "");
  return Number.isFinite(amount) && amount > 0 ? amount : 0;
}

/**
 * Cobertura de la garantía según los dos campos que la traen, con las mismas
 * reglas del sitio anterior: `warranty_type` manda sobre `type_warranty`; sin
 * cobertura reconocible es la de 6 meses, que es la estándar de WCAR. Devuelve
 * `null` si el vehículo no tiene garantía.
 *
 * Los valores llegan con ruido ("on", "null"): no se muestran, caen en la de 6
 * meses.
 */
function getWarranty(dto: VehicleDto): Vehicle["warranty"] {
  const coverage = dto.warranty_type || dto.type_warranty || "";
  const hasCoverage = coverage !== "" && coverage !== "null";
  if (!(dto.warranty || hasCoverage || dto.garantie7Day)) return null;

  const tones: Record<string, { label: string; tone: VehicleWarrantyTone }> = {
    "Garantía de marca o km": { label: "Garantía de fábrica", tone: "factory" },
    "Garantía de fábrica": { label: "Garantía de fábrica", tone: "factory" },
    "Garantía por 1 año": { label: "Garantía 1 año", tone: "oneYear" },
  };
  return tones[coverage] ?? { label: "Garantía de 6 meses", tone: "standard" };
}

/** La variante más cercana al ancho por defecto, que es la que va en `src`. */
function pickDefault(variants: VehicleImageSrcsetDto[]): VehicleImageSrcsetDto {
  return variants.reduce((best, item) =>
    Math.abs(item.w - DEFAULT_IMAGE_WIDTH) < Math.abs(best.w - DEFAULT_IMAGE_WIDTH) ? item : best,
  );
}

/**
 * Una foto con su `srcset`. Se prefieren las variantes del backend
 * (`/api/v2/img/<ancho>/…`): son URLs estables, sin firma, a seis tamaños, así
 * que el navegador baja la de 320 px en una pantalla chica en vez de la de 1200.
 * Si no las hay se cae a la URL firmada, sin `srcset`.
 */
function toImage(
  variants: VehicleImageSrcsetDto[] | null | undefined,
  signedUrl: string | null | undefined,
): VehicleImage | null {
  const valid = (variants ?? []).filter((item) => item.url && item.w > 0);
  if (valid.length > 0) {
    const sorted = [...valid].sort((a, b) => a.w - b.w);
    return {
      src: pickDefault(sorted).url,
      srcSet: sorted.map((item) => `${item.url} ${item.w}w`).join(", "),
    };
  }
  return signedUrl ? { src: signedUrl } : null;
}

/** Fotos del vehículo: la principal primero y luego la galería, sin repetir, hasta `MAX_IMAGES`. */
function toImages(dto: VehicleDto): VehicleImage[] {
  const images: VehicleImage[] = [];
  const seen = new Set<string>();

  const add = (image: VehicleImage | null) => {
    if (!image) return;
    // Se compara sin el query string: la firma cambia en cada respuesta.
    const key = image.src.split("?")[0];
    if (seen.has(key)) return;
    seen.add(key);
    images.push(image);
  };

  add(toImage(dto.image_first_srcset, dto.image_first));
  for (const file of dto.files ?? []) add(toImage(file.image_srcset, file.image));

  return images.slice(0, MAX_IMAGES);
}

/** Convierte un vehículo del backend en el que pinta la tarjeta; `null` si no se puede mostrar. */
function toVehicle(dto: VehicleDto): Vehicle | null {
  const name = dto.car?.trim();
  const listPrice = parsePrice(dto.price);
  const discountPrice = parsePrice(dto.discount_price);
  const images = toImages(dto);

  // Sin nombre, sin precio o sin foto no hay tarjeta que valga.
  if (!name || listPrice === 0 || images.length === 0 || dto.active === false) return null;

  const hasDiscount = discountPrice > 0 && discountPrice < listPrice;
  const bodyType = dto.type?.type?.trim() ?? "";
  const finalPrice = hasDiscount ? discountPrice : listPrice;

  return {
    id: dto.id,
    name,
    bodyType,
    year: dto.year || null,
    mileage: dto.mileage != null ? `${numberFormat.format(dto.mileage)} Km.` : null,
    transmission: dto.transmission === 1 ? "Automática" : "Manual",
    city: dto.sede_car?.name?.trim() || "Bogotá",
    price: formatPrice(finalPrice),
    previousPrice: hasDiscount ? formatPrice(listPrice) : null,
    // Sin descuento la tarjeta muestra esta cuota en vez del precio tachado.
    monthlyPayment: hasDiscount
      ? null
      : formatPrice(calculateMonthlyPayment(finalPrice, finalPrice * DOWN_PAYMENT_RATIO, LOAN_TERM_MONTHS)),
    // "Disponible" (id 6) es el estado normal: no se rotula.
    tag:
      dto.tag_car && dto.tag_car.id !== 6 && dto.tag_car.tag
        ? { name: dto.tag_car.tag, color: dto.tag_car.color || "#000000" }
        : null,
    warranty: getWarranty(dto),
    viewers: dto.quantityPersons ?? 0,
    images,
    href: vehicleHref({ id: dto.id, type: bodyType, name }),
  };
}

/**
 * Vehículos destacados del catálogo (GET /api/cars/): los primeros de la lista
 * tal como los entrega el backend (los más recientes primero), sin los que no
 * se pueden pintar (sin precio ni foto).
 *
 * El backend no tiene un campo "destacado", así que no hay forma de que
 * comercial escoja cuáles se muestran. El sitio anterior tampoco: su carrusel
 * del inicio era esta misma lista.
 * TODO: confirmar con negocio el criterio (¿con descuento? ¿los más vistos?) y,
 * si hace falta, pedirle al backend un `featured`.
 *
 * Si el backend falla devuelve una lista vacía y la sección no se pinta: la
 * página de inicio no puede caerse por esto. El error queda en el log.
 */
export async function getFeaturedVehicles(limit = 8): Promise<Vehicle[]> {
  const url = apiUrl("/cars/");

  try {
    const response = await fetch(url, { next: { revalidate: REVALIDATE_SECONDS } });
    if (!response.ok) {
      throw new Error(`GET ${url} respondió ${response.status}`);
    }
    const page: { results?: VehicleDto[] } = await response.json();
    const vehicles: Vehicle[] = [];
    for (const dto of page.results ?? []) {
      const vehicle = toVehicle(dto);
      if (vehicle) vehicles.push(vehicle);
      if (vehicles.length === limit) break;
    }
    return vehicles;
  } catch (error) {
    console.error("No se pudieron cargar los vehículos destacados:", error);
    return [];
  }
}
