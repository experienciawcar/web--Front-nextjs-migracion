import Image from "next/image";

import ButtonComponent from "@/modules/shared/components/ButtonComponent";
import { ROUTES } from "@/modules/shared/constants/routes";

import logoWcarHorizontal from "../assets/banner/logo-wcar-horizontal.svg";

/**
 * Banner cian "Financiación hasta *del 100%*" con el logo wcar y el botón
 * "Evalúa tu crédito". Se construye en código, no como imagen.
 *
 * Figma: nodo "Banner_785×80" 193:8438, 785 x 80 en (327,931), centrado en el
 * lienzo. Es cian (`blue-neon`) con un patrón de conchas oscuras al 5 % (un tile
 * PNG de 71 x 73 mostrado a 58,84 x 60,49 desde arriba a la izquierda y repetido,
 * `public/assets/financiacion/banner/patron-banner.png`). Dentro: el logo
 * horizontal de 60,5 x 24 en (16,16), el texto Bold 36/44 `dark-gray` en (106,18)
 * con "del 100%" en cursiva regular, y el botón `primary` a 16 de arriba y de la
 * derecha. La marca cian que se ve en la esquina del botón en el diseño es un
 * fotograma de la animación de brillo (`button-shine`): no se dibuja.
 *
 * Cruza la costura entre los pasos y el simulador: arranca 40 px por encima del
 * gris (lo coloca `FinancingSimulatorComponent`).
 *
 * Mobile (no hay diseño): apilado y centrado, con el texto a 28 px.
 *
 * TODO: destino de "Evalúa tu crédito" (hoy `ROUTES.contact`). En el sitio
 * anterior era un enlace suelto a un documento de ZapSign: no se copió.
 */
export default function FinancingBannerComponent({ className = "" }: { className?: string }) {
  return (
    <div
      className={`relative flex flex-col items-center gap-4 overflow-hidden bg-blue-neon p-4 text-center xl:block xl:h-20 xl:w-[785px] xl:p-0 xl:text-left ${className}`}
    >
      <div
        aria-hidden
        className="absolute inset-0 bg-[url('/assets/financiacion/banner/patron-banner.png')] bg-size-[58.84px_60.49px] bg-top-left opacity-5"
      />
      <Image
        src={logoWcarHorizontal}
        alt="WCAR"
        className="relative h-6 w-[60.5px] xl:absolute xl:top-4 xl:left-4"
      />
      <p className="relative text-subheadline-1 leading-11 font-bold text-dark-gray xl:absolute xl:top-[18px] xl:left-[106px] xl:whitespace-nowrap">
        Financiación hasta <span className="font-normal italic">del 100%</span>
      </p>
      <div className="relative xl:absolute xl:top-4 xl:right-4">
        {/* TODO: destino del botón (ver el JSDoc). */}
        <ButtonComponent href={ROUTES.contact}>EVALÚA TU CRÉDITO</ButtonComponent>
      </div>
    </div>
  );
}
