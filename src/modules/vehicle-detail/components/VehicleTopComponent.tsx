import type { VehicleDetail } from "../types/vehicle-detail";

import VehicleBackLinkComponent from "./VehicleBackLinkComponent";
import VehicleDetailGalleryComponent from "./VehicleDetailGalleryComponent";
import VehicleSummaryComponent from "./VehicleSummaryComponent";
import VehicleTagBannerComponent from "./VehicleTagBannerComponent";

/** Color del texto de la etiqueta de la foto según su fondo (igual que en la tarjeta del catálogo). */
function tagTextColor(background: string): string {
  const hex = background.replace("#", "");
  const full = hex.length === 3 ? [...hex].map((c) => c + c).join("") : hex;
  if (!/^[0-9a-f]{6}$/i.test(full)) return "#000000";
  if (full === "000000") return "var(--color-orange)";
  const [r, g, b] = [0, 2, 4].map((i) =>
    Number.parseInt(full.slice(i, i + 2), 16),
  );
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 < 0.5
    ? "#ffffff"
    : "#000000";
}

/**
 * Parte de arriba de la ficha, sobre el panel gris: el aviso de la etiqueta, "Volver", la
 * galería y la tarjeta de resumen.
 *
 * Figma 89:4207 (px del lienzo de 1440, con y=143 en el borde superior del panel gris, que mide
 * 680): la galería de 787 x 510 arranca en (124, 213), o sea 70 debajo del borde; la tarjeta,
 * de 381, a 24 de la galería (787 + 24 + 381 = 1192); las miniaturas acaban en y=790 y el panel
 * 33 más abajo. La tarjeta se estira hasta la altura de la galería con sus miniaturas (577).
 * Mobile (89:4840): todo en una columna a 32 de los bordes, "Volver" a 32 del panel.
 *
 * La etiqueta de estado ("Promoción", "Vehículo por ingresar"…) va sobre la esquina de la foto,
 * como en el diseño mobile (`Label/Promoción`, 89:4881) y en la tarjeta del catálogo.
 */
export default function VehicleTopComponent({
  vehicle,
}: {
  vehicle: VehicleDetail;
}) {
  return (
    <section
      aria-label="Datos del vehículo"
      className="bg-gray-light pb-8 xl:pb-[33px]"
    >
      <div className="mx-auto w-full max-w-[1368px] px-8 pt-10 max-xl:px-4 xl:pt-4">
        <VehicleTagBannerComponent tag={vehicle.tag} />
        <div className="flex min-h-[38px] items-center xl:h-[54px]">
          <VehicleBackLinkComponent />
        </div>
        <div className="mt-2 grid grid-cols-[minmax(0,1fr)] gap-6 xl:mt-0 xl:grid-cols-[minmax(0,1fr)_440px] xl:gap-4">
          <div className="reveal reveal-fade">
            <VehicleDetailGalleryComponent
              images={vehicle.images}
              name={vehicle.name}
              overlay={
                vehicle.tag && (
                  <span
                    className="absolute top-0 left-0 rounded-br-2xl px-4 py-2 text-small leading-5 font-medium"
                    style={{
                      backgroundColor: vehicle.tag.color,
                      color: tagTextColor(vehicle.tag.color),
                    }}
                  >
                    {vehicle.tag.name}
                  </span>
                )
              }
            />
          </div>
          <div className="reveal max-xl:-mx-4 xl:h-full">
            <VehicleSummaryComponent vehicle={vehicle} />
          </div>
        </div>
      </div>
    </section>
  );
}
