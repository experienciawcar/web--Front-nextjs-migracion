"use client";

import { useEffect, useState } from "react";

import arrowCircle from "@/modules/shared/assets/icons/arrow-circle.svg";
import ButtonComponent from "@/modules/shared/components/ButtonComponent";
import { ROUTES } from "@/modules/shared/constants/routes";

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
      className={`fixed inset-x-0 bottom-0 z-30 bg-dark-gray p-3 transition-transform duration-200 motion-reduce:transition-none xl:hidden ${footerVisible ? "pointer-events-none translate-y-full" : ""}`}
    >
      <ButtonComponent
        href={ROUTES.contact}
        icon={arrowCircle}
        className="w-full"
      >
        Separar vehículo
      </ButtonComponent>
    </div>
  );
}
