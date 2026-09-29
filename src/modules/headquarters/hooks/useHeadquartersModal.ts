"use client";

import { createContext, useContext } from "react";

import type { Coordinates } from "../types/headquarters";

/** Lo que los botones de la vista necesitan del modal de las sedes. */
export type HeadquartersModalContextValue = {
  /** Abre el modal de una sede (el botón VER de cada tarjeta). */
  open: (id: string) => void;
  /**
   * Abre el modal del concesionario más cercano a `position` y devuelve su
   * nombre, o `null` si no hay ninguno (el botón del banner).
   */
  openNearest: (position: Coordinates) => string | null;
};

export const HeadquartersModalContext = createContext<HeadquartersModalContextValue | null>(null);

export function useHeadquartersModal(): HeadquartersModalContextValue {
  const context = useContext(HeadquartersModalContext);
  if (!context) {
    throw new Error("useHeadquartersModal solo funciona dentro de HeadquartersModalProvider.");
  }
  return context;
}
