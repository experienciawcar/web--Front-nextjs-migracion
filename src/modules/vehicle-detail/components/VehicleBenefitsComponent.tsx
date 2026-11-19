"use client";

import { useState } from "react";

import { ROUTES } from "@/modules/shared/constants/routes";

import { SEPARATION_AMOUNT_LABEL } from "../constants/tags";
import type { VehicleDetail } from "../types/vehicle-detail";

type Benefit = {
  key: string;
  badge: string;
  title: string;
  sub: string;
  detailTitle: string;
  detail: string;
};

/**
 * Beneficios bajo el precio (propuesta "Garantías junto al precio, fuera de los acordeones"):
 * cuatro tarjetas y, al tocar una, su detalle debajo, sin acordeones. Se muestran solo las que
 * aplican al vehículo. TODO(mercadeo): los textos son los del mockup, provisionales; el plazo del reembolso de la separación están por confirmar.
 */
export default function VehicleBenefitsComponent({
  vehicle,
  canSeparate,
}: {
  vehicle: VehicleDetail;
  canSeparate: boolean;
}) {
  const [openKey, setOpenKey] = useState<string | null>(null);

  const benefits: Benefit[] = [
    {
      key: "peritaje",
      badge: "✓",
      title: "Peritaje público",
      sub: "Colserauto o Automás, no nosotros",
      detailTitle: "Peritaje público",
      detail:
        "El peritaje lo hace un tercero (Colserauto o Automás), no WCAR. Puedes verlo completo antes de decidir con el botón «Ver peritaje».",
    },
  ];
  if (vehicle.warranty) {
    const standard = vehicle.warranty.tone === "standard";
    benefits.push({
      key: "garantia",
      badge: "6",
      title: vehicle.warranty.bullet,
      sub: vehicle.warranty.short,
      detailTitle: vehicle.warranty.title,
      detail: standard
        ? "Cubre motor, caja, diferencial, dirección, enfriamiento, inyección, módulos y suspensión. Diagnóstico gratis aunque la falla no esté cubierta."
        : "Aplican términos y condiciones.",
    });
  }
  if (vehicle.happinessWarranty) {
    benefits.push({
      key: "felicidad",
      badge: "7",
      title: "7 días o 300 km",
      sub: "Si no te convence, te lo cambiamos*",
      detailTitle: "7 días o 300 km",
      detail:
        "Lleva tu vehículo y, si no estás satisfecho, puedes cambiarlo: tienes hasta 7 días o 300 km para hacerlo.",
    });
  }
  if (canSeparate) {
    benefits.push({
      key: "separacion",
      badge: "$",
      title: "Separación reembolsable",
      sub: `Desde ${SEPARATION_AMOUNT_LABEL}`,
      detailTitle: "Separación reembolsable",
      detail: `Separa este carro desde ${SEPARATION_AMOUNT_LABEL}. El dinero es reembolsable según el plazo y las condiciones vigentes (por confirmar).`,
    });
  }

  const open = benefits.find((b) => b.key === openKey);

  return (
    <div className="flex flex-col gap-2">
      <ul className="grid grid-cols-2 gap-2">
        {benefits.map((b) => (
          <li key={b.key} className="flex">
            <button
              type="button"
              aria-expanded={openKey === b.key}
              onClick={() => setOpenKey(openKey === b.key ? null : b.key)}
              className={`flex w-full cursor-pointer items-start gap-2 rounded-lg border p-2 text-left ${
                openKey === b.key ? "border-orange" : "border-gray/30"
              }`}
            >
              <span
                aria-hidden
                className="flex size-6 shrink-0 items-center justify-center rounded-md bg-orange/10 text-[12px] font-bold text-orange"
              >
                {b.badge}
              </span>
              <span className="flex flex-col">
                <span className="text-[12px] leading-4 font-bold text-dark-gray">
                  {b.title}
                </span>
                <span className="text-[11px] leading-[14px] text-gray-dark">
                  {b.sub}
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>

      {open && (
        <div
          role="region"
          aria-label={open.detailTitle}
          className="rounded-lg bg-white p-3 shadow-[0_4px_16px_rgba(0,0,0,0.12)] ring-1 ring-gray/20"
        >
          <div className="flex items-start justify-between gap-2">
            <p className="text-small leading-5 font-bold text-dark-gray">
              {open.detailTitle}
            </p>
            <button
              type="button"
              aria-label="Cerrar detalle"
              onClick={() => setOpenKey(null)}
              className="cursor-pointer px-1 text-gray-dark"
            >
              ×
            </button>
          </div>
          <p className="mt-1 text-[12px] leading-4 text-gray-dark">
            {open.detail}{" "}
            <a href={ROUTES.buyerPolicies} className="font-medium text-orange underline">
              Ver términos
            </a>
          </p>
        </div>
      )}
    </div>
  );
}
