"use client";

import { useRef, useState } from "react";
import { type StaticImageData } from "next/image";

import ButtonComponent from "@/modules/shared/components/ButtonComponent";
import { ROUTES } from "@/modules/shared/constants/routes";

import { appointmentPath, type Gateway, MIN_SEPARATION_AMOUNT } from "../constants/separation";
import { isEpaycoPaid, startPayment } from "../services/separation-client";

type EpaycoCheckout = { onClosed: (callback: () => void) => void; open: () => void };
declare global {
  interface Window {
    ePayco?: { checkout: { configure: (options: Record<string, unknown>) => EpaycoCheckout } };
  }
}

const EPAYCO_SCRIPT = "https://checkout.epayco.co/checkout-v2.js";

function Chip({ selected, onClick, children }: { selected: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={`h-10 cursor-pointer rounded-sm px-4 text-small font-bold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange ${
        selected ? "bg-orange text-white" : "bg-gray-light text-gray-dark hover:bg-orange/15"
      }`}
    >
      {children}
    </button>
  );
}

function loadEpayco(): Promise<void> {
  if (window.ePayco) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = EPAYCO_SCRIPT;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("epayco"));
    document.head.appendChild(script);
  });
}

const GATEWAYS = [
  { id: "wompi", label: "PSE, Tarjeta o Nequi (Wompi)" },
  { id: "epayco", label: "ePayco" },
] as const;

const money = (value: number) => `$${value.toLocaleString("es-CO")}`;

/**
 * Botón "Sepáralo" + el modal de monto (`docs/flujo-separar-vehiculo.md` pasos 2-4): monto
 * (mínimo $2.000.000, máximo el precio), pasarela (Wompi o ePayco) y aceptar términos. Crea el
 * review y paga; al volver, la pasarela cae en `/carro/cita/separar-wompi/:reviewId`.
 *
 * Usa un `<dialog>` nativo: foco atrapado, Esc cierra y el fondo queda inerte sin código extra.
 */
