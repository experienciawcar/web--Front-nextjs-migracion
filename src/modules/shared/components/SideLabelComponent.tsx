/**
 * Título de sección partido en dos: la primera mitad en negrita y la segunda
 * en cursiva, con una línea corta encima. Se repite tres veces en la vista
 * Sobre Nosotros ("Nuestros / Datos", "Misión / & visión", "¿Qué dicen de /
 * wcar?") y el diseño lo trata distinto según el breakpoint:
 *
 * - Desktop: va sobre la barra negra lateral, con la línea turquesa (#00FEFE)
 *   y el texto en blanco.
 * - Mobile: la barra negra no existe, así que baja a título normal sobre el
 *   fondo gris claro, con la línea naranja (#FF8000) y el texto oscuro.
 *
 * Medidas del diseño: línea de 77x4, 24px de separación y dos renglones de
 * 36/44. Iguales en los dos breakpoints.
 */
export default function SideLabelComponent({
  regular,
  italic,
  className = "",
}: {
  regular: string;
  italic: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <span aria-hidden className="block h-[4px] w-[77px] bg-[#ff8000] xl:bg-blue" />
      <h2 className="mt-6 text-subheadline-1 text-dark-gray xl:text-white">
        <span className="font-bold">{regular}</span>
        <br />
        <span className="italic">{italic}</span>
      </h2>
    </div>
  );
}
