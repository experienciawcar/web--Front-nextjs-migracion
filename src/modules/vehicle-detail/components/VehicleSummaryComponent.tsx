import Image, { type StaticImageData } from "next/image";

import arrowCircle from "@/modules/shared/assets/icons/arrow-circle.svg";
import ButtonComponent from "@/modules/shared/components/ButtonComponent";
import WarrantyBadgeComponent from "@/modules/shared/components/WarrantyBadgeComponent";
import { ROUTES } from "@/modules/shared/constants/routes";

import iconCar from "../assets/summary/n-auto.svg";
import iconExchange from "../assets/summary/n-cambio.svg";
import iconMoney from "../assets/summary/n-dinero.svg";
import iconMedal from "../assets/summary/n-medalla.svg";
import iconAi from "../assets/summary/icono-ia.svg";
import iconEye from "../assets/summary/n-ojo.svg";
import { isUnavailable } from "../constants/tags";
import type { VehicleDetail } from "../types/vehicle-detail";

import VehicleExpertiseComponent from "./VehicleExpertiseComponent";
import VehicleFavoriteComponent from "./VehicleFavoriteComponent";
import VehicleShareComponent from "./VehicleShareComponent";

/**
 * Columna derecha de la ficha, tres tarjetas blancas de 8 de radio separadas 16: resumen,
 * "¿Tienes vehículo?" y las viñetas de valor.
 *
 * Figma 1542:22565 (marco "Página carro -desktop 1451", 1542:22539), tarjeta de 381: insignia de
 * garantía (verde, 12 Medium), nombre 18/26 Bold (el `<h1>`), línea "tipo / nombre año" 12/16
 * `gray-dark`, raya, precio 32/44 Bold, "SEPÁRALO AQUÍ" de ancho completo, "VER PERITAJE" y
 * "FINANCIAR" lado a lado, raya, y abajo visitas (ojo + número) y compartir. Los botones usan el
 * `ButtonComponent` del sitio (el diseño los dibuja de 32 de alto).
 *
 * Reglas del sitio anterior (`docs/DETALLE_VEHICULO.md` §4.1): el precio se oculta y "SEPÁRALO
 * AQUÍ" no sale si la etiqueta es "Reservado" (y el botón tampoco si es "Vendido"); con descuento
 * se tacha el precio de lista; la viñeta de garantía solo sale si hay garantía y la de los 7
 * días si el vehículo trae la garantía de felicidad.
 *
 * El ícono de IA (círculo con degradado y estrella, 1542:22590, esquina de la tarjeta) lleva a la
 * descripción de IA del acordeón (`#descripcion-ia`); el SVG está armado a mano (el export del nodo
 * trae el marco entero). El corazón de favoritos guarda en `localStorage` (no hay backend de
 * favoritos). Sin hacer, a propósito: "o desde $X /mes*", porque la API no trae la cuota.
 * TODO(negocio): "SEPÁRALO AQUÍ" abría el pago (Wompi/ePayco); lleva a Contacto
 * (`docs/DETALLE_VEHICULO.md` §7.2-3). TODO: "Garantia de 6 meses" del diseño lleva errata; aquí
 * sale el texto del backend ("Garantía 6 meses").
 */
