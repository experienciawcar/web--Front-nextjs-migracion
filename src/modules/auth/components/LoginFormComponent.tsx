"use client";

import { useRouter } from "next/navigation";
import { useEffect, useId, useState } from "react";

import iconAccount from "@/modules/shared/assets/navbar/icon-account.svg";
import ButtonComponent from "@/modules/shared/components/ButtonComponent";

import { OTP_LENGTH, OTP_RESEND_SECONDS } from "../constants/auth";
import {
  notifySessionChange,
  safeNextPath,
  sendOtpCode,
  signInWithGoogleCredential,
  verifyOtpCode,
} from "../services/auth-client";
import GoogleSignInButtonComponent from "./GoogleSignInButtonComponent";
import OtpInputComponent from "./OtpInputComponent";

/**
 * Formulario de inicio de sesión, sin contraseña: correo → código de 6 dígitos
 * que llega al correo → sesión. Y "Continuar con Google" como alternativa.
 * No existe "crear cuenta" aparte: entrar con un correo nuevo la crea (lo
 * decide el backend; ver docs/CUENTA_DE_USUARIO_Y_LOGIN.md §1).
 */
export default function LoginFormComponent({ next, redirectTo }: { next?: string; redirectTo: string }) {
  const router = useRouter();
  const ids = useId();
  const [step, setStep] = useState<"email" | "code">("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((seconds) => seconds - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const finish = () => {
    notifySessionChange();
    router.replace(safeNextPath(next, redirectTo));
    router.refresh();
  };

  async function requestCode() {
    setBusy(true);
    setError("");
    const result = await sendOtpCode(email.trim());
    setBusy(false);
    if (!result.ok) return setError(result.error);
    setCode("");
    setCooldown(OTP_RESEND_SECONDS);
    setStep("code");
  }

  async function verify(value: string) {
    if (busy || value.length !== OTP_LENGTH) return;
    setBusy(true);
    setError("");
    const result = await verifyOtpCode(email.trim(), value);
    if (result.ok) return finish();
    setBusy(false);
    setError(result.error);
  }

  async function googleSignIn(credential: string) {
    setBusy(true);
    setError("");
    const result = await signInWithGoogleCredential(credential);
    if (result.ok) return finish();
    setBusy(false);
    setError(result.error);
  }

  const errorId = `${ids}-error`;
  const errorMessage = error && (
    <p id={errorId} role="alert" className="mt-2 text-small text-red-600">
      {error}
    </p>
  );

  return (
    <div className="w-full max-w-[416px]">
      {step === "email" ? (
        <form
          onSubmit={(event) => {
            event.preventDefault();
            void requestCode();
          }}
        >
          <p className="text-small text-dark-gray">Por favor, inicie sesión con su correo electrónico.</p>
          <label htmlFor={`${ids}-email`} className="mt-6 block text-small text-dark-gray">
            Email <span className="text-orange">*</span>
          </label>
          <input
            id={`${ids}-email`}
            type="email"
            required
            autoComplete="email"
            autoFocus
            maxLength={254}
            value={email}
            disabled={busy}
            placeholder="ejemplo@gmail.com"
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? errorId : undefined}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-1 h-9 w-full rounded-sm bg-gray-light px-3 text-body text-dark-gray outline-none placeholder:text-gray-dark focus-visible:ring-2 focus-visible:ring-orange disabled:opacity-50"
          />
          {errorMessage}
          <div className="mt-10 flex justify-center">
            <ButtonComponent type="submit" icon={iconAccount} disabled={busy}>
              {busy ? "Enviando…" : "Iniciar sesión"}
            </ButtonComponent>
          </div>
        </form>
      ) : (
        <form
          onSubmit={(event) => {
            event.preventDefault();
            void verify(code);
          }}
        >
          <p className="text-small text-dark-gray">
            Enviamos un código de {OTP_LENGTH} dígitos a <strong>{email.trim()}</strong>. Revisa también la carpeta de
            correo no deseado.
          </p>
          <div className="mt-6">
            <OtpInputComponent
              value={code}
              disabled={busy}
              invalid={!!error}
              describedBy={error ? errorId : undefined}
              onChange={(value) => {
                setCode(value);
                if (value.length === OTP_LENGTH) void verify(value);
              }}
            />
          </div>
          {errorMessage}
          <div className="mt-10 flex justify-center">
            <ButtonComponent type="submit" icon={iconAccount} disabled={busy || code.length !== OTP_LENGTH}>
              {busy ? "Verificando…" : "Verificar"}
            </ButtonComponent>
          </div>
          <div className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2 text-small font-bold">
            <button
              type="button"
              disabled={busy || cooldown > 0}
              onClick={() => void requestCode()}
              className="text-orange enabled:cursor-pointer enabled:hover:underline disabled:text-gray"
            >
              {cooldown > 0 ? `Reenviar código (${cooldown}s)` : "Reenviar código"}
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => {
                setStep("email");
                setError("");
              }}
              className="cursor-pointer text-gray-dark hover:underline"
            >
              Cambiar correo
            </button>
          </div>
        </form>
      )}

      {step === "email" && (
        <>
          <div className="my-8 flex items-center gap-4 text-small text-gray-dark" aria-hidden>
            <span className="h-px flex-1 bg-gray/40" />o<span className="h-px flex-1 bg-gray/40" />
          </div>
          <div className="flex justify-center">
            <GoogleSignInButtonComponent onCredential={googleSignIn} disabled={busy} />
          </div>
        </>
      )}
    </div>
  );
}
