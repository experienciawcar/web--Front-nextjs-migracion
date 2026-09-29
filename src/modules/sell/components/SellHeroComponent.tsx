import Image from "next/image";

import ButtonComponent from "@/modules/shared/components/ButtonComponent";
import { ROUTES } from "@/modules/shared/constants/routes";

/**
 * Hero de "Vende tu Carro": banner negro de 363px de alto (medido con `cdp.py`
 * contra `https://wcar.co/vende-tu-carro` a 1440; no hay Figma para esta
 * vista) con la foto de una rueda delantera sobre fondo oscuro a la derecha.
 *
 * A diferencia de los demás heroes del sitio (Sobre Nosotros, Sedes,
 * Financiación) no hay corte diagonal ni marca de agua "W wcar": la foto se
 * funde con el negro con un degradado horizontal simple, sin forma recortada.
 * Por eso no reutiliza `AboutHeroComponent`, aunque sí el mismo criterio de
 * lienzo de 1440 centrado con el fondo sangrando a la derecha (guía §4.2).
 *
 * Texto medido en el sitio anterior: `<h1>` en x=72 (relativo a su
 * `container`, no al x=124 del resto de este sitio; aquí se usa
 * `container-wcar`, que en 1440 arranca igual en x=124: la diferencia de 52px
 * no se replica, es del grid de Bootstrap del sitio viejo) y 46px de peso 700.
 * "razonable" se ve en cursiva en la captura del usuario, aunque el DOM midió
 * el `<h1>` entero como un solo nodo de 700: se reproduce la cursiva porque es
 * lo que se ve, con `TODO: confirmar con diseño`.
 *
 * Botones apilados (no en fila): "VENDE TU CARRO" → `ROUTES.quote` (era
 * `/cotizar` en el sitio anterior) y "Contacta a un asesor" → `ROUTES.contact`
 * (era `/contacto`), ambos confirmados desde el DOM real, no inventados.
 *
 * Mobile: sin diseño (el sitio anterior es responsive con Bootstrap, no se
 * capturó a 393). Se adapta con el criterio de la guía §4.3: foto arriba
 * recortada, texto y botones debajo.
 * TODO: confirmar con diseño.
 */
export default function SellHeroComponent() {
  return (
    <section className="relative overflow-x-clip bg-black" aria-label="Vende tu carro con wcar">
      <div className="relative mx-auto xl:max-w-[1440px]">
        {/* Foto: sangra a la derecha hasta el borde de la ventana, como el
            resto de los heroes del sitio (guía §4.2). En mobile ocupa un
            bloque propio arriba, sin sangrar (no hay canvas de 1440 ahí). */}
        <div className="relative h-[220px] w-full xl:absolute xl:inset-y-0 xl:right-[calc(50%-50vw)] xl:h-auto xl:w-[calc(60%+50vw-50%)]">
          <Image
            src="/assets/vende-tu-carro/hero/rueda-carro-naranja.webp"
            alt=""
            aria-hidden
            fill
            sizes="(min-width: 1280px) 60vw, 100vw"
            priority
            className="object-cover"
          />
          {/* Degradado que funde la foto con el negro: sin corte diagonal,
              solo un fundido horizontal (a diferencia de los demás heroes). */}
          <div
            aria-hidden
            className="absolute inset-0 hidden xl:block"
            style={{
              backgroundImage:
                "linear-gradient(to right, black 0%, rgba(0,0,0,0.85) 15%, rgba(0,0,0,0.35) 40%, transparent 65%)",
            }}
          />
          <div aria-hidden className="absolute inset-0 bg-black/40 xl:hidden" />
        </div>

        <div className="container-wcar relative py-10 xl:h-[363px] xl:py-0">
          <div className="flex flex-col items-start xl:pt-16">
            <h1 className="reveal max-w-[420px] text-[32px] leading-[1.15] font-bold text-white xl:text-[46px]">
              Vende tu Carro a un precio{" "}
              <span className="font-medium italic">razonable</span>
            </h1>

            <div className="reveal mt-6 flex flex-col items-start gap-2 xl:mt-4">
              <ButtonComponent href={ROUTES.quote} variant="primary">
                VENDE TU CARRO
              </ButtonComponent>
              <ButtonComponent href={ROUTES.contact} variant="outline">
                Contacta a un asesor
              </ButtonComponent>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
