import { ROUTES } from "@/modules/shared/constants/routes";
import ButtonComponent from "@/modules/shared/components/ButtonComponent";

/**
 * Franja "Financiación hasta del 100%" que la web anterior intercala en la grilla del catálogo,
 * a todo el ancho, después de la segunda fila de vehículos. Es HTML/CSS y no una imagen (así
 * la armaba la web en vivo): fondo cian con el patrón de `patron.svg` (bajado tal cual, ya trae
 * su propia opacidad), isotipo a la izquierda, titular de 36 px y botón naranja. Máximo 900 px
 * de ancho, centrada.
 */
export default function FinancingBannerComponent() {
  return (
    <section
      aria-label="Financiación hasta del 100%"
      className="reveal relative col-span-full mx-auto flex w-full max-w-[900px] flex-col items-center justify-center gap-3 bg-blue-neon bg-[url('/assets/catalogo/financiacion/patron.svg')] bg-size-[785px_80px] px-6 py-4 lg:min-h-20 lg:flex-row lg:gap-4"
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- SVG decorativo chico: next/image no optimiza SVG. */}
      <img
        src="/assets/catalogo/financiacion/wcar-icon.svg"
        alt=""
        aria-hidden
        width={61}
        height={24}
        className="h-6 w-[61px] lg:absolute lg:top-4 lg:left-[18px]"
      />
      <p className="text-center text-[24px] leading-[30px] text-black sm:text-[36px] sm:leading-[43px]">
        <strong>Financiación hasta</strong>{" "}
        <span className="italic">del 100%</span>
      </p>
      <ButtonComponent
        href={ROUTES.financing}
        size="big"
        className="shrink-0 justify-center! px-4!"
      >
        Evalúa tu crédito
      </ButtonComponent>
    </section>
  );
}
