"use client";

import Image from "next/image";
import { useState } from "react";

import { DEFAULT_LOAN, INSURERS, LOAN_TERMS } from "../constants/loan-options";
import { formLabelFont } from "../constants/fonts";
import { calculateMonthlyPayment, formatThousands } from "@/modules/shared/services/loan-calculator";

import iconHandWithCoin from "../assets/simulador/icon-mano-con-moneda.svg";

import MoneyFieldComponent from "./MoneyFieldComponent";

/** Rótulo de los grupos del formulario, con la tipografía del diseño (ver `constants/fonts.ts`). */
const LABEL = `${formLabelFont.className} flex h-5 items-center text-base leading-[1.5] tracking-[-0.32px] text-dark-gray`;

/**
 * El simulador de cuota: la tarjeta con el formulario a la izquierda y, a la
 * derecha, lo que llegue por `children` (el título y el párrafo, que se pintan en
 * el servidor) más la tarjeta con la cuota mensual. Es cliente porque el
 * resultado se recalcula al cambiar cualquier campo.
 *
 * Medidas de Figma (nodos "Datos personales" 193:8220 y "Popup" 193:8243):
 * - Tarjeta del formulario de 584 x 504: blanca, borde de 2 px `gray` al 30 %,
 *   esquinas de 8, relleno de 40 (48 abajo) medido desde el borde exterior (o sea
 *   38 y 46 más el borde) y 32 entre grupos. Campos de 54 con el rótulo de 20 de
 *   alto (el texto de 24 de interlineado va centrado y sobresale 2 px) y 8 de
 *   separación (16 en el de plazo).
 * - Plazo: siete "chips" de 38 de alto, 8 entre ellos, esquinas de 8, relleno de
 *   12 (borde incluido): `gray-light` con el texto `gray-dark`; el elegido va en
 *   `orange` con texto blanco. Son radios nativos (grupo con `<fieldset>`), así que
 *   las flechas del teclado cambian el plazo.
 * - Seguro: un `<select>` nativo con el aspecto de un campo; el diseño lo pinta con
 *   el texto en `gray` (más claro que el de los campos de dinero) y sin flecha.
 * - Resultado (381 x 232): blanco, sombra `0 7 7 rgba(211,218,226,.4)`, esquinas de 8,
 *   relleno de 32 y 16 entre bloques: el ícono de la mano con moneda (32), una raya
 *   vertical de 1 px `gray` (70), "Tu cuota mensual sería de:" (14/22 Medium
 *   `gray-dark`) y la cuota en Bold 36/44 `orange`; una línea horizontal `gray` y la
 *   nota de 12/22 `gray`, centrada. El resultado va con `aria-live="polite"`.
 *
 * Los valores iniciales son los del diseño ($ 3.921.855). La fórmula y sus casos
 * límite están en `services/loan-calculator.ts`. Teléfono (Figma "Datos personales"
 * 1:6582 y "Popup" 1:6605, 329 de ancho): una columna, el formulario (relleno de 40
 * desde el borde exterior, como en desktop) y luego el resultado, con la raya que
 * lo parte de lado a lado de la tarjeta.
 *
 * TODO: el texto del aviso tiene las erratas del diseño ("de neto uso interactivo",
 * "cuanto" sin tilde en el párrafo): se dejan tal cual hasta que diseño las revise.
 * TODO: lista real de aseguradoras y si el seguro suma (ver `constants/loan-options.ts`).
 */
export default function LoanSimulatorComponent({ children }: { children: React.ReactNode }) {
  const [vehicleValue, setVehicleValue] = useState<number>(DEFAULT_LOAN.vehicleValue);
  const [downPayment, setDownPayment] = useState<number>(DEFAULT_LOAN.downPayment);
  const [months, setMonths] = useState<number>(DEFAULT_LOAN.months);
  const [insurer, setInsurer] = useState<string>(DEFAULT_LOAN.insurer);

  const payment = calculateMonthlyPayment(vehicleValue, downPayment, months);
  const paymentText = `$ ${formatThousands(payment)}`;

  return (
    <div className="mx-auto grid max-w-[584px] gap-8 xl:w-[990px] xl:max-w-none xl:grid-cols-[584px_382px] xl:grid-rows-[auto_1fr] xl:gap-x-6 xl:gap-y-0">
      <div className="order-1 xl:order-none xl:col-start-2 xl:row-start-1">{children}</div>

      <form
        onSubmit={(event) => event.preventDefault()}
        aria-label="Simulador de cuota mensual"
        className="order-2 flex flex-col gap-8 rounded-lg border-2 border-gray/30 bg-white px-[38px] pt-[38px] pb-[46px] xl:order-none xl:col-start-1 xl:row-span-2 xl:row-start-1"
      >
        <MoneyFieldComponent id="loan-vehicle-value" label="Valor del Vehículo" value={vehicleValue} onChange={setVehicleValue} />
        <MoneyFieldComponent id="loan-down-payment" label="Cuota inicial" value={downPayment} onChange={setDownPayment} />

        <div role="radiogroup" aria-labelledby="loan-months-label" className="flex flex-col gap-4">
          <span id="loan-months-label" className={LABEL}>
            <span>
              Plazo en Meses<span className="text-[#ed3f3f]">*</span>
            </span>
          </span>
          <div className="flex flex-wrap gap-2">
            {LOAN_TERMS.map((term) => (
              <label key={term} className="cursor-pointer">
                <input
                  type="radio"
                  name="loan-months"
                  value={term}
                  checked={months === term}
                  onChange={() => setMonths(term)}
                  className="peer sr-only"
                />
                <span className="block h-[38px] rounded-lg border border-gray-light bg-gray-light px-[11px] py-[7px] text-small font-medium text-gray-dark peer-checked:border-orange peer-checked:bg-orange peer-checked:text-white peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-orange">
                  {term}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="loan-insurer" className={LABEL}>
            Seguro
          </label>
          <select
            id="loan-insurer"
            value={insurer}
            onChange={(event) => setInsurer(event.target.value)}
            className="h-[54px] w-full cursor-pointer appearance-none rounded-lg bg-gray-light px-4 text-small font-medium text-gray focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange"
          >
            {INSURERS.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>
      </form>

      <div className="order-3 flex flex-col items-center gap-4 rounded-lg bg-white p-8 drop-shadow-[0_7px_7px_rgba(211,218,226,0.4)] xl:order-none xl:col-start-2 xl:row-start-2 xl:mt-8 xl:self-start">
        <div className="flex w-fit max-w-full items-center gap-4">
          <Image src={iconHandWithCoin} alt="" aria-hidden className="size-8 shrink-0" />
          <span aria-hidden className="w-px self-stretch bg-gray" />
          <div aria-live="polite" className="flex min-w-[197px] flex-col gap-1">
            <p className="text-small font-medium whitespace-nowrap text-gray-dark">Tu cuota mensual sería de:</p>
            <p
              className={`font-bold whitespace-nowrap text-orange ${
                paymentText.length > 12 ? "text-[28px] leading-9" : "text-subheadline-1 leading-11"
              }`}
            >
              {paymentText}
            </p>
          </div>
        </div>
        <span aria-hidden className="-mx-8 h-px w-[calc(100%+4rem)] bg-gray xl:mx-0 xl:w-full" />
        <p className="text-center text-caption font-medium text-gray">
          *Este simulador es de neto uso interactivo y calcula una cuota aproximada la cual tiene fines informativos y
          no comporta ofertas o promesas de contratar.
        </p>
      </div>
    </div>
  );
}
