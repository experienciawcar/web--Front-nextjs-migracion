import { getRelatedVehicles } from "@/modules/vehicle-detail/services/vehicle-detail";

/**
 * `GET /api/vehiculos-relacionados/{id}`: las tarjetas de "Vehículos relacionados" de una ficha.
 * Existe porque `GET /cars-related/{id}/` del backend tarda ~24 s la primera vez: pedido al
 * renderizar la ficha, bloqueaba toda la página. Ahora la ficha sale al instante y esta sección
 * la pide el navegador después. El `fetch` de `getRelatedVehicles` ya cachea una hora en el
 * servidor; el `Cache-Control` deja que también lo cachee el navegador.
 */
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^\d+$/.test(id)) return new Response(null, { status: 400 });

  const vehicles = await getRelatedVehicles(Number(id));
  return Response.json(vehicles, {
    headers: {
      // Una lista vacía suele ser un fallo del backend (getRelatedVehicles lo traga): que no se quede pegada.
      "Cache-Control": vehicles.length
        ? "public, max-age=300, s-maxage=3600, stale-while-revalidate=86400"
        : "public, max-age=0, s-maxage=60",
    },
  });
}
