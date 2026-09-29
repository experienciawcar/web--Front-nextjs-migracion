/**
 * Antetítulo en línea: una raya corta amarilla y la etiqueta al lado.
 * En Figma es el patrón "eyebrow" horizontal (nodos 2:207 y 2:210), distinto
 * del vertical que usa "Nuestra Empresa" (ver SectionEyebrowComponent): aquí
 * la raya mide 48x1 y va amarilla, no naranja, y el texto va al costado.
 */
export default function InlineEyebrowComponent({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span aria-hidden className="h-px w-12 shrink-0 bg-yellow" />
      <span className="text-small font-bold whitespace-nowrap text-gray">{children}</span>
    </div>
  );
}
