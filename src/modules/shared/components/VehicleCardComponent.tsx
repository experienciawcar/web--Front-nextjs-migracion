import Image, { type StaticImageData } from "next/image";

import iconCity from "../assets/vehicle/icon-city.svg";
import iconMileage from "../assets/vehicle/icon-mileage.svg";
import iconViewers from "../assets/vehicle/icon-viewers.svg";
import iconWarranty from "../assets/vehicle/icon-warranty.svg";
import iconYear from "../assets/vehicle/icon-year.svg";
import type { Vehicle, VehicleWarrantyTone } from "../types/vehicle";
import AppLinkComponent from "./AppLinkComponent";
import ButtonComponent from "./ButtonComponent";
import { HeartIcon } from "./icons";
import VehicleGalleryComponent from "./VehicleGalleryComponent";

/** Etiqueta que avisa que el vehículo aún no está en la vitrina (trae franja negra abajo). */
const COMING_SOON_TAG = "Vehículo por ingresar";

/** Colores de la pastilla de garantía por cobertura. */
const WARRANTY_STYLES: Record<VehicleWarrantyTone, string> = {
  // La de 6 meses es la estándar: verde "label" con borde oscuro.
  standard: "border-dark-gray bg-label-green text-dark-gray",
  factory: "border-orange bg-orange text-white",
  oneYear: "border-black bg-label-yellow text-black",
};

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

  const [r, g, b] = [0, 2, 4].map((i) => Number.parseInt(full.slice(i, i + 2), 16));
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance < 0.5 ? "#ffffff" : "#000000";
}

function InfoItem({ icon, children }: { icon: StaticImageData; children: React.ReactNode }) {
  return (
    <li className="flex min-w-0 items-center gap-2">
      <Image src={icon} alt="" aria-hidden className="size-6 shrink-0 object-contain" />
      <span className="truncate">{children}</span>
    </li>
  );
}

/**
 * Tarjeta de un vehículo del catálogo. Es EL componente de la web: sale en el
 * inicio (Destacados del Catálogo) y saldrá en cada listado y en los
 * relacionados.
 *
 * Referencia: la tarjeta del sitio anterior (wcar.co/compra-tu-carro) para la
 * base (foto, galería, botón VER), afinada con la del rediseño "Home 2.0" de
 * Figma (nodo 671:11871, "Frame 627"), que trajo tres cambios sobre la
 * primera versión:
 * - El corazón de favoritos SÍ va (antes no, a falta de referencia): arriba a
 *   la derecha de la foto, decorativo por ahora.
 * - Las pastillas (etiqueta de estado y garantía) bajaron de la foto a su
 *   propia fila, encima del nombre, en vez de flotar sobre la imagen.
 * - La fila de datos quedó en dos (año y kilometraje, no cuatro): la
 *   transmisión ya no se muestra en la tarjeta (sigue en `Vehicle`, para
 *   cuando haga falta en el detalle). Debajo, una línea con la ciudad y
 *   "Envío a todo el país" (texto fijo, no del backend).
 *   TODO: confirmar con negocio si el envío a todo el país aplica siempre.
 * - Bajo el precio va la cuota mensual estimada, salvo que haya descuento (ahí
 *   se mantiene el precio de lista tachado, que no puede convivir con la
 *   cuota). Ver el TODO en `services/vehicles.ts` sobre esa cuota.
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

        {/* Favorito: decorativo por ahora (el backend sí tiene POST /cars/like).
            TODO: confirmar con diseño cómo se guarda (¿sin cuenta?) y cablearlo. */}
        <button
          type="button"
          aria-label={`Guardar ${vehicle.name} en favoritos`}
          className="absolute top-3 right-3 z-20 grid size-8 place-items-center rounded-full bg-white/90 text-dark-gray shadow-[0_1px_4px_rgba(0,0,0,0.2)]"
        >
          <HeartIcon className="size-4" />
        </button>
      </div>

      {/* Datos */}
      <div className="flex flex-1 flex-col px-4 pt-4 pb-4">
        {(tag || warranty) && (
          <div className="mb-3 flex flex-wrap items-center gap-2">
            {tag && (
              <span
                className="rounded-full px-3 py-1 text-caption font-medium"
                style={{ backgroundColor: tag.color, color: getTagTextColor(tag.color) }}
              >
                {tag.name}
              </span>
            )}
            {warranty && (
              <span
                className={`flex h-[26px] items-center gap-1 rounded-full border py-1 pr-3 pl-1.5 text-caption leading-[22px] font-semibold whitespace-nowrap ${WARRANTY_STYLES[warranty.tone]}`}
              >
                <Image
                  src={iconWarranty}
                  alt=""
                  aria-hidden
                  className={`h-4 w-[12px] ${warranty.tone === "factory" ? "brightness-0 invert" : ""}`}
                />
                {warranty.label}
              </span>
            )}
          </div>
        )}

        <h3 className="line-clamp-2 min-h-11 text-[18px] leading-[22px] font-bold text-dark-gray">
          <AppLinkComponent href={vehicle.href} className="after:absolute after:inset-0">
            {vehicle.name}
          </AppLinkComponent>
        </h3>

        <p className="mt-2 min-h-5 text-small leading-5 font-bold text-gray-dark">{vehicle.bodyType}</p>

        <span aria-hidden className="mt-3 block border-t border-gray/15" />

        <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-caption leading-[22px] font-medium text-gray">
          {vehicle.year && <InfoItem icon={iconYear}>{vehicle.year}</InfoItem>}
          {vehicle.mileage && <InfoItem icon={iconMileage}>{vehicle.mileage}</InfoItem>}
        </ul>

        <p className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-caption leading-[22px] font-medium text-gray">
          <span className="flex min-w-0 items-center gap-2">
            <Image src={iconCity} alt="" aria-hidden className="size-6 shrink-0 object-contain" />
            {vehicle.city}
          </span>
          <span aria-hidden>•</span>
          <span className="font-bold text-orange">Envío a todo el país</span>
        </p>

        <div className="mt-4 flex min-h-[50px] items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[22px] leading-[30px] font-bold whitespace-nowrap text-dark-gray">{vehicle.price}</p>
            {vehicle.previousPrice ? (
              <p className="text-small leading-5 font-bold whitespace-nowrap text-gray line-through">
                <span className="sr-only">Antes </span>
                {vehicle.previousPrice}
              </p>
            ) : (
              vehicle.monthlyPayment && (
                <p className="text-caption leading-[22px] font-medium whitespace-nowrap text-gray-dark">
                  {vehicle.monthlyPayment} / Mes
                </p>
              )
            )}
          </div>
          <ButtonComponent
            href={vehicle.href}
            size="medium"
            withoutBorder
            className="h-[42px]! w-[91px]! shrink-0 justify-center! px-0!"
          >
            Ver
            <span className="sr-only"> {vehicle.name}</span>
          </ButtonComponent>
        </div>

        {vehicle.viewers > 0 && (
          <p className="mt-4 flex items-center gap-2 text-small leading-5 text-gray">
            <Image src={iconViewers} alt="" aria-hidden className="size-6 shrink-0" />
            {vehicle.viewers} {vehicle.viewers === 1 ? "Persona ha visto" : "Personas han visto"} este vehículo
          </p>
        )}
      </div>
    </article>
  );
}