export default function SeparateVehicleButtonComponent({
  vehicleId,
  vehicleName,
  price,
  priceLabel,
  stockId,
  children,
  icon,
  size = "medium",
  className,
}: {
  vehicleId: number;
  vehicleName: string;
  /** Precio del vehículo en pesos: es el monto máximo. */
  price: number;
  /** Precio ya formateado y stock, para la cabecera del modal. */
  priceLabel: string;
  stockId: string;
  children: React.ReactNode;
  icon?: StaticImageData;
  size?: "big" | "medium";
  className?: string;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [amountText, setAmountText] = useState(MIN_SEPARATION_AMOUNT.toLocaleString("es-CO"));
  const [gateway, setGateway] = useState<Gateway>("wompi");
  const [terms, setTerms] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const amount = Number(amountText.replace(/\D/g, ""));
  const max = price >= MIN_SEPARATION_AMOUNT ? price : Number.POSITIVE_INFINITY;
  const amountError =
    amount < MIN_SEPARATION_AMOUNT
      ? `El monto mínimo es ${money(MIN_SEPARATION_AMOUNT)}.`
      : amount > max
        ? `El monto no puede superar ${money(price)}.`
        : null;
  const canPay = terms && !amountError && !busy;

  async function pay(event: React.FormEvent) {
    event.preventDefault();
    if (!canPay) return;
    setBusy(true);
    setError(null);
    const result = await startPayment({ car: vehicleId, amount, gateway, vehicleName });
    if (!result.ok) {
      setBusy(false);
      setError(result.error);
      return;
    }
    if (result.gateway === "wompi") {
      window.location.href = result.checkoutUrl;
      return;
    }
    try {
      await loadEpayco();
      dialog.current?.close();
      const checkout = window.ePayco!.checkout.configure({
        sessionId: result.sessionId,
        type: "onpage",
        test: process.env.NEXT_PUBLIC_EPAYCO_TEST === "true",
        external: false,
      });
      checkout.onClosed(async () => {
        if (await isEpaycoPaid(result.sessionId)) {
          window.location.href = `${appointmentPath(result.reviewId)}?session_id=${encodeURIComponent(result.sessionId)}`;
        } else {
          setBusy(false);
          setError("No completaste el pago o la transacción no fue exitosa.");
          dialog.current?.showModal();
        }
      });
      checkout.open();
    } catch {
      setBusy(false);
      setError("No pudimos abrir ePayco. Inténtalo de nuevo o usa Wompi.");
    }
  }

  return (
    <>
      <ButtonComponent size={size} icon={icon} className={className} onClick={() => dialog.current?.showModal()}>
        {children}
      </ButtonComponent>
      <dialog
        ref={dialog}
        aria-labelledby="separar-titulo"
        className="mx-auto mt-auto mb-0 w-full max-w-[480px] rounded-t-2xl p-6 backdrop:bg-black/60 sm:m-auto sm:rounded-lg"
        onClick={(event) => event.target === dialog.current && dialog.current?.close()}
      >
        <form onSubmit={pay} noValidate className="flex flex-col gap-5">
          <div className="flex flex-col gap-1 border-b border-gray/30 pb-4">
            <p className="text-body font-bold text-dark-gray">{vehicleName}</p>
            <p className="text-small font-medium text-dark-gray">
              <span className="font-bold">{priceLabel}</span> · {stockId}
            </p>
          </div>
          <h2 id="separar-titulo" className="text-heading-1 font-bold text-dark-gray">
            Reservarlo y asegurar tu compra
          </h2>

          {/* TODO(legal): frase y plazo exactos; deben coincidir palabra por palabra con los términos del comprador. */}
          <div className="flex items-center gap-3 rounded-sm bg-gray-light px-3 py-2.5 text-caption font-medium text-gray-dark">
            <svg aria-hidden viewBox="0 0 24 24" className="size-5 shrink-0 text-gray" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="12" r="9.5" />
              <path d="M12 11v6M12 7.5v.5" strokeLinecap="round" />
            </svg>
            <p>Si el vehículo no cumple con sus expectativas, se le realizará la devolución del 100% de su reserva</p>
          </div>

          <div role="group" aria-labelledby="separar-cuanto" className="flex flex-col gap-3">
            <p id="separar-cuanto" className="text-body font-bold text-dark-gray">
              ¿Con qué cantidad deseas reservar?
            </p>
            <label className="flex h-11 items-center justify-between rounded-sm border border-[#5b7aa6]/60 bg-gray-light px-3 text-small font-medium text-gray-dark focus-within:ring-2 focus-within:ring-orange">
              Reservar
              <input
                inputMode="numeric"
                value={amountText ? `$${amountText}` : ""}
                onChange={(event) => {
                  const digits = event.target.value.replace(/\D/g, "").slice(0, 10);
                  setAmountText(digits ? Number(digits).toLocaleString("es-CO") : "");
                }}
                aria-invalid={Boolean(amountError)}
                aria-describedby="separar-monto-ayuda"
                className="w-40 bg-transparent text-right text-small font-bold text-dark-gray outline-none"
              />
            </label>
            <div className="flex flex-wrap gap-2">
              {[MIN_SEPARATION_AMOUNT, 5_000_000, 10_000_000]
                .filter((value) => value <= max)
                .map((value) => (
                  <Chip key={value} selected={amount === value} onClick={() => setAmountText(value.toLocaleString("es-CO"))}>
                    {money(value)}
                  </Chip>
                ))}
            </div>
            <p
              id="separar-monto-ayuda"
              role={amountError ? "alert" : undefined}
              className={`text-caption font-medium ${amountError ? "text-[#ed3f3f]" : "text-gray-dark"}`}
            >
              {amountError ?? `Mínimo de ${money(MIN_SEPARATION_AMOUNT)}. Se descuenta del precio final.`}
            </p>
          </div>

          <fieldset className="flex flex-col gap-3">
            <legend className="mb-3 text-body font-bold text-dark-gray">Medio de pago</legend>
            <div className="flex flex-wrap gap-3">
              {GATEWAYS.map(({ id, label }) => (
                <label
                  key={id}
                  className={`flex h-11 cursor-pointer items-center justify-center rounded-sm px-4 text-small font-bold has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-orange ${
                    gateway === id ? "bg-orange text-white" : "bg-gray-light text-gray-dark hover:bg-orange/15"
                  }`}
                >
                  <input type="radio" name="pasarela" checked={gateway === id} onChange={() => setGateway(id)} className="sr-only" />
                  {label}
                </label>
              ))}
            </div>
          </fieldset>

          <label className="flex items-center gap-2 text-small font-medium text-gray-dark">
            <input
              type="checkbox"
              checked={terms}
              onChange={(event) => setTerms(event.target.checked)}
              className="size-4 shrink-0 accent-orange"
            />
            <span>
              Acepto los{" "}
              <a
                href={ROUTES.buyerPolicies}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#5b7aa6] underline hover:text-orange"
              >
                términos y condiciones
              </a>
            </span>
          </label>

          {error && (
            <p role="alert" className="text-caption text-[#ed3f3f]">
              {error}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-4">
            <ButtonComponent type="submit" disabled={!canPay} className="max-w-none">
              {busy ? "Procesando" : `Separar con ${money(amount)}`}
            </ButtonComponent>
            <ButtonComponent variant="secondary" onClick={() => dialog.current?.close()}>
              Cancelar
            </ButtonComponent>
          </div>
        </form>
      </dialog>
    </>
  );
}
