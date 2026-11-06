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
      className="m-auto w-[min(492px,calc(100%-32px))] rounded-2xl bg-white p-0 shadow-xl backdrop:bg-black/50"
    >
      {/* Figma 1542:22183: 492 x 400; logo a 59, texto a 137, botón de 335 a 53 del fondo. */}
      <div className="relative flex flex-col items-center px-6 pt-[59px] pb-[53px] text-center">
        <button
          type="button"
          aria-label="Cerrar"
          onClick={onClose}
          className="absolute top-6 right-6 size-6 cursor-pointer text-2xl leading-none text-dark-gray"
        >
          ×
        </button>
        <Image src={logoWcar} alt="wcar" className="h-8 w-auto" />
        <h2 id="sell-success-title" className="mt-[46px] max-w-[366px] text-[22px] leading-[1.25] font-bold text-dark-gray">
          Le agradecemos su tiempo,
          <br />
          <span className="font-medium italic">en un momento un asesor se pondrá en contacto con usted</span>
        </h2>
        <p className="mt-4 text-small font-medium text-gray-dark">Le agradecemos su paciencia</p>
        <ButtonComponent icon={arrowCircle} onClick={onClose} className="mt-12 h-[50px]! w-full max-w-[335px] justify-center!">
          Continuar
        </ButtonComponent>
      </div>
    </dialog>
  );
}
