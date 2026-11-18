"use client";

import { useEffect, useState } from "react";

import SeparateVehicleButtonComponent from "@/modules/separation/components/SeparateVehicleButtonComponent";
import ButtonComponent from "@/modules/shared/components/ButtonComponent";
import { WhatsAppIcon } from "@/modules/shared/components/icons";

import arrowCircle from "@/modules/shared/assets/icons/arrow-circle.svg";

/**
 * Barra fija de mobile con dos caminos: "WhatsApp" (verde, para quien aún duda) y "Sepáralo desde
 * $2M" (naranja, para quien ya está listo), con el precio arriba. Pegada al borde inferior de la
 * ventana mientras se lee la ficha; solo en pantallas menores a 1280.
 *
 * Se esconde (baja fuera de la ventana) cuando el pie de página entra en pantalla, para no dejar
 * una franja suelta entre el contenido y el footer. Sin JavaScript no hay barra (es un atajo, la
 * página tiene sus botones).
 *
 * "Vendido": no hay barra. "Reservado": solo WhatsApp y sin precio (como la tarjeta de resumen).
 * El `id` lo usa el botón flotante global para ocultarse en mobile en esta página (ya hay uno aquí).
 * La cuota "o desde $X/mes*" del diseño no está: la API no la trae.
 */
export default function VehicleStickyBarComponent({
  tagName,
  price,
  priceValue,
  vehicleId,
  vehicleName,
  stockId,
  whatsappHref,
}: {
  stockId: string;
  tagName: string | undefined;
  price: string;
  priceValue: number;
  vehicleId: number;
  vehicleName: string;
  whatsappHref: string;
}) {
  const [footerVisible, setFooterVisible] = useState(false);
  const [buttonsVisible, setButtonsVisible] = useState(true);

  useEffect(() => {
    const footer = document.querySelector("footer");
    const buttons = document.getElementById("botones-ficha-movil");
    const observer = new IntersectionObserver((entries) =>
      entries.forEach((e) =>
        e.target === footer
          ? setFooterVisible(e.isIntersecting)
          : setButtonsVisible(e.isIntersecting),
      ),
    );
    if (footer) observer.observe(footer);
    if (buttons) observer.observe(buttons);
    return () => observer.disconnect();
  }, []);

  if (tagName === "Vendido") return null;
  const reserved = tagName === "Reservado";
  const hidden = footerVisible || buttonsVisible;

  return (
    <div
      id="barra-ficha-movil"
      aria-hidden={hidden}
      className={`fixed inset-x-0 bottom-0 z-30 flex flex-col gap-3 bg-white px-5 pt-4 pb-4 shadow-[0_-4px_15px_rgba(0,0,0,0.12)] transition-transform duration-200 motion-reduce:transition-none xl:hidden ${hidden ? "pointer-events-none translate-y-full" : ""}`}
    >
      <div>
        <p className="text-[16px] leading-6 font-bold text-dark-gray">{vehicleName}</p>
        <p className="text-[14px] leading-5 text-gray-dark">
          {!reserved && <span className="font-bold text-dark-gray">{price} · </span>}
          {stockId}
        </p>
      </div>
      <div className="flex gap-3">
        <ButtonComponent
          href={whatsappHref}
          newTab
          variant="green"
          size="medium"
          className="max-w-none! flex-2 px-2! text-[13px]!"
        >
          <WhatsAppIcon className="size-5" />
          WhatsApp
        </ButtonComponent>
        {!reserved && (
          <SeparateVehicleButtonComponent
            vehicleId={vehicleId}
            vehicleName={vehicleName}
            price={priceValue}
            priceLabel={price}
            stockId={stockId}
            icon={arrowCircle}
            className="max-w-none! flex-3 justify-center! px-2! text-[13px]!"
          >
            Sepáralo aquí
</SeparateVehicleButtonComponent>
        )}
      </div>
    </div>
  );
}
