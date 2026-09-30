"use client";

import { useRouter } from "next/navigation";

import { ROUTES } from "@/modules/shared/constants/routes";

/** Solo cuenta como "vino de un listado" lo que sale de `/compra-tu-carro` o de un tipo (`/compra-tu-carro/<tipo>`). */
function cameFromListing(referrer: string): boolean {
  try {
    const url = new URL(referrer);
    if (url.origin !== window.location.origin) return false;
    const segments = url.pathname.split("/").filter(Boolean);
    return segments[0] === ROUTES.buyCar.slice(1) && segments.length <= 2;
  } catch {
    return false;
  }
}

/**
 * "← Volver" de la ficha (Figma 89:4865: flecha de 10 px y texto de 12 Bold `gray-dark`; en
 * desktop sale a 14). Es un enlace real al catálogo, así que funciona sin JavaScript y los
 * buscadores lo siguen; con JavaScript, si la persona llegó desde un listado, vuelve a él con
 * el historial (conserva los filtros y la página) y si no, va al catálogo. Es la regla del
 * sitio anterior (`_handleGoBack`).
 */
export default function VehicleBackLinkComponent() {
  const router = useRouter();

  return (
    <a
      href={ROUTES.buyCar}
      onClick={(event) => {
        if (cameFromListing(document.referrer)) {
          event.preventDefault();
          router.back();
        }
      }}
      className="inline-flex items-center gap-2 py-2 text-small font-bold text-dark-gray hover:text-orange focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange xl:text-body"
    >
      <svg
        aria-hidden
        viewBox="0 0 12 12"
        className="size-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M11 6H1.5M5.5 2 1.5 6l4 4" />
      </svg>
      Volver
    </a>
  );
}
