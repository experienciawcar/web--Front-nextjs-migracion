"use client";

import { useEffect, useId, useRef, useState } from "react";

import Image from "next/image";

import ButtonComponent from "@/modules/shared/components/ButtonComponent";

import sparkle from "../assets/ai/sparkle.svg";
import iconAi from "../assets/summary/icono-ia.svg";
import { requestVehicleAiSummary } from "../services/ai-summary-request";
import type { VehicleAiSummary } from "../types/ai-summary";
import type { VehicleExpertise } from "../types/vehicle-detail";

import VehicleExpertiseComponent from "./VehicleExpertiseComponent";

/** Azul a morado de Gemini: el círculo, el borde de la tarjeta y el título. */
const GEMINI_GRADIENT = "linear-gradient(90deg,#4a8af4,#a48bfa)";

type State =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "done"; summary: VehicleAiSummary }
  | { status: "error"; message: string };

/**
 * Resumen del vehículo con Gemini. El disparador es el ícono de IA de la esquina de la tarjeta de
 * resumen (círculo azul-morado con la estrella, Figma 1542:22590); abre debajo una tarjeta
 * "¿Quieres que Gemini te haga un resumen de este vehículo?". Al pulsar "Realizar resumen" pide
 * `POST /api/resumen-ia/{id}` (la key de Gemini vive solo en el servidor) y la misma tarjeta
 * muestra el párrafo y las viñetas.
 *
 * Diseño: captura del equipo (tarjeta blanca con borde degradado azul-morado, título degradado y el
 * botón naranja que se funde en morado). Nunca es más ancha que la tarjeta de resumen: se ancla a
 * ella (`absolute`, la tarjeta es `relative`) y toma su ancho. Se cierra con la X, con Escape o al hacer clic fuera. El
 * resumen queda guardado mientras la página siga abierta. Si el vehículo tiene peritaje, el resumen
 * acaba con "Ver peritaje": el mismo botón y visor de la tarjeta (`VehicleExpertiseComponent`, con
 * el formulario de datos antes del primer peritaje).
 */
export default function VehicleAiSummaryComponent({
  vehicleId,
  expertise,
  vehicleName,
}: {
  vehicleId: number;
  expertise: VehicleExpertise | null;
  vehicleName: string;
}) {
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<State>({ status: "idle" });
  const rootRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const panelId = useId();
  const titleId = useId();

  useEffect(() => {
    if (!open) return;
    panelRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape" || document.querySelector("dialog[open]")) return;
      setOpen(false);
      triggerRef.current?.focus();
    };
    const onPointer = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

  useEffect(() => () => abortRef.current?.abort(), []);

  async function summarize() {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setState({ status: "loading" });
    try {
      const result = await requestVehicleAiSummary(vehicleId, controller.signal);
      setState(
        result.ok
          ? { status: "done", summary: result.summary }
          : { status: "error", message: result.message },
      );
    } catch {
      // Abortada: la página se cerró o se pidió de nuevo.
    }
  }

  // Sin `relative`: la tarjeta se ancla a la tarjeta de resumen (que sí lo es) y toma su ancho.
  return (
    <div ref={rootRef}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        aria-label="Resumir este vehículo con Gemini"
        title="Resumen con Gemini"
        className="block cursor-pointer rounded-full transition-transform duration-200 hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange motion-reduce:transition-none"
      >
        <Image
          src={iconAi}
          alt=""
          aria-hidden
          className={`size-8 ${state.status === "loading" ? "motion-safe:animate-pulse" : ""}`}
        />
      </button>

      {open && (
        <div
          ref={panelRef}
          id={panelId}
          role="dialog"
          aria-labelledby={titleId}
          tabIndex={-1}
          className="absolute inset-x-4 top-14 z-40 max-h-[min(640px,calc(100dvh-140px))] origin-top-right overflow-y-auto rounded-[24px] border-2 border-transparent shadow-[0_8px_30px_rgba(30,30,30,0.18)] outline-none motion-safe:animate-[ai-pop_180ms_ease-out] xl:inset-x-0"
          style={{ background: `linear-gradient(#fff,#fff) padding-box, ${GEMINI_GRADIENT} border-box` }}
        >
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              triggerRef.current?.focus();
            }}
            aria-label="Cerrar resumen de Gemini"
            className="absolute top-3 right-3 flex size-8 cursor-pointer items-center justify-center rounded-full text-gray hover:bg-gray-light hover:text-dark-gray focus-visible:outline-2 focus-visible:outline-orange"
          >
            <svg aria-hidden viewBox="0 0 12 12" className="size-3" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
              <path d="M1.5 1.5l9 9M10.5 1.5l-9 9" />
            </svg>
          </button>

          <div className="px-7 pt-8 pb-7">
            {state.status === "done" ? (
              <Result summary={state.summary} titleId={titleId}>
                {state.summary.hasExpertise && (
                  <VehicleExpertiseComponent
                    vehicleId={vehicleId}
                    expertise={expertise}
                    vehicleName={vehicleName}
                    variant="summary"
                  />
                )}
              </Result>
            ) : state.status === "loading" ? (
              <Loading titleId={titleId} />
            ) : (
              <>
                <h2
                  id={titleId}
                  className="bg-clip-text pr-6 text-[22px] leading-[26px] font-bold text-transparent"
                  style={{ backgroundImage: GEMINI_GRADIENT }}
                >
                  ¿Quieres que Gemini te haga un resumen de este vehículo?
                </h2>
                <p className="mt-4 text-small leading-[22px] font-medium text-gray-dark">
                  Al permitir que Gemini te haga un resumen del vehículo se te mostrarán todos sus
                  detalles, incluyendo su peritaje, y así podrás tomar una mejor decisión al momento
                  de preferir este vehículo u observar los beneficios de reservarlo que te ofrece
                  WCAR.
                </p>
                {state.status === "error" && (
                  <p role="alert" className="mt-4 rounded-xl bg-orange/10 px-4 py-3 text-small leading-[20px] font-semibold text-orange-dark">
                    {state.message}
                  </p>
                )}
                <ButtonComponent variant="gemini" icon={sparkle} onClick={summarize} className="mt-6 w-full">
                  {state.status === "error" ? "Intentar de nuevo" : "Realizar resumen"}
                </ButtonComponent>
              </>
            )}
          </div>
        </div>
      )}

    </div>
  );
}

