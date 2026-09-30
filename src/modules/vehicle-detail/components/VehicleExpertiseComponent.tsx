"use client";

import { useRef, useState } from "react";

import iconDownload from "../assets/summary/icon-descargar.svg";
import externalLink from "@/modules/shared/assets/icons/external-link.svg";
import ButtonComponent from "@/modules/shared/components/ButtonComponent";
import { ROUTES } from "@/modules/shared/constants/routes";

import type { ExpertiseResult } from "../types/expertise";
import type { VehicleExpertise } from "../types/vehicle-detail";

import ExpertiseLeadFormComponent from "./ExpertiseLeadFormComponent";
import ExpertiseReportComponent from "./ExpertiseReportComponent";

/** Lo que guarda el navegador cuando ya dejó sus datos (la misma llave del sitio anterior). */
const LEAD_KEY = "dataUserColection";
/** TODO(negocio): confirmar la URL de la política de tratamiento de datos. */
const POLICY_HREF = "/politicas-comprador";

function hasLeftData(): boolean {
  try {
    return localStorage.getItem(LEAD_KEY) === "true";
  } catch {
    return false;
  }
}

type State =
  | { status: "idle" }
  | { status: "lead" }
  | { status: "loading" }
  | { status: "ready"; result: ExpertiseResult };

/**
 * El botón "VER PERITAJE" y el visor del peritaje del vehículo. Sale dos veces en la ficha:
 * en la tarjeta de resumen (cian de 32 de alto) y en "Evaluación del vehículo" (cian grande con
 * el ícono de enlace externo, Figma 89:4839).
 *
 * Flujo (`docs/VER_PERITAJE.md` §1.2 y §2.1): al pulsar, si el navegador aún no dejó sus datos
 * se muestra el formulario (nombre, celular con código por SMS, correo y política de datos; se
 * registra el lead y se guarda `dataUserColection`). Después se muestra el PDF propio del
 * vehículo (`automas_pdf`) o, sin él, lo que encuentre el servidor (`GET /api/peritaje/{id}`):
 * el certificado de Automás por placa o la imagen de Colserauto. Sin nada, un aviso con salida
 * a un asesor.
 *
 * TODO: POR AHORA LOS BOTONES "VER PERITAJE" NO HACEN NADA (pedido del usuario). Para reactivarlos
 * basta con volver a pasarles `onClick={open}`; el visor y el flujo de abajo ya están hechos y no se abren.
 *
 * El visor es un `<dialog>` nativo.
 */
export default function VehicleExpertiseComponent({
  vehicleId,
  expertise,
  vehicleName,
  variant,
}: {
  vehicleId: number;
  expertise: VehicleExpertise | null;
  vehicleName: string;
  variant: "summary" | "card";
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [state, setState] = useState<State>({ status: "idle" });

  async function load() {
    if (expertise?.kind === "pdf") {
      setState({ status: "ready", result: { kind: "none" } });
      return;
    }
    setState({ status: "loading" });
    try {
      const response = await fetch(`/api/peritaje/${vehicleId}`);
      const result: ExpertiseResult = await response.json();
      setState({ status: "ready", result });
    } catch {
      setState({ status: "ready", result: { kind: "none" } });
    }
  }

  // TODO: sin uso a propósito mientras los botones no hacen nada (ver el JSDoc).
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function open() {
    dialogRef.current?.showModal();
    if (state.status === "ready") return;
    if (hasLeftData()) void load();
    else setState({ status: "lead" });
  }

  function onLeadDone() {
    try {
      localStorage.setItem(LEAD_KEY, "true");
    } catch {
      // Sin almacenamiento se vuelve a pedir la próxima vez; el peritaje sí se muestra.
    }
    void load();
  }

  return (
    <>
      {variant === "summary" ? (
        <ButtonComponent
          variant="cyan"
          size="medium"
          icon={iconDownload}

          className="max-w-none!"
        >
          Ver peritaje
        </ButtonComponent>
      ) : (
        <ButtonComponent
          variant="cyan"

          icon={externalLink}
          shine
          className="mx-auto"
        >
          Ver peritaje
        </ButtonComponent>
      )}

      <dialog
        ref={dialogRef}
        aria-label={`Peritaje de ${vehicleName}`}
        onClick={(event) => {
          if (event.target === event.currentTarget) dialogRef.current?.close();
        }}
        className="m-auto h-[90vh] w-[min(960px,94vw)] rounded-lg bg-white p-0 backdrop:bg-black/70"
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between gap-4 border-b border-[#c2d3ed] px-6 py-4">
            <h2 className="text-heading-1 font-bold text-dark-gray">
              Peritaje del vehículo
            </h2>
            <ButtonComponent
              variant="black"
              size="medium"
              onClick={() => dialogRef.current?.close()}
            >
              Cerrar
            </ButtonComponent>
          </div>

          <div className="min-h-0 flex-1 overflow-auto">
            {state.status === "lead" && (
              <ExpertiseLeadFormComponent
                vehicleId={vehicleId}
                policyHref={POLICY_HREF}
                onDone={onLeadDone}
              />
            )}
            {state.status === "loading" && (
              <p
                role="status"
                className="flex h-full items-center justify-center px-8 text-body font-medium text-gray-dark"
              >
                Consultando el peritaje…
              </p>
            )}
            {state.status === "ready" && expertise?.kind === "pdf" && (
              <iframe
                src={expertise.url}
                title={`Peritaje de ${vehicleName}`}
                className="size-full"
              />
            )}
            {state.status === "ready" &&
              expertise?.kind !== "pdf" &&
              state.result.kind === "report" && (
                <ExpertiseReportComponent
                  report={state.result.report}
                  vehicleName={vehicleName}
                />
              )}
            {state.status === "ready" &&
              expertise?.kind !== "pdf" &&
              state.result.kind === "image" && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={state.result.url}
                  alt={`Peritaje de ${vehicleName}`}
                  className="mx-auto h-auto max-w-full"
                />
              )}
            {state.status === "ready" &&
              expertise?.kind !== "pdf" &&
              state.result.kind === "none" && (
                <div className="flex h-full flex-col items-center justify-center gap-6 px-8 text-center">
                  <p className="max-w-[460px] text-body font-medium text-gray-dark">
                    El peritaje de este vehículo todavía no está disponible en
                    línea. Un asesor te lo comparte con gusto.
                  </p>
                  <ButtonComponent href={ROUTES.contact}>
                    Hablar con un asesor
                  </ButtonComponent>
                </div>
              )}
          </div>
        </div>
      </dialog>
    </>
  );
}
