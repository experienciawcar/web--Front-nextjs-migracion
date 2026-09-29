import Image from "next/image";

import ContactChannelsComponent from "./ContactChannelsComponent";
import ContactOptionsComponent from "./ContactOptionsComponent";

/**
 * Fondo de cada lado del panel: de la ventana al panel (que mide 1128px y va
 * centrado) y a todo el alto de la sección. Solo desde `xl`.
 */
const FONDO =
  "absolute inset-y-0 hidden w-[calc(50%-564px)] bg-[url(/assets/contacto/auto-electrico-estacion-de-carga.webp)] bg-size-[auto_100%] bg-repeat-x xl:block";

/**
 * Sección "Contacto": un panel negro con el título, los datos de contacto y las
 * tres maneras de escribir a WCAR, sobre una foto de un auto eléctrico.
 *
 * El diseño es una captura de 1910 de ancho de la página de contacto del sitio
 * anterior (wcar.co/contacto), sin el navbar ni el footer. Todo se midió de la
 * captura y del DOM de ese sitio, no de Figma.
 *
 * Desktop (`xl`):
 * - Panel de 1128px centrado (en el sitio anterior era el contenedor de
 *   Bootstrap de 1320px menos 2x48 de relleno, dos veces). Con 48px de relleno
 *   arriba y a los lados y 64 abajo (48 + los 16 de separación que dejaba el
 *   último bloque). Mide unos 897px de alto con el copy actual.
 * - La foto llena lo que el panel deja libre a cada lado, escalada al alto de la
 *   sección (unos 1298px de ancho). A la izquierda se ve el inicio de la foto; a
 *   la derecha, el trozo que sigue a 225px de su inicio, que es lo que muestra la
 *   captura (a 1910, la foto se repite en x=1295 y el panel tapa la costura).
 *   Cada lado lleva su propio fondo, anclado al panel: en el sitio anterior era
 *   una sola imagen repetida desde el borde de la ventana y a 1440 la costura
 *   caía fuera del panel, a la vista. Así, a cualquier ancho desde 1280 se ve lo
 *   mismo que en la captura (391px por lado a 1910, 156 a 1440, 76 a 1280).
 * - Como fondo CSS, y solo con `xl` (el elemento va `hidden` bajo ese ancho), no
 *   se descarga en mobile.
 *
 * Mobile: el diseño no existe. Como en el sitio anterior, el panel va a todo el
 * ancho y la foto debajo, entera; el panel lleva 24px de margen y los círculos
 * de contacto van sin texto (ver `ContactChannelsComponent`). Se llega aquí por
 * debajo de `xl` (el breakpoint de desktop del proyecto); el sitio anterior lo
 * cambiaba a 768px.
 * TODO: confirmar con diseño el mobile y la tablet.
 *
 * TODO: confirmar con diseño el copy del párrafo. Une dos frases sin punto:
 * "…un servicio excepcional Estamos aquí para atenderte."
 *
 * Los títulos de los bloques son `<h2>` y el de la página `<h1>` (el sitio
 * anterior usaba h2 y h3).
 */
export default function ContactComponent() {
  return (
    <section aria-labelledby="contact-title" className="relative">
      {/* La foto a cada lado del panel (ver arriba). El de la derecha arranca
          225px adentro de la foto. */}
      <div aria-hidden className={`${FONDO} left-0`} />
      <div aria-hidden className={`${FONDO} right-0 bg-position-[-225px_0]`} />

      <div className="relative mx-auto bg-black px-6 py-12 text-white xl:w-[1128px] xl:px-12 xl:pb-16">
        <h1 id="contact-title" className="reveal text-center text-subheadline-1 font-bold">
          ¿Necesitas ayuda?
          <br />
          ¡Contáctanos!
        </h1>
        <p className="reveal mx-auto mt-4 max-w-[680px] text-center text-small leading-5 xl:mt-0">
          ¡Atenderte es nuestra prioridad! Completa el formulario de contacto y experimenta un servicio excepcional
          Estamos aquí para atenderte.
        </p>

        <ContactChannelsComponent />
        <ContactOptionsComponent />
      </div>

      {/* La foto de debajo del panel solo existe en mobile: en desktop es el
          fondo de la sección. Con `xl:hidden` (display: none) y carga perezosa
          el navegador no la pide en desktop. */}
      <Image
        src="/assets/contacto/auto-electrico-estacion-de-carga.webp"
        alt="Un auto eléctrico conectado a un cargador en una estación de carga, de noche"
        width={1440}
        height={995}
        sizes="100vw"
        className="reveal reveal-fade h-auto w-full md:h-[360px] md:object-cover xl:hidden"
      />
    </section>
  );
}
