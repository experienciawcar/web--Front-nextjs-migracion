"use client";

import { useEffect, useState } from "react";

import { YEAR_OPTIONS } from "../constants/validation";
import { getVersionsByBrand } from "../services/versions";
import type { Brand } from "../types/brand";
import type { QuoteCar } from "../types/quote-form";
import type { Version } from "../types/version";
import { QuoteSelectFieldComponent, QuoteTextFieldComponent } from "./QuoteFieldComponents";

type Errors = Partial<Record<"brandId" | "reference" | "version" | "year", string>>;

/**
 * Paso 2, "Datos del carro": marca (con cascada a versión), referencia (texto
 * libre), versión y año. La marca y la versión son las únicas piezas de este
 * formulario con dependencia real entre campos: al cambiar la marca se piden
 * de nuevo las versiones (`GET /version-brand/:brandId/`) y se vacía la
 * versión elegida, para no dejar seleccionada la de otra marca.
 *
 * El valor que viaja al backend en `car.version` es el TEXTO de la versión,
 * no su id (ver `types/version.ts`): por eso el `<option value>` es el texto.
 */
export default function QuoteCarStepComponent({
  value,
  errors,
  onChange,
  brands,
}: {
  value: QuoteCar;
  errors: Errors;
  onChange: (patch: Partial<QuoteCar>) => void;
  brands: Brand[];
}) {
  const [versions, setVersions] = useState<Version[]>([]);
  // De qué marca son las `versions` de arriba: mientras no coincida con la
  // marca elegida, se está cargando (o no hay marca elegida). Derivarlo así
  // evita un segundo `setState` de "cargando" síncrono dentro del efecto
  // (`react-hooks/set-state-in-effect`, guía §18): el único `setState` del
  // efecto queda dentro del `.then()`.
  const [versionsBrandId, setVersionsBrandId] = useState("");
  const loadingVersions = value.brandId !== "" && value.brandId !== versionsBrandId;

  useEffect(() => {
    if (!value.brandId) return;
    let cancelled = false;
    getVersionsByBrand(value.brandId).then((result) => {
      if (!cancelled) {
        setVersions(result);
        setVersionsBrandId(value.brandId);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [value.brandId]);

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <QuoteSelectFieldComponent
        id="quote-brand"
        label="Marca"
        required
        placeholder="Selecciona una marca"
        value={value.brandId}
        error={errors.brandId}
        options={brands.map((brand) => ({ value: brand.id, label: brand.name }))}
        onChange={(event) => onChange({ brandId: event.target.value, version: "" })}
      />
      <QuoteTextFieldComponent
        id="quote-reference"
        label="Referencia"
        required
        placeholder="Ej: Sonic, Picanto, 5008…"
        value={value.reference}
        error={errors.reference}
        onChange={(event) => onChange({ reference: event.target.value })}
      />
      <QuoteSelectFieldComponent
        id="quote-version"
        label="Versión"
        required
        disabled={!value.brandId || loadingVersions}
        placeholder={!value.brandId ? "Elige primero una marca" : loadingVersions ? "Cargando versiones…" : "Selecciona una versión"}
        value={value.version}
        error={errors.version}
        options={versions.map((version) => ({ value: version.label, label: version.label }))}
        onChange={(event) => onChange({ version: event.target.value })}
      />
      <QuoteSelectFieldComponent
        id="quote-year"
        label="Año"
        required
        placeholder="Selecciona un año"
        value={String(value.year)}
        error={errors.year}
        options={YEAR_OPTIONS.map((year) => ({ value: String(year), label: String(year) }))}
        onChange={(event) => onChange({ year: event.target.value ? Number(event.target.value) : "" })}
      />
    </div>
  );
}
