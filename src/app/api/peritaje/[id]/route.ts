import { getExpertise } from "@/modules/vehicle-detail/services/expertise";

/**
 * `GET /api/peritaje/{id}`: el peritaje de un vehículo sin PDF propio (ver `getExpertise`). Se
 * consulta desde el navegador al abrir el visor, después del formulario de datos.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const id = Number((await params).id);
  if (!Number.isInteger(id) || id <= 0)
    return Response.json({ kind: "none" }, { status: 400 });
  try {
    return Response.json(await getExpertise(id));
  } catch (error) {
    console.error("No se pudo consultar el peritaje:", error);
    return Response.json({ kind: "none" }, { status: 502 });
  }
}
