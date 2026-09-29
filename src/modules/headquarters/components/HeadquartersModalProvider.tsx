"use client";

import { useCallback, useMemo, useState } from "react";

import { HeadquartersModalContext } from "../hooks/useHeadquartersModal";
import { findNearestHeadquarters } from "../services/nearest-headquarters";
import type { Coordinates, Headquarters } from "../types/headquarters";

import HeadquartersModalComponent from "./HeadquartersModalComponent";

/**
 * Guarda qué sede tiene abierta el modal y lo pinta. Envuelve la página entera
 * (banner y cuadrícula): los botones que lo abren son hijos (`useHeadquartersModal`):
 * el VER de cada tarjeta y el "Google Maps" del banner, que abre el del
 * concesionario más cercano. Así las tarjetas siguen siendo componentes de
 * servidor y solo esos botones y el modal viajan al navegador.
 *
 * `distanceKm` no es `null` cuando el modal se abrió por "la más cercana": el
 * modal lo muestra ("Sede más cercana a ti · a 3,2 km").
 *
 * El modal no se pinta hasta que hay una sede abierta, así que el mapa
 * embebido y las fotos de la galería no cargan antes de que alguien lo abra.
 * TODO: que la URL guarde la sede abierta (`#punto-de-venta-morato`) para poder
 * compartir el enlace; hoy no.
 */
export default function HeadquartersModalProvider({
  headquarters,
  children,
}: {
  headquarters: Headquarters[];
  children: React.ReactNode;
}) {
  const [selected, setSelected] = useState<{ id: string; distanceKm: number | null } | null>(null);
  const current = headquarters.find((item) => item.id === selected?.id) ?? null;

  const open = useCallback((id: string) => setSelected({ id, distanceKm: null }), []);
  const openNearest = useCallback(
    (position: Coordinates) => {
      const nearest = findNearestHeadquarters(position, headquarters);
      if (!nearest) return null;
      setSelected({ id: nearest.headquarters.id, distanceKm: nearest.distanceKm });
      return nearest.headquarters.name;
    },
    [headquarters],
  );
  const value = useMemo(() => ({ open, openNearest }), [open, openNearest]);

  return (
    <HeadquartersModalContext.Provider value={value}>
      {children}
      <HeadquartersModalComponent
        headquarters={current}
        distanceKm={selected?.distanceKm ?? null}
        onClose={() => setSelected(null)}
      />
    </HeadquartersModalContext.Provider>
  );
}
