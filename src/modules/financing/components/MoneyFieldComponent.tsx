"use client";

import { useLayoutEffect, useRef } from "react";

import { formatThousands, MAX_MONEY_DIGITS, parseMoney } from "@/modules/shared/services/loan-calculator";
import { formLabelFont } from "../constants/fonts";

/**
 * Campo de dinero del simulador ("Valor del Vehículo *", "Cuota inicial *"): un
 * `<input>` de texto que solo deja dígitos y los muestra en pesos con punto de
 * miles ("$89.345.990") mientras se escribe. El estado es el número; el texto se
 * deriva de él.
 *
 * Al reformatear el texto el navegador manda el cursor al final: para que escribir
 * o borrar en medio no lo salte, se cuenta cuántos dígitos había antes del cursor
 * y se coloca después del mismo dígito del texto ya formateado.
 *
 * Medidas de Figma: rótulo de 20 de alto, 8 de separación y campo de 54 con
 * `gray-light` de fondo, esquinas de 8, texto de 14/22 Medium `gray-dark` a 16 del
 * borde. El asterisco rojo (#ED3F3F) no está en los tokens.
 */
export default function MoneyFieldComponent({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const caretDigits = useRef<number | null>(null);
  const text = value === 0 ? "" : `$${formatThousands(value)}`;

  useLayoutEffect(() => {
    const input = inputRef.current;
    const digitsBeforeCaret = caretDigits.current;
    if (!input || digitsBeforeCaret === null || document.activeElement !== input) return;

    let position = 0;
    let seen = 0;
    while (position < input.value.length && seen < digitsBeforeCaret) {
      if (/\d/.test(input.value[position])) seen++;
      position++;
    }
    input.setSelectionRange(position, position);
    caretDigits.current = null;
  }, [text]);

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className={`${formLabelFont.className} flex h-5 items-center text-base leading-[1.5] tracking-[-0.32px] text-dark-gray`}>
        <span>
          {label} <span className="text-[#ed3f3f]">*</span>
        </span>
      </label>
      <input
        ref={inputRef}
        id={id}
        type="text"
        inputMode="numeric"
        autoComplete="off"
        maxLength={MAX_MONEY_DIGITS + 4}
        placeholder="$0"
        value={text}
        onChange={(event) => {
          const { value: typed, selectionStart } = event.target;
          caretDigits.current = typed.slice(0, selectionStart ?? typed.length).replace(/\D/g, "").length;
          onChange(parseMoney(typed));
        }}
        className="h-[54px] w-full rounded-lg bg-gray-light px-4 text-small font-medium text-gray-dark placeholder:text-gray focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange"
      />
    </div>
  );
}
