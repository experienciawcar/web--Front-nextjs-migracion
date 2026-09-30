"use client";

import { useEffect, useState } from "react";

import type { Vehicle } from "@/modules/shared/types/vehicle";

import RelatedVehiclesComponent from "./RelatedVehiclesComponent";

/**
 * Pide los vehículos relacionados al terminar de pintar la ficha (`/api/vehiculos-relacionados`)
 * y monta "Vehículos relacionados" cuando llegan. El backend tarda ~24 s en esa lista (ver la
 * ruta): si se esperara en el servidor, la ficha entera se demoraría. Sin respuesta o sin
 * resultados no se pinta nada, igual que antes.
 */
export default function RelatedVehiclesLoaderComponent({ vehicleId }: { vehicleId: number }) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  useEffect(() => {
    const controller = new AbortController();
    fetch(`/api/vehiculos-relacionados/${vehicleId}`, { signal: controller.signal })
      .then((response) => (response.ok ? (response.json() as Promise<Vehicle[]>) : []))
      .then(setVehicles)
      .catch(() => {});
    return () => controller.abort();
  }, [vehicleId]);

  return <RelatedVehiclesComponent vehicles={vehicles} />;
}
