import { CONTACT_INFO } from "@/modules/shared/constants/contact";

import type { User } from "../types/auth";
import LogoutButtonComponent from "./LogoutButtonComponent";
import ProfileFormComponent from "./ProfileFormComponent";

/**
 * Vista "Mi cuenta" (`ROUTES.account`).
 *
 * No hay diseño: se armó con los tokens del sistema. Muestra y deja editar el
 * nombre, muestra el correo (es la identidad del login y no se cambia) y el
 * teléfono, y permite cerrar sesión.
 * TODO: "Tus vehículos" (`/tus-vehiculos` del sitio anterior) cuando exista.
 * TODO(backend): eliminar la cuenta. No hay endpoint: el sitio anterior armaba un
 * `mailto:` y aquí se hace igual.
 */
export default function AccountViewComponent({ user }: { user: User }) {
  const initial = (user.name || user.email).charAt(0).toUpperCase();
  const deleteMail = `mailto:${CONTACT_INFO.email}?subject=${encodeURIComponent("Solicitud de eliminación de cuenta")}&body=${encodeURIComponent(`Quiero eliminar mi cuenta de WCAR asociada al correo ${user.email}.`)}`;

  return (
    <section aria-labelledby="account-title" className="container-wcar py-10 xl:py-16">
      <div className="mx-auto max-w-[640px]">
        <div className="reveal flex items-center gap-4">
          <span aria-hidden className="flex size-16 shrink-0 items-center justify-center rounded-full bg-orange text-heading-1 font-bold text-white">
            {initial}
          </span>
          <div className="min-w-0">
            <h1 id="account-title" className="text-heading-1 font-bold text-dark-gray xl:text-subheadline-1 xl:leading-11">
              Mi cuenta
            </h1>
            <p className="truncate text-small text-gray-dark">{user.email}</p>
          </div>
        </div>

        <div className="reveal mt-8 rounded-tr-[30px] rounded-bl-[30px] bg-gray-light p-6 xl:p-8">
          <ProfileFormComponent name={user.name} email={user.email} phone={user.phone} />
        </div>

        <div className="reveal mt-8 flex flex-wrap items-center justify-between gap-4">
          <LogoutButtonComponent />
          <a href={deleteMail} className="text-small text-gray-dark underline hover:text-orange">
            Solicitar eliminación de cuenta
          </a>
        </div>
      </div>
    </section>
  );
}
