"use client";

import { useState } from "react";
import Image from "next/image";

import iconUser from "../assets/summary/icon-usuario-registro.svg";
import arrowCircle from "@/modules/shared/assets/icons/arrow-circle.svg";
import externalLink from "@/modules/shared/assets/icons/external-link.svg";
import { ROUTES } from "@/modules/shared/constants/routes";
import ButtonComponent from "@/modules/shared/components/ButtonComponent";
import { isValidEmail } from "@/modules/quote/constants/validation";
import { QuoteTextFieldComponent } from "@/modules/quote/components/QuoteFieldComponents";

import {
  saveExpertiseLead,
  sendPhoneCode,
  toColombianPhone,
  verifyPhoneCode,
} from "../services/expertise-lead";

type Errors = Partial<Record<"name" | "phone" | "email" | "terms", string>>;

/**
 * El "muro de datos" antes del peritaje (`docs/VER_PERITAJE.md` §3.3): nombre, celular, correo y
 * el tratamiento de datos; se verifica el celular con un código de 6 dígitos por SMS y se
 * registra el lead. Al terminar avisa con `onDone` y el visor guarda que ya se hizo.
 */
export default function ExpertiseLeadFormComponent({
  vehicleId,
  policyHref,
  onDone,
}: {
  vehicleId: number;
  policyHref: string;
  onDone: () => void;
}) {
  const [step, setStep] = useState<"form" | "code">("form");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [terms, setTerms] = useState(false);
  const [code, setCode] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const fullPhone = toColombianPhone(phone);

  async function submitForm(event: React.FormEvent) {
    event.preventDefault();
    const next: Errors = {};
    if (name.trim().length < 2) next.name = "Escribe tu nombre.";
    if (!fullPhone)
      next.phone = "Escribe un celular colombiano válido (10 dígitos).";
    if (!isValidEmail(email)) next.email = "Escribe un correo válido.";
    if (!terms) next.terms = "Debes aceptar el tratamiento de datos.";
    setErrors(next);
    setMessage(null);
    if (Object.keys(next).length > 0 || !fullPhone) return;

    setBusy(true);
    const result = await sendPhoneCode(fullPhone);
    setBusy(false);
    if (result.ok) setStep("code");
    else setMessage(result.message);
  }

  async function submitCode(event: React.FormEvent) {
    event.preventDefault();
    if (!fullPhone) return;
    if (!/^\d{6}$/.test(code)) {
      setMessage("El código tiene 6 dígitos.");
      return;
    }
    setBusy(true);
    setMessage(null);
    const verified = await verifyPhoneCode(fullPhone, code);
    if (!verified.ok) {
      setBusy(false);
      setMessage(verified.message);
      return;
    }
    const saved = await saveExpertiseLead({
      name: name.trim(),
      phone: fullPhone,
      email: email.trim(),
      vehicleId,
    });
    setBusy(false);
    if (saved.ok) onDone();
    else setMessage(saved.message);
  }

  if (step === "code")
    return (
      <form
        onSubmit={submitCode}
        className="flex w-full flex-col gap-5 px-6 pt-16 pb-10 sm:px-20"
      >
        <h3 className="text-heading-1 font-bold text-dark-gray">
          Confirma tu celular
        </h3>
        <p className="text-small font-medium text-gray-dark">
          Te enviamos un código de 6 dígitos por SMS al {phone}.
        </p>
        <QuoteTextFieldComponent
          id="expertise-code"
          label="Código"
          required
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={6}
          placeholder="000000"
          value={code}
          onChange={(event) => setCode(event.target.value.replace(/\D/g, ""))}
        />
        {message && (
          <p role="alert" className="text-caption text-[#ed3f3f]">
            {message}
          </p>
        )}
        <div className="flex flex-wrap items-center gap-4">
          <ButtonComponent type="submit" disabled={busy}>
            {busy ? "Verificando" : "Verificar"}
          </ButtonComponent>
          <button
            type="button"
            onClick={() => {
              setStep("form");
              setCode("");
              setMessage(null);
            }}
            className="cursor-pointer text-small font-bold text-gray-dark underline"
          >
            Cambiar mis datos
          </button>
        </div>
      </form>
    );

  return (
    <form
      onSubmit={submitForm}
      noValidate
      className="flex w-full flex-col gap-4 px-6 pt-20 pb-10 sm:px-20"
    >
      <Image src={iconUser} alt="" aria-hidden className="mx-auto size-[100px]" />
      <h3 className="mb-2 text-center text-body font-bold text-dark-gray">
        Regístrate gratis y accede a toda la información de los vehículos
      </h3>
      <QuoteTextFieldComponent
        id="expertise-name"
        label="Nombre"
        required
        autoComplete="name"
        placeholder="Ingrese su nombre"
        value={name}
        error={errors.name}
        onChange={(event) => setName(event.target.value)}
      />
      <QuoteTextFieldComponent
        id="expertise-phone"
        label="Teléfono"
        required
        inputMode="tel"
        autoComplete="tel"
        placeholder="Ej: 3001234567 o +573001234567"
        value={phone}
        error={errors.phone}
        onChange={(event) => setPhone(event.target.value)}
      />
      <QuoteTextFieldComponent
        id="expertise-email"
        label="Email"
        required
        type="email"
        autoComplete="email"
        placeholder="ingrese su email"
        value={email}
        error={errors.email}
        onChange={(event) => setEmail(event.target.value)}
      />
      <div className="flex flex-col gap-1">
        <label className="flex items-start gap-2 text-small font-medium text-gray-dark">
          <input
            type="checkbox"
            checked={terms}
            onChange={(event) => setTerms(event.target.checked)}
            className="mt-1 size-4 shrink-0 accent-orange"
          />
          <span>
            Acepto tratamiento de datos personales.{" "}
            <a
              href={policyHref}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#5b7aa6] underline hover:text-orange"
            >
              Política de Tratamiento de Datos y Protección de Datos Personales.
            </a>
          </span>
        </label>
        {errors.terms && (
          <p role="alert" className="text-caption text-[#ed3f3f]">
            {errors.terms}
          </p>
        )}
      </div>
      {message && (
        <p role="alert" className="text-caption text-[#ed3f3f]">
          {message}
        </p>
      )}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-6">
        <ButtonComponent
          variant="cyan"
          href={ROUTES.contact}
          icon={externalLink}
          className="max-w-none"
        >
          Contacta un asesor
        </ButtonComponent>
        <ButtonComponent
          type="submit"
          icon={arrowCircle}
          disabled={busy}
          className="w-[135px]"
        >
          {busy ? "Enviando" : "Ver"}
        </ButtonComponent>
      </div>
    </form>
  );
}
