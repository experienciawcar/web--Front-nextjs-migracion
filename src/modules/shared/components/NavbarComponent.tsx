import Image from "next/image";
import Link from "next/link";

import iconAccount from "../assets/navbar/icon-account.svg";
import iconGoogle from "../assets/navbar/icon-google.svg";
import iconLocation from "../assets/navbar/icon-location.svg";
import logoWcar from "../assets/navbar/logo-wcar.svg";
import { ROUTES } from "../constants/routes";
import { getNavItems } from "../services/navigation";
import AppLinkComponent from "./AppLinkComponent";
import MobileMenuComponent from "./MobileMenuComponent";
import NavDropdownComponent from "./NavDropdownComponent";

/** Mismo estilo que el botón de los items con submenú (ver NavDropdownComponent). */
const NAV_LINK_CLASS =
  "flex items-center whitespace-nowrap text-small font-bold text-gray-1 transition-colors hover:text-orange";

/**
 * Los items con submenú (Sobre Nosotros, Compra o Vende, Servicios) llevan
 * chevron en el diseño. El diseño solo trae el estado cerrado, así que los
 * paneles desplegados están hechos con los tokens del sistema, a partir de la
 * estructura del sitio anterior (ver `getNavItems`).
 * TODO: ajustar los paneles cuando exista el diseño del estado abierto.
 *
 * El corte a la versión mobile es en `xl` (1280px) y no en `lg`: el layout de
 * desktop necesita ~1140px para no desbordar, así que en tablet se usa la
 * versión mobile del diseño (frame "Nav mobile", 393x96).
 *
 * Es un componente de servidor: el árbol de navegación se arma aquí (con los
 * tipos de vehículo del backend, cacheados) y solo las piezas interactivas
 * (`NavDropdownComponent`, `MobileMenuComponent`) viajan como JavaScript.
 *
 * No se trajo del navbar anterior, a propósito:
 *  - La cuenta regresiva de campaña: su fecha ("24/02/2025") ya venció y el
 *    estado que calculaba nunca se llegaba a pintar.
 *  - Ocultar el navbar al hacer scroll hacia abajo: se calculaba `isVisible`
 *    pero ninguna clase lo usaba, así que nunca hizo nada.
 *  - Lo que depende de la sesión (nombre del usuario, "Tus Vehículos", cerrar
 *    sesión, el botón de Google): este proyecto todavía no tiene autenticación.
 *    TODO: cuando exista, el enlace "Cuenta" pasa a mostrar el nombre y a
 *    abrir la sesión.
 */
export default async function NavbarComponent() {
  const navItems = await getNavItems();

  return (
    // z-40: los desplegables cuelgan sobre el contenido de la página, que en
    // Sobre Nosotros usa capas de hasta z-30 (foto del edificio, barra negra).
    <header className="relative z-40 h-20 w-full shrink-0 bg-white">
      <nav aria-label="Principal" className="container-wcar flex h-full items-center">
        <Link href={ROUTES.home} aria-label="WCAR, ir al inicio" className="shrink-0">
          <Image
            src={logoWcar}
            alt="WCAR"
            className="h-10 w-[124px] xl:h-12 xl:w-[148px]"
            priority
          />
        </Link>

        <ul className="ml-[54px] hidden items-center gap-[42px] xl:flex">
          {navItems.map((item) =>
            item.children ? (
              <NavDropdownComponent key={item.label} item={item} />
            ) : (
              <li key={item.label}>
                <AppLinkComponent href={item.href} className={NAV_LINK_CLASS}>
                  {item.label}
                </AppLinkComponent>
              </li>
            ),
          )}
        </ul>

        <div className="ml-auto flex items-center gap-4 xl:gap-[34px]">
          {/* TODO: selector de ciudad. En el diseño no hay estado abierto, y la
              ciudad seleccionada debería venir del contexto de usuario.
              En mobile el diseño no lo incluye. */}
          <div className="hidden items-center gap-[6px] xl:flex">
            <Image src={iconLocation} alt="" aria-hidden className="size-8" />
            <div className="flex flex-col">
              <span className="text-small font-bold leading-[22px] text-gray-1">Ubicación</span>
              <span className="text-caption font-medium leading-[22px] text-gray-2">Bogotá</span>
            </div>
          </div>

          {/* TODO: confirmar destino. En Figma es solo el isotipo de Google, sin
              enlace ni etiqueta; probablemente sea el badge de reseñas. */}
          <Image src={iconGoogle} alt="Google" className="hidden h-7 w-auto xl:block" />

          <Link
            href={ROUTES.signIn}
            className="flex items-center gap-1 whitespace-nowrap text-small font-bold text-gray-1 transition-colors hover:text-orange"
          >
            {/* El glifo es más pequeño que su caja: 32px en una caja de 40 en
                mobile, y 25.33px en una de 32 en desktop. La caja es la que
                define el espaciado. */}
            <span className="flex size-10 items-center justify-center xl:size-8">
              <Image
                src={iconAccount}
                alt=""
                aria-hidden
                className="size-8 xl:size-[25.33px]"
              />
            </span>
            <span className="hidden xl:inline">Cuenta</span>
          </Link>

          <MobileMenuComponent items={navItems} />
        </div>
      </nav>
    </header>
  );
}
