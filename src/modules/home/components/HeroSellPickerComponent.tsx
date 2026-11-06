"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Selector con el desplegable del diseño: tarjeta blanca con una X y la opción
 * elegida en naranja. Con `logoBase` cada opción lleva su logo (marcas, Figma
 * "Marca"); sin él es solo texto (modelos, Figma 1542:25314).
 */
export default function HeroSellPickerComponent({
  label,
  options,
  logoBase,
  disabled,
  value,
  onChange,
  className,
}: {
  label: string;
  options: { id: string; name: string }[];
  logoBase?: string;
  disabled?: boolean;
  value: string;
  onChange: (id: string) => void;
  className: string;
}) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const selected = options.find((b) => b.id === value);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent | KeyboardEvent) => {
      if (e instanceof KeyboardEvent ? e.key === "Escape" : !root.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", close);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", close);
    };
  }, [open]);

  return (
    <div ref={root} className="relative">
      <button
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        className={`${className} flex cursor-pointer items-center pr-10 disabled:cursor-not-allowed disabled:opacity-60 text-left ${selected ? "" : "text-gray-dark"}`}
      >
        {selected?.name ?? label}
      </button>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="pointer-events-none absolute top-1/2 right-3 size-5 -translate-y-1/2 text-gray-dark" aria-hidden>
        <path d="m6 9 6 6 6-6" />
      </svg>

      {open && !disabled && (
        <div className="absolute top-full left-0 z-30 mt-2 w-[min(300px,calc(100vw-48px))] rounded-lg bg-white p-4 shadow-[0_7px_24px_rgba(30,30,30,0.18)]">
          <button type="button" aria-label="Cerrar" onClick={() => setOpen(false)} className="ml-auto block size-6 cursor-pointer text-2xl leading-none text-gray">
            ×
          </button>
          <ul role="listbox" aria-label={label} className="mt-2 max-h-[340px] overflow-y-auto">
            {options.map((b) => {
              const active = b.id === value;
              return (
                <li key={b.id} role="option" aria-selected={active}>
                  <button
                    type="button"
                    onClick={() => {
                      onChange(b.id);
                      setOpen(false);
                    }}
                    className={`flex h-12 w-full cursor-pointer items-center gap-3 rounded-lg px-4 text-left text-body font-semibold ${active ? "bg-orange text-white" : "text-gray-dark hover:bg-gray-light"}`}
                  >
                    {logoBase && (
                      // eslint-disable-next-line @next/next/no-img-element -- logos ya cacheados por /api/marca-logo
                      <img src={`${logoBase}/${b.id}`} alt="" loading="lazy" className="size-7 shrink-0 object-contain" onError={(e) => (e.currentTarget.style.visibility = "hidden")} />
                    )}
                    {b.name}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
