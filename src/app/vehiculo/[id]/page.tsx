import type { Metadata } from "next";
import { notFound } from "next/navigation";

import VehicleDetailComponent from "@/modules/vehicle-detail/components/VehicleDetailComponent";
import { getVehicleDetail } from "@/modules/vehicle-detail/services/vehicle-detail";
import { buildVehicleMetadata } from "@/modules/vehicle-detail/utils/seo";

type PageProps = { params: Promise<{ id: string }> };

/**
 * Ruta interna de la ficha de un vehículo. La URL pública sigue siendo
 * `/compra-tu-carro/<tipo>/<nombre>/<id>`: `next.config.ts` la reescribe (rewrite) a esta ruta.
 * Existe aparte porque dentro de `compra-tu-carro/[[...typeVehicleName]]` la ficha se renderizaba
 * en el servidor en cada visita (esa ruta lee `searchParams` para el catálogo). Aquí no hay nada
 * dinámico: la primera visita a cada vehículo genera el HTML y se sirve desde caché durante una
 * hora (mismo `revalidate` que los `fetch` de `getVehicleDetail`).
 */
export const revalidate = 3600;

// Vacío a propósito: no se prerenderiza ninguna ficha en el build, pero al devolver un array la
// ruta es estática y cada id se genera la primera vez que se pide.
export async function generateStaticParams() {
  return [];
}

function parseId(id: string): number | null {
  return /^\d+$/.test(id) ? Number(id) : null;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const id = parseId((await params).id);
  const vehicle = id === null ? null : await getVehicleDetail(id);
  return vehicle ? buildVehicleMetadata(vehicle) : {};
}

export default async function VehiclePage({ params }: PageProps) {
  const id = parseId((await params).id);
  if (id === null) notFound();

  const vehicle = await getVehicleDetail(id);
  if (!vehicle) notFound();
  return <VehicleDetailComponent vehicle={vehicle} />;
}
