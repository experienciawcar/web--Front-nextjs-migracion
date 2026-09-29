"use client";

import { useEffect, useState } from "react";

import { getCitiesByDepartment } from "../services/departments";
import type { Color } from "../types/color";
import type { City, Department } from "../types/department";
import type { QuoteCar } from "../types/quote-form";
import { QuoteSelectFieldComponent, QuoteTextFieldComponent } from "./QuoteFieldComponents";

type Errors = Partial<Record<"departmentId" | "cityId" | "kilometers" | "colorId", string>>;

/**
 * Paso 3, "Ubicación y detalles" (era "Enviar formulario" en el diseño: el
 * envío real se movió al paso 4, ver `docs/planes/cotizar.md`). Departamento
 * con cascada a ciudad (`GET /departaments/:id/`, se vacía la ciudad al
 * cambiar de departamento), kilometraje y color.
 */
export default function QuoteLocationStepComponent({
  value,
  errors,
  onChange,
  departments,
  colors,
}: {
  value: QuoteCar;
  errors: Errors;
  onChange: (patch: Partial<QuoteCar>) => void;
  departments: Department[];
  colors: Color[];
}) {
  const [cities, setCities] = useState<City[]>([]);
  // Mismo patrón que `versionsBrandId` en `QuoteCarStepComponent`: el
  // "cargando" se deriva comparando en vez de guardarse aparte (guía §18).
  const [citiesDepartmentId, setCitiesDepartmentId] = useState("");
  const loadingCities = value.departmentId !== "" && value.departmentId !== citiesDepartmentId;

  useEffect(() => {
    if (!value.departmentId) return;
    let cancelled = false;
    getCitiesByDepartment(value.departmentId).then((result) => {
      if (!cancelled) {
        setCities(result);
        setCitiesDepartmentId(value.departmentId);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [value.departmentId]);

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <QuoteSelectFieldComponent
        id="quote-department"
        label="¿En qué departamento está matriculado el carro?"
        required
        placeholder="seleccionar"
        value={value.departmentId}
        error={errors.departmentId}
        options={departments.map((department) => ({ value: department.id, label: department.name }))}
        onChange={(event) => onChange({ departmentId: event.target.value, cityId: "" })}
      />
      <QuoteSelectFieldComponent
        id="quote-city"
        label="¿En qué ciudad está matriculado el carro?"
        required
        disabled={!value.departmentId || loadingCities}
        placeholder={!value.departmentId ? "Elige primero un departamento" : loadingCities ? "Cargando ciudades…" : "seleccionar"}
        value={value.cityId}
        error={errors.cityId}
        options={cities.map((city) => ({ value: city.id, label: city.name }))}
        onChange={(event) => onChange({ cityId: event.target.value })}
      />
      <QuoteTextFieldComponent
        id="quote-kilometers"
        label="Kilometraje"
        required
        type="number"
        min={0}
        inputMode="numeric"
        placeholder="km aproximado"
        value={value.kilometers}
        error={errors.kilometers}
        onChange={(event) => onChange({ kilometers: event.target.value ? Number(event.target.value) : "" })}
      />
      <QuoteSelectFieldComponent
        id="quote-color"
        label="Color"
        required
        placeholder="Selecciona un color"
        value={value.colorId}
        error={errors.colorId}
        options={colors.map((color) => ({ value: color.id, label: color.name }))}
        onChange={(event) => onChange({ colorId: event.target.value })}
      />
    </div>
  );
}
