"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import ButtonComponent from "@/modules/shared/components/ButtonComponent";

import iconGoogleMaps from "../assets/intro/icon-google-maps.svg";
import { GOOGLE_MAPS_URL } from "../constants/links";
import { useHeadquartersModal } from "../hooks/useHeadquartersModal";

type Status = "idle" | "locating" | "denied" | "failed";

/** Cuánto se espera la ubicación antes de rendirse, y cuánto vale una ubicación ya conocida. */
const GEOLOCATION_OPTIONS: PositionOptions = {
  enableHighAccuracy: false,
  timeout: 10_000,
  maximumAge: 5 * 60 * 1000,
};

/**
 * Botón "Google Maps" del banner: lleva a la sede más cercana a quien lo pulsa.
 *
 * Cómo:
 * 1. Pide la ubicación al navegador (`navigator.geolocation`): sale su aviso de
 *    permiso. Solo funciona en HTTPS (o en localhost). La ubicación se usa en el
 *    navegador para el cálculo y no se guarda ni se envía a ningún servidor.
 * 2. Con ella calcula la distancia a cada concesionario
 *    (`findNearestHeadquarters`) y abre el modal del más cercano.
 * 3. Si no se pudo (negó el permiso, el navegador no la da, tardó más de 10
 *    segundos), no se abre nada: se avisa debajo del botón y se ofrece buscar las
 *    sedes en Google Maps con un enlace.
 *
 * Por qué abre el modal y no Google Maps directo: la ubicación llega de forma
 * asíncrona, después del clic, y los navegadores (sobre todo Safari) bloquean
 * `window.open` a esas alturas. El modal ya trae los botones WAZE y Google Maps
 * de esa sede, que son enlaces reales.
 *
 * El botón conserva el aspecto del diseño (pin y "Google Maps"). Mientras busca
 * queda deshabilitado, y el aviso va en una región `aria-live` para lectores de
 * pantalla.
 */
export default function NearestHeadquartersButtonComponent({ className }: { className?: string }) {
  const { openNearest } = useHeadquartersModal();
  const [status, setStatus] = useState<Status>("idle");
  // Si el componente se desmonta mientras se espera la ubicación, la respuesta se ignora.
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  function handleClick() {
    if (!("geolocation" in navigator)) {
      setStatus("failed");
      return;
    }

    setStatus("locating");
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        if (!mounted.current) return;
        const found = openNearest({ lat: coords.latitude, lng: coords.longitude });
        setStatus(found ? "idle" : "failed");
      },
      (error) => {
        if (!mounted.current) return;
        setStatus(error.code === error.PERMISSION_DENIED ? "denied" : "failed");
      },
      GEOLOCATION_OPTIONS,
    );
  }

  return (
    <div className={className}>
      <ButtonComponent
        onClick={handleClick}
        disabled={status === "locating"}
        variant="secondary"
        size="medium"
        className="w-[280px] max-w-none! normal-case!"
      >
        <Image src={iconGoogleMaps} alt="" aria-hidden className="h-[17px] w-3" />
        Google Maps
      </ButtonComponent>

      <p role="status" aria-live="polite" className="mt-3 max-w-[420px] text-small font-medium text-gray-dark empty:hidden">
        {status === "locating" && "Buscando la sede más cercana a ti…"}
        {status === "denied" && (
          <>
            No pudimos ver tu ubicación porque no diste el permiso. Puedes ver todas las sedes aquí abajo o{" "}
            <a href={GOOGLE_MAPS_URL} target="_blank" rel="noopener noreferrer" className="font-bold text-orange underline">
              buscarlas en Google Maps
            </a>
            .
          </>
        )}
        {status === "failed" && (
          <>
            No pudimos saber dónde estás. Puedes ver todas las sedes aquí abajo o{" "}
            <a href={GOOGLE_MAPS_URL} target="_blank" rel="noopener noreferrer" className="font-bold text-orange underline">
              buscarlas en Google Maps
            </a>
            .
          </>
        )}
      </p>
    </div>
  );
}
