"use client";

import { useRouter } from "next/navigation";
import { useId, useState } from "react";

import ButtonComponent from "@/modules/shared/components/ButtonComponent";
import { ROUTES } from "@/modules/shared/constants/routes";

import { notifySessionChange, updateName } from "../services/auth-client";

const INPUT =
  "mt-1 h-10 w-full rounded-sm bg-white px-3 text-body text-dark-gray outline-none focus-visible:ring-2 focus-visible:ring-orange read-only:bg-transparent read-only:px-0 read-only:text-gray-dark disabled:opacity-50";

/** Datos de la cuenta. Solo el nombre se edita (`PATCH /user/update/`); correo y teléfono son de lectura. */
export default function ProfileFormComponent({ name, email, phone }: { name: string; email: string; phone: string }) {
  const router = useRouter();
  const ids = useId();
  const [value, setValue] = useState(name);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const changed = value.trim() !== name;

  return (
    <form
      onSubmit={async (event) => {
        event.preventDefault();
        setBusy(true);
        setMessage(null);
        const result = await updateName(value);
        setBusy(false);
        if (!result.ok) {
          // Un token vencido borra la sesión en el servidor: hay que volver a entrar.
          if (/sesión/i.test(result.error)) {
            notifySessionChange();
            return router.replace(ROUTES.signIn);
          }
          return setMessage({ ok: false, text: result.error });
        }
        setMessage({ ok: true, text: "Cambios guardados." });
        notifySessionChange();
        router.refresh();
      }}
    >
      <label htmlFor={`${ids}-name`} className="block text-small font-bold text-dark-gray">
        Nombre
      </label>
      <input
        id={`${ids}-name`}
        value={value}
        required
        minLength={2}
        maxLength={80}
        autoComplete="name"
        disabled={busy}
        onChange={(event) => setValue(event.target.value)}
        className={INPUT}
      />

      <label htmlFor={`${ids}-email`} className="mt-4 block text-small font-bold text-dark-gray">
        Correo electrónico
      </label>
      <input id={`${ids}-email`} value={email} readOnly className={INPUT} />

      {phone && (
        <>
          <label htmlFor={`${ids}-phone`} className="mt-4 block text-small font-bold text-dark-gray">
            Teléfono
          </label>
          <input id={`${ids}-phone`} value={phone} readOnly className={INPUT} />
        </>
      )}

      {message && (
        <p role={message.ok ? "status" : "alert"} className={`mt-4 text-small ${message.ok ? "text-dark-gray" : "text-red-600"}`}>
          {message.text}
        </p>
      )}
      <ButtonComponent type="submit" disabled={busy || !changed} className="mt-6">
        {busy ? "Guardando…" : "Guardar cambios"}
      </ButtonComponent>
    </form>
  );
}
