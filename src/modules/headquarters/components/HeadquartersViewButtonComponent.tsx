"use client";

import ButtonComponent from "@/modules/shared/components/ButtonComponent";

import { useHeadquartersModal } from "../hooks/useHeadquartersModal";

/**
 * Botón VER de una tarjeta: abre el modal de su sede. Es lo único de la tarjeta
 * que necesita el navegador. El texto para lectores de pantalla nombra la sede
 * ("VER wcar Punto de Venta Morato"), porque ocho botones "VER" no dicen nada.
 */
export default function HeadquartersViewButtonComponent({ id, label }: { id: string; label: string }) {
  const { open } = useHeadquartersModal();

  return (
    <ButtonComponent onClick={() => open(id)} className="w-full justify-center!">
      VER
      <span className="sr-only"> {label}</span>
    </ButtonComponent>
  );
}
