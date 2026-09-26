import Image, { type StaticImageData } from "next/image";

import AppLinkComponent from "./AppLinkComponent";

type Variant = "primary" | "secondary" | "tertiary" | "cyan" | "black";

/**
 * Cada variante trae su color de borde (transparente o naranja) a propósito:
 * la base solo fija el grosor, así no compiten dos utilidades de color de borde.
 */
const VARIANTS: Record<Variant, string> = {
  primary: "justify-between border-transparent bg-orange text-white",
  secondary: "justify-center border-orange bg-white text-black",
  tertiary: "w-[221px] justify-center border-orange bg-dark-gray text-white",
  // Las franjas del brillo son cian por defecto; sobre un botón cian no se
  // verían, así que ahí van naranjas.
  cyan: "justify-center border-transparent bg-blue text-black [--shine-color:var(--color-orange)]",
  black: "justify-center border-transparent bg-black text-white",
};

/** Variantes de texto blanco: el ícono es oscuro y ahí se pasa a blanco. */
const LIGHT_TEXT: Variant[] = ["primary", "tertiary", "black"];

const SIZES = {
  big: "h-12 px-8",
  medium: "h-11 max-w-[180px] px-4",
};

type CommonProps = {
  children: React.ReactNode;
  variant?: Variant;
  size?: keyof typeof SIZES;
  /** Ícono a la derecha del texto (una caja de 32px con el glifo de 26px). */
  icon?: StaticImageData;
  /** Sin borde: para las variantes que lo traen (`secondary`, `tertiary`). */
  withoutBorder?: boolean;
  /** Deja el brillo siempre activo, no solo al pasar el mouse. */
  shine?: boolean;
  /** Para el ancho (`w-full`) y los márgenes, que dependen de dónde se use. */
  className?: string;
};

type LinkProps = CommonProps & {
  href: string;
  type?: never;
  disabled?: never;
  onClick?: never;
};

type NativeProps = CommonProps & {
  href?: undefined;
  type?: "button" | "submit";
  disabled?: boolean;
  onClick?: () => void;
};

/**
 * Botón de WCAR. Con `href` es un enlace (interno o externo, lo decide
 * `AppLinkComponent`) y sin él un `<button>`, con el mismo aspecto.
 *
 * Es el "Buttons" de Figma y el `<Button>` (`btn-custom`) del sitio anterior,
 * pasado a Tailwind y sin Bootstrap:
 * - Forma: esquinas redondeadas solo abajo a la izquierda y arriba a la derecha
 *   (30px, la medida de Figma; el sitio anterior usaba 2em, 28px).
 * - Alto de 48px (44px en `medium`, con un máximo de 180px de ancho), texto de
 *   14px en negrita y mayúsculas, sin partirse en renglones.
 * - Variantes: `primary` (naranja), `secondary` (blanco con borde naranja),
 *   `tertiary` (oscuro con borde naranja y 221px de ancho), `cyan` y `black`.
 *   El naranja es el token del rediseño y no el #FF7300 fijo del sitio anterior.
 *   Solo `primary` reparte el texto y el ícono a los extremos; las demás los
 *   centran.
 * - Brillo: al pasar el mouse cruza el botón una franja de rayas diagonales
 *   (ver `button-shine` en globals.css). Con `shine` queda siempre activo. Es lo
 *   que se ve como marca en la esquina del botón naranja de "Nuestros valores"
 *   en el diseño: es una captura de la animación.
 *
 * Diferencias con la guía del sitio anterior:
 * - No hay prop `width`: el ancho va en `className` (`w-full`, `w-[221px]`), que
 *   es como se hace en Tailwind.
 * - No hay clases globales `btn_*` ni `btn_shadow`, `btn_cut`, gris ni verde:
 *   ningún diseño de esta versión los usa. Si aparece uno, se agrega como
 *   variante aquí.
 */
export default function ButtonComponent({
  children,
  variant = "primary",
  size = "big",
  icon,
  withoutBorder = false,
  shine = false,
  href,
  type = "button",
  disabled,
  onClick,
  className = "",
}: LinkProps | NativeProps) {
  const classes = [
    "button-shine inline-flex items-center gap-2 rounded-tr-[30px] rounded-bl-[30px] py-2 text-small font-bold whitespace-nowrap uppercase",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange",
    "enabled:cursor-pointer disabled:cursor-not-allowed disabled:opacity-50",
    withoutBorder ? "border-0" : "border-2",
    SIZES[size],
    VARIANTS[variant],
    shine ? "is-shining" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const content = (
    <>
      {children}
      {icon && (
        // La caja es de 32px pero el glifo mide 26: la caja define el espaciado.
        <span className="flex size-8 shrink-0 items-center justify-center">
          <Image
            src={icon}
            alt=""
            aria-hidden
            className={`size-[26px] ${LIGHT_TEXT.includes(variant) ? "brightness-0 invert" : ""}`}
          />
        </span>
      )}
    </>
  );

  if (href !== undefined) {
    return (
      <AppLinkComponent href={href} className={classes}>
        {content}
      </AppLinkComponent>
    );
  }

  return (
    <button type={type} disabled={disabled} onClick={onClick} className={classes}>
      {content}
    </button>
  );
}
