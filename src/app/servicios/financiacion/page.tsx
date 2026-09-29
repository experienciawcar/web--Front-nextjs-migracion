import type { Metadata } from "next";

import FinancingFaqComponent from "@/modules/financing/components/FinancingFaqComponent";
import FinancingHeroComponent from "@/modules/financing/components/FinancingHeroComponent";
import FinancingTradeInComponent from "@/modules/financing/components/FinancingTradeInComponent";
import FinancingWarrantyComponent from "@/modules/financing/components/FinancingWarrantyComponent";
import FinancingProductsComponent from "@/modules/financing/components/FinancingProductsComponent";
import FinancingSimulatorComponent from "@/modules/financing/components/FinancingSimulatorComponent";
import FinancingStepsComponent from "@/modules/financing/components/FinancingStepsComponent";
import { buildPageMetadata } from "@/modules/shared/utils/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Financiación | WCAR",
  description:
    "Financia hasta el 100 % de tu vehículo con WCAR: simula tu cuota, conoce el proceso de financiación, la garantía y los créditos Credirápido y Credifácil.",
  path: "/servicios/financiacion",
});

/**
 * Vista Financiación. La ruta es /servicios/financiacion porque es la que ya
 * apunta el navbar y el footer (`ROUTES.financing` en constants/routes).
 *
 * Diseño: Figma "Wcar Website - 2026", nodo 193:8183 (desktop 1440 x 4848, con
 * el navbar y el footer dentro del marco) y cinco capturas en
 * `docs/planes/financiacion/` (escala 0,532: son marcos de 1440 apilados que
 * encajan uno tras otro, ver el Registro del plan). Las medidas salen de Figma;
 * las capturas sirven para comparar el render. No hay diseño mobile: se adapta
 * con el criterio de la guía §4.3 y se marca en cada componente. Plan de
 * trabajo: `docs/planes/financiacion.md`.
 *
 * No hay endpoint (`/financing/`, `/financiacion/`, `/faqs/`, `/insurers/`,
 * `/simulator/` y `/loans/` dan 404): todo el contenido es fijo en
 * `modules/financing/constants/` y el simulador es una función pura
 * (`services/loan-calculator.ts`).
 *
 * Están todas las secciones del diseño y todas sus imágenes: hero, pasos, banner
 * con el simulador, garantía, "Cambia tu vehículo", "Financia tu Vehículo" y
 * preguntas frecuentes. Faltan por agregar: nada de maquetación. Lo pendiente
 * son datos y decisiones de otros (`grep -rn TODO src/modules/financing`): la
 * tasa y el seguro del simulador (negocio), las preguntas frecuentes reales, el
 * destino de los cinco botones, las erratas del diseño y el diseño mobile. El
 * Footer no va aquí: es global y vive en el layout.
 */
export default function FinancingPage() {
  return (
    <main className="flex-1">
      <FinancingHeroComponent />
      <FinancingStepsComponent />
      <FinancingSimulatorComponent />
      <FinancingWarrantyComponent />
      <FinancingTradeInComponent />
      <FinancingProductsComponent />
      <FinancingFaqComponent />
    </main>
  );
}
