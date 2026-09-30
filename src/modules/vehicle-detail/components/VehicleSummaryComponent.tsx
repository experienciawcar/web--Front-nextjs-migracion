import Image from "next/image";

import arrowCircle from "@/modules/shared/assets/icons/arrow-circle.svg";
import ButtonComponent from "@/modules/shared/components/ButtonComponent";
import WarrantyBadgeComponent from "@/modules/shared/components/WarrantyBadgeComponent";
import { ROUTES } from "@/modules/shared/constants/routes";

import iconFinancing from "../assets/summary/icon-financiacion.svg";
import iconHappiness from "../assets/summary/icon-garantia-vehiculo.svg";
import iconViews from "../assets/summary/icon-visualizaciones.svg";
import iconStopwatch from "../assets/summary/icon-cronometro.svg";
import iconHappinessWarranty from "../assets/summary/icon-felicidad.svg";
import iconFairPrice from "../assets/summary/icon-precio-justo.svg";
import iconCity from "../assets/specs/icon-ubicacion.svg";
import iconMileage from "../assets/specs/icon-kilometraje.svg";
import iconTransmission from "../assets/specs/icon-transmision.svg";
import iconYear from "../assets/specs/icon-modelo.svg";
import { isUnavailable } from "../constants/tags";
import type { VehicleDetail } from "../types/vehicle-detail";

import VehicleExpertiseComponent from "./VehicleExpertiseComponent";
import VehicleShareComponent from "./VehicleShareComponent";

function InfoItem({
  icon,
  children,
}: {
  icon: typeof iconCity;
  children: React.ReactNode;
}) {
  return (
    <li className="flex min-w-0 items-center gap-2">
      <Image src={icon} alt="" aria-hidden className="size-6 shrink-0" />
      <span className="truncate">{children}</span>
    </li>
  );
}

