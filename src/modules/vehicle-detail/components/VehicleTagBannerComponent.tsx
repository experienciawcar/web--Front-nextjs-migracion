import { TAG_IDS } from "../constants/tags";
import type { VehicleDetail } from "../types/vehicle-detail";

const OUT_OF_STANDARD_TEXT =
  "La categoría fuera de estándar indica que el vehículo no cumple con los criterios de calidad definidos por WCAR para ser considerado un automóvil de calidad superior. Esto puede deberse a diversos factores, como intervención en varias partes de la pintura, problemas mecánicos significativos, alto kilometraje, historial de pérdida total, daños estructurales u otras razones que pueden no estar detalladas aquí. Además, es importante destacar que puede o no ser asegurable y esto dependerá de las políticas de la aseguradora.";

function InfoIcon() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      className="size-5 shrink-0 text-orange"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    >
      <circle cx="12" cy="12" r="9.5" />
      <path d="M12 11v5.5M12 7.6v.01" />
    </svg>
  );
}

/**
 * Aviso de arriba de la ficha según la etiqueta del vehículo (`tag_car.id`): 5 "fuera de
 * estándar" y 11 "en preventa" son desplegables ("Más al detalle…", con `<details>`, sin
 * JavaScript) y 7 avisa que ya lo reservó otra persona. Los textos son los del sitio anterior
 * (copia de su bundle; "concisiones" en "las mejores concisiones" es una errata suya y aquí se
 * corrigió a "condiciones").
 *
 * No hay diseño de este aviso en Figma (ni en la captura): es una franja amarilla estimada.
 * TODO: pedir el diseño a diseño.
 */
export default function VehicleTagBannerComponent({
  tag,
}: {
  tag: VehicleDetail["tag"];
}) {
  if (!tag) return null;

  let content: React.ReactNode = null;
  if (tag.id === TAG_IDS.reserved) {
    content = (
      <p className="text-small font-medium text-dark-gray">
        Este vehículo ya fue reservado por otro usuario.
      </p>
    );
  } else if (tag.id === TAG_IDS.outOfStandard || tag.id === TAG_IDS.presale) {
    const isPresale = tag.id === TAG_IDS.presale;
    content = (
      <details className="group">
        <summary className="cursor-pointer list-none text-small text-dark-gray [&::-webkit-details-marker]:hidden">
          <span className="font-bold">
            {isPresale
              ? "Vehículos en preventa:"
              : "Vehículos fuera de estándar:"}
          </span>{" "}
          Más al detalle…
        </summary>
        <p className="mt-2 max-w-[760px] text-caption leading-5 font-medium text-dark-gray">
          {isPresale ? (
            "Estamos alistando este vehículo para entregártelo en las mejores condiciones."
          ) : (
            <>
              <strong className="block">
                ¿Qué es un auto fuera de estándar?
              </strong>
              {OUT_OF_STANDARD_TEXT}
            </>
          )}
        </p>
      </details>
    );
  }
  if (!content) return null;

  return (
    <div
      role="note"
      className="flex items-start gap-3 rounded-lg bg-yellow/30 px-4 py-3"
    >
      <InfoIcon />
      {content}
    </div>
  );
}
