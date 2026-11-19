"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import arrowCircle from "@/modules/shared/assets/icons/arrow-circle.svg";
import ButtonComponent from "@/modules/shared/components/ButtonComponent";
import ZigZagComponent from "@/modules/shared/components/ZigZagComponent";
import { ROUTES } from "@/modules/shared/constants/routes";

import { isValidEmail, isValidPhone, isValidPlate, normalizePlate } from "../constants/validation";
import { createSaleCarQuote } from "../services/sale-car-quote";
import { EMPTY_QUOTE_FORM, type QuoteFormValues } from "../types/quote-form";
import { QuoteTextFieldComponent } from "./QuoteFieldComponents";
import QuoteSuccessComponent from "./QuoteSuccessComponent";

type Errors = Record<string, string>;

const ADVANTAGES = [
  "Te pagamos de contado, sin vueltas.",
  "Cotización en minutos, sin costo.",
  "Nosotros nos encargamos de los trámites.",
];

function validateStep(step: number, { car, contact }: QuoteFormValues): Errors {
  const errors: Errors = {};

  if (step === 0) {
    if (!isValidPlate(car.plate)) errors.plate = "Escribe la placa con 3 letras y 3 números (ej. ABC123).";
    if (!car.kilometers || Number(car.kilometers) > 999999) errors.kilometers = "Escribe el kilometraje.";
  } else {
    if (contact.fullName.trim().length < 2 || contact.fullName.length > 60) errors.fullName = "Escribe tu nombre.";
    if (!isValidPhone(contact.phone)) errors.phone = "Escribe un celular válido.";
    if (contact.email && !isValidEmail(contact.email)) errors.email = "Escribe un correo válido.";
  }

  return errors;
}

/**
 * Formulario corto de "Cotiza con *nosotros*" en 2 pasos: el carro primero
 * (placa y km, quien ya invirtió 20 segundos en su carro termina el formulario)
 * y luego el contacto. Un solo estado para ambos pasos, validación manual por
 * paso (este proyecto no usa `react-hook-form`). Contrato con backend:
 * `docs/backend/cotizar-formulario-corto.md`.
 */