/**
 * Tarjeta de resumen de la ficha (a la derecha de la galería): insignia de garantía y compartir,
 * el nombre (el `<h1>` de la página), año, kilometraje, transmisión y ciudad, la línea
 * "tipo / nombre año", el Stock ID, el precio, los dos botones y las tres viñetas de valor.
 *
 * Figma 89:4207, en px del lienzo de 1440 con y=213 en el borde superior de la tarjeta (381 de
 * ancho, 8 de radio, blanca, 32 de relleno): la insignia (y=245, alto 30), el nombre de 24/44
 * Bold (y=286; aquí a 24/32 y no a 44, para que un nombre de dos renglones no crezca la tarjeta), dos filas de datos de 12 Medium con íconos de 20 (y=337 y 367, segunda
 * columna a 116), la línea de tipo de 14 Medium (y=413), el Stock ID de 16 Bold (y=445), el
 * precio de 24 Bold (y=480), "VER PERITAJE" cian (y=542) y "SEPÁRALO AQUÍ" naranja
 * (y=591), con el `ButtonComponent` tal como se usa en el resto del sitio (el diseño los dibuja de 32 de alto y con un "+"; "Sepáralo aquí" lleva la flecha en círculo como los demás), y las viñetas desde y=644 (339 x 131:
 * en Figma son una imagen; aquí se dibujan con tres filas de ~44 de alto y separadores).
 * Mobile (89:4840): la tarjeta va bajo la galería con el nombre a 22/30 y los botones lado a lado
 * de 40 de alto.
 *
 * Reglas del sitio anterior (`docs/DETALLE_VEHICULO.md` §4.1): el precio se oculta y "SEPÁRALO
 * AQUÍ" no sale si la etiqueta es "Reservado" (y el botón tampoco si es "Vendido"); con
 * descuento se tacha el precio de lista debajo del que se cobra; la viñeta de garantía solo sale
 * si hay garantía y la de "Garantía de felicidad" si el vehículo la trae.
 *
 * TODO(negocio): "SEPÁRALO AQUÍ" abría el pago (Wompi o ePayco, monto libre entre $2.000.000 y el
 * precio; `ModalAmount`). Ese flujo firma el pago en el navegador con una llave de integridad
 * incrustada y define el monto en el cliente (`docs/DETALLE_VEHICULO.md` §7.2-3): no se copió.
 * Mientras tanto lleva a Contacto.
 * Ajuste pedido por el usuario con una captura del sitio anterior: textos más grandes, compartir y
 * el contador de visitas (`quantityPersons`, sin el +9 que le sumaba el sitio anterior) arriba a la
 * izquierda con la insignia a la derecha, "Sepáralo aquí" antes de "Ver peritaje" y cinco viñetas
 * (con "Financia hasta $15 millones en 3 minutos" y "Garantía de felicidad"). Esto pisa las medidas
 * de Figma de arriba, que ya no rigen en esta tarjeta.
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
    <div className="flex flex-col rounded-none bg-white px-6 py-6 xl:px-8 xl:py-8 xl:rounded-lg">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <VehicleShareComponent title={vehicle.name} />
          {vehicle.viewers > 0 && (
            <p className="flex items-center gap-1 text-body leading-6 font-medium text-gray-dark">
              <Image
                src={iconViews}
                alt=""
                aria-hidden
                className="size-6 shrink-0"
              />
              <span className="sr-only">
                Personas que han visto este vehículo:{" "}
              </span>
              {vehicle.viewers}
            </p>
          )}
        </div>
        {vehicle.warranty && (
          <WarrantyBadgeComponent
            label={vehicle.warranty.label}
            tone={vehicle.warranty.tone}
            className="h-[38px]"
          />
        )}
      </div>

      <h1 className="mt-5 text-[28px] leading-9 font-bold text-dark-gray xl:text-[30px]">
        {vehicle.name}
      </h1>

      <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 text-small leading-6 font-medium text-gray">
        {vehicle.year && <InfoItem icon={iconYear}>{vehicle.year}</InfoItem>}
        {vehicle.mileage && (
          <InfoItem icon={iconMileage}>{vehicle.mileage}</InfoItem>
        )}
        <InfoItem icon={iconTransmission}>{vehicle.transmission}</InfoItem>
        <InfoItem icon={iconCity}>{vehicle.city}</InfoItem>
      </ul>

      <p className="mt-5 text-[15px] leading-6 font-medium text-gray-dark">
        {typeLine}
      </p>
      <p className="mt-2 text-body leading-6 font-bold text-gray-dark">
        Stock ID: {vehicle.stockId}
      </p>

      {!hidePrice && (
        <div className="mt-3">
          <p className="text-[26px] leading-9 font-bold text-dark-gray xl:text-[28px]">
            {vehicle.price}
          </p>
          {vehicle.previousPrice && (
            <p className="text-small leading-5 font-bold text-gray line-through">
              <span className="sr-only">Antes </span>
              {vehicle.previousPrice}
            </p>
          )}
        </div>
      )}

      <div className="mt-5 flex flex-col items-start gap-4">
        {!soldOut && (
          // TODO(negocio): ver el JSDoc, el pago no está portado.
          <ButtonComponent
            href={ROUTES.contact}
            size="medium"
            icon={arrowCircle}
            className="max-w-none!"
          >
            Sepáralo aquí
          </ButtonComponent>
        )}
        <VehicleExpertiseComponent
          vehicleId={vehicle.id}
          expertise={vehicle.expertise}
          vehicleName={vehicle.name}
          variant="summary"
        />
      </div>

      <ul className="mt-7 text-[15px] leading-6 font-medium text-gray-dark">
        {vehicle.warranty && (
          <Bullet icon={iconHappiness}>{vehicle.warranty.bullet}</Bullet>
        )}
        <Bullet icon={iconFinancing}>
          Financiación hasta del 100% del vehículo
        </Bullet>
        <Bullet icon={iconFairPrice}>
          Precio más justo <span className="text-orange">del mercado</span>
        </Bullet>
        <Bullet icon={iconStopwatch}>
          <a href="#financiacion" className="hover:text-orange">
            Financia hasta $15 millones en 3 minutos
          </a>
        </Bullet>
        {vehicle.happinessWarranty && (
          <Bullet icon={iconHappinessWarranty}>
            Garantía de felicidad: 7 días o te cambiamos el carro
          </Bullet>
        )}
      </ul>
    </div>
  );
}

function Bullet({
  icon,
  children,
}: {
  icon: typeof iconCity;
  children: React.ReactNode;
}) {
  return (
    <li className="flex items-center gap-3 border-t border-gray/30 py-4 first:border-t-0 first:pt-0">
      <Image src={icon} alt="" aria-hidden className="size-6 shrink-0" />
      <span>{children}</span>
    </li>
  );
}
