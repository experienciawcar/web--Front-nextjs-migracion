import AppLinkComponent from "@/modules/shared/components/AppLinkComponent";
import { ROUTES } from "@/modules/shared/constants/routes";
import { TUCARRO_URL } from "../constants/advice";

const CARD = [
  {
    title: "Haz una prueba de manejo",
    text: "Antes de comprar un auto usado, siempre es recomendable hacer una prueba de manejo. Esto te permitirá sentir cómo maneja el auto y detectar posibles problemas que no hayas notado durante la inspección.",
  },
  {
    title: "No aceptes transacciones en efectivo",
    text: "Las transacciones en efectivo pueden ser riesgosas tanto para compradores como vendedores. En su lugar, utiliza métodos de pago seguros como transferencias bancarias o pagos electrónicos.",
  },
  {
    title: "No te apresures en tomar una decisión",
    text: "Comprar o vender un auto usado puede ser una decisión importante, así que no te apresures en tomarla. Tómate tu tiempo para investigar, comparar opciones y considerar todas las posibilidades antes de tomar una decisión.",
  },
  {
    title: "Busca asesoramiento legal",
    text: "Si tienes dudas sobre los aspectos legales de comprar o vender un auto usado en Colombia, busca asesoramiento legal. En wcar tenemos todo un equipo de expertos dispuestos a asesorarte en tu proceso de venta o compra de tu vehículo usado.",
  },
];

const LINK = "text-orange underline-offset-2 hover:underline";
const BODY = "text-[17.5px] leading-[21px] font-medium text-dark-gray";
const H3 = "text-[24px] leading-[1.2] font-bold text-orange xl:text-[28px] xl:leading-[33.6px]";

/**
 * "Consejos adicionales": fondo gris claro, párrafo de apertura, cuatro consejos
 * en dos columnas de 600 y, a todo el ancho, "Mantén los documentos en orden" con
 * dos párrafos de cierre. Bloque de 1224 (x=108) medido en el sitio anterior.
 * Dentro del texto, "wcar" y "tucarro.com" son enlaces naranjas; "wcar" apuntaba a
 * `wcar.com` (parece un descuido) y aquí va al inicio. TODO: confirmar.
 */
export default function BuyOrSellExtraAdviceComponent() {
  return (
    <section aria-labelledby="extra-title" className="bg-gray-light px-8 py-12 xl:pb-24">
      <div className="mx-auto max-w-[1224px]">
        <h2 id="extra-title" className="reveal text-[28px] leading-[1.2] font-bold text-orange xl:text-subheadline-1 xl:leading-[43.2px]">
          Consejos adicionales
        </h2>
        <p className={`reveal ${BODY}`}>
          Nuestra principal razón de ser en{" "}
          <AppLinkComponent href={ROUTES.home} className={LINK}>
            wcar
          </AppLinkComponent>{" "}
          es brindar a compradores y vendedores todas las herramientas informacionales, técnicas y operativas para que
          puedan realizar una transacción segura y confiable, generando un ambiente comercial vehicular seguro para
          todos los involucrados en la compra o venta de un carro usado en Colombia.
        </p>

        <div className="mt-12 grid gap-x-6 gap-y-10 xl:grid-cols-2">
          {CARD.map((card) => (
            <div key={card.title} className="reveal">
              <h3 className={H3}>{card.title}</h3>
              <p className={BODY}>{card.text}</p>
            </div>
          ))}
        </div>

        <div className="reveal mt-10">
          <h3 className={H3}>Mantén los documentos en orden</h3>
          <p className={BODY}>
            Una vez que hayas comprado o vendido un auto usado, asegúrate de mantener todos los documentos en orden y en
            un lugar seguro. Esto incluye la tarjeta de propiedad, el impuesto de vehículos y la revisión
            técnico-mecánica.
          </p>
          <p className={`${BODY} mt-2`}>
            En conclusión, comprar y vender autos usados en Colombia puede ser una tarea complicada, pero siguiendo estos
            consejos útiles, podrás hacer una transacción exitosa sin preocupaciones. Recuerda hacer tu tarea antes de
            comprar o vender, buscar en diferentes lugares como en{" "}
            <AppLinkComponent href={TUCARRO_URL} className={LINK} target="_blank">
              tucarro.com
            </AppLinkComponent>
            , inspeccionar cuidadosamente el auto, negociar el precio y verificar la documentación.
          </p>
          <p className={`${BODY} mt-2`}>
            Para los vendedores, asegúrate de limpiar y arreglar el auto, anunciar en los lugares correctos, poner un
            precio justo, ofrecer información detallada y ser honesto sobre el estado del auto. Además, no olvides hacer
            una prueba de manejo, utilizar métodos de pago seguros, tomar tu tiempo para tomar una decisión, buscar
            asesoramiento legal y mantener los documentos en orden. Con estos consejos, estarás mejor preparado para
            hacer una transacción exitosa y sin preocupaciones.
          </p>
        </div>
      </div>
    </section>
  );
}
