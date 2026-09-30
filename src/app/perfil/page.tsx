import type { Metadata } from "next";
import { redirect } from "next/navigation";

import AccountViewComponent from "@/modules/auth/components/AccountViewComponent";
import { getSessionUser } from "@/modules/auth/services/session";
import { ROUTES } from "@/modules/shared/constants/routes";
import { buildPageMetadata } from "@/modules/shared/utils/seo";

export const metadata: Metadata = {
  ...buildPageMetadata({
    title: "Mi cuenta | WCAR",
    description: "Consulta y edita los datos de tu cuenta de WCAR.",
    path: ROUTES.account,
  }),
  robots: { index: false, follow: false },
};

/** Vista Mi cuenta (`ROUTES.account`). Sin sesión, manda al login y vuelve aquí al entrar. */
export default async function AccountPage() {
  const user = await getSessionUser();
  if (!user) redirect(`${ROUTES.signIn}?next=${encodeURIComponent(ROUTES.account)}`);

  return (
    <main className="flex-1">
      <AccountViewComponent user={user} />
    </main>
  );
}
