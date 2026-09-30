import type { Metadata } from "next";

import StaticLegalPageComponent from "@/modules/legal-pages/components/StaticLegalPageComponent";
import {
  BUYER_POLICIES_HTML,
  BUYER_POLICIES_TITLE,
} from "@/modules/legal-pages/constants/buyer-policies-html";
import { ROUTES } from "@/modules/shared/constants/routes";
import { buildPageMetadata } from "@/modules/shared/utils/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Términos y condiciones del comprador | WCAR",
  description:
    "Términos y condiciones que rigen la relación entre WCAR y el comprador: definiciones, reserva, pago y entrega del vehículo.",
  path: ROUTES.buyerPolicies,
});

/** Términos y condiciones del comprador (`ROUTES.buyerPolicies`), la misma URL del sitio anterior. */
export default function BuyerPoliciesPage() {
  return (
    <main className="flex-1">
      <StaticLegalPageComponent
        title={BUYER_POLICIES_TITLE}
        html={BUYER_POLICIES_HTML}
      />
    </main>
  );
}
