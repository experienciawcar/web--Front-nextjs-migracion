import type { Metadata } from "next";

import ButtonComponent from "@/modules/shared/components/ButtonComponent";
import { ROUTES } from "@/modules/shared/constants/routes";

export const metadata: Metadata = { title: "¡Gracias! | WCAR", robots: { index: false } };

export default function ThankYouPage() {
  return (
    <main className="mx-auto flex w-full max-w-[720px] flex-1 flex-col items-start gap-6 px-5 py-16">
      <h1 className="text-heading-1 font-bold text-dark-gray">¡Tu vehículo quedó separado!</h1>
      <p className="text-small font-medium text-gray-dark">
        Te enviamos la confirmación de tu cita al correo. Un asesor de WCAR te contactará pronto.
      </p>
      <ButtonComponent href={ROUTES.buyCar}>Seguir viendo vehículos</ButtonComponent>
    </main>
  );
}
