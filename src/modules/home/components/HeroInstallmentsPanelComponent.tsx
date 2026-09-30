"use client";

import { useState } from "react";

import arrowCircle from "@/modules/shared/assets/icons/arrow-circle.svg";
import ButtonComponent from "@/modules/shared/components/ButtonComponent";
import { ROUTES } from "@/modules/shared/constants/routes";

const MIN_INSTALLMENT = 600_000;
const MAX_INSTALLMENT = 6_000_000;
const STEP = 10_000;

// Supuestos del cálculo. No vienen de un documento: salen de la maqueta, donde
// $600.000 al mes alcanza para "hasta $35.737.466 (60 meses, 30% de inicial)", que
// cuadra al peso con una tasa de 16,5 % efectivo anual.
// TODO: confirmar la tasa y el plazo con financiación (y dejarlos en un solo lugar).
const MONTHS = 60;
const DOWN_PAYMENT = 0.3;
const ANNUAL_RATE = 0.165;

function formatCop(value: number): string {
  return String(Math.round(value)).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

/** Precio máximo de carro que alcanza una cuota: valor presente de las cuotas = 70 % del precio. */
function affordablePrice(installment: number): number {
  const monthlyRate = (1 + ANNUAL_RATE) ** (1 / 12) - 1;
  const financed =
    (installment * (1 - (1 + monthlyRate) ** -MONTHS)) / monthlyRate;
  return Math.round(financed / (1 - DOWN_PAYMENT));
}

/**
 * Panel de la pestaña "Compra a cuotas" del buscador del home: un deslizador de
 * cuota mensual ($600 mil a $6 millones), el precio de carro que esa cuota alcanza
 * y el botón que abre el catálogo filtrado a ese precio máximo.
 */
export default function HeroInstallmentsPanelComponent() {
  const [installment, setInstallment] = useState(MIN_INSTALLMENT);
  const maxPrice = affordablePrice(installment);
  const percent =
    ((installment - MIN_INSTALLMENT) / (MAX_INSTALLMENT - MIN_INSTALLMENT)) *
    100;

  return (
    <form action={ROUTES.buyCar} method="get" className="mt-7">
      <h3 className="text-[18px] leading-6 font-bold text-dark-gray md:text-body">
        Calcula las cuotas{" "}
        <span className="text-orange italic">para pagar mes a mes</span>
      </h3>

      <p className="mt-4 text-dark-gray">
        <span className="text-[48px] leading-[56px] md:text-[40px] md:leading-[48px] font-bold">
          ${formatCop(installment)}
        </span>
        <span className="ml-2 text-small font-medium"> / Mes</span>
      </p>

      <input
        type="range"
        aria-label="Cuota mensual"
        min={MIN_INSTALLMENT}
        max={MAX_INSTALLMENT}
        step={STEP}
        value={installment}
        onChange={(event) => setInstallment(Number(event.target.value))}
        style={{ "--pct": `${percent}%` } as React.CSSProperties}
        className="mt-4 block h-2 w-full cursor-pointer appearance-none rounded-full bg-[linear-gradient(to_right,var(--color-orange)_var(--pct),#dde3ec_var(--pct))] outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange [&::-moz-range-thumb]:size-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-orange [&::-webkit-slider-thumb]:size-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-orange"
      />
      <div className="mt-3 flex justify-between text-small md:mt-2 md:text-caption font-semibold text-gray-dark">
        <span>$600 Mil</span>
        <span>$6 Millones</span>
      </div>

      <p className="mt-4 text-small text-gray-dark md:text-caption">
        Te alcanza para carros de hasta{" "}
        <strong className="font-bold text-orange">
          ${formatCop(maxPrice)}
        </strong>{" "}
        ({MONTHS} meses, {DOWN_PAYMENT * 100}% de inicial)
      </p>

      <input type="hidden" name="max_price" value={maxPrice} />
      <ButtonComponent
        type="submit"
        icon={arrowCircle}
        className="mt-5 h-12! w-full! md:h-[42px]! justify-center!"
      >
        VER CARROS PARA MI CUOTA
      </ButtonComponent>
    </form>
  );
}
