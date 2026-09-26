/**
 * Título de columna del footer: una barra naranja de 80x4 y el texto debajo.
 * Es la misma barra corta que el sitio anterior ponía sobre "Menú" y
 * "Términos y condiciones".
 */
export default function FooterHeadingComponent({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <span aria-hidden className="block h-1 w-20 bg-orange" />
      <h2 className="mt-1.5 text-[20px] leading-6 font-bold text-dark-gray">{children}</h2>
    </div>
  );
}
