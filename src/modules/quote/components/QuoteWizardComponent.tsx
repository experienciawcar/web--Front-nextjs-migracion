"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import arrowCircle from "@/modules/shared/assets/icons/arrow-circle.svg";
import ButtonComponent from "@/modules/shared/components/ButtonComponent";
import ZigZagComponent from "@/modules/shared/components/ZigZagComponent";
import { ROUTES } from "@/modules/shared/constants/routes";

import { MIN_YEAR, MAX_YEAR, isValidEmail, isValidPersonName, isValidPhone } from "../constants/validation";
import { getAvailableHours } from "../services/booking";
import { createSaleCarQuote } from "../services/sale-car-quote";
import type { BookHour } from "../types/booking";
import type { Brand } from "../types/brand";
import type { Color } from "../types/color";
import type { Department } from "../types/department";
import { EMPTY_QUOTE_FORM, type QuoteFormValues } from "../types/quote-form";
import type { BookDate } from "../types/booking";
import QuoteBookingStepComponent, { formatBookDate } from "./QuoteBookingStepComponent";
import QuoteCarStepComponent from "./QuoteCarStepComponent";
import QuoteLocationStepComponent from "./QuoteLocationStepComponent";
import QuotePersonalStepComponent from "./QuotePersonalStepComponent";
import QuoteStepperComponent, { QUOTE_STEPS } from "./QuoteStepperComponent";
import QuoteSuccessComponent from "./QuoteSuccessComponent";

type Errors = Record<string, string>;

function validateStep(step: number, values: QuoteFormValues): Errors {
  const errors: Errors = {};

  if (step === 0) {
    if (!isValidPersonName(values.contact.name)) errors.name = "Escribe un nombre de 2 a 20 caracteres.";
    if (!isValidPersonName(values.contact.lastname)) errors.lastname = "Escribe un apellido de 2 a 20 caracteres.";
    if (values.contact.companyName.length > 50) errors.companyName = "Máximo 50 caracteres.";
    if (!isValidPhone(values.contact.phone)) errors.phone = "Escribe un teléfono válido (5 a 13 dígitos).";
    if (!isValidEmail(values.contact.email)) errors.email = "Escribe un correo válido.";
  }

  if (step === 1) {
    if (!values.car.brandId) errors.brandId = "Elige una marca.";
    if (!values.car.reference.trim()) errors.reference = "Escribe la referencia del carro.";
    if (!values.car.version) errors.version = "Elige una versión.";
    if (values.car.year === "" || values.car.year < MIN_YEAR || values.car.year > MAX_YEAR) {
      errors.year = `Elige un año entre ${MIN_YEAR} y ${MAX_YEAR}.`;
    }
  }

  if (step === 2) {
    if (!values.car.departmentId) errors.departmentId = "Elige un departamento.";
    if (!values.car.cityId) errors.cityId = "Elige una ciudad.";
    if (values.car.kilometers === "" || values.car.kilometers < 0) errors.kilometers = "Escribe el kilometraje.";
    if (!values.car.colorId) errors.colorId = "Elige un color.";
  }

  if (step === 3) {
    if (!values.book.dateId) errors.dateId = "Elige una fecha.";
    if (!values.book.hourId) errors.hourId = "Elige una hora.";
  }

  return errors;
}

/**
 * El wizard completo de "Cotiza con *nosotros*": cabecera, tarjeta con el
 * stepper y los 4 pasos, y el estado de envío. Ver el JSDoc de
 * `src/app/cotizar/page.tsx` para la arquitectura general (por qué son 4
 * pasos en una sola vista, qué se pide en el servidor y qué en el cliente).
 *
 * Un único estado (`values`) para los 4 pasos, como el `useForm()` del sitio
 * anterior: así no se pierde nada al ir y volver con el stepper. La
 * validación es manual (guía: este proyecto no usa `react-hook-form`) y
 * corre por paso, al intentar avanzar.
 */