export default function QuoteWizardComponent({ termsHref }: { termsHref: string | null }) {
  const [values, setValues] = useState<QuoteFormValues>(EMPTY_QUOTE_FORM);
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [succeeded, setSucceeded] = useState(false);

  const setCar = (patch: Partial<QuoteFormValues["car"]>) => setValues((prev) => ({ ...prev, car: { ...prev.car, ...patch } }));
  const setContact = (patch: Partial<QuoteFormValues["contact"]>) =>
    setValues((prev) => ({ ...prev, contact: { ...prev.contact, ...patch } }));

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const stepErrors = validateStep(step, values);
    setErrors(stepErrors);
    if (Object.keys(stepErrors).length > 0) return;

    if (step === 0) {
      setStep(1);
      return;
    }

    setSubmitting(true);
    setSubmitError(null);
    const result = await createSaleCarQuote(values);
    setSubmitting(false);
    if (result.ok) setSucceeded(true);
    else setSubmitError(result.message);
  }

  if (succeeded) {
    return (
      <QuoteHeader>
        <QuoteSuccessComponent />
      </QuoteHeader>
    );
  }

  return (
    <QuoteHeader>
      <form onSubmit={handleSubmit} noValidate autoComplete="on">
        <p className="text-small font-bold text-gray">Paso {step + 1} de 2</p>

        {step === 0 ? (
          <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-2">
            <QuoteTextFieldComponent
              id="quote-plate"
              label="Placa"
              required
              placeholder="ABC123"
              autoCapitalize="characters"
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
              maxLength={7}
              value={values.car.plate}
              error={errors.plate}
              onChange={(event) => setCar({ plate: normalizePlate(event.target.value) })}
            />
            <QuoteTextFieldComponent
              id="quote-kilometers"
              label="Kilometraje"
              required
              inputMode="numeric"
              pattern="[0-9]*"
              autoComplete="off"
              placeholder="km aproximado"
              value={values.car.kilometers}
              error={errors.kilometers}
              onChange={(event) => setCar({ kilometers: event.target.value.replace(/\D/g, "").slice(0, 6) })}
            />
          </div>
        ) : (
          <>
            <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="md:col-span-2">
                <QuoteTextFieldComponent
                  id="quote-name"
                  name="name"
                  label="Nombre completo"
                  required
                  autoComplete="name"
                  placeholder="nombre y apellido"
                  value={values.contact.fullName}
                  error={errors.fullName}
                  onChange={(event) => setContact({ fullName: event.target.value })}
                />
              </div>
              <QuoteTextFieldComponent
                id="quote-phone"
                name="phone"
                label="Celular (WhatsApp)"
                required
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="300 123 4567"
                value={values.contact.phone}
                error={errors.phone}
                onChange={(event) => setContact({ phone: event.target.value })}
              />
              <QuoteTextFieldComponent
                id="quote-email"
                name="email"
                label="Correo (opcional)"
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="ejemplo@gmail.com"
                value={values.contact.email}
                error={errors.email}
                onChange={(event) => setContact({ email: event.target.value })}
              />
            </div>

            <ul className="mt-6 flex flex-col gap-2 text-small text-gray-dark">
              {ADVANTAGES.map((advantage) => (
                <li key={advantage} className="flex gap-2">
                  <span aria-hidden className="font-bold text-orange">
                    ✓
                  </span>
                  {advantage}
                </li>
              ))}
            </ul>
          </>
        )}

        {submitError && (
          <p role="alert" className="mt-6 text-small font-medium text-[#ed3f3f]">
            {submitError}
          </p>
        )}

        <div className="mt-10 flex items-center justify-between gap-4">
          {step === 1 ? (
            <button
              type="button"
              onClick={() => {
                setErrors({});
                setStep(0);
              }}
              className="cursor-pointer text-small font-medium text-gray-dark underline-offset-2 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange"
            >
              Atrás
            </button>
          ) : (
            <span />
          )}
          <ButtonComponent type="submit" disabled={submitting} icon={arrowCircle}>
            {submitting ? "Enviando…" : step === 0 ? "Siguiente" : "Cotizar mi carro"}
          </ButtonComponent>
        </div>

        <p className="mt-6 text-caption text-gray">
          Al continuar aceptas nuestros{" "}
          <Link href={termsHref ?? ROUTES.contact} className="font-medium text-orange underline-offset-2 hover:underline">
            Términos y Condiciones.
          </Link>
        </p>
      </form>
    </QuoteHeader>
  );
}

/** Cabecera común a los 4 pasos y a la pantalla de éxito: botón atrás, título, subtítulo, tarjeta y el zigzag decorativo. */
function QuoteHeader({ children }: { children: React.ReactNode }) {
  return (
    <div className="container-wcar relative py-12 xl:py-16">
      <div
        aria-hidden
        className="absolute top-24 right-0 hidden xl:top-32 xl:right-8 xl:block"
      >
        <ZigZagComponent />
      </div>

      <Link
        href={ROUTES.sellCar}
        aria-label="Volver a Vende tu Carro"
        className="inline-block rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange"
      >
        <Image src={arrowCircle} alt="" aria-hidden className="size-9 rotate-180" />
      </Link>

      <h1 className="mt-6 text-[32px] leading-[1.2] font-bold text-dark-gray xl:text-[46px]">
        Cotiza con <span className="font-normal text-orange italic">nosotros</span>
      </h1>
      <p className="mt-2 text-small font-bold text-dark-gray xl:text-body">Llena el siguiente formulario</p>

      <div className="relative mt-10 max-w-[856px] rounded-lg border border-gray-light bg-white p-6 shadow-[0_7px_7px_rgba(211,218,226,0.4)] xl:p-10">
        {children}
      </div>
    </div>
  );
}
