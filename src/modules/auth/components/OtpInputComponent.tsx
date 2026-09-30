"use client";

import { useRef } from "react";

import { OTP_LENGTH } from "../constants/auth";

/**
 * Código de verificación en casillas individuales: escribir avanza, Backspace
 * retrocede, las flechas mueven el foco y pegar el código completo lo reparte.
 * `autoComplete="one-time-code"` deja que el teléfono proponga el código del correo/SMS.
 */
export default function OtpInputComponent({
  value,
  onChange,
  disabled,
  invalid,
  describedBy,
}: {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  invalid?: boolean;
  describedBy?: string;
}) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const digits = Array.from({ length: OTP_LENGTH }, (_, i) => value[i] ?? "");

  const focusAt = (index: number) => refs.current[Math.min(Math.max(index, 0), OTP_LENGTH - 1)]?.focus();

  const setDigit = (index: number, digit: string) => {
    const next = digits.slice();
    next[index] = digit;
    onChange(next.join("").slice(0, OTP_LENGTH));
  };

  return (
    <div role="group" aria-label="Código de verificación" className="flex gap-2">
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(el) => {
            refs.current[index] = el;
          }}
          value={digit}
          disabled={disabled}
          inputMode="numeric"
          pattern="\d*"
          maxLength={1}
          autoComplete={index === 0 ? "one-time-code" : "off"}
          aria-label={`Dígito ${index + 1} de ${OTP_LENGTH}`}
          aria-invalid={invalid || undefined}
          aria-describedby={describedBy}
          onFocus={(event) => event.target.select()}
          onChange={(event) => {
            const typed = event.target.value.replace(/\D/g, "");
            if (!typed) return;
            setDigit(index, typed.slice(-1));
            focusAt(index + 1);
          }}
          onKeyDown={(event) => {
            if (event.key === "Backspace") {
              event.preventDefault();
              if (digit) setDigit(index, "");
              else {
                setDigit(Math.max(index - 1, 0), "");
                focusAt(index - 1);
              }
            } else if (event.key === "ArrowLeft") focusAt(index - 1);
            else if (event.key === "ArrowRight") focusAt(index + 1);
          }}
          onPaste={(event) => {
            const pasted = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
            if (!pasted) return;
            event.preventDefault();
            onChange(pasted);
            focusAt(pasted.length);
          }}
          className={`size-12 rounded-sm bg-gray-light text-center text-heading-1 font-bold text-dark-gray outline-none focus-visible:ring-2 focus-visible:ring-orange disabled:opacity-50 ${
            invalid ? "ring-2 ring-red-500" : ""
          }`}
        />
      ))}
    </div>
  );
}