export default function QuoteWizardComponent({
  brands,
  colors,
  departments,
  dates,
  termsHref,
}: {
  brands: Brand[];
  colors: Color[];
  departments: Department[];
  dates: BookDate[];
  termsHref: string | null;
}) {
  const [values, setValues] = useState<QuoteFormValues>(EMPTY_QUOTE_FORM);
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"editing" | "submitting" | "error">("editing");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [succeeded, setSucceeded] = useState(false);

  const [hours, setHours] = useState<BookHour[]>([]);
  // Mismo patrón que `versionsBrandId`/`citiesDepartmentId` (guía §18).
  const [hoursDateId, setHoursDateId] = useState("");
  const loadingHours = values.book.dateId !== "" && values.book.dateId !== hoursDateId;

  useEffect(() => {
    if (!values.book.dateId) return;
    let cancelled = false;
    getAvailableHours(values.book.dateId).then((result) => {
      if (!cancelled) {
        setHours(result);
        setHoursDateId(values.book.dateId);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [values.book.dateId]);

  function updateContact(patch: Partial<QuoteFormValues["contact"]>) {
    setValues((prev) => ({ ...prev, contact: { ...prev.contact, ...patch } }));
  }

  function updateCar(patch: Partial<QuoteFormValues["car"]>) {
    setValues((prev) => ({ ...prev, car: { ...prev.car, ...patch } }));
  }

  function updateBook(patch: Partial<QuoteFormValues["book"]>) {
    setValues((prev) => ({ ...prev, book: { ...prev.book, ...patch } }));
  }

  async function handleContinue() {
    const stepErrors = validateStep(step, values);
    setErrors(stepErrors);
    if (Object.keys(stepErrors).length > 0) return;

    if (step < QUOTE_STEPS.length - 1) {
      setStep((current) => current + 1);
      return;
    }

    setStatus("submitting");
    setSubmitError(null);
    const result = await createSaleCarQuote(values);
    if (result.ok) {
      setSucceeded(true);
      setStatus("editing");
    } else {
      setStatus("error");
      setSubmitError(result.message);
    }
  }

  function handleStepSelect(target: number) {
    setErrors({});
    setStep(target);
  }

  if (succeeded) {
    const chosenDate = dates.find((date) => date.id === values.book.dateId);
    const chosenHour = hours.find((hour) => hour.id === values.book.hourId);
    return (
      <QuoteHeader>
        <QuoteSuccessComponent
          dateLabel={chosenDate ? formatBookDate(chosenDate.date) : ""}
          hourLabel={chosenHour ? `${chosenHour.from} - ${chosenHour.to}` : ""}
        />
      </QuoteHeader>
    );
  }

  return (
    <QuoteHeader>
      <QuoteStepperComponent current={step} onSelect={handleStepSelect} />

      <div className="mt-8">
        {step === 0 && <QuotePersonalStepComponent value={values.contact} errors={errors} onChange={updateContact} />}
        {step === 1 && <QuoteCarStepComponent value={values.car} errors={errors} onChange={updateCar} brands={brands} />}
        {step === 2 && (
          <QuoteLocationStepComponent value={values.car} errors={errors} onChange={updateCar} departments={departments} colors={colors} />
        )}
        {step === 3 && (
          <QuoteBookingStepComponent
            value={values.book}
            errors={errors}
            onChange={updateBook}
            dates={dates}
            hours={hours}
            loadingHours={loadingHours}
          />
        )}
      </div>

      {status === "error" && submitError && (
        <p role="alert" className="mt-6 text-small font-medium text-[#ed3f3f]">
          {submitError}
        </p>
      )}

      <div className="mt-10 flex justify-end">
        <ButtonComponent
          type="button"
          onClick={handleContinue}
          disabled={status === "submitting"}
          icon={arrowCircle}
        >
          {status === "submitting" ? "Enviando…" : step === QUOTE_STEPS.length - 1 ? "Enviar" : "Siguiente"}
        </ButtonComponent>
      </div>

      <p className="mt-6 text-caption text-gray">
        Al continuar aceptas nuestros{" "}
        {termsHref ? (
          <Link href={termsHref} className="font-medium text-orange underline-offset-2 hover:underline">
            Términos y Condiciones.
          </Link>
        ) : (
          <Link href={ROUTES.contact} className="font-medium text-orange underline-offset-2 hover:underline">
            Términos y Condiciones.
          </Link>
        )}
      </p>
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
