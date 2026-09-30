import Image, { type StaticImageData } from "next/image";

/**
 * Componente "Features cards/desktop" del sistema de diseño: un icono de 32px,
 * 24px de separación y una columna con título y descripción opcional.
 *
 * Se repite cinco veces en la vista Sobre Nosotros. En algunos usos la
 * descripción viene oculta en Figma (`hidden`), por eso es opcional aquí.
 *
 * En la vista Taller el título va partido: la primera parte en negrita y la
 * segunda en cursiva, en un renglón aparte (`titleItalic`, "Talleres
 * Especializados por / *Marca y Modelo*"). En los pasos de Financiación lleva
 * numeración delante (`titleMarker`, "1.").
 *
 * `mobileCentered`: bajo `md` (768) el icono va arriba, centrado, con el texto
 * centrado debajo a 8 px ("Features cards/mobile" del home, Figma 701:55065);
 * desde `md` vuelve a la fila de siempre.
 */
export default function FeatureCardComponent({
  icon,
  title,
  titleItalic,
  titleAs: Title = "p",
  titleMarker,
  description,
  descriptionClassName = "",
  titleClassName = "",
  textClassName = "",
  iconClassName = "size-8",
  tone = "light",
  mobileCentered = false,
  className = "",
}: {
  icon: StaticImageData;
  title: string;
  /** Segunda parte del título: cursiva y en su propio renglón. */
  titleItalic?: string;
  titleAs?: "p" | "h2" | "h3";
  /**
   * Numeración delante del título ("1."): va alineada a la derecha en un hueco de
   * 33px, así el texto arranca siempre en el mismo punto sin importar el ancho del
   * número (en Figma es una lista numerada con el texto a 33px).
   */
  titleMarker?: string;
  description?: string;
  /** Escape para las desviaciones puntuales del diseño (ver MissionVision). */
  descriptionClassName?: string;
  /** Igual que `descriptionClassName`, para el título. */
  titleClassName?: string;
  /** Clases de la columna de texto, p. ej. otra separación entre título y descripción. */
  textClassName?: string;
  /** Tamaño de la caja del icono: 32px (`size-8`), o 48px (`size-12`) en "Servicios adicionales". */
  iconClassName?: string;
  /** `dark` para fondos oscuros: título y descripción en blanco (al 90 y 80 %). */
  tone?: "light" | "dark";
  /** Icono arriba y texto centrado hasta `md` (ver arriba). */
  mobileCentered?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`flex ${mobileCentered ? "flex-col items-center gap-2 text-center md:flex-row md:items-start md:gap-6 md:text-left" : "items-start gap-6"} ${className}`}
    >
      <Image src={icon} alt="" aria-hidden className={`${iconClassName} shrink-0`} />
      <div className={`flex min-w-0 flex-1 flex-col gap-2 ${textClassName}`}>
        <Title
          className={`text-heading-1 font-bold opacity-90 ${tone === "dark" ? "text-white" : "text-dark-gray"} ${titleClassName}`}
        >
          {titleMarker && (
            <span
              className={
                mobileCentered
                  ? "mr-1 md:mr-0 md:inline-block md:w-[33px] md:pr-[5.5px] md:text-right"
                  : "inline-block w-[33px] pr-[5.5px] text-right"
              }
            >
              {titleMarker}
            </span>
          )}
          {title}
          {titleItalic && (
            <>
              <br />
              <span className="font-medium italic">{titleItalic}</span>
            </>
          )}
        </Title>
        {description && (
          <p
            className={`text-body font-medium opacity-80 ${tone === "dark" ? "text-white" : "text-gray-dark"} ${descriptionClassName}`}
          >
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
