"use client";

/**
 * Rótulo + campo del formulario de cotización: mismo lenguaje visual que
 * `MoneyFieldComponent` del simulador de Financiación (fondo `gray-light`,
 * esquinas redondeadas, foco naranja), la única referencia de campo de
 * formulario que ya existe en el sitio. No hay Figma para `/cotizar`: el
 * alto (44px) es una estimación cómoda para escribir, no una medida exacta
 * de la captura (que midió 36px en `wcar.co/cotizar`).
 *
 * Dos componentes en un archivo porque comparten el mismo rótulo y el mismo
 * mensaje de error, y siempre se usan juntos.
 */

const LABEL = "flex h-5 items-center text-small font-medium text-dark-gray";
const FIELD =
  "h-11 w-full rounded-lg bg-gray-light px-4 text-small font-medium text-dark-gray placeholder:text-gray focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange disabled:cursor-not-allowed disabled:opacity-60";

function FieldLabel({ id, label, required }: { id: string; label: string; required?: boolean }) {
  return (
    <label htmlFor={id} className={LABEL}>
      {label}
      {required && <span className="text-[#ed3f3f]"> *</span>}
    </label>
  );
}

function FieldError({ id, error }: { id: string; error?: string }) {
  if (!error) return null;
  return (
    <p id={id} role="alert" className="text-caption text-[#ed3f3f]">
      {error}
    </p>
  );
}

export function QuoteTextFieldComponent({
  id,
  label,
  required,
  error,
  ...inputProps
}: {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
} & Omit<React.ComponentProps<"input">, "id" | "className">) {
  const errorId = error ? `${id}-error` : undefined;

  return (
    <div className="flex flex-col gap-2">
      <FieldLabel id={id} label={label} required={required} />
      <input
        id={id}
        className={FIELD}
        aria-invalid={Boolean(error)}
        aria-describedby={errorId}
        {...inputProps}
      />
      <FieldError id={errorId ?? ""} error={error} />
    </div>
  );
}

export function QuoteSelectFieldComponent({
  id,
  label,
  required,
  error,
  placeholder,
  options,
  ...selectProps
}: {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  placeholder: string;
  options: { value: string; label: string }[];
} & Omit<React.ComponentProps<"select">, "id" | "className">) {
  const errorId = error ? `${id}-error` : undefined;

  return (
    <div className="flex flex-col gap-2">
      <FieldLabel id={id} label={label} required={required} />
      <select
        id={id}
        className={`${FIELD} appearance-none`}
        aria-invalid={Boolean(error)}
        aria-describedby={errorId}
        {...selectProps}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <FieldError id={errorId ?? ""} error={error} />
    </div>
  );
}
