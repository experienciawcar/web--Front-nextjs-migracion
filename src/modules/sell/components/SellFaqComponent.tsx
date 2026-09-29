import AccordionIconComponent from "@/modules/shared/components/AccordionIconComponent";
import { PROCEDURES } from "@/modules/procedures/constants/procedures";

/**
 * "Preguntas *frecuentes*": mismo patrón visual que `FinancingFaqComponent`
 * (raya naranja + título + acordeón `<details name>` nativo), pero con datos
 * distintos: aquí las preguntas son **exactamente** los seis `PROCEDURES` de
 * `/tramites-de-vehiculos` (comprobado contra el texto del sitio anterior:
 * es idéntico, letra por letra), no contenido nuevo ni lorem. Por eso importa
 * la constante en vez de copiarla.
 *
 * Medido con `cdp.py` contra `https://wcar.co/vende-tu-carro` a 1440: bloque
 * de ~799px centrado, cabeceras de 54px con el título en 20px negrita.
 *
 * Ninguna captura del usuario mostraba con claridad cuál pregunta arranca
 * abierta (a diferencia de Financiación, donde la primera va abierta): se
 * dejan todas cerradas. TODO: confirmar con diseño.
 */
export default function SellFaqComponent() {
  return (
    <section aria-labelledby="sell-faq-title" className="bg-white px-8 py-12 xl:px-0 xl:py-20">
      <div className="mx-auto max-w-[799px]">
        <span aria-hidden className="reveal block h-1 w-[77px] bg-orange" />
        <h2 id="sell-faq-title" className="reveal mt-4 text-subheadline-1 leading-11 font-bold text-dark-gray">
          Preguntas <span className="font-normal text-orange italic">frecuentes</span>
        </h2>

        <div className="reveal relative mt-10 xl:mt-16">
          {PROCEDURES.map((procedure) => (
            <details
              key={procedure.id}
              name="sell-faq"
              className="group relative py-[3px] before:absolute before:inset-x-0 before:-top-[1.5px] before:h-[3px] before:bg-gray-light last:after:absolute last:after:inset-x-0 last:after:-bottom-[1.5px] last:after:h-[3px] last:after:bg-gray-light"
            >
              <summary className="flex cursor-pointer items-start justify-between gap-4 py-4 marker:content-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange [&::-webkit-details-marker]:hidden">
                <span className="text-body font-bold text-dark-gray">{procedure.title}</span>
                <AccordionIconComponent />
              </summary>
              <div aria-hidden className="h-[3px] bg-gray-light" />
              <p className="px-6 pt-4 pb-8 text-body font-medium text-gray-dark">{procedure.description}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
