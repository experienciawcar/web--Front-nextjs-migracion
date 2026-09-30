import Image from "next/image";

import AccordionIconComponent from "@/modules/shared/components/AccordionIconComponent";
import { BUY_ADVICE, SELL_ADVICE, type AdviceItem } from "../constants/advice";

/**
 * Una columna del acordeón: raya naranja de 56x3, título de 29,44px con la
 * segunda línea naranja en cursiva y cinco ítems con línea de 1px `#CDD6DA`
 * (cabecera de 57px, título de 17,5px/700). `<details name>` nativo: uno abierto
 * a la vez por columna, sin JavaScript.
 */
function AdviceColumn({ name, verb, items }: { name: string; verb: string; items: AdviceItem[] }) {
  return (
    <div className="min-w-0">
      <div className="reveal py-[7px]">
        <span aria-hidden className="mb-2 block h-[3px] w-14 bg-orange" />
        <h3 className="text-[26px] leading-[1.2] font-medium text-dark-gray xl:text-[29.44px] xl:leading-[35.3px]">
          Consejos para {verb} <br />
          <span className="text-orange italic">carros usados en Colombia</span>
        </h3>
      </div>
      <div className="reveal mt-4 border-t border-[#cdd6da]">
        {items.map((item) => (
          <details key={item.title} name={name} className="group border-b border-[#cdd6da]">
            <summary className="flex min-h-[57px] cursor-pointer items-center justify-between gap-4 py-[14px] marker:content-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange [&::-webkit-details-marker]:hidden">
              <span className="text-[17.5px] leading-[21px] font-bold text-dark-gray">{item.title}</span>
              <AccordionIconComponent />
            </summary>
            <p className="px-3 pb-5 text-[17.5px] leading-[21px] font-medium text-dark-gray xl:px-4">{item.text}</p>
          </details>
        ))}
      </div>
    </div>
  );
}

/**
 * "Consejos para compra o vende tu carro en Colombia": título naranja, párrafo,
 * dos columnas de acordeón (comprar / vender) y la foto de la conductora
 * (612x408) centrada. Medidas del sitio anterior a 1440: bloque de 1224 (x=108),
 * columnas de 586 separadas por 38.
 */
export default function BuyOrSellAdviceComponent() {
  return (
    <section aria-labelledby="advice-title" className="bg-white px-8 py-12">
      <div className="mx-auto max-w-[1224px]">
        <h2 id="advice-title" className="reveal text-[28px] leading-[1.2] font-bold text-orange xl:text-subheadline-1 xl:leading-[43.2px]">
          Consejos para compra o vende tu carro en Colombia
        </h2>
        <p className="reveal text-[17.5px] leading-[21px] font-medium text-dark-gray">
          Comprar y vender autos usados en Colombia puede ser una tarea complicada, especialmente si no se tiene
          experiencia en el tema. Sin embargo, con algunos consejos útiles, se puede hacer una transacción exitosa sin
          caer en estafas o problemas legales. Aquí te presentamos algunos consejos útiles tanto para compradores como
          vendedores de autos usados en Colombia.
        </p>
        <div className="mt-12 grid gap-10 xl:grid-cols-2 xl:gap-x-[38px]">
          <AdviceColumn name="advice-buy" verb="comprar" items={BUY_ADVICE} />
          <AdviceColumn name="advice-sell" verb="vender" items={SELL_ADVICE} />
        </div>
        <Image
          src="/assets/compra-o-vende/consejos/mujer-conductora.webp"
          alt="Mujer conduciendo un carro, mirando hacia la carretera"
          width={1199}
          height={800}
          sizes="(min-width: 1280px) 612px, 100vw"
          className="reveal reveal-fade mx-auto mt-12 h-auto w-full max-w-[612px] rounded-[10px]"
        />
      </div>
    </section>
  );
}
