import Image from "next/image";

import ButtonComponent from "@/modules/shared/components/ButtonComponent";
import { ROUTES } from "@/modules/shared/constants/routes";
import { TUCARRO_URL } from "../constants/advice";

const INTRO =
  "Cuando te dices ¡Compra tu carro en Colombia! Los carros usados pueden ser una excelente opción. No solo ofrecen un precio más cómodo que los vehículos nuevos, sino que también puedes encontrar modelos más antiguos o raros que ya no están disponibles en el mercado.";
const CAUTION =
  "Sin embargo, al comprar un carro usado, es importante que tomes algunas precauciones para garantizar que estás haciendo una inversión segura y satisfactoria.";

/**
 * "Compra tu carro en Colombia": en desktop es un zigzag de 1128 de ancho. Foto del
 * volante (504x336) a la izquierda arriba; título y dos párrafos a la derecha; abajo,
 * los MISMOS dos párrafos a la izquierda (así está en el sitio anterior y en el
 * diseño) con los botones, y la foto del jeep (504x284) a la derecha. Fondo gris
 * `#F6F7F9` a todo el ancho.
 *
 * En mobile el texto repetido se oculta (`hidden xl:block`): el mismo párrafo dos
 * veces seguidas solo sirve para el zigzag de desktop.
 * TODO: confirmar con diseño si el texto repetido es intencional.
 *
 * "Listado tu carro.com" (copy tal cual del diseño) abre el perfil de WCAR en
 * tucarro.com. "Compra seguro aquí" apuntaba a /vende-tu-carro en el sitio
 * anterior (parece un descuido): aquí va al catálogo. TODO: confirmar.
 */
export default function BuyOrSellBuyComponent() {
  return (
    <section aria-labelledby="buy-title" className="bg-gray-light px-8 py-12">
      <div className="mx-auto grid max-w-[1128px] gap-x-[72px] gap-y-8 xl:grid-cols-[504px_552px] xl:justify-between">
        <Image
          src="/assets/compra-o-vende/compra/conductor-volante-carretera.webp"
          alt="Conductor al volante de un carro por una carretera rodeada de montañas"
          width={1008}
          height={672}
          sizes="(min-width: 1280px) 504px, 100vw"
          className="reveal reveal-left h-auto w-full rounded-[10px] xl:h-[336px] xl:w-[504px] xl:object-cover"
        />
        <div>
          <h2 id="buy-title" className="reveal text-[30px] leading-[1.2] font-bold text-dark-gray xl:text-subheadline-1 xl:leading-[43.2px]">
            Compra tu carro en Colombia
          </h2>
          <p className="reveal py-3 text-[17.5px] leading-[21px] font-medium text-dark-gray">{INTRO}</p>
          <p className="reveal py-3 text-[17.5px] leading-[21px] font-medium text-dark-gray">{CAUTION}</p>
        </div>

        <div className="xl:pt-0">
          <p className="reveal hidden py-3 text-[17.5px] leading-[21px] font-medium text-dark-gray xl:block">{INTRO}</p>
          <p className="reveal hidden py-3 text-[17.5px] leading-[21px] font-medium text-dark-gray xl:block">{CAUTION}</p>
          <div className="reveal mt-2 flex flex-wrap gap-4 xl:mt-[8px]">
            <ButtonComponent href={ROUTES.buyCar} variant="primary" size="medium" className="h-10! max-w-none!">
              Compra seguro aquí
            </ButtonComponent>
            <ButtonComponent href={TUCARRO_URL} newTab variant="primary" size="medium" className="h-10! max-w-none!">
              Listado tu carro.com
            </ButtonComponent>
          </div>
        </div>
        <Image
          src="/assets/compra-o-vende/compra/jeep-negro-trasera.webp"
          alt="Jeep negro visto por detrás, ejemplo de un carro usado para comprar en Colombia"
          width={1008}
          height={567}
          sizes="(min-width: 1280px) 504px, 100vw"
          className="reveal reveal-right h-auto w-full rounded-[10px] xl:w-[504px]"
        />
      </div>
    </section>
  );
}
