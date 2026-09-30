import Image from "next/image";

import { FAQ_ITEMS } from "../constants/faq";

import iconClose from "../assets/faq/icon-cerrar.svg";
import iconPlus from "../assets/faq/icon-mas.svg";

/**
 * "Preguntas *frecuentes*": el título y un acordeón de seis preguntas, sobre el
 * blanco de la página, justo encima del footer.
 *
 * Fuente: Figma "Wcar Website - 2026", nodo "Group 1171276188" 204:6613. Medidas en
 * px del lienzo de 1440, con y=0 en el borde superior de la sección (y=3476, donde
 * acaba el gris de "Financia tu Vehículo"): raya naranja de 77 x 4 en (327,54), título
 * de 36/44 ("frecuentes" en `orange` cursiva regular) 16 debajo, y el acordeón de 786
 * de ancho (centrado: x=327) en y=182, o sea 64 debajo del título. La lista mide 519
 * (209 + 5 x 62) dentro de un marco de 544 que acaba en y=726, y la sección sigue 53
 * más (donde arranca el footer del diseño): 25 + 53 = 78 de relleno abajo, 779 en total.
 *
 * Acordeón nativo, sin JavaScript: `<details name="faq">` (el `name` hace que abrir
 * uno cierre el otro; la primera va abierta) con `group-open:` para cambiar el "+" por
 * la "×" de 24 x 24 de Figma. Cada elemento mide 62 cerrado (bandas de 3 + cabecera de
 * 56 + 3) y 209 abierto (la primera): la cabecera es la pregunta en 16/24 Bold `dark-gray`
 * con 16 de relleno arriba y abajo; abierta, una banda de 3 y la respuesta de 16/24
 * Medium `gray-dark` con 24 a los lados, 16 arriba y 32 abajo (4 renglones a 738). Los
 * separadores son bandas de 3 px `gray-light` **centradas en el límite** entre dos
 * elementos (Figma solapa el borde de abajo de uno con el de arriba del siguiente y
 * queda una sola banda; la primera y la última también quedan centradas en el borde
 * del acordeón).
 *
 * Los dos íconos van con `loading="eager"`: uno de los dos está siempre oculto (`display:none`) y
 * uno perezoso no se pide hasta mostrarse, así que al abrir el primer elemento la × tardaría en
 * aparecer. Son 700 bytes.
 *
 * Sin animación de apertura (un `<details>` salta): no hay nada que reducir con
 * `prefers-reduced-motion`.
 *
 * Teléfono ("financiación - 394", y=5376..6430): el mismo acordeón a 329 de ancho, con
 * 64 de aire arriba, 24 entre el título y la lista y 115 de cierre.
 *
 * TODO: los datos son de prueba (ver `constants/faq.ts`): lorem, la "м" cirílica de
 * "Potentiмnibh", el doble espacio de "ttitore  ismod" y el espacio inicial de la
 * pregunta 4 se conservan del diseño.
 */
export default function FinancingFaqComponent() {
  return (
    <section aria-labelledby="faq-title" className="px-8 pt-16 pb-[115px] xl:px-0 xl:pt-[54px] xl:pb-[78px]">
      <div className="mx-auto max-w-[786px]">
        <span aria-hidden className="block h-1 w-[77px] bg-orange" />
        <h2
          id="faq-title"
          className="mt-6 text-subheadline-1 leading-11 font-bold text-dark-gray xl:mt-4"
        >
          Preguntas <span className="font-normal text-orange italic">frecuentes</span>
        </h2>

        <div className="relative mt-6 xl:mt-16">
          {FAQ_ITEMS.map((item, index) => (
            <details
              key={item.id}
              name="faq"
              open={index === 0}
              className="group relative py-[3px] before:absolute before:inset-x-0 before:-top-[1.5px] before:h-[3px] before:bg-gray-light last:after:absolute last:after:inset-x-0 last:after:-bottom-[1.5px] last:after:h-[3px] last:after:bg-gray-light"
            >
              <summary className="flex cursor-pointer items-start justify-between gap-4 py-4 marker:content-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange [&::-webkit-details-marker]:hidden">
                <span className="text-body font-bold whitespace-pre-wrap text-dark-gray">{item.question}</span>
                <Image src={iconPlus} alt="" aria-hidden loading="eager" className="size-6 shrink-0 group-open:hidden" />
                <Image src={iconClose} alt="" aria-hidden loading="eager" className="hidden size-6 shrink-0 group-open:block" />
              </summary>
              <div className="h-[3px] bg-gray-light" aria-hidden />
              <p className="px-6 pt-4 pb-8 text-body font-medium whitespace-pre-wrap text-gray-dark">{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
