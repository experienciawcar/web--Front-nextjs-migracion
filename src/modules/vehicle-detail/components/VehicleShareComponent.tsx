"use client";

import { useEffect, useRef, useState } from "react";

type Channel = { label: string; href: (url: string, text: string) => string };

/** Los mismos canales del sitio anterior (`webShare`): Facebook, X, WhatsApp y correo; el enlace se copia aparte. */
const CHANNELS: Channel[] = [
  {
    label: "WhatsApp",
    href: (url, text) =>
      `https://api.whatsapp.com/send?text=${encodeURIComponent(`${text} ${url}`)}`,
  },
  {
    label: "Facebook",
    href: (url) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  },
  {
    label: "X (Twitter)",
    href: (url, text) =>
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
  },
  {
    label: "Correo",
    href: (url, text) =>
      `mailto:?subject=${encodeURIComponent(text)}&body=${encodeURIComponent(url)}`,
  },
];

/**
 * Botón de compartir de la ficha (Figma 90:5602: el ícono `share` naranja de 32 x 32).
 *
 * Comparte la dirección de la página tal como está en el navegador. Donde el dispositivo lo
 * ofrece (móvil) abre la hoja de compartir del sistema (`navigator.share`); si no, o si la
 * persona la cancela por un fallo, abre un menú con los canales. Cierra con Esc o al tocar fuera.
 *
 * TODO: el sitio anterior medía cada canal (`vehiculo_compartido`, Mixpanel); aquí no hay analítica
 * todavía.
 */
export default function VehicleShareComponent({ title }: { title: string }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointer = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  async function handleClick() {
    if (
      typeof navigator.share === "function" &&
      window.matchMedia("(max-width: 800px)").matches
    ) {
      try {
        await navigator.share({ title, url: window.location.href });
        return;
      } catch (error) {
        // Cancelar la hoja del sistema no es un fallo: no se abre el menú detrás.
        if (error instanceof DOMException && error.name === "AbortError")
          return;
      }
    }
    setOpen((value) => !value);
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-label="Compartir este vehículo"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={handleClick}
        className="grid size-8 place-items-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange"
      >
        {/* 24 x 24 con trazo de 2: tres nodos unidos, en el naranja del corazón de favoritos. */}
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="size-6 text-orange" aria-hidden>
          <circle cx="5" cy="12" r="3.2" />
          <circle cx="19" cy="4.5" r="3.2" />
          <circle cx="19" cy="19.5" r="3.2" />
          <path d="m7.8 10.4 8.4-4.3M7.8 13.6l8.4 4.3" />
        </svg>
      </button>

      {open && (
        <ul
          role="menu"
          className="absolute top-full right-0 z-30 mt-2 w-48 rounded-lg bg-white py-2 text-small font-medium text-dark-gray shadow-[0_8px_24px_rgba(30,30,30,0.18)]"
        >
          {CHANNELS.map((channel) => (
            <li key={channel.label} role="none">
              <a
                role="menuitem"
                href={channel.href(window.location.href, title)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="block px-4 py-2 hover:bg-gray-light focus-visible:bg-gray-light focus-visible:outline-none"
              >
                {channel.label}
              </a>
            </li>
          ))}
          <li role="none">
            <button
              type="button"
              role="menuitem"
              onClick={copyLink}
              className="block w-full px-4 py-2 text-left hover:bg-gray-light focus-visible:bg-gray-light focus-visible:outline-none"
            >
              {copied ? "Enlace copiado" : "Copiar enlace"}
            </button>
          </li>
        </ul>
      )}
    </div>
  );
}
