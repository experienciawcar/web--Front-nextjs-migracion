"use client";

import { useScrollReveal } from "../hooks/useScrollReveal";

/**
 * Enciende la aparición al hacer scroll en toda la web: se monta una vez en el
 * layout y no pinta nada. Lo que se anima lo decide cada elemento con la clase
 * `reveal` (ver `useScrollReveal` y globals.css), así las secciones no tienen
 * que ser componentes cliente.
 */
export default function ScrollRevealComponent() {
  useScrollReveal();
  return null;
}
