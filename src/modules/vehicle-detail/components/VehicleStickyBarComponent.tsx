"use client";

import { useEffect, useState } from "react";

import Image from "next/image";

import AppLinkComponent from "@/modules/shared/components/AppLinkComponent";
import { ROUTES } from "@/modules/shared/constants/routes";

import rectangleSticky from "../assets/sticky/rectangle-sticky-mobile.svg";
import { isUnavailable } from "../constants/tags";

/**
 * Barra fija "SEPARAR VEHÍCULO" de mobile (`StickyActionMobile` del sitio anterior): pegada al borde
 * inferior de la ventana mientras se lee la ficha. Solo en pantallas menores a 1280.
 *
 * Se esconde (baja fuera de la ventana) cuando el pie de página entra en pantalla: así no queda
 * una franja oscura suelta entre el contenido y el footer. Sin JavaScript no hay barra (es un
 * atajo, la página tiene su botón "Sepáralo aquí").
 *
 * A diferencia del sitio anterior, sí respeta las etiquetas "Reservado" y "Vendido" (allí la barra
 * dejaba iniciar la separación de un vehículo ya reservado: `docs/DETALLE_VEHICULO.md` §7.12).
 * TODO(negocio): igual que "SEPÁRALO AQUÍ", lleva a Contacto hasta que se porte el pago.
 * El diseño mobile (89:4840) no dibuja esta barra.
 */
export default function VehicleStickyBarComponent({
  tagName,
}: {
  tagName: string | undefined;
}) {
  const [footerVisible, setFooterVisible] = useState(false);

  useEffect(() => {
    const footer = document.querySelector("footer");
    if (!footer) return;
    const observer = new IntersectionObserver(([entry]) =>
      setFooterVisible(entry.isIntersecting),
    );
    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  if (isUnavailable(tagName)) return null;

  return (
    <div
      aria-hidden={footerVisible}
      className={`fixed inset-x-0 bottom-0 z-30 flex justify-center overflow-hidden bg-[#1a1a1a] px-5 py-[15px] transition-transform duration-200 motion-reduce:transition-none xl:hidden ${footerVisible ? "pointer-events-none translate-y-full" : ""}`}
    >
      <AppLinkComponent
        href={ROUTES.contact}
        className="group relative flex h-11 w-full max-w-[450px] rounded-tr-[35px] rounded-bl-[35px] drop-shadow-[0_4px_15px_rgba(0,0,0,0.4)]"
      >
        <span aria-hidden className="-mr-[30px] h-11 w-[53px] rounded-bl-[35px] bg-blue-neon" />
        <span className="relative z-[101] -ml-px flex h-11 grow items-center justify-center gap-3 overflow-hidden rounded-tr-[35px] rounded-bl-[35px] bg-[#f60] text-[15px] font-bold tracking-[0.5px] text-white uppercase">
          Separar vehículo
          <svg
            className="size-6 transition-transform duration-300 group-hover:translate-x-[5px]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </span>
        <span aria-hidden className="absolute -top-[22px] -right-[23px] z-[100]">
          <Image src={rectangleSticky} alt="" className="h-[50px] w-auto" />
        </span>
      </AppLinkComponent>
    </div>
  );
}