function Loading({ titleId }: { titleId: string }) {
  return (
    <div aria-live="polite" aria-busy="true">
      <h2 id={titleId} className="flex items-center gap-2 pr-6 text-body font-bold text-gray-dark">
        <span
          aria-hidden
          className="inline-block size-3 shrink-0 rounded-full motion-safe:animate-pulse"
          style={{ backgroundImage: GEMINI_GRADIENT }}
        />
        Gemini está revisando el vehículo y su peritaje…
      </h2>
      <div className="mt-5 flex flex-col gap-3" aria-hidden>
        {["w-full", "w-11/12", "w-3/4", "w-full", "w-5/6", "w-2/3"].map((width, index) => (
          <span
            key={index}
            className={`h-3 rounded-full bg-[length:200%_100%] motion-safe:animate-[ai-shimmer_1.4s_linear_infinite] ${width} ${index === 2 ? "mb-3" : ""}`}
            style={{ backgroundImage: "linear-gradient(90deg,#eef2fb 0%,#dde4fb 40%,#efe9fe 60%,#eef2fb 100%)" }}
          />
        ))}
      </div>
    </div>
  );
}

function Result({
  summary,
  titleId,
  children,
}: {
  summary: VehicleAiSummary;
  titleId: string;
  /** "Ver peritaje", si el vehículo lo tiene. */
  children?: React.ReactNode;
}) {
  return (
    <div aria-live="polite">
      <h2 id={titleId} className="sr-only">
        Resumen del vehículo por Gemini
      </h2>
      {summary.intro && (
        <p className="pr-6 text-body leading-6 font-medium text-gray-dark">{summary.intro}</p>
      )}
      {summary.bullets.length > 0 && (
        <ul className="mt-5 flex flex-col gap-1.5 pl-2 text-body leading-6 font-medium text-gray-dark">
          {summary.bullets.map((bullet) => (
            <li key={bullet} className="flex gap-3">
              <span aria-hidden className="shrink-0">·</span>
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
      )}
      {children && <div className="mt-6 flex flex-col">{children}</div>}
      <p className="mt-6 flex items-center gap-1.5 text-caption text-gray">
        <span
          aria-hidden
          className="inline-block size-3 shrink-0 rounded-full"
          style={{ backgroundImage: GEMINI_GRADIENT }}
        />
        Generado con Gemini a partir de los datos de la ficha. Puede contener errores.
      </p>
    </div>
  );
}
