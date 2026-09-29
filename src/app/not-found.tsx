import type { Metadata } from "next";

import ButtonComponent from "@/modules/shared/components/ButtonComponent";
import { ROUTES } from "@/modules/shared/constants/routes";

export const metadata: Metadata = {
  title: "Página no encontrada | WCAR",
  description: "La página que buscas no existe o cambió de lugar.",
};

/** Página 404 propia (la de Next sale en inglés). Next ya le pone `noindex` y responde 404. */
export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 px-4 py-24 text-center">
      <p className="text-small font-bold text-orange">Error 404</p>
      <h1 className="text-[32px] leading-9 font-bold text-dark-gray xl:text-[42px] xl:leading-[48px]">
        No encontramos esta página
      </h1>
      <p className="max-w-[480px] text-body text-gray-dark">
        Puede que el enlace esté roto o que la página haya cambiado de lugar. Vuelve al inicio o revisa nuestros
        vehículos.
      </p>
      <div className="flex flex-col gap-4 sm:flex-row">
        <ButtonComponent href={ROUTES.home}>Ir al inicio</ButtonComponent>
        <ButtonComponent href={ROUTES.buyCar} variant="secondary">
          Ver vehículos
        </ButtonComponent>
      </div>
    </main>
  );
}
