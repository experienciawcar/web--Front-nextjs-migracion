import type { Metadata } from "next";

import StaticLegalPageComponent from "@/modules/legal-pages/components/StaticLegalPageComponent";
import {
  PRIVACY_POLICY_HTML,
  PRIVACY_POLICY_TITLE,
} from "@/modules/legal-pages/constants/privacy-policy-html";
import { ROUTES } from "@/modules/shared/constants/routes";
import { buildPageMetadata } from "@/modules/shared/utils/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Política de Privacidad | WCAR",
  description:
    "Política de tratamiento de datos personales de WCAR: qué datos recolectamos, para qué los usamos y cómo ejercer tus derechos.",
  path: ROUTES.privacyPolicy,
});

/** Política de Privacidad (`ROUTES.privacyPolicy`), la misma URL del sitio anterior. */
export default function PrivacyPolicyPage() {
  return (
    <main className="flex-1">
      <StaticLegalPageComponent
        title={PRIVACY_POLICY_TITLE}
        html={PRIVACY_POLICY_HTML}
      />
    </main>
  );
}
