"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";

import { GOOGLE_CLIENT_ID } from "../constants/auth";

/** Lo mínimo de Google Identity Services que se usa (https://developers.google.com/identity/gsi/web). */
type GoogleId = {
  initialize: (config: {
    client_id: string;
    callback: (response: { credential: string }) => void;
    ux_mode?: "popup";
    use_fedcm_for_prompt?: boolean;
  }) => void;
  renderButton: (parent: HTMLElement, options: Record<string, unknown>) => void;
};
declare global {
  interface Window {
    google?: { accounts: { id: GoogleId } };
  }
}

/**
 * Botón "Continuar con Google" oficial (lo dibuja Google en un iframe, con su
 * marca). Al elegir cuenta entrega un `credential` (JWT) que `onCredential`
 * manda al servidor para verificarlo: aquí no se decodifica ni se confía en él.
 *
 * No se usa One Tap automático como el sitio anterior (un prompt que salta solo
 * en cada página): solo este botón, que es lo que el usuario espera en un login.
 */
export default function GoogleSignInButtonComponent({
  onCredential,
  disabled,
}: {
  onCredential: (credential: string) => void;
  disabled?: boolean;
}) {
  const holder = useRef<HTMLDivElement>(null);
  const callback = useRef(onCredential);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    callback.current = onCredential;
  }, [onCredential]);

  useEffect(() => {
    const google = window.google?.accounts.id;
    if (!ready || !google || !holder.current) return;
    google.initialize({ client_id: GOOGLE_CLIENT_ID, callback: (r) => callback.current(r.credential), ux_mode: "popup" });
    holder.current.replaceChildren();
    google.renderButton(holder.current, {
      type: "standard",
      theme: "outline",
      size: "large",
      text: "continue_with",
      shape: "pill",
      locale: "es",
      width: 280,
    });
  }, [ready]);

  return (
    <>
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="lazyOnload"
        onReady={() => setReady(true)}
      />
      {/* Reserva el alto (44px) para que el formulario no salte al cargar el script. */}
      <div
        ref={holder}
        aria-busy={!ready}
        className={`flex h-11 min-w-[280px] items-center justify-center ${disabled ? "pointer-events-none opacity-50" : ""}`}
      />
    </>
  );
}
