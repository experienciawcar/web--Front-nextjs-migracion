import Image from "next/image";

import arrowCircle from "@/modules/shared/assets/icons/arrow-circle.svg";
import ButtonComponent from "@/modules/shared/components/ButtonComponent";
import ZigZagComponent from "@/modules/shared/components/ZigZagComponent";
import { ROUTES } from "@/modules/shared/constants/routes";

/**
 * "Venta segura": el collage (tablero con neón + rin, foto única de
 * 1440x219, sin 2x en el sitio anterior — `TODO: pedir el original en más
 * resolución` si se ve blanda) pegado a la sección oscura "Vende tu carro de
 * manera segura, rápida, confiable y justa.". En el sitio anterior son un
 * mismo contenedor (`sell_section`), por eso van en un solo componente.
 *
 * Medido con `cdp.py` contra `https://wcar.co/vende-tu-carro` a 1440 (sin
 * Figma): collage de 219px de alto a ancho completo; debajo, la sección
 * oscura de 586px con la foto de llantas (428px, `object-cover`, oculta en
 * mobile a favor del recorte `llantas-luz-roja-mobile.webp`) a la izquierda y
 * el texto a la derecha.
 *
 * El antetítulo "Venta" (cuadrado cian de 14px + texto) no es
 * `SectionEyebrowComponent` (esa lleva una raya horizontal larga): aquí es un
 * cuadrado, más simple, así que va suelto en vez de forzar ese componente.
 *
 * Botones con destino real, confirmado en el DOM del sitio anterior: "Vende tu
 * carro" → `ROUTES.quote` y "Contacta a un asesor" → `ROUTES.contact`.
 */
export default function SellSecurityComponent() {
  return (
    <section aria-label="Vende tu carro de manera segura" className="relative overflow-x-clip bg-dark-gray">
      <div className="relative mx-auto xl:max-w-[1440px]">
        {/* Collage: sangra a los bordes de la ventana, como el resto de los
            fondos del sitio (guía §4.2). Recorte propio en mobile (más
            cuadrado que el de desktop, igual que en el sitio anterior). */}
        <div className="relative h-[110px] w-full xl:h-[219px] xl:right-[calc(50%-50vw)] xl:w-[100vw]">
          <Image
            src="/assets/vende-tu-carro/venta-segura/collage-tablero-y-rin-mobile.webp"
            alt=""
            aria-hidden
            fill
            sizes="100vw"
            className="object-cover xl:hidden"
          />
          <Image
            src="/assets/vende-tu-carro/venta-segura/collage-tablero-y-rin.webp"
            alt=""
            aria-hidden
            fill
            sizes="100vw"
            className="hidden object-cover xl:block"
          />
        </div>

        <div className="relative grid grid-cols-1 xl:grid-cols-[428px_1fr]">
          <div className="relative h-[220px] xl:h-auto">
            <Image
              src="/assets/vende-tu-carro/venta-segura/llantas-luz-roja-mobile.webp"
              alt="Llantas en fila bajo una luz roja y naranja, en el taller de wcar"
              fill
              sizes="100vw"
              className="object-cover xl:hidden"
            />
            <Image
              src="/assets/vende-tu-carro/venta-segura/llantas-luz-roja.webp"
              alt="Llantas en fila bajo una luz roja y naranja, en el taller de wcar"
              fill
              sizes="(min-width: 1280px) 428px, 100vw"
              className="hidden object-cover xl:block"
            />
          </div>

          <div className="relative px-8 py-12 xl:px-[72px] xl:py-16">
            <div aria-hidden className="absolute top-16 right-8 hidden xl:block">
              <ZigZagComponent tone="light" />
            </div>

            <div className="reveal flex items-center gap-2">
              <span aria-hidden className="size-3.5 bg-blue-neon" />
              <span className="text-small font-bold text-white">Venta</span>
            </div>

            <h2 className="reveal mt-6 max-w-[572px] text-[28px] leading-[1.2] font-medium text-white xl:text-[35px]">
              Vende tu carro de manera segura, rápida, confiable y justa.
            </h2>

            <p className="reveal mt-6 max-w-[572px] text-body text-white/90">
              En wcar nos preocupamos por la seguridad en cada servicio, el asesoramiento en cada negocio que un
              proceso tan tedioso como lo es la venta de carros en Colombia se hace fácil y sencillo
            </p>
            <p className="reveal mt-4 max-w-[572px] text-body text-white/90">
              Te ayudamos desde el primer contacto y gestionamos todos los procesos que requiere la venta de tu
              vehículo, el comerciar con carros usados no es una tarea sencilla, pero conocemos el mercado y sabemos
              como ayudarte.
            </p>

            <div className="reveal mt-8 flex flex-col items-start gap-4 xl:flex-row xl:items-center">
              <ButtonComponent href={ROUTES.quote} icon={arrowCircle}>
                Vende tu carro
              </ButtonComponent>
              <ButtonComponent href={ROUTES.contact} variant="outline" icon={arrowCircle}>
                Contacta a un asesor
              </ButtonComponent>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
