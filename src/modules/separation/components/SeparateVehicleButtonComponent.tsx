"use client";

import { useRef, useState } from "react";
import Image, { type StaticImageData } from "next/image";

import ButtonComponent from "@/modules/shared/components/ButtonComponent";
import { ROUTES } from "@/modules/shared/constants/routes";

import logoEpayco from "../assets/logo-epayco.webp";
import logoWompi from "../assets/logo-wompi.webp";
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
      className={`h-10 cursor-pointer rounded-full border px-4 text-small font-bold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange ${
        selected ? "border-dark-gray bg-dark-gray text-white" : "border-gray/40 bg-white text-dark-gray hover:border-orange"
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
  { id: "wompi", logo: logoWompi, label: "Wompi" },
  { id: "epayco", logo: logoEpayco, label: "ePayco" },
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
  const [other, setOther] = useState(false);
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
        <form onSubmit={pay} noValidate className="flex flex-col gap-4">
          <div className="flex flex-col gap-0.5 border-b border-gray/30 pb-3">
            <p className="text-small font-bold text-dark-gray">{vehicleName}</p>
            <p className="text-caption font-medium text-gray-dark">
              {priceLabel} · {stockId}
            </p>
          </div>
          <h2 id="separar-titulo" className="text-heading-1 font-bold text-dark-gray">
            Sepáralo para que nadie más lo compre
          </h2>

          {/* TODO(legal): frase y plazo exactos; deben coincidir palabra por palabra con los términos del comprador. */}
          <p className="rounded-sm border border-[#25D366] bg-[#e9f9ef] px-3 py-2 text-small font-bold text-[#14703a]">
            Si al verlo decides no comprarlo, te devolvemos el 100% de la separación.
          </p>

          <div role="group" aria-labelledby="separar-cuanto" className="flex flex-col gap-2">
            <p id="separar-cuanto" className="text-small font-bold text-dark-gray">
              ¿Cuánto quieres separar?
            </p>
            <div className="flex flex-wrap gap-2">
              {[MIN_SEPARATION_AMOUNT, 5_000_000]
                .filter((value) => value <= max)
                .map((value) => (
                  <Chip
                    key={value}
                    selected={!other && amount === value}
                    onClick={() => {
                      setOther(false);
                      setAmountText(value.toLocaleString("es-CO"));
                    }}
                  >
                    {value.toLocaleString("es-CO")}
                  </Chip>
                ))}
              <Chip selected={other} onClick={() => setOther(true)}>
                Otro valor
              </Chip>
            </div>
            {other && (
              <input
                aria-label="Monto a separar"
                autoFocus
                inputMode="numeric"
                value={amountText ? `$${amountText}` : ""}
                onChange={(event) => {
                  const digits = event.target.value.replace(/\D/g, "").slice(0, 10);
                  setAmountText(digits ? Number(digits).toLocaleString("es-CO") : "");
                }}
                aria-invalid={Boolean(amountError)}
                aria-describedby="separar-monto-ayuda"
                className="h-11 rounded-sm bg-gray-light px-3 text-body font-bold outline-none focus-visible:ring-2 focus-visible:ring-orange"
              />
            )}
            <p
              id="separar-monto-ayuda"
              role={amountError ? "alert" : undefined}
              className={`text-caption font-medium ${amountError ? "text-[#ed3f3f]" : "text-gray-dark"}`}
            >
              {amountError ?? `Mínimo ${money(MIN_SEPARATION_AMOUNT)}. Se descuenta del precio final.`}
            </p>
          </div>

          <fieldset className="flex flex-col gap-2">
            <legend className="mb-1 text-small font-bold text-dark-gray">Medio de pago</legend>
            <div className="flex gap-3">
              {GATEWAYS.map(({ id, logo, label }) => (
                <label
                  key={id}
                  className="flex h-14 flex-1 cursor-pointer items-center justify-center rounded-sm has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-orange"
                >
                  <input type="radio" name="pasarela" checked={gateway === id} onChange={() => setGateway(id)} className="sr-only" />
                  {/* El brillo sigue la silueta del logo (drop-shadow), no la caja. */}
                  <Image
                    src={logo}
                    alt={label}
                    className={`h-8 w-auto max-w-full object-contain transition-[filter,opacity] ${
                      gateway === id
                        ? "[filter:drop-shadow(0_0_6px_rgb(255_115_0/0.9))_drop-shadow(0_0_14px_rgb(255_115_0/0.6))]"
                        : "opacity-50 grayscale hover:opacity-80"
                    }`}
                  />
                </label>
              ))}
            </div>
            <p className="text-caption font-medium text-gray-dark">
              {gateway === "wompi" ? "PSE, tarjeta o Nequi." : "Tarjetas y otros medios de ePayco."}
            </p>
          </fieldset>

          <label className="flex items-start gap-2 text-small font-medium text-gray-dark">
            <input
              type="checkbox"
              checked={terms}
              onChange={(event) => setTerms(event.target.checked)}
              className="mt-1 size-4 shrink-0 accent-orange"
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
              .
            </span>
          </label>

          {error && (
            <p role="alert" className="text-caption text-[#ed3f3f]">
              {error}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-4">
            <ButtonComponent type="submit" disabled={!canPay}>
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
