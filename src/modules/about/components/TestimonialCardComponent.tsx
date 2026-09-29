import Image from "next/image";

import StarRatingComponent from "@/modules/shared/components/StarRatingComponent";

import iconQuote from "../assets/testimonios/icon-quote.svg";
import type { Review } from "../types/reviews";
import ReviewerAvatarComponent from "./ReviewerAvatarComponent";

/**
 * Tarjeta de una reseña (381px de ancho y 251 de alto en desktop): foto,
 * nombre, calificación y comillas arriba; el texto en medio y la fecha al pie.
 *
 * El texto se corta a 4 renglones, como en el diseño, para que todas las
 * tarjetas midan lo mismo aunque una reseña sea larguísima; el texto completo
 * sigue en el HTML. La fecha va pegada al fondo, así que queda a la misma
 * altura en todas.
 *
 * `StarRatingComponent` solo tiene estrella llena y media, sin la vacía: una
 * reseña de 3 estrellas se pinta con 3. Hoy todas son de 5.
 *
 * TODO: el ícono de comillas está dibujado a partir del diseño; si hay un SVG
 * original en Figma, conviene cambiarlo por ese.
 */
export default function TestimonialCardComponent({ review }: { review: Review }) {
  return (
    <li className="flex min-h-[251px] w-[300px] shrink-0 snap-start flex-col rounded-lg bg-white p-6 xl:w-[381px]">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <ReviewerAvatarComponent name={review.authorName} photoUrl={review.photoUrl} />
          <div className="min-w-0">
            <p className="truncate text-small font-bold text-dark-gray">{review.authorName}</p>
            <div className="flex items-center gap-2">
              <span className="text-small font-bold text-dark-gray">{review.rating.toFixed(1)}</span>
              <StarRatingComponent value={review.rating} />
            </div>
          </div>
        </div>
        {/* En mobile la tarjeta mide 300px y a 50px de ancho las comillas se
            pegaban a las estrellas y recortaban el nombre: ahí van más chicas. */}
        <Image
          src={iconQuote}
          alt=""
          aria-hidden
          className="mt-1 h-6 w-[33px] shrink-0 xl:mt-[9px] xl:h-9 xl:w-[50px]"
        />
      </div>

      <p className="mt-4 line-clamp-4 text-body font-medium text-gray-dark">{review.text}</p>

      <time dateTime={review.dateIso} className="mt-auto pt-4 text-small font-medium text-gray">
        {review.dateLabel}
      </time>
    </li>
  );
}
