"use client";

import { QuoteTextFieldComponent } from "./QuoteFieldComponents";
import type { QuoteContact } from "../types/quote-form";

/**
 * Paso 1, "Datos personales": los 5 campos reales de `wcar.co/cotizar`
 * (rótulos y placeholders medidos con `cdp.py`, campo por campo — ver
 * `docs/planes/cotizar.md`, tarea 2).
 */
export default function QuotePersonalStepComponent({
  value,
  errors,
  onChange,
}: {
  value: QuoteContact;
  errors: Partial<Record<keyof QuoteContact, string>>;
  onChange: (patch: Partial<QuoteContact>) => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <QuoteTextFieldComponent
        id="quote-name"
        label="Nombre"
        required
        placeholder="nombre"
        value={value.name}
        error={errors.name}
        onChange={(event) => onChange({ name: event.target.value })}
      />
      <QuoteTextFieldComponent
        id="quote-lastname"
        label="Apellido"
        required
        placeholder="apellido"
        value={value.lastname}
        error={errors.lastname}
        onChange={(event) => onChange({ lastname: event.target.value })}
      />
      <div className="md:col-span-2">
        <QuoteTextFieldComponent
          id="quote-company"
          label="Nombre de compañía (opcional)"
          placeholder="nombre de compañía"
          value={value.companyName}
          error={errors.companyName}
          onChange={(event) => onChange({ companyName: event.target.value })}
        />
      </div>
      <QuoteTextFieldComponent
        id="quote-phone"
        label="Teléfono"
        required
        placeholder="número de teléfono"
        inputMode="tel"
        value={value.phone}
        error={errors.phone}
        onChange={(event) => onChange({ phone: event.target.value })}
      />
      <QuoteTextFieldComponent
        id="quote-email"
        label="Email"
        required
        type="email"
        placeholder="ejemplo@gmail.com"
        value={value.email}
        error={errors.email}
        onChange={(event) => onChange({ email: event.target.value })}
      />
    </div>
  );
}
