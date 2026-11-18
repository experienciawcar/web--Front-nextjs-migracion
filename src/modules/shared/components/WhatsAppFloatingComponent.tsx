import { WhatsAppIcon } from "./icons";
import { whatsappHref } from "../constants/whatsapp";

/**
 * Botón redondo de WhatsApp, fijo abajo a la derecha en todo el sitio (reemplaza la pestaña
 * lateral "Contacta un asesor", que en móvil tapaba fotos y formularios). Mensaje genérico: en
 * la ficha el botón verde del resumen manda el del carro. En la ficha móvil se oculta: la
 * barra fija de abajo ya trae WhatsApp.
 */
export default function WhatsAppFloatingComponent() {
  return (
    <a
      href={whatsappHref("Hola, quiero hablar con un asesor de WCAR.")}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escríbenos por WhatsApp"
      className="fixed right-4 bottom-20 z-30 flex size-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange max-xl:[body:has(#barra-ficha-movil)_&]:hidden xl:right-6 xl:bottom-6"
    >
      <WhatsAppIcon className="size-8" />
    </a>
  );
}
