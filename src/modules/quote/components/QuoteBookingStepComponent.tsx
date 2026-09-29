"use client";

import type { BookDate, BookHour } from "../types/booking";
import type { QuoteBooking } from "../types/quote-form";

type Errors = Partial<Record<"dateId" | "hourId", string>>;

const DATE_FORMATTER = new Intl.DateTimeFormat("es-CO", { weekday: "short", day: "2-digit", month: "short" });

/** "AAAA-MM-DD" a mediodía local, para que no se corra un día por la zona horaria. */
export function formatBookDate(iso: string): string {
  const label = DATE_FORMATTER.format(new Date(`${iso}T12:00:00`));
  return label.charAt(0).toUpperCase() + label.slice(1);
}

/**
 * Paso 4, "Agenda tu cita": sin captura (ver `docs/planes/cotizar.md`,
 * "Decisión de alcance"). Mismo lenguaje de "chips" seleccionables que el
 * plazo en meses del simulador de Financiación (`LoanSimulatorComponent`),
 * la única referencia visual de un grupo de opciones ya construida en el
 * sitio. Fecha y hora son radios nativos (`<fieldset>`), no botones sueltos:
 * así responden a las flechas del teclado y a lectores de pantalla.
 *
 * Las horas (`hours`/`loadingHours`) llegan por props en vez de pedirlas
 * aquí: `QuoteWizardComponent` las necesita también para el resumen de la
 * pantalla de éxito, así que las pide una sola vez, arriba.
 *
 * Sin esta fecha/hora el backend no puede crear el registro (`date`/`hour`
 * nunca vienen nulos en los 6.003 registros reales de `GET /sale-cars/`).
 */
export default function QuoteBookingStepComponent({
  value,
  errors,
  onChange,
  dates,
  hours,
  loadingHours,
}: {
  value: QuoteBooking;
  errors: Errors;
  onChange: (patch: Partial<QuoteBooking>) => void;
  dates: BookDate[];
  hours: BookHour[];
  loadingHours: boolean;
}) {
  return (
    <div className="flex flex-col gap-8">
      <fieldset role="radiogroup" aria-invalid={Boolean(errors.dateId)} className="flex flex-col gap-4">
        <legend className="flex h-5 items-center text-small font-medium text-dark-gray">
          Fecha <span className="text-[#ed3f3f]">*</span>
        </legend>
        {dates.length === 0 ? (
          <p className="text-small text-gray">No hay fechas disponibles por ahora. Escríbenos por &quot;Contacta un asesor&quot;.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {dates.map((date) => (
              <label key={date.id} className="cursor-pointer">
                <input
                  type="radio"
                  name="quote-date"
                  value={date.id}
                  checked={value.dateId === date.id}
                  onChange={() => onChange({ dateId: date.id, hourId: "" })}
                  className="peer sr-only"
                />
                <span className="block rounded-lg border border-gray-light bg-gray-light px-4 py-2 text-small font-medium whitespace-nowrap text-gray-dark peer-checked:border-orange peer-checked:bg-orange peer-checked:text-white peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-orange">
                  {formatBookDate(date.date)}
                </span>
              </label>
            ))}
          </div>
        )}
        {errors.dateId && (
          <p role="alert" className="text-caption text-[#ed3f3f]">
            {errors.dateId}
          </p>
        )}
      </fieldset>

      <fieldset role="radiogroup" aria-invalid={Boolean(errors.hourId)} className="flex flex-col gap-4">
        <legend className="flex h-5 items-center text-small font-medium text-dark-gray">
          Hora <span className="text-[#ed3f3f]">*</span>
        </legend>
        {!value.dateId ? (
          <p className="text-small text-gray">Elige primero una fecha.</p>
        ) : loadingHours ? (
          <p className="text-small text-gray">Cargando horas…</p>
        ) : hours.length === 0 ? (
          <p className="text-small text-gray">No quedan horas para esa fecha: elige otra.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {hours.map((hour) => (
              <label key={hour.id} className="cursor-pointer">
                <input
                  type="radio"
                  name="quote-hour"
                  value={hour.id}
                  checked={value.hourId === hour.id}
                  onChange={() => onChange({ hourId: hour.id })}
                  className="peer sr-only"
                />
                <span className="block rounded-lg border border-gray-light bg-gray-light px-4 py-2 text-small font-medium whitespace-nowrap text-gray-dark peer-checked:border-orange peer-checked:bg-orange peer-checked:text-white peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-orange">
                  {hour.from} - {hour.to}
                </span>
              </label>
            ))}
          </div>
        )}
        {errors.hourId && (
          <p role="alert" className="text-caption text-[#ed3f3f]">
            {errors.hourId}
          </p>
        )}
      </fieldset>
    </div>
  );
}
