import VehicleCardComponent from "@/modules/shared/components/VehicleCardComponent";
import type { Vehicle } from "@/modules/shared/types/vehicle";

import FinancingBannerComponent from "./FinancingBannerComponent";
import PromoCardComponent, { PROMO_VARIANT_COUNT } from "./PromoCardComponent";
import SkeletonCardComponent from "./SkeletonCardComponent";

/** No existe paginado de a 24 real (el backend pagina de a 22): es el número que ya usaba `SkeletonCard` de la SPA anterior para el placeholder, y alcanza para llenar la pantalla más alta. */
const SKELETON_COUNT = 24;
/**
 * Dónde aparece la tarjeta promocional dentro de la grilla (0-index): en
 * `1-sitio-anterior-carro-desktop.png` es la 6.ª tarjeta de la primera
 * página. Se repite cada tantas tarjetas para que no falte en páginas largas.
 */
const PROMO_EVERY = 6;

/** Cuántas tarjetas de vehículo van antes del banner de financiación: dos filas de tres. */
const BANNER_AFTER = 6;

const GRID_CLASS =
  "grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3 xl:gap-10";
/** El ancho real de una tarjeta en esta grilla (3 columnas de `container-wcar`, 1192px con 24px de separación). */
const CARD_SIZES = "(min-width: 1280px) 340px, (min-width: 640px) 45vw, 100vw";

/**
 * Grilla de resultados: `VehicleCardComponent` (sin tocar, ya construida y
 * usada en el home) intercalada con `PromoCardComponent` cada `PROMO_EVERY`
 * tarjetas — así se ve en la web en vivo (una tarjeta de "Garantía 6 meses"
 * en vez de un vehículo). Con 0 resultados, la web en vivo muestra tarjetas
 * promocionales en lugar de un vacío (confirmado en `/compra-tu-camion`):
 * se reproduce, más un mensaje de texto simple por accesibilidad (no está en
 * el original, se agrega porque un usuario que combine filtros hasta 0
 * resultados de verdad necesita saber que no hay vehículos, no solo ver
 * publicidad).
 *
 * TODO(diseño): la web en vivo trata el banner distinto en mobile (una
 * franja ancha de "Financiación hasta del 100%" aparte de la grilla, no una
 * tarjeta intercalada) — se simplificó a un solo tratamiento responsivo
 * (`PromoCardComponent` en la misma grilla a cualquier ancho) porque no hay
 * Figma de esa franja; revisar si hace falta separarlos. Ese banner de
 * financiación es una pieza aparte de las dos de `PromoCardComponent`
 * (bajadas de la web en vivo en la tarea 10): no se bajó porque no se pidió.
 *
 * `vehicles` es el resultado de la última búsqueda resuelta, aunque
 * `loading` esté en `true` (`CatalogComponent` no lo limpia al empezar una
 * búsqueda nueva): el placeholder de 24 tarjetas es solo para la carga
 * **inicial** (sin ningún resultado todavía, `SkeletonCard` de la SPA
 * anterior era exactamente esto — "mientras cars === undefined", no en cada
 * búsqueda). Cambiar de filtro o de página con resultados ya en pantalla
 * atenúa la grilla existente en vez de reemplazarla por el esqueleto: es
 * menos brusco y evita que la paginación "salte" al desaparecer y reaparecer
 * el contenido.
 */
export default function ResultsGridComponent({
  vehicles,
  loading,
}: {
  vehicles: Vehicle[];
  loading: boolean;
}) {
  const isInitialLoad = loading && vehicles.length === 0;

  if (isInitialLoad) {
    return (
      <div className={GRID_CLASS}>
        {Array.from({ length: SKELETON_COUNT }, (_, index) => (
          <SkeletonCardComponent key={index} />
        ))}
      </div>
    );
  }

  if (vehicles.length === 0) {
    return (
      <div>
        <p className="pb-6 text-body font-medium text-gray-dark">
          No encontramos vehículos con estos filtros.
        </p>
        <div className={GRID_CLASS}>
          <PromoCardComponent />
        </div>
      </div>
    );
  }

  const items: React.ReactNode[] = [];
  let promoCount = 0;
  // Posición en la grilla (1-based, sin contar el banner, que va a todo el ancho): cada
  // `PROMO_EVERY`-ésima celda es una promo — la primera en la 6.ª, no en la 7.ª — y cada pieza
  // sale una sola vez por página. Los vehículos que ocupaba la celda se corren, no se pierden.
  let cell = 0;
  const pushCell = (node: React.ReactNode) => {
    items.push(node);
    cell++;
    // El banner de financiación va justo después de la segunda fila.
    if (cell === BANNER_AFTER)
      items.push(<FinancingBannerComponent key="financing-banner" />);
  };

  vehicles.forEach((vehicle) => {
    while ((cell + 1) % PROMO_EVERY === 0 && promoCount < PROMO_VARIANT_COUNT) {
      pushCell(
        <PromoCardComponent
          key={`promo-${promoCount}`}
          variant={promoCount++}
        />,
      );
    }
    pushCell(
      <VehicleCardComponent
        key={vehicle.id}
        vehicle={vehicle}
        className="reveal w-full"
        sizes={CARD_SIZES}
      />,
    );
  });

  return (
    <div
      aria-busy={loading}
      className={`${GRID_CLASS} ${loading ? "opacity-60 transition-opacity" : ""}`}
    >
      {items}
    </div>
  );
}
