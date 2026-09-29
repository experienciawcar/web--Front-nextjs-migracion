import { Plus_Jakarta_Sans } from "next/font/google";

/**
 * Plus Jakarta Sans SemiBold 16 (letra -2 %, interlineado 1,5): la tipografía de
 * los rótulos del formulario del simulador ("Valor del Vehículo *"). Es el estilo
 * de texto "Semibold/Type@16" del diseño; el resto de la página es Urbanist.
 * TODO: confirmar con diseño que es intencional y no un estilo heredado de otro
 * kit de componentes (todo lo demás del sitio es Urbanist).
 */
export const formLabelFont = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: "600",
});
