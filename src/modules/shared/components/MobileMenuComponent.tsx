"use client";

import Image from "next/image";
import { useId, useState } from "react";

import chevronDown from "../assets/navbar/chevron-down.svg";
import iconMenu from "../assets/navbar/icon-menu.svg";
import type { NavLink } from "../types/navigation";
import AppLinkComponent from "./AppLinkComponent";
import NavLinkContentComponent from "./NavLinkContentComponent";

/** Primer nivel más grande y con peso; los niveles de adentro, más discretos. */
const ROW_CLASS: Record<"top" | "nested", string> = {
  top: "flex flex-1 items-center gap-2 py-3 text-body font-bold text-gray-1 transition-colors hover:text-orange",
  nested:
    "flex flex-1 items-center gap-2 py-2.5 text-small font-medium text-gray-1 transition-colors hover:text-orange",
};

/**
 * Fila del menú mobile. Con submenú es un acordeón: el texto sigue siendo un
 * enlace a su página y el chevron es un botón aparte con `aria-expanded`, igual
 * que en el desplegable de escritorio. Es recursivo porque "Compra tu carro"
 * tiene un tercer nivel (los tipos de vehículo).
 */
function MobileNavItem({
  item,
  level,
  onNavigate,
}: {
  item: NavLink;
  level: "top" | "nested";
  onNavigate: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const panelId = useId();

  if (!item.children) {
    return (
      <li className="flex">
        <AppLinkComponent href={item.href} onClick={onNavigate} className={ROW_CLASS[level]}>
          <NavLinkContentComponent item={item} />
        </AppLinkComponent>
      </li>
    );
  }

  const chevron = (
    <Image
      src={chevronDown}
      alt=""
      aria-hidden
      className={`h-auto w-[10px] shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
    />
  );
  const toggleProps = {
    type: "button" as const,
    "aria-expanded": isOpen,
    "aria-controls": panelId,
    onClick: () => setIsOpen((open) => !open),
  };

  return (
    <li>
      <div className="flex items-center">
        {item.href ? (
          <>
            <AppLinkComponent href={item.href} onClick={onNavigate} className={ROW_CLASS[level]}>
              {item.label}
            </AppLinkComponent>
            {/* Área táctil de 44px de alto en la fila completa, no solo el ícono. */}
            <button
              {...toggleProps}
              aria-label={`Opciones de ${item.label}`}
              className="flex size-11 shrink-0 items-center justify-center"
            >
              {chevron}
            </button>
          </>
        ) : (
          <button {...toggleProps} className={`${ROW_CLASS[level]} text-left`}>
            {item.label}
            <span className="ml-auto flex size-11 items-center justify-center">{chevron}</span>
          </button>
        )}
      </div>

      <ul id={panelId} hidden={!isOpen} className="ml-2 border-l border-light-gray pl-4">
        {item.children.map((child) => (
          <MobileNavItem key={child.label} item={child} level="nested" onNavigate={onNavigate} />
        ))}
      </ul>
    </li>
  );
}

/**
 * El diseño de Figma solo tiene el navbar mobile cerrado: no existe ningún
 * frame del menú abierto en todo el archivo (se buscó por nombre en las 16
 * páginas). Este panel es una solución provisional construida con los tokens
 * del sistema, no una traducción del diseño.
 * TODO: reemplazar cuando exista el diseño del menú desplegado.
 *
 * El panel se limita al alto de la ventana y hace scroll por dentro: con
 * "Compra tu carro" abierto son ocho tipos de vehículo más el resto de items, y
 * en un teléfono se salían de la pantalla sin poder llegar al final.
 */
export default function MobileMenuComponent({ items }: { items: NavLink[] }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="xl:hidden">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        aria-controls="menu-mobile"
        aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
        className="flex size-10 items-center justify-center"
      >
        {/* El SVG exportado es la caja completa de 40x40 del componente de
            Figma; el trazo de 28x18 ya viene centrado dentro. */}
        <Image src={iconMenu} alt="" aria-hidden className="size-10" />
      </button>

      {isOpen && (
        <div
          id="menu-mobile"
          className="absolute inset-x-0 top-full z-50 max-h-[calc(100dvh-5rem)] overflow-y-auto border-t border-light-gray bg-white shadow-lg"
        >
          <ul className="container-wcar flex flex-col py-2">
            {items.map((item) => (
              <MobileNavItem
                key={item.label}
                item={item}
                level="top"
                onNavigate={() => setIsOpen(false)}
              />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
