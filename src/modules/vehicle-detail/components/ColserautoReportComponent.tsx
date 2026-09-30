"use client";

import Image from "next/image";
import { useState } from "react";

import logoColserauto from "../assets/expertise/logo-colserauto.webp";
import logoWcar from "../assets/expertise/logo-wcar-horizontal.svg";
import "../styles/colserauto-report.css";

import type { ColserautoReport } from "../types/expertise";

import Icon, { type ColserautoIconName } from "./ColserautoIconsComponent";

const ZOOMS = [0.65, 0.75, 0.85, 1, 1.15, 1.3];

type Tab = "inspection" | "appraisal" | "claims";

const TABS: { id: Tab; icon: ColserautoIconName; size: number; label: string }[] = [
  { id: "inspection", icon: "barChart", size: 15, label: "Inspección & Especificaciones" },
  { id: "appraisal", icon: "dollar", size: 15, label: "Avalúo & Fasecolda" },
  { id: "claims", icon: "alert", size: 13, label: "Siniestros & Antecedentes" },
];

/** Verde desde 90, amarillo desde 60 y rojo por debajo. */
function band(percent: number): "opt" | "ace" | "def" {
  return percent >= 90 ? "opt" : percent >= 60 ? "ace" : "def";
}

const IDENTIFIER_ICONS: ColserautoIconName[] = ["idCard", "fileText", "wrench", "tag"];
const SPEC_ICONS: ColserautoIconName[] = ["settings", "fuel", "gauge", "ban", "sliders"];

function SectionHead({
  icon,
  tone,
  size = 16,
  children,
}: {
  icon: ColserautoIconName;
  tone: "navy" | "blue" | "orange" | "red" | "yellow";
  size?: number;
  children: React.ReactNode;
}) {
  return (
    <div className="per-sc-head">
      <div className={`per-sc-icon ${tone}`}>
        <Icon name={icon} size={size} />
      </div>
      <span>{children}</span>
    </div>
  );
}