export default function VehicleSummaryComponent({
  vehicle,
}: {
  vehicle: VehicleDetail;
}) {
  const soldOut = isUnavailable(vehicle.tag?.name);
  const hidePrice = vehicle.tag?.name === "Reservado";
  const typeLine = [
    vehicle.bodyType,
    `${vehicle.name}${vehicle.year ? ` ${vehicle.year}` : ""}`,
  ]
    .filter(Boolean)
    .join(" / ");

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 bg-white px-6 py-4 xl:rounded-lg xl:pl-[25px]">
        <div className="flex items-start justify-between gap-4">
          {vehicle.warranty ? (
            <WarrantyBadgeComponent
              label={vehicle.warranty.label}
              tone={vehicle.warranty.tone}
            />
          ) : (
            <span />
          )}
          {/* Lleva a la descripción de IA del acordeón si el vehículo la tiene (el diseño no dice qué abre). */}
          {vehicle.aiDescription ? (
            <a href="#descripcion-ia" aria-label="Ver la descripción generada por IA">
              <Image src={iconAi} alt="" aria-hidden className="size-8 shrink-0" />
            </a>
          ) : (
            <Image src={iconAi} alt="" aria-hidden className="size-8 shrink-0" />
          )}
        </div>

        <div className="flex flex-col gap-[7px]">
          <h1 className="text-[18px] leading-[26px] font-bold text-dark-gray">
            {vehicle.name}
          </h1>
          <p className="text-[12px] leading-4 font-medium text-gray-dark">
            {typeLine}
          </p>
        </div>

        {!hidePrice && (
          <>
            <hr className="border-gray/30" />
            <div>
              <p className="text-[32px] leading-11 font-bold text-dark-gray">
                {vehicle.price}
              </p>
              {vehicle.previousPrice && (
                <p className="text-body leading-[22px] font-medium text-gray-dark line-through">
                  <span className="sr-only">Antes </span>
                  {vehicle.previousPrice}
                </p>
              )}
            </div>
          </>
        )}

        {!soldOut && (
          // TODO(negocio): ver el JSDoc, el pago no está portado.
          <ButtonComponent
            href={ROUTES.contact}
            size="medium"
            icon={arrowCircle}
            className="w-full max-w-none! justify-center!"
          >
            Sepáralo aquí
          </ButtonComponent>
        )}
        <div className="grid grid-cols-2 gap-4 [&>*]:w-full [&>*]:max-w-none!">
          <VehicleExpertiseComponent
            vehicleId={vehicle.id}
            expertise={vehicle.expertise}
            vehicleName={vehicle.name}
            variant="summary"
          />
          <ButtonComponent
            href="#financiacion"
            variant="secondary"
            size="medium"
            className="max-w-none!"
          >
            Financiar
          </ButtonComponent>
        </div>

        <hr className="border-gray/30" />
        <div className="flex items-center justify-between">
          <p className="flex items-center gap-1 text-small leading-6 font-bold text-gray-dark">
            {vehicle.viewers > 0 && (
              <>
                <Image src={iconEye} alt="" aria-hidden className="size-6" />
                <span className="sr-only">
                  Personas que han visto este vehículo:{" "}
                </span>
                {vehicle.viewers}
              </>
            )}
          </p>
          <div className="flex items-center gap-4">
            <VehicleFavoriteComponent vehicleId={vehicle.id} />
            <VehicleShareComponent title={vehicle.name} />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-[17px] bg-white px-6 py-4 xl:rounded-lg">
        <Image src={iconCar} alt="" aria-hidden className="size-6 shrink-0" />
        <div>
          <p className="text-small leading-[22px] font-bold text-dark-gray">
            ¿Tienes vehículo? Úsalo como cuota inicial.
          </p>
          <a
            href={ROUTES.quote}
            className="mt-[3px] flex items-center gap-[7px] text-small font-bold text-orange underline"
          >
            Cotizar mi carro ahora
            <Image src={arrowCircle} alt="" aria-hidden className="size-6" />
          </a>
        </div>
      </div>

      <ul className="flex flex-col gap-4 bg-white px-6 py-4 text-small leading-[22px] font-medium text-gray-dark xl:rounded-lg">
        {vehicle.happinessWarranty && (
          <Bullet icon={iconExchange}>
            7 Días o te lo cambiamos, sin letra pequeña
          </Bullet>
        )}
        {vehicle.warranty && (
          <Bullet icon={iconMedal}>{vehicle.warranty.bullet}</Bullet>
        )}
        <Bullet icon={iconMoney}>Financiación hasta del 100% del vehículo</Bullet>
      </ul>
    </div>
  );
}

function Bullet({
  icon,
  children,
}: {
  icon: StaticImageData;
  children: React.ReactNode;
}) {
  return (
    <li className="flex items-center gap-[13px]">
      <Image src={icon} alt="" aria-hidden className="size-6 shrink-0" />
      <span>{children}</span>
    </li>
  );
}
