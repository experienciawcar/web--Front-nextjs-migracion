"use client";

import { ROUTES } from "@/modules/shared/constants/routes";
import ButtonComponent from "@/modules/shared/components/ButtonComponent";

/**
 * Pantalla de éxito: reemplaza el formulario dentro de la misma tarjeta.
 * El sitio anterior no tiene una página de destino real que llegar (la única
 * pensada para esto, `/cotizar/resultado`, es huérfana — ver
 * `docs/planes/cotizar.md`), así que no se navega a ningún lado.
 * TODO: confirmar el copy con diseño; TODO(negocio): si hace falta una
 * página de agradecimiento propia en vez de esta confirmación en la tarjeta.
 */
export default function QuoteSuccessComponent({ dateLabel, hourLabel }: { dateLabel: string; hourLabel: string }) {
  return (
    <div className="flex flex-col items-center gap-4 py-8 text-center">
      <span aria-hidden className="grid size-16 place-items-center rounded-full bg-orange text-3xl text-white">
        ✓
      </span>
      <h2 className="text-heading-1 font-bold text-dark-gray">¡Listo! Tu cita quedó agendada</h2>
      <p className="max-w-[420px] text-body text-gray-dark">
        Te esperamos el <strong>{dateLabel}</strong> entre <strong>{hourLabel}</strong>. Un asesor de wcar se pondrá en
        contacto contigo para confirmar los detalles.
      </p>
      <ButtonComponent href={ROUTES.home} variant="primary" className="mt-4">
        Volver al inicio
      </ButtonComponent>
    </div>
  );
}
