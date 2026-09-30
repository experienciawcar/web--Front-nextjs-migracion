/**
 * Marco de las páginas legales (documentos de términos y política de privacidad): panel blanco de
 * 1296 centrado y pegado al navbar sobre la foto del sitio anterior
 * (`public/assets/terminos/fondo.webp`, la de Contacto), que se ve a los lados. Relleno de 48
 * en desktop (32 arriba en los documentos: lo fija cada página con `className`).
 */
export default function LegalPanelComponent({
  children,
  className = "md:pt-8",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className="bg-[url('/assets/terminos/fondo.webp')] bg-[length:100%_auto] bg-top px-3 md:px-4">
      <article
        className={`mx-auto w-full max-w-[1296px] bg-white px-5 py-8 md:px-12 md:pb-12 ${className}`}
      >
        {children}
      </article>
    </div>
  );
}
