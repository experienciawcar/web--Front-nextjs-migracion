import Image from "next/image";

/**
 * Las dos piezas reales que la web en vivo intercala en la grilla del
 * catálogo (`https://wcar.co/assets/buyCarBanner{3,5}.png`, bajadas y
 * pasadas a WebP q82 — no son arte inventado: se pidieron al usuario y las
 * dio la propia wcar.co, ver `docs/planes/compra-tu-carro.md` tarea 10).
 * La de "Garantía de satisfacción, 7 días o 300 km" (`buyCarBanner6.png`) se quitó
 * a pedido del usuario: en el catálogo solo van estas dos. Referenciadas por ruta (`public/`, guía §6),
 * no importadas: por eso llevan su ancho/alto a mano.
 */
export const PROMO_VARIANT_COUNT = 2;

const VARIANTS = [
  {
    src: "/assets/catalogo/promo/garantia-6-meses.webp",
    width: 400,
    height: 653,
    alt: "Garantía de 6 meses. Compra con total tranquilidad.",
  },
  {
    src: "/assets/catalogo/promo/garantia-felicidad.webp",
    width: 400,
    height: 653,
    alt: "Garantía de felicidad: 7 días o te cambiamos el carro.",
  },
] as const;

/**
 * Tarjeta promocional intercalada en la grilla de resultados, en el mismo
 * lugar que ocuparía una tarjeta de vehículo. `variant` rota entre las dos
 * piezas reales (ver `ResultsGridComponent`, que decide el índice según la
 * posición en la grilla) — así se ve en la web en vivo, que no repite
 * siempre la misma.
 */
export default function PromoCardComponent({
  variant = 0,
}: {
  variant?: number;
}) {
  const { src, width, height, alt } = VARIANTS[variant % VARIANTS.length];

  return (
    <div className="reveal relative overflow-hidden rounded-lg bg-white shadow-[0_7px_14px_rgba(211,218,226,0.4)]">
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        sizes="(min-width: 1280px) 381px, (min-width: 640px) 45vw, 100vw"
        className="h-auto w-full"
      />
    </div>
  );
}
