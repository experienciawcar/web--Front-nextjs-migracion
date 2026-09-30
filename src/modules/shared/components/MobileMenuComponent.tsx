"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";

import chevronDown from "../assets/navbar/chevron-down.svg";
import type { NavLink } from "../types/navigation";
import AppLinkComponent from "./AppLinkComponent";
import NavLinkContentComponent from "./NavLinkContentComponent";

/** Primer nivel más grande y con peso; los niveles de adentro, más discretos. */
const ROW_CLASS: Record<"top" | "nested", string> = {
  top: "flex flex-1 items-center gap-2 py-3 text-body font-bold text-gray-dark transition-colors hover:text-orange active:text-orange",
  nested:
    "flex flex-1 items-center gap-2 py-2.5 text-small font-medium text-gray-dark transition-colors hover:text-orange active:text-orange",
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
  enter,
}: {
  item: NavLink;
  level: "top" | "nested";
  onNavigate: () => void;
  /** Solo el primer nivel: entrada escalonada al abrir el menú. */
  enter?: { visible: boolean; index: number };
}) {
  const [isOpen, setIsOpen] = useState(false);
  const panelId = useId();

  const enterProps = enter
    ? {
        className: `transition-[opacity,translate] duration-300 ease-out motion-reduce:transition-none ${
          enter.visible
            ? "translate-y-0 opacity-100"
            : "translate-y-3 opacity-0"
        }`,
        style: {
          transitionDelay: enter.visible ? `${80 + enter.index * 45}ms` : "0ms",
        },
      }
    : {};

  if (!item.children) {
    return (
      <li {...enterProps} className={`flex ${enterProps.className ?? ""}`}>
        <AppLinkComponent
          href={item.href}
          onClick={onNavigate}
          className={ROW_CLASS[level]}
        >
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
      className={`h-auto w-[10px] shrink-0 transition-transform duration-300 ease-out motion-reduce:transition-none ${isOpen ? "rotate-180" : ""}`}
    />
  );
  const toggleProps = {
    type: "button" as const,
    "aria-expanded": isOpen,
    "aria-controls": panelId,
    onClick: () => setIsOpen((open) => !open),
  };

  return (
    <li {...enterProps}>
      <div className="flex items-center">
        {item.href ? (
          <>
            <AppLinkComponent
              href={item.href}
              onClick={onNavigate}
              className={ROW_CLASS[level]}
            >
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
            <span className="ml-auto flex size-11 items-center justify-center">
              {chevron}
            </span>
          </button>
        )}
      </div>

      {/* Acordeón animado: la fila de la cuadrícula pasa de 0fr a 1fr, así la
          altura se anima sin medirla. `inert` saca el contenido cerrado del
          foco y de los lectores de pantalla. */}
      <div
        className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out motion-reduce:transition-none ${
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
        inert={!isOpen}
      >
        <ul
          id={panelId}
          className="ml-2 min-h-0 overflow-hidden border-l border-gray-light pl-4"
        >
          {item.children.map((child) => (
            <MobileNavItem
              key={child.label}
              item={child}
              level="nested"
              onNavigate={onNavigate}
            />
          ))}
        </ul>
      </div>
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
  // Cambia en cada apertura y se usa como `key` de la lista: los items se
  // vuelven a montar y todos los acordeones arrancan cerrados.
  const [openCount, setOpenCount] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);

  // Con el menú abierto la página de atrás no se desplaza; Escape lo cierra; y
  // si la pantalla crece hasta el navbar de escritorio, se cierra para no
  // dejar el scroll bloqueado sin nada visible.
  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    const desktop = window.matchMedia("(min-width: 1280px)");
    const onChange = (event: MediaQueryListEvent) => {
      if (event.matches) setIsOpen(false);
    };
    // Un toque fuera del botón y del panel (el logo, el resto del navbar, la
    // página) cierra el menú. El botón queda fuera de esto: tiene su propio toggle.
    const onPointerDown = (event: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node))
        setIsOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    desktop.addEventListener("change", onChange);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
      desktop.removeEventListener("change", onChange);
    };
  }, [isOpen]);

  const barClass =
    "absolute left-1.5 h-[2px] w-7 rounded-full bg-dark-gray transition-[transform,opacity] duration-300 ease-out motion-reduce:transition-none";

  return (
    <div ref={rootRef} className="xl:hidden">
      <button
        type="button"
        onClick={() => {
          if (!isOpen) setOpenCount((count) => count + 1);
          setIsOpen((open) => !open);
        }}
        aria-expanded={isOpen}
        aria-controls="menu-mobile"
        aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
        className="relative flex size-10 items-center justify-center active:scale-90 transition-transform motion-reduce:transition-none"
      >
        {/* Tres barras de 28px con la separación del ícono de Figma; al abrir se
            vuelven una X. */}
        <span
          aria-hidden
          className={`${barClass} top-[13px] ${isOpen ? "translate-y-[7px] rotate-45" : ""}`}
        />
        <span
          aria-hidden
          className={`${barClass} top-[20px] ${isOpen ? "scale-x-0 opacity-0" : ""}`}
        />
        <span
          aria-hidden
          className={`${barClass} top-[27px] ${isOpen ? "-translate-y-[7px] -rotate-45" : ""}`}
        />
      </button>

      {/* Telón: oscurece la página y, al tocarlo, cierra el menú. */}
      <div
        aria-hidden
        onClick={() => setIsOpen(false)}
        className={`fixed inset-x-0 bottom-0 top-20 z-40 bg-black/40 transition-opacity duration-300 motion-reduce:transition-none ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Siempre montado para poder animar la salida; cerrado queda invisible e
          `inert` (sin foco ni lectores de pantalla). */}
      <div
        id="menu-mobile"
        inert={!isOpen}
        className={`absolute inset-x-0 top-full z-50 max-h-[calc(100dvh-5rem)] overflow-y-auto overscroll-contain border-t border-gray-light bg-white shadow-lg transition-[opacity,translate,visibility] duration-300 ease-out motion-reduce:transition-none ${
          isOpen
            ? "visible translate-y-0 opacity-100"
            : "invisible -translate-y-3 opacity-0"
        }`}
      >
        <ul key={openCount} className="container-wcar flex flex-col py-2">
          {items.map((item, index) => (
            <MobileNavItem
              key={item.label}
              item={item}
              level="top"
              enter={{ visible: isOpen, index }}
              onNavigate={() => setIsOpen(false)}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}
