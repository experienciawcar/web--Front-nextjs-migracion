"use client";

import { useRef } from "react";

import Image from "next/image";

import { HEADQUARTERS } from "@/modules/headquarters/constants/headquarters";
import iconGoogleMaps from "@/modules/headquarters/assets/intro/icon-google-maps.svg";
import iconWaze from "@/modules/headquarters/assets/modal/icon-waze.svg";
import SeparateVehicleButtonComponent from "@/modules/separation/components/SeparateVehicleButtonComponent";
import ButtonComponent from "@/modules/shared/components/ButtonComponent";
import { whatsappHref } from "@/modules/shared/constants/whatsapp";

/** La vitrina de Bogotá: el backend aún no dice en qué sede está cada vehículo (se integra después). */
const SEDE =
  HEADQUARTERS.find((h) => h.id === "vitrina-ventas-w4") ?? HEADQUARTERS[0];

const PIN_PATH =
  "M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5Z";

/**
 * Pastilla con la ciudad del vehículo; al pulsarla abre "Este vehículo se encuentra en:" con la
 * sede, "Pregunta por envío" (WhatsApp), Waze, Google Maps y "Solicitar reserva" (el mismo modal
 * de "Sepáralo aquí"). En mobile sale como hoja desde abajo. `<dialog>` nativo: Esc cierra y el
 * foco queda dentro. TODO: la sede es fija (W4) hasta que el backend traiga la del vehículo.
 */
export default function VehicleLocationComponent({
  city,
  vehicleId,
  vehicleName,
  price,
  priceValue,
  stockId,
  canReserve,
}: {
  city: string;
  vehicleId: number;
  vehicleName: string;
  price: string;
  priceValue: number;
  stockId: string;
  canReserve: boolean;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const query = encodeURIComponent(SEDE.mapQuery ?? SEDE.address);

  return (
    <>
      <button
        type="button"
        onClick={() => dialog.current?.showModal()}
        className="flex shrink-0 cursor-pointer items-center gap-1 rounded bg-gray-light px-2 py-1 hover:bg-orange/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange"
      >
        <svg aria-hidden viewBox="0 0 24 24" className="size-4 text-orange" fill="currentColor">
          <path d={PIN_PATH} />
        </svg>
        {city}
      </button>
      <dialog
        ref={dialog}
        aria-labelledby="ubicacion-titulo"
        className="mx-auto mt-auto mb-0 w-full max-w-[500px] rounded-t-2xl p-6 backdrop:bg-black/60 sm:m-auto sm:rounded-2xl"
        onClick={(event) => event.target === dialog.current && dialog.current?.close()}
      >
        <div className="flex flex-col gap-4">
          <div className="border-b border-gray/30 pb-4">
            <p className="text-body font-bold text-dark-gray">{vehicleName}</p>
            <p className="text-small font-medium text-gray-dark">
              <span className="font-bold text-dark-gray">{price}</span> · {stockId}
            </p>
          </div>
          <h2 id="ubicacion-titulo" className="text-body font-bold text-dark-gray">
            Este vehículo se encuentra en:
          </h2>
          <div className="flex items-center gap-4">
            <Image
              src={SEDE.photo}
              alt={`${SEDE.brand} ${SEDE.name}`}
              width={168}
              height={140}
              className="h-24 w-28 shrink-0 rounded object-cover"
              style={{ objectPosition: SEDE.photoPosition }}
            />
            <div className="flex min-w-0 flex-col gap-1">
              <p className="text-[18px] leading-6 font-bold text-dark-gray">
                {SEDE.brand} - {SEDE.name}
              </p>
              <p className="text-small text-gray-dark">{SEDE.address.split(",")[0]}</p>
              <span className="mt-1 flex w-fit items-center gap-1 rounded bg-gray-light px-3 py-1.5 text-small text-gray-dark">
                <svg aria-hidden viewBox="0 0 24 24" className="size-4 text-orange" fill="currentColor">
                  <path d={PIN_PATH} />
                </svg>
                {city}
              </span>
            </div>
          </div>
          <p className="text-small font-medium text-gray-dark">
            ¿Estás en otra ciudad?{" "}
            <a
              href={whatsappHref(`Hola, estoy en otra ciudad y quiero preguntar por el envío de ${vehicleName} (${stockId}).`)}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-orange hover:underline"
            >
              Pregunta por envío
            </a>
          </p>
          <div className="grid grid-cols-2 gap-4">
            <ButtonComponent
              href={`https://waze.com/ul?q=${query}&navigate=yes`}
              newTab
              variant="cyan"
              size="medium"
              className="w-full max-w-none!"
            >
              <Image src={iconWaze} alt="" aria-hidden className="size-6" />
              WAZE
            </ButtonComponent>
            <ButtonComponent
              href={`https://www.google.com/maps/search/?api=1&query=${query}`}
              newTab
              variant="secondary"
              size="medium"
              className="w-full max-w-none! normal-case!"
            >
              <Image src={iconGoogleMaps} alt="" aria-hidden className="h-[17px] w-3" />
              Google Maps
            </ButtonComponent>
          </div>
          {canReserve && (
            <SeparateVehicleButtonComponent
              vehicleId={vehicleId}
              vehicleName={vehicleName}
              price={priceValue}
              priceLabel={price}
              stockId={stockId}
              className="w-full max-w-none! justify-center! normal-case!"
            >
              Solicitar reserva
            </SeparateVehicleButtonComponent>
          )}
        </div>
      </dialog>
    </>
  );
}
