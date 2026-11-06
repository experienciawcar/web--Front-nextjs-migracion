import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { AuthError } from "@/modules/auth/types/auth";
import { destroySession, getSessionToken } from "@/modules/auth/services/session";
import { listFavorites } from "@/modules/favorites/services/favorites-backend";
import VehicleCardComponent from "@/modules/shared/components/VehicleCardComponent";
import { ROUTES } from "@/modules/shared/constants/routes";
import { toVehicle } from "@/modules/shared/services/vehicles";
import type { Vehicle } from "@/modules/shared/types/vehicle";
import { buildPageMetadata } from "@/modules/shared/utils/seo";

export const metadata: Metadata = {
  ...buildPageMetadata({
    title: "Mis vehículos favoritos | WCAR",
    description: "Los vehículos que guardaste en WCAR.",
    path: ROUTES.favorites,
  }),
  robots: { index: false, follow: false },
};

/** Vista Favoritos (`ROUTES.favorites`). Sin sesión, manda al login y vuelve aquí al entrar. */
export default async function FavoritesPage() {
  const token = await getSessionToken();
  const login = `${ROUTES.signIn}?next=${encodeURIComponent(ROUTES.favorites)}`;
  if (!token) redirect(login);

  let vehicles: Vehicle[];
  try {
    vehicles = (await listFavorites(token)).map(toVehicle).filter((v): v is Vehicle => v !== null);
  } catch (error) {
    if (error instanceof AuthError && error.status === 401) {
      await destroySession();
      redirect(login);
    }
    throw error;
  }

  return (
    <main className="mx-auto w-full max-w-[1212px] flex-1 px-4 py-10">
      <h1 className="text-[28px] leading-9 font-bold text-dark-gray">Vehículos favoritos</h1>
      {vehicles.length === 0 ? (
        <p className="mt-6 text-gray">
          Aún no tienes vehículos favoritos.{" "}
          <Link href={ROUTES.buyCar} className="font-bold text-orange underline">
            Explora el catálogo
          </Link>
        </p>
      ) : (
        <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {vehicles.map((vehicle) => (
            <li key={vehicle.id} className="flex">
              <VehicleCardComponent vehicle={vehicle} sizes="(min-width: 1024px) 290px, 50vw" className="w-full" />
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
