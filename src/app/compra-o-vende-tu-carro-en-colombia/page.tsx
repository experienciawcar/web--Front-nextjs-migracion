import type { Metadata } from "next";

import BuyOrSellAdviceComponent from "@/modules/buy-or-sell/components/BuyOrSellAdviceComponent";
import BuyOrSellBuyComponent from "@/modules/buy-or-sell/components/BuyOrSellBuyComponent";
import BuyOrSellExtraAdviceComponent from "@/modules/buy-or-sell/components/BuyOrSellExtraAdviceComponent";
import BuyOrSellHeroComponent from "@/modules/buy-or-sell/components/BuyOrSellHeroComponent";
import BuyOrSellSellComponent from "@/modules/buy-or-sell/components/BuyOrSellSellComponent";
import { ROUTES } from "@/modules/shared/constants/routes";
import { buildPageMetadata } from "@/modules/shared/utils/seo";

// TODO(seo): confirmar con marketing la palabra clave ("compra o vende tu carro en
// Colombia" por defecto, la del título de la vista). Título y descripción escritos
// desde el contenido de la página.
export const metadata: Metadata = buildPageMetadata({
  title: "Compra o vende tu carro en Colombia | WCAR",
  description:
    "Compra o vende tu carro usado en Colombia con WCAR: consejos para comprar y vender con seguridad, sin estafas ni problemas legales. ¡Empieza hoy!",
  path: ROUTES.buyOrSell,
});

/**
 * Vista "Compra o vende tu carro en Colombia": la página a la que lleva el item
 * "Compra o Vende" del menú. Sin Figma: el diseño es el sitio anterior
 * (`https://wcar.co/compra-o-vende-tu-carro-en-colombia`), medido en vivo con
 * `cdp.py` y con las 4 capturas del usuario. Sin datos del backend: todo el texto
 * es fijo. El Footer es global y vive en el layout.
 */
export default function BuyOrSellPage() {
  return (
    <main className="flex-1">
      <BuyOrSellHeroComponent />
      <BuyOrSellSellComponent />
      <BuyOrSellBuyComponent />
      <BuyOrSellAdviceComponent />
      <BuyOrSellExtraAdviceComponent />
    </main>
  );
}
