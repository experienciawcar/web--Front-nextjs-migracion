"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";

import chevronDown from "../assets/navbar/chevron-down.svg";
import type { NavGroup } from "../types/navigation";
import AppLinkComponent from "./AppLinkComponent";
import NavLinkContentComponent from "./NavLinkContentComponent";

type Placement = "bottom" | "side";

/** Mismo estilo que los enlaces sueltos del navbar (ver NavbarComponent). */
const TRIGGER_CLASS =
  "flex items-center whitespace-nowrap text-small font-bold text-gray-dark transition-colors hover:text-orange";

/** El fondo al pasar el ratón lo pone la fila (el `<li>`), no el enlace: así
 *  cubre también el chevron de las filas con submenú. */
const ROW_CLASS =
  "flex flex-1 items-center gap-2 whitespace-nowrap px-4 py-3 text-small font-medium text-gray-dark transition-colors hover:text-orange";
const ROW_HOVER_BG = "hover:bg-orange/10";

/**
 * Item del navbar de escritorio con submenú.
 *
 * Sigue el patrón de "disclosure navigation" de la guía de accesibilidad de
 * W3C (APG), no el de menú de aplicación: el sitio anterior abría solo con
 * `:hover`, así que con teclado o con el dedo los submenús eran inalcanzables.
 * Aquí:
 *  - El texto es un enlace normal (va a su página) y el chevron es un botón
 *    aparte con `aria-expanded`: con teclado se llega con Tab y se abre con
 *    Enter o Espacio.
 *  - Con ratón abre al pasar por encima y cierra al salir.
 *  - Esc cierra y devuelve el foco al botón; clic o foco fuera también cierran.
 *  - Elegir un enlace cierra todos los niveles.
 *
 * Es recursivo: un hijo con submenú (los tipos de vehículo de "Compra tu
 * carro") se pinta con este mismo componente, abriendo hacia el costado.
 *
 * Sin `href` (caso "Servicios") el texto entero es el botón.
 *
 * El sitio anterior tapaba todo con `z-index` de más de 150 dígitos; aquí basta
 * con un contexto de apilamiento razonable: el header es `z-40` y el panel `z-50`.
 */
export default function NavDropdownComponent({
  item,
  placement = "bottom",
  onNavigate,
}: {
  item: NavGroup;
  placement?: Placement;
  /** Lo pasa el nivel padre para cerrarse también cuando se elige un enlace. */
  onNavigate?: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLLIElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();
  const isSide = placement === "side";

  const close = () => {
    setIsOpen(false);
    onNavigate?.();
  };

  // Clic o toque fuera. `onBlur` solo no alcanza: en Safari y en Firefox de
  // macOS un botón no recibe foco al hacer clic, así que no se dispararía.
  useEffect(() => {
    if (!isOpen) return;
    const closeOnOutsidePointer = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setIsOpen(false);
    };
    document.addEventListener("pointerdown", closeOnOutsidePointer);
    return () => document.removeEventListener("pointerdown", closeOnOutsidePointer);
  }, [isOpen]);

  // Un giro solo cuando el panel cuelga hacia abajo; el del costado ya mira a
  // la derecha.
  const chevronClass = isSide ? "-rotate-90" : isOpen ? "rotate-180" : "";
  const chevron = (
    <Image
      src={chevronDown}
      alt=""
      aria-hidden
      className={`h-auto w-[10px] shrink-0 transition-transform ${chevronClass}`}
    />
  );

  const toggleProps = {
    ref: toggleRef,
    type: "button" as const,
    "aria-expanded": isOpen,
    "aria-controls": panelId,
    onClick: (event: React.MouseEvent) => {
      // Con ratón el hover ya abrió el panel: alternar aquí lo cerraría justo
      // al hacer clic. Con teclado (`pointerType` vacío) o con el dedo, sí alterna.
      if ((event.nativeEvent as PointerEvent).pointerType === "mouse") {
        setIsOpen(true);
        return;
      }
      setIsOpen((open) => !open);
    },
  };

  return (
    <li
      ref={rootRef}
      className={isSide ? `relative ${ROW_HOVER_BG}` : "relative"}
      // Solo con ratón: en pantallas táctiles el navegador emula un hover al
      // tocar y abriría y cerraría a la vez que el clic del botón.
      onPointerEnter={(event) => event.pointerType === "mouse" && setIsOpen(true)}
      onPointerLeave={(event) => event.pointerType === "mouse" && setIsOpen(false)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setIsOpen(false);
      }}
      onKeyDown={(event) => {
        if (event.key !== "Escape" || !isOpen) return;
        // Cierra solo este nivel: sin esto el Esc subiría y cerraría también al padre.
        event.stopPropagation();
        setIsOpen(false);
        toggleRef.current?.focus();
      }}
    >
      {item.href ? (
        <div className={isSide ? "flex items-center" : "flex items-center gap-0.5"}>
          <AppLinkComponent
            href={item.href}
            onClick={close}
            className={isSide ? ROW_CLASS : TRIGGER_CLASS}
          >
            {item.label}
          </AppLinkComponent>
          {/* Área táctil de 24px (mínimo de WCAG 2.5.8) aunque el ícono mida 10.
              El margen negativo devuelve al chevron a donde lo pone el diseño. */}
          <button
            {...toggleProps}
            aria-label={`Opciones de ${item.label}`}
            className={
              isSide
                ? "flex items-center self-stretch px-3"
                : "-mr-[7px] flex size-6 items-center justify-center"
            }
          >
            {chevron}
          </button>
        </div>
      ) : (
        <button
          {...toggleProps}
          className={`${isSide ? ROW_CLASS : TRIGGER_CLASS} gap-2`}
        >
          {item.label}
          {chevron}
        </button>
      )}

      {/* `hidden` y no renderizado condicional: `aria-controls` necesita que
          el panel exista. El contenedor transparente (`pt-3` / `pl-1`) tapa el
          hueco entre el texto y el panel para que el ratón no lo cierre al
          cruzar. */}
      <div
        id={panelId}
        hidden={!isOpen}
        className={`absolute z-50 ${isSide ? "top-0 left-full pl-1" : "top-full left-0 pt-3"}`}
      >
        <ul className="min-w-[220px] rounded-lg border border-gray-light bg-white py-2 shadow-lg">
          {item.children.map((child) =>
            child.children ? (
              <NavDropdownComponent
                key={child.label}
                item={child}
                placement="side"
                onNavigate={close}
              />
            ) : (
              <li key={child.label} className={`flex ${ROW_HOVER_BG}`}>
                <AppLinkComponent href={child.href} onClick={close} className={ROW_CLASS}>
                  <NavLinkContentComponent item={child} />
                </AppLinkComponent>
              </li>
            ),
          )}
        </ul>
      </div>
    </li>
  );
}
