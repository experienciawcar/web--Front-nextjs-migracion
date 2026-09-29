import Image from "next/image";

import iconClose from "@/modules/shared/assets/footer/icon-close.svg";
import iconPlus from "@/modules/shared/assets/footer/icon-plus.svg";
import iconExternal from "@/modules/shared/assets/icons/external-link.svg";
import ButtonComponent from "@/modules/shared/components/ButtonComponent";
import { ROUTES } from "@/modules/shared/constants/routes";

import iconPhone from "../assets/valores/icon-phone.svg";
import { COMPANY_VALUES } from "../constants/values";

/** Color de las líneas del acordeón: un gris casi blanco, de 3px. */
const LINEA = "border-black/[0.06]";

/**
 * Bloque oscuro "Hablemos": invitación a contactar a un asesor.
 *
 * Desktop: 404x318, montado sobre el borde izquierdo de la foto (empieza en
 * x=806 y la foto en x=908), a 243px del inicio de la sección.
 * Mobile: bloque a todo el ancho, debajo del acordeón.
 *
 * El teléfono es el del diseño y es de relleno.
 * TODO: reemplazar "(00) 112 365 489" por el número real, y entonces hacerlo un
 * enlace `tel:`.
 *
 * El botón dice "CONTÁCTA" con tilde en Figma (y "CONTACTA" sin ella en
 * "Nuestra Empresa").
 * TODO: confirmar con diseño, parece un error de ortografía.
 */
function ContactCard() {
  return (
    <div className="reveal mt-12 bg-dark-gray px-6 pt-[51px] pb-[54px] xl:absolute xl:top-[243px] xl:left-[806px] xl:mt-0 xl:w-[404px] xl:px-[60px]">
      <div className="flex items-center gap-4">
        <span aria-hidden className="h-px w-12 shrink-0 bg-blue-neon" />
        <span className="text-small font-bold text-white">Hablemos</span>
      </div>

      <h3 className="mt-6 text-heading-1 font-bold text-white">¿Necesitas asesoría?</h3>

      <div className="mt-5 flex items-center gap-4">
        <Image src={iconPhone} alt="" aria-hidden className="size-6 shrink-0" />
        <p className="text-body font-medium text-white">
          <span className="block">Si tienes alguna pregunta</span>
          <span className="block">(00) 112 365 489</span>
        </p>
      </div>

      <ButtonComponent href={ROUTES.contact} icon={iconExternal} className="mt-6">
        CONTÁCTA A UN ASESOR
      </ButtonComponent>
    </div>
  );
}

/**
 * Sección "Nuestros valores": un acordeón con los valores de la empresa, una
 * foto a la derecha y el bloque "Hablemos" montado sobre ambos.
 *
 * El diseño la dibuja como "Preguntas frecuentes" (título, preguntas y un
 * párrafo de relleno); el contenido es el de los valores, y el título va en dos
 * tonos como el original ("Nuestros" en negrita y "valores" en cursiva
 * naranja).
 *
 * El acordeón es nativo (<details>), sin JavaScript: el `name` los agrupa y el
 * navegador cierra el que estaba abierto al abrir otro. Va abierto el primero,
 * como en el diseño. El ícono cambia de "+" a "×" con `group-open`, los mismos
 * íconos y la misma técnica del footer.
 *
 * Desktop (captura del diseño): el acordeón mide 582px desde x=124 y la foto
 * arranca en x=908 y llega hasta el borde de la ventana, a todo el alto. Todo
 * va en un lienzo de 1440 centrado y la foto sangra hasta el borde (ver la
 * página). La sección mide unos 800px con los 4 renglones del diseño; con los
 * 7 valores crece, y `object-cover` recorta la foto a lo que mida la columna.
 *
 * Mobile: el diseño no lo trae. El acordeón va a todo el ancho, el bloque
 * "Hablemos" debajo y la foto no se muestra (va en una columna que solo existe
 * desde `xl`, así que el navegador no la descarga).
 *
 * La foto (`auto-suv-atardecer.webp`, 767x1169) es el recorte que hace el
 * diseño de un original de 3840x2560, ampliado sobre el frente del auto: da
 * para 1x y queda algo blanda en pantallas de doble densidad o muy anchas.
 * TODO: si hace falta más nitidez, pedir a diseño el original en más resolución
 * de esa zona.
 *
 * Medidas sacadas de una captura del diseño, sin acceso a Figma.
 */
export default function ValuesComponent() {
  return (
    <section aria-labelledby="values-title" className="relative overflow-x-clip">
      <div className="relative mx-auto xl:max-w-[1440px] xl:min-h-[800px]">
        {/* Columna de la foto. `sizes` sigue lo que mide la columna: de x=908 al
            borde de la ventana, o sea 100vw - 908px hasta 1440 y, pasado eso,
            como el lienzo va centrado, 50vw - 188px. El fondo oscuro se ve solo
            mientras carga. */}
        <div className="reveal reveal-fade absolute inset-y-0 hidden bg-dark-gray xl:right-[calc(50%-50vw)] xl:left-[908px] xl:block">
          <Image
            src="/assets/about-us/valores/auto-suv-atardecer.webp"
            alt="Un SUV visto de frente durante el atardecer"
            fill
            sizes="(min-width: 1440px) calc(50vw - 188px), (min-width: 1280px) calc(100vw - 908px), 0px"
            className="object-cover"
          />
        </div>

        {/* Sin `relative`: así el bloque "Hablemos", que va dentro y se posiciona
            en absoluto en desktop, mide contra el lienzo de 1440 y no contra
            este contenedor (que tiene 32px de padding). */}
        <div className="container-wcar py-16 xl:pt-[124px] xl:pb-[100px]">
          <div className="reveal flex flex-col gap-4">
            <span aria-hidden className="h-[4px] w-[77px] bg-orange" />
            <h2 id="values-title" className="text-subheadline-1 font-bold text-dark-gray">
              Nuestros <span className="font-normal text-orange italic">valores</span>
            </h2>
          </div>

          <div className={`reveal mt-8 border-t-[3px] xl:mt-[23px] xl:w-[582px] ${LINEA}`}>
            {COMPANY_VALUES.map((value, index) => (
              <details key={value.id} name="company-values" open={index === 0} className="group">
                <summary
                  className={`flex cursor-pointer items-center justify-between gap-4 border-b-[3px] py-[17px] pr-2 marker:content-none [&::-webkit-details-marker]:hidden ${LINEA}`}
                >
                  <span className="text-body font-bold text-dark-gray">{value.title}</span>
                  <Image
                    src={iconPlus}
                    alt=""
                    aria-hidden
                    className="size-[14px] shrink-0 group-open:hidden"
                  />
                  <Image
                    src={iconClose}
                    alt=""
                    aria-hidden
                    className="hidden size-[14px] shrink-0 group-open:block"
                  />
                </summary>
                <p
                  className={`border-b-[3px] px-6 py-6 text-body font-medium text-gray-dark ${LINEA}`}
                >
                  {value.description}
                </p>
              </details>
            ))}
          </div>

          <ContactCard />
        </div>
      </div>
    </section>
  );
}
