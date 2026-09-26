/**
 * Antetítulo de sección: una línea corta encima de una etiqueta pequeña.
 * En Figma es el patrón "Eyebrow" + el componente "Line H", que se repite en
 * casi todas las secciones de la vista.
 *
 * La separación entre la línea y el texto cambia con el breakpoint: 8px en el
 * frame mobile y 16px en el de desktop.
 *
 * Ojo con el color: la línea es #FF8000, que NO es el naranja de marca 2026
 * (--color-orange, #EC671B). En Figma está puesto como hex suelto y no como
 * variable del sistema, así que se replica tal cual para no desviarse del
 * diseño. TODO: confirmar con diseño si es intencional o quedó del sitio viejo.
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
      <span aria-hidden className="h-[4px] w-full bg-[#ff8000]" />
      {/* Sin cortar: la raya mide 115px pero el texto puede ser más ancho (en
          "Nuestro Equipo" mide unos 200) y sale por el costado en un solo
          renglón, como en el diseño. */}
      <span className="text-small font-bold whitespace-nowrap text-gray-2">{children}</span>
    </div>
  );
}
