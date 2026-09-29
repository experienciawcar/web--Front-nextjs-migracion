"use client";

import { useEffect, useRef } from "react";

import ButtonComponent from "@/modules/shared/components/ButtonComponent";

/**
 * El sidebar de filtros en mobile, como bottom sheet (hoja que sube desde abajo), no un drawer
 * lateral: patrón real de la web anterior
 * (`docs/planes/compra-tu-carro/diseno-filtros-laterales.md` §3). `<dialog>` nativo con
 * `showModal()` (mismo patrón que `HeadquartersModalComponent`): foco atrapado, Esc para cerrar,
 * fondo inerte y devuelve el foco al botón que lo abrió — todo del navegador, no hay que
 * reimplementarlo. Anclado abajo con `mt-auto` dentro del `<dialog>` a pantalla completa, en vez
 * del `ml-auto` que usaba el drawer lateral anterior.
 *
 * El contenido (`children`) es `FilterTabsComponent`: los mismos filtros que el acordeón de
 * desktop, presentados en pestañas — nunca un estado de filtros aparte.
 */
export default function FilterBottomSheetComponent({
  open,
  onClose,
  onClearFilters,
  children,
}: {
  open: boolean;
  onClose: () => void;
  onClearFilters: () => void;
  children: React.ReactNode;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    else if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      aria-label="Filtros"
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) event.currentTarget.close();
      }}
      // `max-h-none` deshace el `max-height` que trae por defecto el user-agent stylesheet de
      // `<dialog>` (algo así como `calc(100% - 38px)` en Chrome): sin esto, `size-full` no
      // llega a cubrir el viewport completo y el `mt-auto` de abajo deja un hueco entre la
      // hoja y el borde inferior real de la pantalla.
      className="m-0 size-full max-h-none max-w-none flex-col bg-transparent p-0 backdrop:bg-black/40 open:flex xl:hidden"
    >
      <div className="mt-auto flex max-h-[70vh] w-full flex-col rounded-t-3xl shadow-[0_-10px_25px_rgba(0,0,0,0.1)] bg-white">
        <div className="flex shrink-0 items-center justify-between border-b border-[#e5e7eb] px-5 py-[18px]">
          <button type="button" onClick={onClearFilters} className="text-[14.4px] font-semibold text-orange">
            Limpiar filtros
          </button>
          <span className="text-body font-bold text-dark-gray">Filtros</span>
          <button
            type="button"
            aria-label="Cerrar filtros"
            onClick={() => dialogRef.current?.close()}
            className="grid size-8 place-items-center rounded-full text-gray-dark bg-[#f3f4f6] text-[#6b7280]"
          >
            <svg viewBox="0 0 24 24" className="size-4" aria-hidden>
              <path
                d="M5 5 19 19M19 5 5 19"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
              />
            </svg>
          </button>
        </div>

        <div className="flex min-h-0 flex-1">{children}</div>

        <div className="shrink-0 border-t border-[#e5e7eb] px-4 py-3.5">
          <ButtonComponent
            variant="primary"
            size="big"
            className="w-full justify-center!"
            onClick={() => dialogRef.current?.close()}
          >
            Aplicar filtros
          </ButtonComponent>
        </div>
      </div>
    </dialog>
  );
}
