"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import OtpInputComponent from "@/modules/auth/components/OtpInputComponent";
import { OTP_LENGTH } from "@/modules/auth/constants/auth";
import { isValidEmail, isValidPersonName, isValidPhone } from "@/modules/quote/constants/validation";
import { QuoteTextFieldComponent } from "@/modules/quote/components/QuoteFieldComponents";
import ButtonComponent from "@/modules/shared/components/ButtonComponent";
import { ROUTES } from "@/modules/shared/constants/routes";

import { THANK_YOU_PATH } from "../constants/separation";
import {
  type AppointmentDay,
  type AppointmentHour,
  confirmSeparation,
  getHours,
  sendEmailCode,
} from "../services/separation-client";

type Errors = Partial<Record<"name" | "lastName" | "phone" | "email" | "terms" | "day" | "hour", string>>;

const dayLabel = (date: string) =>
  new Date(`${date}T00:00:00`).toLocaleDateString("es-CO", { weekday: "long", day: "numeric", month: "long" });

/** "08:00:00" → "8:00 am". */
function hourLabel(time: string) {
  const [h, m] = time.split(":").map(Number);
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h < 12 ? "am" : "pm"}`;
}

/**
 * Cita tras el pago (`docs/flujo-separar-vehiculo.md` pasos 5-8): día → hora → datos → términos →
 * código por correo → confirmar. El código lo valida el servidor (`/api/separar/confirmar`).
 * No verifica que el pago exista: eso es del backend (guía §9, puntos 2 y 7).
 */
export default function BookAppointmentComponent({
  reviewId,
  days,
  transactionId,
  sessionId,
}: {
  reviewId: string;
  days: AppointmentDay[];
  transactionId?: string;
  sessionId?: string;
}) {
  const router = useRouter();
  const [step, setStep] = useState<"form" | "code">("form");
  const [dayId, setDayId] = useState<number | null>(null);
  const [hours, setHours] = useState<AppointmentHour[] | null>(null);
  const [hourId, setHourId] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [terms, setTerms] = useState(false);
  const [code, setCode] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function pickDay(id: number) {
    setDayId(id);
    setHourId(null);
    setHours(null);
    setHours(await getHours(id));
  }

  async function submitForm(event: React.FormEvent) {
    event.preventDefault();
    const next: Errors = {};
    if (!dayId) next.day = "Elige un día.";
    if (!hourId) next.hour = "Elige una hora.";
    if (!isValidPersonName(name)) next.name = "Escribe tu nombre (2 a 20 letras).";
    if (!isValidPersonName(lastName)) next.lastName = "Escribe tu apellido (2 a 20 letras).";
    if (!isValidPhone(phone)) next.phone = "Escribe un celular válido.";
    if (!isValidEmail(email)) next.email = "Escribe un correo válido.";
    if (!terms) next.terms = "Debes aceptar los términos y condiciones.";
    setErrors(next);
    setMessage(null);
    if (Object.keys(next).length > 0) return;

    setBusy(true);
    const result = await sendEmailCode(email.trim());
    setBusy(false);
    if (result.ok) setStep("code");
    else setMessage(result.error);
  }

  async function submitCode(event: React.FormEvent) {
    event.preventDefault();
    if (code.length !== OTP_LENGTH) return setMessage(`El código tiene ${OTP_LENGTH} dígitos.`);
    setBusy(true);
    setMessage(null);
    const result = await confirmSeparation({
      reviewId,
      name: name.trim(),
      lastName: lastName.trim(),
      phone: phone.replace(/\s/g, ""),
      email: email.trim(),
      code,
      dateId: String(dayId),
      hourId: String(hourId),
      transactionId,
      sessionId,
    });
    if (result.ok) return router.push(THANK_YOU_PATH);
    setBusy(false);
    setMessage(result.error);
  }

  if (step === "code")
    return (
      <form onSubmit={submitCode} className="flex flex-col gap-5">
        <h2 className="text-heading-1 font-bold text-dark-gray">Confirma tu correo</h2>
        <p className="text-small font-medium text-gray-dark">
          Te enviamos un código de {OTP_LENGTH} dígitos a {email}.
        </p>
        <OtpInputComponent value={code} onChange={setCode} disabled={busy} invalid={Boolean(message)} />
        {message && (
          <p role="alert" className="text-caption text-[#ed3f3f]">
            {message}
          </p>
        )}
        <div className="flex flex-wrap items-center gap-4">
          <ButtonComponent type="submit" disabled={busy || code.length !== OTP_LENGTH}>
            {busy ? "Confirmando" : "Confirmar cita"}
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
    <form onSubmit={submitForm} noValidate className="flex flex-col gap-6">
      <fieldset className="flex flex-col gap-2">
        <legend className="mb-2 text-body font-bold text-dark-gray">1. ¿Qué día te queda bien?</legend>
        {days.length === 0 && <p className="text-small text-gray-dark">No hay días disponibles ahora. Escríbenos por WhatsApp.</p>}
        <div className="flex flex-wrap gap-2">
          {days.map((day) => (
            <Choice key={day.id} selected={dayId === day.id} onClick={() => pickDay(day.id)}>
              {dayLabel(day.date)}
            </Choice>
          ))}
        </div>
        {errors.day && <p role="alert" className="text-caption text-[#ed3f3f]">{errors.day}</p>}
      </fieldset>

      {dayId && (
        <fieldset className="flex flex-col gap-2">
          <legend className="mb-2 text-body font-bold text-dark-gray">2. ¿A qué hora?</legend>
          {hours === null && <p className="text-small text-gray-dark">Buscando horas…</p>}
          {hours?.length === 0 && <p className="text-small text-gray-dark">Este día no tiene horas libres. Elige otro.</p>}
          <div className="flex flex-wrap gap-2">
            {hours?.map((hour) => (
              <Choice key={hour.id} selected={hourId === hour.id} onClick={() => setHourId(hour.id)}>
                {hourLabel(hour.hour_from)} – {hourLabel(hour.hour_to)}
              </Choice>
            ))}
          </div>
          {errors.hour && <p role="alert" className="text-caption text-[#ed3f3f]">{errors.hour}</p>}
        </fieldset>
      )}

      <div className="flex flex-col gap-4">
        <h2 className="text-body font-bold text-dark-gray">3. Tus datos</h2>
        <QuoteTextFieldComponent id="cita-name" label="Nombre" required autoComplete="given-name" value={name} error={errors.name} onChange={(e) => setName(e.target.value)} />
        <QuoteTextFieldComponent id="cita-lastname" label="Apellido" required autoComplete="family-name" value={lastName} error={errors.lastName} onChange={(e) => setLastName(e.target.value)} />
        <QuoteTextFieldComponent id="cita-phone" label="Celular" required inputMode="tel" autoComplete="tel" value={phone} error={errors.phone} onChange={(e) => setPhone(e.target.value)} />
        <QuoteTextFieldComponent id="cita-email" label="Correo" required type="email" autoComplete="email" value={email} error={errors.email} onChange={(e) => setEmail(e.target.value)} />
      </div>

      <div className="flex flex-col gap-1">
        <label className="flex items-start gap-2 text-small font-medium text-gray-dark">
          <input type="checkbox" checked={terms} onChange={(e) => setTerms(e.target.checked)} className="mt-1 size-4 shrink-0 accent-orange" />
          <span>
            Acepto los{" "}
            <a href={ROUTES.buyerPolicies} target="_blank" rel="noopener noreferrer" className="text-[#5b7aa6] underline hover:text-orange">
              términos y condiciones
            </a>
            .
          </span>
        </label>
        {errors.terms && <p role="alert" className="text-caption text-[#ed3f3f]">{errors.terms}</p>}
      </div>

      {message && (
        <p role="alert" className="text-caption text-[#ed3f3f]">
          {message}
        </p>
      )}
      <div>
        <ButtonComponent type="submit" disabled={busy}>
          {busy ? "Enviando código" : "Agendar cita"}
        </ButtonComponent>
      </div>
    </form>
  );
}

function Choice({ selected, onClick, children }: { selected: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={`cursor-pointer rounded-sm border-2 px-3 py-2 text-small font-bold capitalize focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange ${
        selected ? "border-orange bg-orange text-white" : "border-gray/40 bg-white text-dark-gray hover:border-orange"
      }`}
    >
      {children}
    </button>
  );
}
