import Image, { type StaticImageData } from "next/image";

/**
 * Componente "Features cards/desktop" del sistema de diseño: un icono de 32px,
 * 24px de separación y una columna con título y descripción opcional.
 *
 * Se repite cinco veces en la vista Sobre Nosotros. En algunos usos la
 * descripción viene oculta en Figma (`hidden`), por eso es opcional aquí.
 */
export default function FeatureCardComponent({
  icon,
  title,
  titleAs: Title = "p",
  description,
  descriptionClassName = "",
  className = "",
}: {
  icon: StaticImageData;
  title: string;
  titleAs?: "p" | "h2" | "h3";
  description?: string;
  /** Escape para las desviaciones puntuales del diseño (ver MissionVision). */
  descriptionClassName?: string;
  className?: string;
}) {
  return (
    <div className={`flex items-start gap-6 ${className}`}>
      <Image src={icon} alt="" aria-hidden className="size-8 shrink-0" />
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <Title className="text-heading-1 font-bold text-dark-gray opacity-90">{title}</Title>
        {description && (
          <p className={`text-body font-medium text-gray-1 opacity-80 ${descriptionClassName}`}>
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
