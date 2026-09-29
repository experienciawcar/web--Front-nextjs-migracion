import type { StaticImageData } from "next/image";

/** Un paso del proceso de financiación ("1. Simulación"). */
export type FinancingStep = {
  id: string;
  /** Sin el número: la tarjeta lo antepone según su posición ("1. Simulación"). */
  title: string;
  description: string;
  icon: StaticImageData;
};
