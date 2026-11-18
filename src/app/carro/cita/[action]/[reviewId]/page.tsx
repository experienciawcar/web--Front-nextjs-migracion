import type { Metadata } from "next";
import { notFound } from "next/navigation";

import BookAppointmentComponent from "@/modules/separation/components/BookAppointmentComponent";
import { SEPARATION_ACTION } from "@/modules/separation/constants/separation";
import { getDays } from "@/modules/separation/services/separation-client";

// Página transaccional: no tiene sentido en buscadores.
export const metadata: Metadata = { title: "Agenda tu cita | WCAR", robots: { index: false } };

const one = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value);

/**
 * Retorno del pago (`/carro/cita/separar-wompi/:reviewId`, la URL del sitio anterior): agenda la
 * cita. Wompi agrega `?id=<transacción>`; en ePayco la URL lleva `?session_id=`.
 */
export default async function AppointmentPage({
  params,
  searchParams,
}: {
  params: Promise<{ action: string; reviewId: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { action, reviewId } = await params;
  if (action !== SEPARATION_ACTION || !/^\d+$/.test(reviewId)) notFound();
  const query = await searchParams;
  const days = await getDays();

  return (
    <main className="mx-auto flex w-full max-w-[720px] flex-1 flex-col gap-6 px-5 py-12">
      <h1 className="text-heading-1 font-bold text-dark-gray">Agenda tu cita para entregar tu vehículo</h1>
      <p className="text-small font-medium text-gray-dark">
        Tu pago quedó registrado. Elige cuándo vienes y confirmamos tu separación.
      </p>
      <BookAppointmentComponent
        reviewId={reviewId}
        days={days}
        transactionId={one(query.id)}
        sessionId={one(query.session_id)}
      />
    </main>
  );
}
