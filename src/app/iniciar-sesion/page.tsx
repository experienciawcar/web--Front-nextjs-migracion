import type { Metadata } from "next";
import { redirect } from "next/navigation";

import LoginViewComponent from "@/modules/auth/components/LoginViewComponent";
import { safeNextPath } from "@/modules/auth/services/auth-client";
import { getSessionUser } from "@/modules/auth/services/session";
import { ROUTES } from "@/modules/shared/constants/routes";
import { buildPageMetadata } from "@/modules/shared/utils/seo";

// Es una pantalla de acceso: no tiene nada que posicionar y `?next=` crearía duplicados.
export const metadata: Metadata = {
  ...buildPageMetadata({
    title: "Iniciar sesión | WCAR",
    description: "Inicia sesión en WCAR con tu correo electrónico o con Google.",
    path: ROUTES.signIn,
  }),
  robots: { index: false, follow: true },
};

/**
 * Vista Login (`ROUTES.signIn`). Con sesión abierta no tiene sentido: manda a
 * la cuenta (o a donde pidió `?next=`). Por leer las cookies es dinámica.
 */
export default async function SignInPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;
  if (await getSessionUser()) redirect(safeNextPath(next, ROUTES.account));

  return (
    <main className="flex-1">
      <LoginViewComponent next={next} redirectTo={ROUTES.account} />
    </main>
  );
}