function RegulatoryCard({ report }: { report: ColserautoReport }) {
  return (
    <div className="per-section-card">
      <SectionHead icon="shield" tone="navy" size={14}>
        Estados Normativos
      </SectionHead>
      <div className="per-norm-grid">
        {report.regulatory.map((item) => (
          <div key={item.type} className={`per-norm-card ${item.ok ? "nc-ok" : "nc-fail"}`}>
            <div className="pnc-tipo">{item.type}</div>
            <div className="pnc-status">
              <Icon name={item.ok ? "check" : "x"} size={12} /> {item.ok ? "VIGENTE" : "VENCIDO"}
            </div>
            <div className="pnc-fecha">Vence: {item.date}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function InspectionTab({ report }: { report: ColserautoReport }) {
  const { fasecolda } = report;
  return (
    <div className="per-content-grid">
      <div className="per-col-main">
        <div className="per-section-card">
          <div className="per-sc-head">
            <div className="per-sc-icon navy">
              <Icon name="barChart" />
            </div>
            <span>Resultados de Inspección</span>
            <div className="per-legend">
              {[
                ["var(--p-red)", "0–59% Deficiente"],
                ["var(--p-yellow)", "60–89% Aceptable"],
                ["var(--p-green)", "90–100% Óptimo"],
              ].map(([color, label]) => (
                <span key={label} className="per-legend-item">
                  <span style={{ background: color }} className="per-legend-dot" />
                  {label}
                </span>
              ))}
            </div>
          </div>
          <div className="per-bars">
            {report.results.map((result) => {
              const percent = result.percent ?? 0;
              return (
                <div key={result.system} className="per-bar-row">
                  <span className="per-bar-lbl">{result.system}</span>
                  <div className="per-bar-track">
                    <div
                      className={`per-bar-fill per-fill-${band(percent)}`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <span className={`per-bar-pct per-pct-${band(percent)}`}>
                    {result.percent === null ? "N/A" : `${result.percent}%`}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="per-section-card">
          <SectionHead icon="settings" tone="blue">
            Especificaciones Técnicas
          </SectionHead>
          <div className="per-espec-grid">
            {report.specs.map((spec) => (
              <div key={spec.name} className={`per-espec-pill ${spec.on ? "ep-on" : "ep-off"}`}>
                <span className="ep-dot">
                  <Icon name={spec.on ? "check" : "x"} size={13} />
                </span>
                <span className="ep-name">{spec.name}</span>
                {spec.extra && <span className="ep-extra">{spec.extra}</span>}
              </div>
            ))}
          </div>
        </div>

        <div className="per-section-card">
          <SectionHead icon="cart" tone="orange">
            Accesorios
          </SectionHead>
          <table className="per-tbl">
            <thead>
              <tr>
                <th>Accesorio</th>
                <th>Existencia</th>
                <th>Valor</th>
              </tr>
            </thead>
            <tbody>
              {report.accessories.map((accessory, index) => (
                <tr key={`${accessory.name}-${index}`}>
                  <td>{accessory.name}</td>
                  <td>
                    <span className={`per-chip ${accessory.exists ? "chip-green" : "chip-gray"}`}>
                      {accessory.existsLabel}
                    </span>
                  </td>
                  <td className="tbl-mono">{accessory.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="per-col-side">
        <RegulatoryCard report={report} />
        <div className="per-section-card">
          <SectionHead icon="document" tone="navy">
            Fasecolda
          </SectionHead>
          <div className="per-kv-list">
            <div className="per-kv">
              <span>Código</span>
              <strong>{fasecolda.code}</strong>
            </div>
            <div className="per-kv">
              <span>Nac.</span>
              <strong>{fasecolda.nationality}</strong>
            </div>
            <div className="per-kv-full">{fasecolda.description}</div>
            <div className="per-kv-highlight">
              <span>Valor</span>
              <strong>{fasecolda.value}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AppraisalTab({ report }: { report: ColserautoReport }) {
  const { appraisal, fasecolda } = report;
  return (
    <div className="per-content-grid">
      <div className="per-col-main">
        <div className="per-section-card">
          <SectionHead icon="dollar" tone="orange">
            Avalúo Comercial
          </SectionHead>
          <div className="per-avaluo-breakdown">
            <div className="pab-row">
              <span>Valor Comercial</span>
              <strong>{appraisal.commercial}</strong>
            </div>
            <div className="pab-row pab-minus">
              <span>Demérito Latonería / Pintura</span>
              <strong>− {appraisal.bodyDeduction}</strong>
            </div>
            <div className="pab-row pab-minus">
              <span>Demérito Otros</span>
              <strong>− {appraisal.otherDeduction}</strong>
            </div>
            <div className="pab-divider" />
            <div className="pab-total">
              <span>Valor Final</span>
              <strong>{appraisal.final}</strong>
            </div>
          </div>
        </div>
        <div className="per-section-card">
          <SectionHead icon="document" tone="navy">
            Datos Fasecolda
          </SectionHead>
          <div className="per-fasecolda-full">
            {[
              ["Código Fasecolda", fasecolda.code],
              ["Descripción", fasecolda.description],
              ["Nacionalidad", fasecolda.nationality],
              ["Valor Fasecolda", fasecolda.value],
            ].map(([label, value]) => (
              <div
                key={label}
                className={`per-kv per-kv-lg ${label === "Descripción" ? "per-kv-full" : ""}`}
              >
                <span>{label}</span>
                <strong className={label === "Valor Fasecolda" ? "per-kv-orange" : ""}>{value}</strong>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="per-col-side">
        <RegulatoryCard report={report} />
      </div>
    </div>
  );
}

function ClaimsTab({ report }: { report: ColserautoReport }) {
  return (
    <div className="per-content-grid">
      <div className="per-col-main">
        <div className="per-section-card">
          <SectionHead icon="alert" tone="red" size={14}>
            Siniestros
          </SectionHead>
          <div className="per-sin-summary">
            {report.claims.map((claim) => (
              <div key={claim.label} className={`per-sin-card ${claim.ok ? "sin-ok" : "sin-alert"}`}>
                <span className="psc-lbl">{claim.label}</span>
                <span className="psc-val">{claim.value}</span>
              </div>
            ))}
          </div>
          {report.claimDetails.length > 0 && (
            <>
              <table className="per-tbl" style={{ marginTop: 10 }}>
                <thead>
                  <tr>
                    <th>Tipo</th>
                    <th>Fecha</th>
                    <th>Valor</th>
                  </tr>
                </thead>
                <tbody>
                  {report.claimDetails.map((detail, index) => (
                    <tr key={index}>
                      <td>
                        <span className="per-chip chip-red">{detail.type}</span>
                      </td>
                      <td>{detail.date}</td>
                      <td className="tbl-mono">{detail.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {report.claimDetails.map((detail, index) => (
                <div key={index} className="per-obs">
                  <Icon name="info" size={13} /> <strong>Observación:</strong> {detail.note}
                </div>
              ))}
            </>
          )}
        </div>
      </div>
      <div className="per-col-side">
        <div className="per-section-card">
          <SectionHead icon="info" tone="yellow">
            Antecedentes
          </SectionHead>
          <table className="per-tbl">
            <thead>
              <tr>
                <th>Código</th>
                <th>Descripción</th>
              </tr>
            </thead>
            <tbody>
              {report.background.length > 0 ? (
                report.background.map((entry, index) => (
                  <tr key={index}>
                    <td className="tbl-code">{entry.code}</td>
                    <td>{entry.description}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={2} className="tbl-empty">
                    Sin antecedentes
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const DISCLAIMERS = [
  "Este documento es un resumen del informe de peritaje. No genera efecto vinculante para la comercialización del vehículo.",
  "Colserauto aplicó criterios técnicos para la revisión. El informe completo se encuentra en el documento adjunto.",
  "Se sugiere solicitar el Certificado de Tradición para descartar multas, embargos y otras alertas.",
];

/**
 * El informe de peritaje de Colserauto por placa: barra azul con zoom y cierre, cabecera con los
 * logos, portada (placa, puntuación general y ficha del vehículo), identificadores, pestañas
 * (inspección y especificaciones, avalúo y Fasecolda, siniestros y antecedentes) y avisos. Es el
 * informe del sitio de referencia (`docs/VER_PERITAJE.md` §5.5) con su mismo CSS
 * (`styles/colserauto-report.css`).
 */
export default function ColserautoReportComponent({
  report,
  onClose,
}: {
  report: ColserautoReport;
  onClose: () => void;
}) {
  const [zoom, setZoom] = useState(1);
  const [tab, setTab] = useState<Tab>("inspection");
  const zoomIndex = ZOOMS.indexOf(zoom);

  return (
    <div className="per-overlay">
      <div className="per-toolbar">
        <div className="per-tb-left">
          <span className="per-tb-title">Informe de Peritaje</span>
          <span className="per-tb-sub">
            No. {report.inspectionNumber} · {report.date}
          </span>
        </div>
        <div className="per-tb-right">
          <div className="per-zoom-group">
            <button
              type="button"
              aria-label="Alejar"
              className="per-zoom-btn"
              disabled={zoomIndex <= 0}
              onClick={() => setZoom(ZOOMS[zoomIndex - 1])}
            >
              −
            </button>
            <span className="per-zoom-label">{Math.round(zoom * 100)}%</span>
            <button
              type="button"
              aria-label="Acercar"
              className="per-zoom-btn"
              disabled={zoomIndex >= ZOOMS.length - 1}
              onClick={() => setZoom(ZOOMS[zoomIndex + 1])}
            >
              +
            </button>
          </div>
          <button type="button" aria-label="Cerrar" className="per-close-btn" onClick={onClose}>
            <Icon name="x" size={20} />
          </button>
        </div>
      </div>

      <div className="per-doc-wrap" style={{ zoom }}>
        <div className="per-page">
          <div className="per-header">
            <div className="per-hdr-left">
              <div className="per-hdr-divider" />
              <div className="per-renting">
                <Image src={logoColserauto} alt="Colserauto" className="per-colserauto-logo" />
              </div>
            </div>
            <div className="per-hdr-right">
              <Image src={logoWcar} alt="WCAR" className="per-wcar-logo" />
            </div>
          </div>

          <div className="per-hero">
            <div className="per-hero-left">
              <div className="per-eyebrow-row">
                <div className="per-hero-eyebrow">
                  <Icon name="document" size={13} />
                  {report.servicePackage}
                  <span className="per-eyebrow-sep" />
                  <span className="per-eyebrow-date">{report.date}</span>
                </div>
                <div className={`per-aseg-badge ${report.insurable ? "aseg-si" : "aseg-no"}`}>
                  <Icon name="shieldCheck" size={11} />
                  <span>
                    Asegurable: <strong>{report.insurable ? "Sí" : "No"}</strong>
                  </span>
                </div>
              </div>
              <h1 className="per-hero-title">
                PERITAJE
                <br />
                COMERCIAL
              </h1>
              <div className="per-meta-grid">
                {report.meta.map((item) => (
                  <div key={item.label} className="per-meta-cell">
                    <span className="pmc-lbl">{item.label}</span>
                    <span className="pmc-val">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="per-hero-badges">
              <div className="per-placa-wrap">
                <span className="per-placa-hint">PLACA</span>
                <div className="per-placa">{report.plate}</div>
              </div>
              {report.score !== null && (
                <div className={`per-score-card per-score-${band(report.score)}`}>
                  <span className="psc-num">{report.score}%</span>
                  <span className="psc-lbl">Puntuación general</span>
                </div>
              )}
            </div>

            <div className="per-vehicle-card">
              <div className="pvc-header">{report.vehicleHeading}</div>
              <div className="pvc-grid">
                {report.vehicleRows.map((row) => (
                  <div key={row.label} className="pvc-item">
                    <span className="pvc-lbl">{row.label}</span>
                    <span className="pvc-val">{row.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="per-ids">
            {report.identifiers.map((item, index) => (
              <div key={item.label} className="per-id-card">
                <div className="per-id-icon">
                  <Icon name={IDENTIFIER_ICONS[index]} size={20} />
                </div>
                <div className="per-id-info">
                  <span className="per-id-lbl">{item.label}</span>
                  <span className="per-id-val">{item.value}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="per-specs-bar">
            {report.specsBar.map((item, index) => (
              <div key={item.label} className="per-spec-pill">
                <div className="psp-icon">
                  <Icon name={SPEC_ICONS[index]} size={18} />
                </div>
                <div>
                  <span className="psp-lbl">{item.label}</span>
                  <span className="psp-val">{item.value}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="per-tabs" role="tablist">
            {TABS.map((item) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={tab === item.id}
                className={`per-tab ${tab === item.id ? "per-tab-active" : ""}`}
                onClick={() => setTab(item.id)}
              >
                <Icon name={item.icon} size={item.size} /> {item.label}
              </button>
            ))}
          </div>

          {tab === "inspection" && <InspectionTab report={report} />}
          {tab === "appraisal" && <AppraisalTab report={report} />}
          {tab === "claims" && <ClaimsTab report={report} />}

          <div className="per-disclaimer">
            <div className="per-disc-strip">
              {DISCLAIMERS.map((text, index) => (
                <div key={index} className="per-disc-item">
                  <div className="per-disc-num">{index + 1}</div>
                  <p>{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
