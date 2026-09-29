/**
 * Tarjeta "Garantía 6 meses" que ocupa el noveno lugar de la cuadrícula de
 * sedes. En el diseño es una pieza gráfica (corazón cian con un 6 naranja,
 * "Garantía" arriba y "meses" abajo, una franja cian con "¡Compra con total
 * tranquilidad!" y dos rayas en diagonal en la esquina superior derecha); no hay
 * un archivo con el arte y tampoco está en el sitio anterior, así que se dibujó
 * como un SVG con texto real (el texto sale con la tipografía de la página, se
 * lee y escala con la tarjeta).
 *
 * Medidas: lienzo de 381.33x622 (la tarjeta del diseño) y todo sale de medir la
 * captura: "Garantía" y "meses" de 56px en ExtraBold, el 6 de ~133px, el
 * corazón de 283x252 con trazo de 23, la franja cian de y=477 a y=579 con el
 * texto de 30px en SemiBold y una nota de 7px.
 * TODO: pedir el arte a diseño y cambiar el SVG por la imagen (con el `alt`).
 * TODO: confirmar con diseño el color del 6 (en la captura se ve más rojizo que
 * el naranja de los botones; #FF6400 es una estimación) y a dónde lleva la
 * tarjeta (a ninguna parte, de momento).
 */
export default function WarrantyCardComponent() {
  return (
    <li className="reveal overflow-hidden rounded-lg bg-white shadow-[0_4px_20px_rgba(30,30,30,0.05)]">
      <svg
        viewBox="0 0 381.33 622"
        role="img"
        aria-label="Garantía de 6 meses. ¡Compra con total tranquilidad! Unidades seleccionadas. Aplican términos y condiciones."
        className="block h-auto w-full"
      >
        {/* Rayas de la esquina superior derecha (cian y naranja, en diagonal). */}
        <path d="M262 -18L390 88" className="stroke-blue-neon" strokeWidth={11} fill="none" />
        <path d="M303 -12L390 55" className="stroke-orange" strokeWidth={10} fill="none" />

        <g textAnchor="middle" className="font-extrabold">
          <text x="190.67" y="93" fontSize="56" className="fill-dark-gray">
            Garantía
          </text>
          <text x="190.67" y="402" fontSize="56" className="fill-dark-gray">
            meses
          </text>
          <text x="190.67" y="277" fontSize="133" className="fill-[#ff6400]">
            6
          </text>
        </g>

        {/* Corazón: contorno cian de 23 de trazo, punta redondeada. */}
        <path
          d="M190.67 345C190.67 345 61.5 245 61.5 170C61.5 132 90 116 122 116C152 116 176 133 190.67 158C205 133 229 116 259 116C291 116 320 132 320 170C320 245 190.67 345 190.67 345Z"
          className="stroke-blue-neon"
          strokeWidth={23}
          strokeLinejoin="round"
          fill="none"
        />

        <g textAnchor="middle" className="fill-dark-gray font-medium">
          <text x="190.67" y="446" fontSize="7">
            *Unidades seleccionadas
          </text>
          <text x="190.67" y="455" fontSize="7">
            *Aplican términos y condiciones
          </text>
        </g>

        <rect y="477" width="381.33" height="102" className="fill-blue-neon" />
        <g textAnchor="middle" className="fill-dark-gray font-semibold">
          <text x="190.67" y="514" fontSize="30">
            ¡Compra con total
          </text>
          <text x="190.67" y="549" fontSize="30">
            tranquilidad!
          </text>
        </g>
      </svg>
    </li>
  );
}
