/**
 * Título del footer con barra naranja de 3px a la izquierda. En desktop el
 * texto lleva 12px de sangría y la barra va pegada al borde; en mobile el
 * diseño pone el texto en el borde y la barra 15 a 23px a su izquierda: cada
 * tarjeta lo ajusta con `--pl` (sangría), `--bx` (barra, izquierda) y `--bt`
 * (barra, arriba), sin pelear utilidades entre sí. Los márgenes los pone quien lo usa.
 */
export default function FooterHeadingComponent({
  as: Tag = "h2",
  white = false,
  className = "",
  children,
}: {
  as?: "h2" | "p";
  white?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  const look = white
    ? "text-[16px] text-white before:bg-white"
    : "text-[18px] text-black before:bg-orange";
  return (
    <Tag
      className={`relative pl-(--pl,12px) leading-6 font-bold before:absolute before:top-(--bt,2px) before:left-(--bx,0px) before:h-5 before:w-[3px] before:content-[''] ${look} ${className}`}
    >
      {children}
    </Tag>
  );
}
