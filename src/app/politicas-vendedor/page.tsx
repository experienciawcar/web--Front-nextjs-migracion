import type { Metadata } from "next";

import StaticLegalPageComponent from "@/modules/legal-pages/components/StaticLegalPageComponent";
import {
  SELLER_POLICIES_HTML,
  SELLER_POLICIES_TITLE,
} from "@/modules/legal-pages/constants/seller-policies-html";
import { ROUTES } from "@/modules/shared/constants/routes";
import { buildPageMetadata } from "@/modules/shared/utils/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Términos y condiciones del vendedor | WCAR",
  description:
    "Condiciones generales para quienes venden su vehículo a través de la plataforma de WCAR.",
  path: ROUTES.sellerPolicies,
});

/**
 * Términos y condiciones del vendedor (`ROUTES.sellerPolicies`), la misma URL del sitio anterior.
 * TODO: el título del texto original dice "COMPRADOR" (parece un copia-pega del otro documento);
 * se dejó tal cual hasta que legal confirme.
 */
export default function SellerPoliciesPage() {
  return (
    <main className="flex-1">
      <StaticLegalPageComponent
        title={SELLER_POLICIES_TITLE}
        html={SELLER_POLICIES_HTML}
      />
    </main>
  );
}
