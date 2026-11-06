"use client";

import { useEffect, useState } from "react";

import arrowCircle from "@/modules/shared/assets/icons/arrow-circle.svg";
import ButtonComponent from "@/modules/shared/components/ButtonComponent";
import { isValidEmail, isValidPersonName, isValidPhone, YEAR_OPTIONS } from "@/modules/quote/constants/validation";
import { getBrands } from "@/modules/catalog/services/brands";
import type { Brand } from "@/modules/catalog/types/brand";

import { createHeroSellQuote } from "../services/sell-quote";

import HeroSellPickerComponent from "./HeroSellPickerComponent";
import HeroSellSuccessModalComponent from "./HeroSellSuccessModalComponent";

const FIELD =
  "h-11 w-full rounded-lg border border-gray/30 bg-gray-light px-4 text-small text-dark-gray outline-none placeholder:text-gray focus:border-orange";

function ChevronIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="pointer-events-none absolute top-1/2 right-3 size-5 -translate-y-1/2 text-gray-dark"
      aria-hidden
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  return (
    <div className="relative">
      <select aria-label={label} value={value} onChange={(e) => onChange(e.target.value)} className={`${FIELD} appearance-none pr-10`}>
        <option value="">{label}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      <ChevronIcon />
    </div>
  );
}

function Owner({ id, label, type = "text", value, onChange, error }: { id: string; label: string; type?: string; value: string; onChange: (v: string) => void; error?: boolean }) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-small font-medium text-dark-gray">
        {label}
        <span className="text-[#ed3f3f]"> *</span>
      </label>
      <input
        id={id}
        type={type}
        value={value}
        placeholder={label.toLowerCase()}
        aria-invalid={error}
        onChange={(e) => onChange(e.target.value)}
        className={`${FIELD} h-[50px] border-0 ${error ? "outline-2 outline-[#ed3f3f]" : ""}`}
      />
    </div>
  );
}

/**
 * Pestaña "Vende tu carro" del hero: año, marca, modelo y kilometraje. Al
 * completarlos aparecen los datos del propietario (nombre, correo, teléfono); al
 * enviar con éxito se abre el modal de agradecimiento.
 */
export default function HeroSellPanelComponent() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [car, setCar] = useState({ year: "", brandId: "", model: "", km: "" });
  const [owner, setOwner] = useState({ name: "", email: "", phone: "" });
  const [showOwner, setShowOwner] = useState(false);
  const [touched, setTouched] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    getBrands().then(setBrands);
  }, []);

  // El valor del modelo es su nombre (va como `reference`), por eso id = name.
  const models = (brands.find((b) => b.id === car.brandId)?.models ?? []).map((m) => ({ id: m.name, name: m.name }));
  const carReady = Boolean(car.year && car.brandId && car.model.trim() && Number(car.km) > 0);
  const ownerOk = {
    name: isValidPersonName(owner.name),
    email: isValidEmail(owner.email),
    phone: isValidPhone(owner.phone),
  };
  const valid = carReady && ownerOk.name && ownerOk.email && ownerOk.phone;

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    // Primer clic: con el carro completo solo despliega los datos del propietario.
    if (!showOwner) return carReady ? setShowOwner(true) : undefined;
    setTouched(true);
    if (!valid || sending) return;
    setSending(true);
    setError("");
    const result = await createHeroSellQuote({
      year: Number(car.year),
      brandId: car.brandId,
      model: car.model.trim(),
      mileage: Number(car.km),
      ...owner,
    });
    setSending(false);
    if (!result.ok) return setError(result.message);
    setDone(true);
    setCar({ year: "", brandId: "", model: "", km: "" });
    setOwner({ name: "", email: "", phone: "" });
    setTouched(false);
    setShowOwner(false);
  }

  return (
    <form onSubmit={submit} noValidate className="mt-7">
      <h3 className="text-[18px] leading-6 font-bold text-dark-gray md:text-body">
        Solicita tu cotización <span className="font-normal text-orange italic">al instante</span>
      </h3>
      <p className="mt-2 text-small text-gray-dark">Ingresa los datos de tu vehículo para que calculemos su valor</p>

      <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
        <Select label="Año" value={car.year} onChange={(year) => setCar({ ...car, year })} options={YEAR_OPTIONS.map((y) => ({ value: String(y), label: String(y) }))} />
        <HeroSellPickerComponent label="Marca" options={brands} logoBase="/api/marca-logo" value={car.brandId} onChange={(brandId) => setCar({ ...car, brandId, model: "" })} className={FIELD} />
        <HeroSellPickerComponent label="Modelo" options={models} disabled={!car.brandId} value={car.model} onChange={(model) => setCar({ ...car, model })} className={FIELD} />
        <input
          aria-label="Kilometraje"
          placeholder="kilometraje"
          inputMode="numeric"
          value={car.km ? Number(car.km).toLocaleString("es-CO") : ""}
          onChange={(e) => setCar({ ...car, km: e.target.value.replace(/\D/g, "").slice(0, 7) })}
          className={FIELD}
        />
      </div>

      {/* grid 0fr -> 1fr anima el alto real sin medirlo; `inert` saca del tab los campos ocultos */}
      <div
        inert={!showOwner}
        className={`grid transition-[grid-template-rows,opacity] duration-500 ease-out motion-reduce:transition-none ${showOwner ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
      >
        <div className="overflow-hidden">
          <div className="pt-6">
            <h4 className="text-body font-bold text-dark-gray">Datos de propietario</h4>
            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-5">
              <Owner id="sell-name" label="Nombre" value={owner.name} onChange={(name) => setOwner({ ...owner, name })} error={touched && !ownerOk.name} />
              <Owner id="sell-email" label="Gmail" type="email" value={owner.email} onChange={(email) => setOwner({ ...owner, email })} error={touched && !ownerOk.email} />
              <Owner id="sell-phone" label="Teléfono" type="tel" value={owner.phone} onChange={(phone) => setOwner({ ...owner, phone })} error={touched && !ownerOk.phone} />
            </div>
          </div>
        </div>
      </div>

      {error && <p role="alert" className="mt-4 text-small text-[#ed3f3f]">{error}</p>}

      <ButtonComponent
        type="submit"
        icon={arrowCircle}
        disabled={!(showOwner ? valid : carReady) || sending}
        className={`mt-5 w-full justify-center! ${(showOwner ? valid : carReady) ? "" : "bg-gray! text-dark-gray! opacity-100!"}`}
      >
        {sending ? "Enviando…" : "Cotizar ahora"}
      </ButtonComponent>

      <HeroSellSuccessModalComponent open={done} onClose={() => setDone(false)} />
    </form>
  );
}
