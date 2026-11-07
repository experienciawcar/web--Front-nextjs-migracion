"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState, useSyncExternalStore } from "react";

import { ROUTES } from "@/modules/shared/constants/routes";
import { HeartIcon } from "@/modules/shared/components/icons";

import {
  favoritesServerSnapshot,
  favoritesSnapshot,
  isLoggedIn,
  setFavorite,
  subscribeFavorites,
} from "../services/favorites-client";

/**
 * Corazón de favoritos (tarjeta y ficha). Sin sesión manda al login y vuelve a la misma página.
 * En `/favoritos` refresca la página al quitar para que la tarjeta desaparezca.
 */
export default function FavoriteButtonComponent({
  vehicleId,
  className = "",
  fit = false,
}: {
  vehicleId: number;
  className?: string;
  /** Corazón que llena los 24 x 24, con el trazo más grueso (ficha del vehículo). */
  fit?: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);
  const saved = useSyncExternalStore(subscribeFavorites, favoritesSnapshot, favoritesServerSnapshot);
  const active = (JSON.parse(saved) as number[]).includes(vehicleId);

  async function onClick() {
    if (busy) return;
    if (!isLoggedIn()) {
      router.push(`${ROUTES.signIn}?next=${encodeURIComponent(pathname)}`);
      return;
    }
    setBusy(true);
    const ok = await setFavorite(vehicleId, !active);
    setFailed(!ok);
    setBusy(false);
    if (ok && pathname === ROUTES.favorites) router.refresh();
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      aria-label={active ? "Quitar de favoritos" : "Guardar en favoritos"}
      title={failed ? "No pudimos guardar el cambio. Inténtalo de nuevo." : undefined}
      className={`cursor-pointer text-orange focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange ${className}`}
    >
      <HeartIcon fit={fit} className={`size-6 ${active ? "fill-current" : ""}`} />
    </button>
  );
}
