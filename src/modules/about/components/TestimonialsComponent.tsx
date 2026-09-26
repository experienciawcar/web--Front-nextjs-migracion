import DiagonalLinesComponent from "@/modules/shared/components/DiagonalLinesComponent";
import SideLabelComponent from "@/modules/shared/components/SideLabelComponent";

import { getReviews } from "../services/reviews";
import TestimonialsCarouselComponent from "./TestimonialsCarouselComponent";

/**
 * Sección "¿Qué dicen de wcar?": las reseñas de Google de GET /api/map/ en un
 * carrusel. La parte interactiva vive en TestimonialsCarouselComponent; aquí
 * queda el fondo, la etiqueta y la carga de datos, que se resuelve en el
 * servidor.
 *
 * Desktop: mide unos 415px de alto. A la izquierda va la barra negra (x=0..303)
 * con las rayas diagonales en su borde izquierdo y la etiqueta encima; el resto
 * es un panel gris claro que llega hasta el borde de la ventana. Todo va en un
 * lienzo de 1440 centrado y los fondos sangran hasta el borde (ver la página).
 *
 * La etiqueta parte "dicen de wcar?" en dos renglones porque la barra le deja
 * 192px de ancho (de x=111 a 303) y el texto, a 36px, no cabe en uno.
 *
 * Mobile: sin barra negra, panel gris a todo el ancho y la etiqueta baja a
 * título normal con la línea naranja, con 64px de aire arriba y abajo, como
 * documenta StatsComponent para esta misma sección.
 *
 * Medidas sacadas de una captura del diseño, sin acceso a Figma.
 *
 * Si no hay reseñas, la sección no se pinta.
 */
export default async function TestimonialsComponent() {
  const reviews = await getReviews();

  if (reviews.length === 0) return null;

  return (
    <section aria-label="Reseñas de clientes" className="relative overflow-x-clip">
      <div className="relative mx-auto xl:max-w-[1440px]">
        <div
          aria-hidden
          className="absolute inset-0 bg-light-gray xl:right-[calc(50%-50vw)] xl:left-[303px]"
        />
        <div
          aria-hidden
          className="absolute inset-y-0 hidden bg-dark-gray xl:left-[calc(50%-50vw)] xl:block xl:w-[calc(303px+50vw-50%)]"
        >
          <DiagonalLinesComponent className="absolute inset-y-0 left-0 w-[60px]" />
        </div>

        <div className="relative px-8 py-16 xl:px-0 xl:pt-[63px] xl:pb-[42px]">
          <SideLabelComponent
            regular="¿Qué"
            italic="dicen de wcar?"
            className="xl:absolute xl:top-[79px] xl:left-[111px] xl:w-[192px]"
          />

          <TestimonialsCarouselComponent reviews={reviews} />
        </div>
      </div>
    </section>
  );
}
