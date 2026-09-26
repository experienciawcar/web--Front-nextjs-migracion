import { ROUTES } from "../constants/routes";
import type { TypeCarDto, VehicleType } from "../types/vehicle-types";
import { apiUrl } from "./api";

/**
 * Cada cuánto se vuelven a pedir los tipos. Las fotos son URLs firmadas que
 * caducan a las 24 h (X-Goog-Expires=86400) y quedan dentro de la página
 * cacheada, así que tiene que ser bastante menos: con una hora hay margen. El
 * contador de vehículos también se refresca con esa frecuencia; el sitio
 * anterior lo pedía en cada visita.
 */
const REVALIDATE_SECONDS = 60 * 60;

/**
 * Página de categoría de cada tipo, por id del backend. Son las mismas del
 * sitio anterior, donde se armaban con una cadena de ternarios anidados. Un
 * tipo que no esté aquí (hoy Vans, id 22) va al listado general filtrado.
 *
 * Ojo, dos slugs vienen tal cual del sitio anterior: "carros-devortivos" es un
 * typo de "deportivos" y "carros-híbridos-colombia" lleva tilde. Se dejan así
 * porque son URLs vivas con posicionamiento; si se corrigen en las páginas
 * nuevas, se cambia aquí y se redirige la vieja. Los ids 4 y 14 no los
 * devuelve el backend hoy.
 */
const CATEGORY_SLUGS: Record<number, string> = {
  2: "camionetas-usadas",
  3: "carros-sedan-usados",
  4: "carros-híbridos-colombia",
  6: "hatchback-colombia",
  8: "camionetas-usadas",
  12: "carros-coupe",
  13: "carros-pickup",
  14: "carros-devortivos",
  18: "motocicleta",
};

function toVehicleType(dto: TypeCarDto): VehicleType {
  const name = dto.type.trim();
  const slug = CATEGORY_SLUGS[dto.id];
  const path = slug ? `${ROUTES.buyCar}/${encodeURIComponent(slug)}` : ROUTES.buyCar;

  return {
    id: dto.id,
    name,
    count: dto.car_count ?? 0,
    imageUrl: dto.image || null,
    // El nombre puede llevar espacios y guiones ("Camioneta - SUV").
    href: `${path}?type_vehicle=${encodeURIComponent(name)}`,
  };
}

/**
 * Tipos de vehículo para el submenú "Compra tu carro" del navbar
 * (GET /api/type-cars/).
 *
 * Si el backend falla devuelve una lista vacía y "Compra tu carro" queda como
 * un enlace simple, sin submenú: el navbar va en todas las páginas y no puede
 * tumbarlas. El error queda en el log del servidor.
 */
export async function getVehicleTypes(): Promise<VehicleType[]> {
  const url = apiUrl("/type-cars/");

  try {
    const response = await fetch(url, { next: { revalidate: REVALIDATE_SECONDS } });
    if (!response.ok) {
      throw new Error(`GET ${url} respondió ${response.status}`);
    }
    const types: TypeCarDto[] = await response.json();
    return types.map(toVehicleType);
  } catch (error) {
    console.error("No se pudieron cargar los tipos de vehículo:", error);
    return [];
  }
}
