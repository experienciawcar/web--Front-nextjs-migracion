/**
 * Antetítulo de sección: una línea corta encima de una etiqueta pequeña.
 * En Figma es el patrón "Eyebrow" + el componente "Line H", que se repite en
 * casi todas las secciones de la vista.
 *
 * La separación entre la línea y el texto cambia con el breakpoint: 8px en el
 * frame mobile y 16px en el de desktop.
 *
 * La línea es el naranja de marca (`orange`, #FF8000). Antes de unificar los
 * colores con las variables de diseño (el token valía #EC671B) se pintaba con el
 * hex suelto para no desviarse del diseño; ya no hace falta.
 */
export default function SectionEyebrowComponent({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex w-[115px] flex-col gap-2 xl:gap-4 ${className}`}>
      <span aria-hidden className="h-[4px] w-full bg-orange" />
      {/* Sin cortar: la raya mide 115px pero el texto puede ser más ancho (en
          "Nuestro Equipo" mide unos 200) y sale por el costado en un solo
          renglón, como en el diseño. */}
      <span className="text-small font-bold whitespace-nowrap text-gray">{children}</span>
    </div>
  );
}
