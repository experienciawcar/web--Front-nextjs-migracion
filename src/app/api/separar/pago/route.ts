import { readJson } from "@/modules/auth/services/request";
import { separationErrorResponse, startPayment, str } from "@/modules/separation/services/separation-server";

/** `POST /api/separar/pago { car, amount, gateway, vehicleName }`: crea el review y deja listo el pago. */
export async function POST(request: Request) {
  try {
    const body = await readJson<{ car: number; amount: number; gateway: string; vehicleName: string }>(request);
    const result = await startPayment({
      car: Number(body.car),
      amount: Number(body.amount),
      gateway: body.gateway === "epayco" ? "epayco" : "wompi",
      vehicleName: str(body.vehicleName, 100),
    });
    return Response.json(result);
  } catch (error) {
    return separationErrorResponse(error);
  }
}
