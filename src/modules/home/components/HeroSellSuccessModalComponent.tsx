"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

import logoWcar from "@/modules/shared/assets/navbar/logo-wcar.svg";
import arrowCircle from "@/modules/shared/assets/icons/arrow-circle.svg";
import ButtonComponent from "@/modules/shared/components/ButtonComponent";

/** Modal de éxito de "Vende tu carro" (Figma: "Modal - Inicio de sesión d…"). `<dialog>` nativo: trae foco, Escape y fondo. */
export default function HeroSellSuccessModalComponent({ open, onClose }: { open: boolean; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      aria-labelledby="sell-success-title"
      className="m-auto w-[min(304px,calc(100%-32px))] rounded-lg bg-white p-0 shadow-xl backdrop:bg-black/50 md:w-[304px]"
    >
      <div className="relative flex flex-col items-center px-6 pt-14 pb-10 text-center">
        <button
          type="button"
          aria-label="Cerrar"
          onClick={onClose}
          className="absolute top-4 right-4 size-6 cursor-pointer text-lg leading-none text-dark-gray"
        >
          ×
        </button>
        <Image src={logoWcar} alt="wcar" className="h-8 w-auto" />
        <h2 id="sell-success-title" className="mt-9 text-body leading-6 font-bold text-dark-gray">
          Le agradecemos su tiempo,
          <br />
          <span className="font-normal italic">en un momento un asesor se pondrá en contacto con usted</span>
        </h2>
        <p className="mt-5 text-caption text-gray-dark">Le agradecemos su paciencia</p>
        <ButtonComponent icon={arrowCircle} onClick={onClose} className="mt-8 w-full justify-center!">
          Continuar
        </ButtonComponent>
      </div>
    </dialog>
  );
}
