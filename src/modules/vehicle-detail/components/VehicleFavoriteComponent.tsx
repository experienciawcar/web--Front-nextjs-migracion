"use client";

import { useSyncExternalStore } from "react";

import { HeartIcon } from "@/modules/shared/components/icons";

const KEY = "wcar-favorites";
const listeners = new Set<() => void>();

function read(): number[] {
  try {
    const list: unknown = JSON.parse(localStorage.getItem(KEY) ?? "[]");
    return Array.isArray(list) ? list.filter((id) => typeof id === "number") : [];
  } catch {
    return [];
  }
}

/** La lista en texto: `useSyncExternalStore` compara por valor y el servidor devuelve "[]". */
const snapshot = () => JSON.stringify(read());

function toggle(id: number) {
  const list = read();
  const next = list.includes(id) ? list.filter((item) => item !== id) : [...list, id];
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    return; // sin almacenamiento (modo privado): no hay dónde guardarlo
  }
  listeners.forEach((listener) => listener());
}

/**
 * Corazón de favoritos de la ficha (Figma 1542:22601, naranja de 20 x 18, relleno al marcarlo).
 *
 * TODO(backend): no hay endpoint de favoritos; la lista (ids de vehículo) vive en `localStorage`
 * (`wcar-favorites`), por navegador y sin cuenta. Cuando exista, cambiar `read`/`toggle` por la API.
 */
export default function VehicleFavoriteComponent({ vehicleId }: { vehicleId: number }) {
  const saved = useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    snapshot,
    () => "[]",
  );
  const active = (JSON.parse(saved) as number[]).includes(vehicleId);

  return (
    <button
      type="button"
      onClick={() => toggle(vehicleId)}
      aria-pressed={active}
      aria-label={active ? "Quitar de favoritos" : "Guardar en favoritos"}
      className="cursor-pointer text-orange focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange"
    >
      <HeartIcon className={`size-6 ${active ? "fill-current" : ""}`} />
    </button>
  );
}
