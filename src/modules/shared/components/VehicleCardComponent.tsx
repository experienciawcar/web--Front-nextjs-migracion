import Image, { type StaticImageData } from "next/image";

import iconCity from "../assets/vehicle/icon-city.svg";
import iconMileage from "../assets/vehicle/icon-mileage.svg";
import iconTransmission from "../assets/vehicle/icon-transmission.svg";
import iconViewers from "../assets/vehicle/icon-viewers.svg";
import iconYear from "../assets/vehicle/icon-year.svg";
import type { Vehicle } from "../types/vehicle";
import AppLinkComponent from "./AppLinkComponent";
import ButtonComponent from "./ButtonComponent";
import VehicleGalleryComponent from "./VehicleGalleryComponent";
import WarrantyBadgeComponent from "./WarrantyBadgeComponent";

/** Etiqueta que avisa que el vehículo aún no está en la vitrina (trae franja negra abajo). */
const COMING_SOON_TAG = "Vehículo por ingresar";

/**
 * Color del texto de una etiqueta según su fondo: blanco sobre fondos oscuros,
 * negro sobre claros, y naranja sobre negro puro (así lo hacía el sitio
 * anterior con cada color de etiqueta a mano).
 */
function getTagTextColor(background: string): string {
  const hex = background.replace("#", "");
  const full = hex.length === 3 ? [...hex].map((c) => c + c).join("") : hex;
  if (!/^[0-9a-f]{6}$/i.test(full)) return "#000000";
  if (full === "000000") return "var(--color-orange)";

  const [r, g, b] = [0, 2, 4].map((i) =>
    Number.parseInt(full.slice(i, i + 2), 16),
  );
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance < 0.5 ? "#ffffff" : "#000000";
}

function InfoItem({
  icon,
  children,
}: {
  icon: StaticImageData;
  children: React.ReactNode;
}) {
  return (
    <li className="flex min-w-0 items-center gap-2">
      <Image
        src={icon}
        alt=""
        aria-hidden
        className="size-6 shrink-0 object-contain"
      />
      <span className="truncate">{children}</span>
    </li>
  );
}

/**
 * Tarjeta de un vehículo del catálogo. Es EL componente de la web: sale en el
 * inicio (Destacados del Catálogo) y saldrá en cada listado y en los
 * relacionados.
 *
 * Diseño: el de la tarjeta del sitio anterior (wcar.co/compra-tu-carro), que
 * es el que pidió negocio con capturas:
 * - La etiqueta de estado va arriba a la izquierda de la foto y la garantía
 *   arriba a la derecha, ambas sobre la imagen. Sin corazón de favoritos.
 * - Datos en cuadrícula de 2 columnas: año, kilometraje, transmisión y ciudad.
 * - Precio a la izquierda (con el de lista tachado debajo si hay descuento) y
 *   el botón VER dentro del margen, con esquinas opuestas redondeadas. No lleva cuota mensual ni "Envío a
 *   todo el país" (`Vehicle.monthlyPayment` queda disponible, sin uso aquí).
 *
 * Toda la tarjeta es clicable con un solo enlace, el del nombre, que se estira
 * sobre ella (`after:absolute after:inset-0`): así el lector de pantalla oye un
 * enlace con el nombre del vehículo y no un bloque de texto entero. Lo que va por
 * encima de esa capa (la galería, el corazón, el botón VER) queda con
 * `relative` o `z-10` para seguir siendo interactivo.
 *
 * `sizes` es el ancho al que se ve la foto; por defecto 291 px, el de la
 * tarjeta en el carrusel del inicio.
 */
export default function VehicleCardComponent({
  vehicle,
  sizes = "291px",
  className = "",
}: {
  vehicle: Vehicle;
  sizes?: string;
  className?: string;
}) {
  const { tag, warranty } = vehicle;
  const comingSoon = tag?.name === COMING_SOON_TAG;

  return (
    <article
      className={`relative flex flex-col rounded-lg bg-white shadow-[0_7px_14px_rgba(211,218,226,0.4)] ${className}`}
    >
      {/* Foto */}
      <div className="relative aspect-[3/2] shrink-0 overflow-hidden rounded-t-lg bg-gray-light">
        <VehicleGalleryComponent
          key={vehicle.id}
          vehicleId={vehicle.id}
          images={vehicle.images}
          name={vehicle.name}
          href={vehicle.href}
          sizes={sizes}
          raised={comingSoon}
        />

        {comingSoon && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex h-[26px] items-center justify-center bg-black text-caption text-white">
            Estamos preparando el vehículo para ti
          </div>
        )}

        {tag && (
          <span
            className="absolute top-0 left-0 z-20 rounded-br-2xl px-4 py-2 text-small leading-5 font-medium"
            style={{
              backgroundColor: tag.color,
              color: getTagTextColor(tag.color),
            }}
          >
            {tag.name}
          </span>
        )}

        {warranty && (
          <WarrantyBadgeComponent
            label={warranty.label}
            tone={warranty.tone}
            className="absolute top-3 right-3 z-20"
          />
        )}
      </div>

      {/* Datos */}
      <div className="flex flex-1 flex-col px-4 pt-4 pb-4">
        <h3 className="line-clamp-2 min-h-11 text-[18px] leading-[22px] font-bold text-dark-gray">
          <AppLinkComponent
            href={vehicle.href}
            className="after:absolute after:inset-0"
          >
            {vehicle.name}
          </AppLinkComponent>
        </h3>

        <p className="mt-2 min-h-5 text-small leading-5 font-bold text-gray-dark">
          {vehicle.bodyType}
        </p>

        <ul className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3 text-caption leading-[22px] font-medium text-gray">
          {vehicle.year && <InfoItem icon={iconYear}>{vehicle.year}</InfoItem>}
          {vehicle.mileage && (
            <InfoItem icon={iconMileage}>{vehicle.mileage}</InfoItem>
          )}
          <InfoItem icon={iconTransmission}>{vehicle.transmission}</InfoItem>
          <InfoItem icon={iconCity}>{vehicle.city}</InfoItem>
        </ul>

        <div className="mt-5 flex min-h-[50px] items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[22px] leading-[30px] font-bold whitespace-nowrap text-dark-gray">
              {vehicle.price}
            </p>
            {vehicle.previousPrice && (
              <p className="text-small leading-5 font-bold whitespace-nowrap text-gray line-through">
                <span className="sr-only">Antes </span>
                {vehicle.previousPrice}
              </p>
            )}
          </div>
          <ButtonComponent href={vehicle.href} size="big" className="shrink-0">
            Ver
            <span className="sr-only"> {vehicle.name}</span>
          </ButtonComponent>
        </div>

        {vehicle.viewers > 0 && (
          <p className="mt-5 flex items-center gap-2 text-small leading-5 text-gray">
            <Image
              src={iconViewers}
              alt=""
              aria-hidden
              className="size-6 shrink-0"
            />
            {vehicle.viewers}{" "}
            {vehicle.viewers === 1 ? "Persona ha visto" : "Personas han visto"}{" "}
            este vehículo
          </p>
        )}
      </div>
    </article>
  );
}
