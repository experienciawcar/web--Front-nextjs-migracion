import { apiUrl } from "@/modules/shared/services/api";

import type { ColserautoReport } from "../types/expertise";

const REVALIDATE_SECONDS = 60 * 60;

const NA = "N/A";

const currency = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

/** El JSON crudo de Colserauto: sin tipar en el backend, aquí solo se lee lo que se usa. */
type Raw = Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any

function empty(value: unknown): boolean {
  return value == null || value === "" || /^(none|null|undefined)$/i.test(String(value).trim());
}

function text(value: unknown): string {
  return empty(value) ? NA : String(value).trim();
}

function isTrue(value: unknown): boolean {
  return value === true || /^(true|si)$/i.test(String(value).trim());
}

/** Sí / No / N/A, como el sitio de referencia. */
function yesNo(value: unknown): string {
  if (empty(value)) return NA;
  if (isTrue(value)) return "Sí";
  if (value === false || /^(false|no)$/i.test(String(value).trim())) return "No";
  return String(value);
}

function lastChar(value: unknown): string {
  return empty(value) ? NA : String(value).trim().slice(-1);
}

function money(value: unknown): string {
  return empty(value) || Number.isNaN(Number(value)) ? NA : currency.format(Number(value)).replace("$", "$ ");
}

function number(value: unknown, suffix: string): string {
  if (empty(value) || Number.isNaN(Number(value))) return "—";
  return `${Number(value).toLocaleString("es-CO")} ${suffix}`;
}

