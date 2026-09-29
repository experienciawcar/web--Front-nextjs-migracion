import FeatureCardComponent from "@/modules/shared/components/FeatureCardComponent";

import { SELL_BENEFITS } from "../constants/benefits";

/**
 * "Vende tu carro fácil y seguro": la franja naranja con la píldora negra
 * (medida con `cdp.py` contra el sitio anterior: `.banner_background` es
 * naranja sólido de 56px de alto, con una cuña blanca a la izquierda —
 * `sell_img.png`, que aquí se reconstruye con `clip-path` en vez de la
 * imagen— y una píldora negra centrada con el texto en blanco) y, debajo, las
 * 3 tarjetas de beneficio a fondo blanco.
 *
 * Los textos son los reales del sitio anterior (sin lorem). Los íconos (carro,
 * `$` en círculo, laptop) se dibujaron nuevos: el sitio anterior no traía un
 * SVG original, solo una fuente de íconos.
 */
export default function SellBenefitsComponent() {
  return (
    <section aria-label="Vende tu carro fácil y seguro" className="bg-white">
      <div className="relative flex h-14 items-center justify-center overflow-hidden bg-orange">
        <span
          aria-hidden
          className="absolute inset-y-0 left-0 w-[35%] bg-white"
          style={{ clipPath: "polygon(0 0, 100% 0, 55% 100%, 0 100%)" }}
        />
        <p className="reveal relative rounded-md bg-black px-4 py-1.5 text-small font-bold text-white xl:text-body">
          Vende tu carro fácil y seguro
        </p>
      </div>

      <div className="container-wcar grid grid-cols-1 gap-10 py-12 md:grid-cols-3 md:gap-6 xl:py-16">
        {SELL_BENEFITS.map((benefit) => (
          <FeatureCardComponent
            key={benefit.id}
            icon={benefit.icon}
            title={benefit.title}
            description={benefit.description}
            mobileCentered
            className="reveal"
          />
        ))}
      </div>
    </section>
  );
}
