"use client";

import Image from "next/image";
import Link from "next/link";
import { useSyncExternalStore } from "react";

import iconAccount from "@/modules/shared/assets/navbar/icon-account.svg";
import { ROUTES } from "@/modules/shared/constants/routes";

import { SESSION_EVENT, SESSION_HINT_COOKIE } from "../constants/auth";
import type { SessionHint } from "../types/auth";

/** Lee el nombre de la cookie `wcar_session` (no HttpOnly); `null` si no hay sesión. Devuelve el texto crudo para que el snapshot sea estable. */
function readHint(): string | null {
  const match = document.cookie.split("; ").find((c) => c.startsWith(`${SESSION_HINT_COOKIE}=`));
  return match ? match.slice(SESSION_HINT_COOKIE.length + 1) : null;
}

function subscribe(onChange: () => void) {
  window.addEventListener(SESSION_EVENT, onChange);
  return () => window.removeEventListener(SESSION_EVENT, onChange);
}

function parseName(raw: string | null): string | null {
  if (!raw) return null;
  try {
    return (JSON.parse(decodeURIComponent(raw)) as SessionHint).name || "Mi cuenta";
  } catch {
    return "Mi cuenta";
  }
}

/**
 * El enlace de cuenta del navbar. El navbar es un componente de servidor que
 * está en TODAS las páginas: si leyera la sesión con `cookies()` volvería
 * dinámicas todas las rutas y se perdería el ISR de las vistas. Por eso esto
 * es un componente cliente que lee la cookie-pista solo con el nombre (en el
 * servidor y en la hidratación no hay sesión: "Iniciar sesión").
 */
export default function AccountLinkComponent() {
  const raw = useSyncExternalStore(subscribe, readHint, () => null);
  const name = parseName(raw);

  return (
    <Link
      href={name ? ROUTES.account : ROUTES.signIn}
      className="flex items-center gap-1 whitespace-nowrap text-small font-bold text-gray-dark transition-colors hover:text-orange"
    >
      {/* El glifo es más pequeño que su caja: 32px en una caja de 40 en
          mobile, y 25.33px en una de 32 en desktop. La caja es la que
          define el espaciado. */}
      <span className="flex size-10 items-center justify-center xl:size-8">
        <Image src={iconAccount} alt="" aria-hidden className="size-8 xl:size-[25.33px]" />
      </span>
      <span className="hidden max-w-[140px] truncate xl:inline">{name ?? "Cuenta"}</span>
      <span className="sr-only xl:hidden">{name ?? "Iniciar sesión"}</span>
    </Link>
  );
}
