import Image from "next/image";

import arrowCircle from "@/modules/shared/assets/icons/arrow-circle.svg";
import ButtonComponent from "@/modules/shared/components/ButtonComponent";
import { ROUTES } from "@/modules/shared/constants/routes";

/**
 * Hero de "Compra o vende tu carro en Colombia": la foto del Mini rojo (1200x800
 * recortada a 1440x478 con `object-cover`) con el título y dos botones apilados a
 * la izquierda. Medido con `cdp.py` contra
 * `https://wcar.co/compra-o-vende-tu-carro-en-colombia` a 1440 (no hay Figma): el
 * `<h1>` arranca en x=72, mide 46px de peso 700 y su tercer renglón ("en 2026") va
 * en cursiva; los botones miden 184 y 261 de ancho con el ícono de flecha.
 *
 * Mobile sin diseño: se adapta con el criterio de la guía §4.3 (alto menor, texto
 * sobre la foto). TODO: confirmar con diseño.
 */
export default function BuyOrSellHeroComponent() {
  return (
    <section className="relative overflow-hidden bg-black" aria-label="Compra o vende tu carro">
      <Image
        src="/assets/compra-o-vende/hero/mini-rojo-frente.webp"
        alt=""
        aria-hidden
        fill
        preload
        sizes="100vw"
        className="object-cover"
      />
      <div aria-hidden className="absolute inset-0 bg-black/25" />
      <div className="relative mx-auto flex min-h-[420px] max-w-[1440px] items-center px-8 py-12 xl:h-[478px] xl:py-0 xl:pl-[72px]">
        <div>
          <h1 className="reveal text-[34px] leading-[1.2] text-white xl:text-[46px] xl:leading-[55.2px]">
            <span className="font-bold">
              Compra o vende <br className="hidden xl:block" />
              tu carro en Colombia
            </span>{" "}
            <br />
            <span className="italic">en 2026</span>
          </h1>
          <div className="reveal mt-6 flex flex-col items-start gap-2">
            <ButtonComponent href={ROUTES.quote} variant="primary" icon={arrowCircle}>
              Vende tu carro
            </ButtonComponent>
            <ButtonComponent href={ROUTES.buyCar} variant="primary" icon={arrowCircle} className="px-12">
              Compra tu carro
            </ButtonComponent>
          </div>
        </div>
      </div>
    </section>
  );
}
