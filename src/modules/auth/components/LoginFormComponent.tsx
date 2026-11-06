"use client";

import { useRouter } from "next/navigation";
import { useEffect, useId, useState } from "react";

import iconAccount from "@/modules/shared/assets/navbar/icon-account.svg";
import ButtonComponent from "@/modules/shared/components/ButtonComponent";

import { OTP_LENGTH, OTP_RESEND_SECONDS } from "../constants/auth";
import {
  loginWithPasswordCall,
  notifySessionChange,
  registerCall,
  safeNextPath,
  sendOtpCode,
  signInWithGoogleCredential,
  verifyOtpCode,
} from "../services/auth-client";
import GoogleSignInButtonComponent from "./GoogleSignInButtonComponent";
import OtpInputComponent from "./OtpInputComponent";

/**
 * Inicio de sesión (docs/login.md): correo + contraseña, "Crear cuenta" y
 * Google. Quien olvidó la contraseña entra con un código al correo (OTP).
 */
const INPUT =
  "mt-1 h-9 w-full rounded-sm bg-gray-light px-3 text-body text-dark-gray outline-none placeholder:text-gray-dark focus-visible:ring-2 focus-visible:ring-orange disabled:opacity-50";
const LINK = "cursor-pointer text-orange hover:underline";

export default function LoginFormComponent({
  next,
  redirectTo,
}: {
  next?: string;
  redirectTo: string;
}) {
  const router = useRouter();
  const ids = useId();
  const [step, setStep] = useState<"password" | "register" | "email" | "code">(
    "password",
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
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

  async function submitPassword() {
    setBusy(true);
    setError("");
    const result =
      step === "register"
        ? await registerCall({ name, email: email.trim(), phone, password })
        : await loginWithPasswordCall(email.trim(), password);
    if (result.ok) return finish();
    setBusy(false);
    setError(result.error);
  }

  function goTo(next: typeof step) {
    setStep(next);
    setError("");
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
      {step === "password" || step === "register" ? (
        <form
          onSubmit={(event) => {
            event.preventDefault();
            void submitPassword();
          }}
        >
          <p className="text-small text-dark-gray">
            {step === "register"
              ? "Crea tu cuenta para continuar."
              : "Por favor, inicie sesión con su correo electrónico."}
          </p>
          {step === "register" && (
            <>
              <label
                htmlFor={`${ids}-name`}
                className="mt-4 block text-small text-dark-gray"
              >
                Nombre <span className="text-orange">*</span>
              </label>
              <input
                id={`${ids}-name`}
                required
                autoComplete="name"
                maxLength={100}
                value={name}
                disabled={busy}
                onChange={(event) => setName(event.target.value)}
                className={INPUT}
              />
              <label
                htmlFor={`${ids}-phone`}
                className="mt-4 block text-small text-dark-gray"
              >
                Teléfono <span className="text-orange">*</span>
              </label>
              <input
                id={`${ids}-phone`}
                type="tel"
                required
                autoComplete="tel"
                maxLength={20}
                value={phone}
                disabled={busy}
                onChange={(event) => setPhone(event.target.value)}
                className={INPUT}
              />
            </>
          )}
          <label
            htmlFor={`${ids}-email`}
            className="mt-4 block text-small text-dark-gray"
          >
            Email <span className="text-orange">*</span>
          </label>
          <input
            id={`${ids}-email`}
            type="email"
            required
            autoComplete="email"
            maxLength={254}
            value={email}
            disabled={busy}
            placeholder="ejemplo@gmail.com"
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? errorId : undefined}
            onChange={(event) => setEmail(event.target.value)}
            className={INPUT}
          />
          <label
            htmlFor={`${ids}-password`}
            className="mt-4 block text-small text-dark-gray"
          >
            Contraseña <span className="text-orange">*</span>
          </label>
          <input
            id={`${ids}-password`}
            type="password"
            required
            minLength={step === "register" ? 8 : undefined}
            autoComplete={
              step === "register" ? "new-password" : "current-password"
            }
            value={password}
            disabled={busy}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? errorId : undefined}
            onChange={(event) => setPassword(event.target.value)}
            className={INPUT}
          />
          {errorMessage}
          <div className="mt-10 flex justify-center">
            <ButtonComponent type="submit" icon={iconAccount} disabled={busy}>
              {busy
                ? "Un momento…"
                : step === "register"
                  ? "Crear cuenta"
                  : "Iniciar sesión"}
            </ButtonComponent>
          </div>
          <div className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2 text-small font-bold">
            <button
              type="button"
              disabled={busy}
              className={LINK}
              onClick={() =>
                goTo(step === "register" ? "password" : "register")
              }
            >
              {step === "register" ? "Ya tengo cuenta" : "Crear cuenta"}
            </button>
            {step === "password" && (
              <button
                type="button"
                disabled={busy}
                className={LINK}
                onClick={() => goTo("email")}
              >
                Entrar con código al correo
              </button>
            )}
          </div>
        </form>
      ) : step === "email" ? (
        <form
          onSubmit={(event) => {
            event.preventDefault();
            void requestCode();
          }}
        >
          <p className="text-small text-dark-gray">
            Por favor, inicie sesión con su correo electrónico.
          </p>
          <label
            htmlFor={`${ids}-email`}
            className="mt-6 block text-small text-dark-gray"
          >
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
            className={INPUT}
          />
          {errorMessage}
          <div className="mt-10 flex justify-center">
            <ButtonComponent type="submit" icon={iconAccount} disabled={busy}>
              {busy ? "Enviando…" : "Iniciar sesión"}
            </ButtonComponent>
          </div>
          <div className="mt-6 flex justify-center text-small font-bold">
            <button
              type="button"
              disabled={busy}
              className={LINK}
              onClick={() => goTo("password")}
            >
              Usar contraseña
            </button>
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
            Enviamos un código de {OTP_LENGTH} dígitos a{" "}
            <strong>{email.trim()}</strong>. Revisa también la carpeta de correo
            no deseado.
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
            <ButtonComponent
              type="submit"
              icon={iconAccount}
              disabled={busy || code.length !== OTP_LENGTH}
            >
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
              {cooldown > 0
                ? `Reenviar código (${cooldown}s)`
                : "Reenviar código"}
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

      {step !== "code" && (
        <>
          <div
            className="my-8 flex items-center gap-4 text-small text-gray-dark"
            aria-hidden
          >
            <span className="h-px flex-1 bg-gray/40" />o
            <span className="h-px flex-1 bg-gray/40" />
          </div>
          <div className="flex justify-center">
            <GoogleSignInButtonComponent
              onCredential={googleSignIn}
              disabled={busy}
            />
          </div>
        </>
      )}
    </div>
  );
}