/** Arma el informe sin los identificadores completos (placa, VIN, chasis, motor, serie). */
export function toColserautoReport(raw: Raw): ColserautoReport {
  const vehicle: Raw = raw.vehiculo ?? {};
  const ids: Raw = raw.identificadores ?? {};
  const specs: Raw = raw.especificaciones ?? {};
  const fasecolda: Raw = raw.fasecolda ?? {};
  const appraisal: Raw = raw.avaluo ?? {};
  const normative: Raw = raw.estados_normativos ?? {};
  const claims: Raw = raw.siniestros ?? {};

  const results = (Array.isArray(raw.resultados_inspeccion) ? raw.resultados_inspeccion : []).map(
    (entry: Raw) => ({
      system: text(entry.sistema),
      percent:
        typeof entry.porcentaje === "number" && !Number.isNaN(entry.porcentaje)
          ? entry.porcentaje
          : null,
    }),
  );
  const percents = results.flatMap((entry: { percent: number | null }) =>
    entry.percent === null ? [] : [entry.percent],
  );
  const score = percents.length
    ? Math.round(percents.reduce((sum: number, percent: number) => sum + percent, 0) / percents.length)
    : null;

  const count = (value: unknown) => (Number(value) > 0 ? Number(value) : 0);

  return {
    inspectionNumber: text(raw.numero_inspeccion),
    date: text(raw.fecha_inspeccion),
    servicePackage: text(raw.Paquete_servcio),
    insurable: isTrue(raw.asegurable),
    plate: lastChar(vehicle.placa),
    score,
    meta: [
      { label: "No. Inspección", value: text(raw.numero_inspeccion) },
      { label: "Clase", value: text(vehicle.clase) },
      { label: "Carrocería", value: empty(vehicle.carroceria) ? "" : text(vehicle.carroceria) },
      { label: "Transmisión", value: text(specs.transmision) },
      { label: "Tracción", value: text(specs.traccion) },
    ],
    vehicleHeading: [vehicle.marca, vehicle.linea, vehicle.modelo].filter((part) => !empty(part)).join(" · "),
    vehicleRows: [
      { label: "Referencia", value: [vehicle.referencia_1, vehicle.referencia_2].filter((part) => !empty(part)).join(" ") || NA },
      { label: "Color", value: text(vehicle.color) },
      { label: "Kilometraje", value: number(vehicle.kilometraje, "km") },
      { label: "Cilindraje", value: number(vehicle.cilindraje, "cc") },
      { label: "Combustible", value: text(vehicle.combustible) },
      { label: "Tipo Caja", value: text(vehicle.tipo_caja) },
    ],
    identifiers: [
      { label: "VIN / Chasis", value: lastChar(ids.vin) },
      { label: "No. Chasis", value: lastChar(ids.numero_chasis) },
      { label: "No. Motor", value: lastChar(ids.numero_motor) },
      { label: "No. Serie", value: lastChar(ids.numero_serie) },
    ],
    specsBar: [
      { label: "Tipo de Caja", value: text(vehicle.tipo_caja) },
      { label: "Combustible", value: text(vehicle.combustible) },
      { label: "Cilindraje", value: number(vehicle.cilindraje, "cc") },
      { label: "Frenos", value: empty(specs.frenos) ? "" : text(specs.frenos) },
      { label: "Dirección", value: empty(specs.tipo_direccion) ? "" : text(specs.tipo_direccion) },
    ],
    results,
    specs: [
      { name: "ABS", on: isTrue(specs.abs), extra: "" },
      { name: "Airbags", on: count(specs.airbags) > 0, extra: `${count(specs.airbags)} unid.` },
      { name: "Aire Acond.", on: isTrue(specs.aire_acondicionado), extra: "" },
      { name: "Vidrios Eléct.", on: count(specs.vidrios_electricos) > 0, extra: `×${count(specs.vidrios_electricos)}` },
      { name: "Espejos Eléct.", on: count(specs.espejos_electricos) > 0, extra: `×${count(specs.espejos_electricos)}` },
      { name: "Sensores", on: isTrue(specs.sensores), extra: "" },
      { name: "Cámara Reversa", on: isTrue(specs.camara_reversa), extra: "" },
      { name: "Sunroof", on: isTrue(specs.sunroof), extra: "" },
      { name: "Exploradoras", on: isTrue(specs.exploradoras), extra: "" },
      {
        name: "Sillas Eléct.",
        on: count(specs.sillasElectricas) > 0,
        extra: count(specs.sillasElectricas) > 0 ? `×${count(specs.sillasElectricas)}` : "",
      },
      { name: `Faros ${empty(specs.tipo_faros) ? "" : specs.tipo_faros}`.trim(), on: true, extra: "" },
      { name: "Tapicería Cuero", on: isTrue(specs.tapiceriaCuero), extra: "" },
    ],
    accessories: (Array.isArray(raw.accesorios) ? raw.accesorios : []).map((entry: Raw) => ({
      name: text(entry.nombre),
      exists: empty(entry.existencia) ? null : isTrue(entry.existencia),
      existsLabel: yesNo(entry.existencia),
      value: money(entry.valor),
    })),
    regulatory: [
      { type: "SOAT", ok: isTrue(normative.soat_vigente), date: String(normative.fecha_vencimiento_soat ?? "") },
      { type: "RTM", ok: isTrue(normative.rtm_vigente), date: String(normative.fecha_vencimiento_rtm ?? "") },
    ],
    fasecolda: {
      code: text(fasecolda.codigo_fasecolda),
      nationality: text(fasecolda.nacionalidad),
      description: text(fasecolda.descripcion_fasecolda),
      value: money(fasecolda.valor_fasecolda),
    },
    appraisal: {
      commercial: money(appraisal.valor_comercial),
      bodyDeduction: money(appraisal.demerito_latoneria_pintura),
      otherDeduction: money(appraisal.demerito_otros),
      final: money(appraisal.valor_final),
    },
    // Verde = sin alerta: la póliza debe estar vigente, la consulta solo informa y una reclamación sí alerta.
    claims: [
      {
        label: "Vigencia Póliza",
        value: text(claims.vigencia_poliza),
        ok: /vigente/i.test(String(claims.vigencia_poliza ?? "")) && !/no\s+vigente|vencid/i.test(String(claims.vigencia_poliza)),
      },
      { label: "Consulta Siniestro", value: yesNo(claims.consulta_siniestro), ok: true },
      { label: "Presenta Recl.", value: yesNo(claims.presenta_reclamacion), ok: !isTrue(claims.presenta_reclamacion) },
    ],
    claimDetails: (Array.isArray(claims.detalle) ? claims.detalle : []).map((entry: Raw) => ({
      type: text(entry.tipo_reclamacion),
      date: text(entry.fecha),
      value: empty(entry.valor) ? NA : money(entry.valor),
      note: text(entry.observacion),
    })),
    background: (Array.isArray(raw.antecedentes) ? raw.antecedentes : []).map((entry: Raw) => ({
      code: text(entry.codigo_novedad),
      description: text(entry.descripcion_novedad),
    })),
  };
}

/**
 * `POST /v2/colserauto/inspeccion/` con la placa: el informe de Colserauto, o `null` si no hay
 * (404, vacío o cualquier fallo). La placa se usa aquí, en el servidor.
 */
export async function getColserautoReport(plate: string): Promise<ColserautoReport | null> {
  try {
    const response = await fetch(apiUrl("/v2/colserauto/inspeccion/"), {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ placa: plate }),
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (!response.ok) return null;
    const raw: Raw = JSON.parse((await response.text()).replace(/\b(NaN|-?Infinity)\b/g, "null"));
    return empty(raw.numero_inspeccion) && !raw.vehiculo ? null : toColserautoReport(raw);
  } catch {
    return null;
  }
}
