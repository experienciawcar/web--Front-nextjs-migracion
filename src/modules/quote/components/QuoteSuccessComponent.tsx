"use client";

import { ROUTES } from "@/modules/shared/constants/routes";
import ButtonComponent from "@/modules/shared/components/ButtonComponent";

/** Pantalla de éxito: reemplaza el formulario dentro de la misma tarjeta. TODO: confirmar el copy con diseño. */
export default function QuoteSuccessComponent() {
  return (
    <div className="flex flex-col items-center gap-4 py-8 text-center">
      <span aria-hidden className="grid size-16 place-items-center rounded-full bg-orange text-3xl text-white">
        ✓
      </span>
      <h2 className="text-heading-1 font-bold text-dark-gray">¡Listo! Recibimos tu carro</h2>
      <p className="max-w-[420px] text-body text-gray-dark">
        Un asesor de WCAR te escribirá por WhatsApp para darte tu cotización y agendar la revisión.
      </p>
      <ButtonComponent href={ROUTES.home} variant="primary" className="mt-4">
        Volver al inicio
      </ButtonComponent>
    </div>
  );
}
