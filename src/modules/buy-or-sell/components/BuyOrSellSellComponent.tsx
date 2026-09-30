import Image from "next/image";

import ButtonComponent from "@/modules/shared/components/ButtonComponent";
import { ROUTES } from "@/modules/shared/constants/routes";

/**
 * "Vende tu carro en Colombia": texto a la izquierda (columna de 552) y foto
 * redondeada de 504x336 a la derecha. Medidas del sitio anterior a 1440: bloque de
 * 1128 centrado, título de 36px/700, párrafo de 17,5px/500 con interlineado de 21.
 */
export default function BuyOrSellSellComponent() {
  return (
    <section aria-labelledby="sell-title" className="bg-white px-8 py-12 xl:py-12">
      <div className="mx-auto grid max-w-[1128px] items-start gap-8 xl:grid-cols-[552px_504px] xl:justify-between">
        <div>
          <h2 id="sell-title" className="reveal text-[30px] leading-[1.2] font-bold text-dark-gray xl:text-subheadline-1 xl:leading-[43.2px]">
            Vende tu carro en Colombia
          </h2>
          <p className="reveal py-3 text-[17.5px] leading-[21px] font-medium text-dark-gray">
            Cuando te dices ¡Vende tu carro en Colombia! Puede ser un proceso desafiante, especialmente si no tienes
            experiencia en la venta de vehículos. Es importante tener en cuenta que, en la actualidad, la mayoría de las
            personas buscan información en línea antes de tomar una decisión de compra, por lo que es fundamental que tu
            vehículo tenga una presencia en línea sólida y efectiva.
          </p>
          <div className="reveal mt-2">
            <ButtonComponent href={ROUTES.sellCar} variant="primary" size="medium" className="h-10! max-w-none!">
              Vende seguro aquí
            </ButtonComponent>
          </div>
        </div>
        <Image
          src="/assets/compra-o-vende/vende/porsche-negro-carretera.webp"
          alt="Porsche negro en una carretera, ejemplo de un carro usado en venta en Colombia"
          width={1008}
          height={672}
          sizes="(min-width: 1280px) 504px, 100vw"
          className="reveal reveal-right h-auto w-full rounded-[10px] xl:w-[504px]"
        />
      </div>
    </section>
  );
}
