"use client";

import Image from "next/image";
import { useRef, useState } from "react";

import MoneyFieldComponent from "@/modules/financing/components/MoneyFieldComponent";
import { LOAN_TERMS } from "@/modules/financing/constants/loan-options";
import iconClose from "@/modules/shared/assets/footer/icon-close.svg";
import ButtonComponent from "@/modules/shared/components/ButtonComponent";
import { DOWN_PAYMENT_RATIO, LOAN_TERM_MONTHS, MONTHLY_INTEREST_RATE } from "@/modules/shared/constants/loan-rates";
import { ROUTES } from "@/modules/shared/constants/routes";
import { calculateMonthlyPayment, formatThousands } from "@/modules/shared/services/loan-calculator";

const money = (amount: number) => `$${formatThousands(amount)}`;

/**
 * "simular" de la ficha: un enlace que abre un `<dialog>` con una versión corta de
 * `calculadora-credito-vehicular.html` (valor, cuota inicial, plazo y tasa → cuota,
 * préstamo, intereses y costo total). Arranca con el precio del vehículo, 0 % de
 * inicial, 84 meses y 1,9 % mensual (`constants/loan-rates.ts`), o sea la misma
 * cuota que muestra la ficha. Reusa la fórmula y el campo de dinero del simulador de
 * Financiación; el `<dialog>` cierra con Esc, con la X o al pulsar fuera.
 * shortcut: no trae la tabla de amortización ni la barra de la calculadora; añadirlas si se piden.
 */
export default function LoanSimulatorModalComponent({ vehiclePrice }: { vehiclePrice: number }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [vehicleValue, setVehicleValue] = useState(vehiclePrice);
  const [downPayment, setDownPayment] = useState(Math.round(vehiclePrice * DOWN_PAYMENT_RATIO));
  const [months, setMonths] = useState<number>(LOAN_TERM_MONTHS);
  const [ratePct, setRatePct] = useState(MONTHLY_INTEREST_RATE * 100);

  const loan = Math.max(vehicleValue - downPayment, 0);
  const payment = calculateMonthlyPayment(vehicleValue, downPayment, months, ratePct / 100);
  const interest = Math.max(payment * months - loan, 0);
  const downPct = vehicleValue > 0 ? Math.round((downPayment / vehicleValue) * 100) : 0;

  return (
    <>
      <button
        type="button"
        onClick={() => dialogRef.current?.showModal()}
        className="cursor-pointer underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange"
      >
        simular
      </button>

      <dialog
        ref={dialogRef}
        aria-labelledby="loan-modal-title"
        onClick={(event) => {
          if (event.target === event.currentTarget) event.currentTarget.close();
        }}
        className="m-0 size-full max-h-none max-w-none overflow-y-auto bg-transparent p-4 backdrop:bg-black/50 backdrop:backdrop-blur-md open:flex"
      >
        <div className="relative m-auto w-full max-w-[520px] rounded-lg bg-white p-6 pt-7">
          <button
            type="button"
            aria-label="Cerrar"
            onClick={() => dialogRef.current?.close()}
            className="absolute top-2.5 right-4 grid size-10 cursor-pointer place-items-center rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange"
          >
            <Image src={iconClose} alt="" aria-hidden className="size-3.5" />
          </button>

          <span aria-hidden className="block h-1 w-12 bg-orange" />
          <h2 id="loan-modal-title" className="mt-4 text-[24px] leading-8 font-bold text-dark-gray">
            ¿Cuánto pagarías al mes?
          </h2>

          <form onSubmit={(event) => event.preventDefault()} className="mt-5 flex flex-col gap-5">
            <MoneyFieldComponent id="loan-modal-value" label="Valor del vehículo" value={vehicleValue} onChange={setVehicleValue} />

            <div>
              <MoneyFieldComponent id="loan-modal-down" label="Cuota inicial" value={downPayment} onChange={setDownPayment} />
              <p className="mt-1 text-small text-gray-dark">{downPct}% del valor. Pon 0 si financias todo.</p>
            </div>

            <fieldset className="flex flex-col gap-2">
              <legend className="mb-2 text-base text-dark-gray">Plazo en meses</legend>
              <div className="flex flex-wrap gap-2">
                {LOAN_TERMS.map((term) => (
                  <label key={term} className="cursor-pointer">
                    <input
                      type="radio"
                      name="loan-modal-months"
                      value={term}
                      checked={months === term}
                      onChange={() => setMonths(term)}
                      className="peer sr-only"
                    />
                    <span className="block rounded-lg bg-gray-light px-3 py-2 text-small font-medium text-gray-dark peer-checked:bg-orange peer-checked:text-white peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-orange">
                      {term}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="flex flex-col gap-2">
              <label htmlFor="loan-modal-rate" className="text-base text-dark-gray">
                Tasa de interés mensual
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="loan-modal-rate"
                  type="number"
                  inputMode="decimal"
                  min={0}
                  max={5}
                  step={0.01}
                  value={ratePct}
                  onChange={(event) => setRatePct(Math.min(Math.max(Number(event.target.value) || 0, 0), 5))}
                  className="h-[54px] w-28 rounded-lg bg-gray-light px-4 text-small font-medium text-gray-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange"
                />
                <span className="text-small text-gray-dark">% mes (la que te dé tu banco)</span>
              </div>
            </div>
          </form>

          <div aria-live="polite" className="mt-6 rounded-lg bg-gray-light p-4">
            {loan === 0 ? (
              <p className="text-small font-medium text-gray-dark">Con esa cuota inicial no necesitas crédito.</p>
            ) : (
              <>
                <p className="text-small font-medium text-gray-dark">Tu cuota mensual sería</p>
                <p className="text-[32px] leading-10 font-bold text-orange">{money(payment)}</p>
                <dl className="mt-3 grid grid-cols-[1fr_auto] gap-x-4 gap-y-1 text-small text-gray-dark">
                  <dt>Préstamo del banco</dt>
                  <dd className="font-bold">{money(loan)}</dd>
                  <dt>Intereses</dt>
                  <dd className="font-bold">{money(interest)}</dd>
                  <dt>Costo total del carro</dt>
                  <dd className="font-bold">{money(downPayment + payment * months)}</dd>
                </dl>
              </>
            )}
          </div>

          <p className="mt-3 text-caption text-gray">
            Resultado aproximado: no incluye seguros ni estudio de crédito, y la tasa real depende de tu perfil.
          </p>

          <ButtonComponent href={ROUTES.financing} size="medium" className="mt-4 w-full max-w-none!">
            Quiero financiar
          </ButtonComponent>
        </div>
      </dialog>
    </>
  );
}
