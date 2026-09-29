import Image from "next/image";

import arrowCircle from "@/modules/shared/assets/icons/arrow-circle.svg";
import ButtonComponent from "@/modules/shared/components/ButtonComponent";
import DiagonalLinesComponent from "@/modules/shared/components/DiagonalLinesComponent";
import FeatureCardComponent from "@/modules/shared/components/FeatureCardComponent";
import SectionEyebrowComponent from "@/modules/shared/components/SectionEyebrowComponent";
import ZigZagComponent from "@/modules/shared/components/ZigZagComponent";
import { ROUTES } from "@/modules/shared/constants/routes";

import iconChip from "../assets/garantias/icon-chip-diagnostico.svg";
import iconGuidance from "../assets/garantias/icon-orientacion.svg";

/**
 * Sección "Garantías y seguros": el panel gris con la foto del mecánico, el
 * texto con dos botones y dos tarjetas de servicio.
 *
 * Fuente: captura del desktop 1440 (`docs/planes/taller/3-garantias-y-seguros.png`,
 * calibrada con el panel gris = contenedor: x de captura = 0,641 × X; el panel
 * arranca en el px 31,6 de la captura). Sin Figma ni diseño mobile. Medidas
 * (px de diseño, ±1,5), con y=0 en el borde superior del panel, que es donde
 * acaba "Servicios Postventa" (y=1299 de la página):
 * - Panel `gray-light`: x=124, sangra a la derecha, 689 de alto (Figma; la captura
 *   acababa en 685 y la de la sección siguiente arrancaba ahí).
 * - Encima, arriba a la izquierda, la barra negra de "Servicios Postventa" sigue
 *   hasta y=257 (ya está en esa sección, por debajo de la foto: `z-20`).
 * - Foto: una sola de 380 x 380 en (124,0), con un rayado blanco sobre su
 *   cuarto inferior izquierdo (256 x 124 en (0,256)) y un cuadrado naranja de
 *   124 x 124 abajo a la derecha. El mecánico de la foto es el mismo de la
 *   galería de "Nuestro taller" (una sola en disco:
 *   `public/assets/taller/garantias/mecanico-junto-al-elevador.webp`, 1200 x 800).
 *   Figma (nodo 192:5947): `object-cover` con la posición 16,4 % 50 % (la foto
 *   de 3:2 a 380 de alto queda de 571 de ancho y corrida 31 px a la izquierda;
 *   verificado contra el export, diferencia media 1,2/255) y, encima, un degradado
 *   a negro que Figma escribe con paradas fuera de la caja: negro al 66 % en el
 *   borde inferior y transparente a 23 % de alto (medido: 0,65 en el último
 *   renglón), por debajo del rayado y del cuadrado.
 * - Texto en x=560 hasta el borde del contenedor (756 de ancho: el párrafo pasa a
 *   tres renglones justo ahí, la primera línea mide 738 y con "piezas" 784).
 *   Eyebrow con la raya en y=60 (`SectionEyebrowComponent` con 10 px hasta el
 *   texto, como en Postventa), título de 36/44 (ink 321 contra 321), párrafo de
 *   16/24 con la primera línea base en y≈191 y dos botones a 44 px uno del
 *   otro, en y=294.
 * - Tarjetas: `FeatureCardComponent` (título 22/30, descripción de 16) con el
 *   icono en x=328 y x=833, en y≈450. Columnas de texto de 320 y 325, deducidas
 *   de dónde parte cada renglón (la primera: "manera rápida y precisa,
 *   asegurando que tu" cabe y "auto" no; la segunda: 325 es lo justo para
 *   "asesoría técnica sobre el uso y mantenimiento").
 * - `ZigZagComponent` en (1295,495): su línea negra mide 15 x 107, igual que en
 *   la captura.
 *
 * Mobile: no hay diseño. Se adaptó (guía §4.3): panel gris a todo el ancho, la
 * foto arriba con las mismas proporciones (en porcentajes) y todo apilado; sin
 * zigzag.
 *
 * Colores: el botón secundario no lleva fondo blanco sino el del panel (el
 * interior se ve 245,246,248 igual que el panel), por eso `bg-transparent!`.
 *
 * Textos tal cual del diseño (con `TODO: confirmar con diseño`; verificados contra
 * los textos de Figma): "Garantias" y "TECNICO" sin tilde, "Wcar" con mayúscula en
 * el párrafo y el párrafo sin punto final. (En las capturas se leía "vehiculo" y
 * "asesoria" sin tilde: en Figma llevan tilde.)
 * TODO: destino de "Solicitar servicio técnico" (hoy `ROUTES.contact`).
 * Iconos: los de Figma ("pixel:technology" y "icon-park-outline:blackboard", 32 x
 * 32, naranja).
 */
export default function WorkshopWarrantyComponent() {
  return (
    <section
      aria-labelledby="garantias-title"
      className="relative overflow-x-clip bg-gray-light xl:h-[689px] xl:bg-transparent"
    >
      {/* El lienzo de 1440 centrado; el panel sangra a la derecha (guía §4.2). */}
      <div className="relative mx-auto xl:h-[689px] xl:max-w-[1440px]">
        <div
          aria-hidden
          className="absolute inset-y-0 left-[124px] hidden bg-gray-light xl:right-[calc(50%-50vw)] xl:block"
        />
        {/* En un contenedor propio: `ZigZagComponent` ya trae `relative` y este
            `absolute` competiría con él. */}
        <div className="absolute top-[495px] left-[1295px] hidden xl:block">
          <ZigZagComponent />
        </div>

        {/* `relative z-10`: sin él el panel (absoluto) pinta por encima del
            texto, que es contenido estático. Va a `z-10` y no más porque la foto
            (`z-20` dentro) tiene que quedar por encima de la barra negra de
            "Servicios Postventa", que también es `z-10` pero está antes. */}
        <div className="container-wcar relative z-10 flex flex-col gap-10 py-16 xl:gap-0 xl:py-0">
          <div className="flex flex-col gap-10 xl:flex-row xl:gap-14">
            {/* Foto compuesta: en porcentajes de su caja cuadrada, así sirve en
                mobile. */}
            <div className="reveal reveal-left relative aspect-square w-full max-w-[380px] shrink-0 xl:z-20 xl:size-[380px] xl:max-w-none">
              <Image
                src="/assets/taller/garantias/mecanico-junto-al-elevador.webp"
                alt="Un mecánico de overol junto a un elevador, con una bolsa de herramientas y una aceitera en la mano"
                fill
                sizes="571px"
                className="object-cover object-[16.4%_50%]"
              />
              <div
                aria-hidden
                className="absolute inset-0 bg-[linear-gradient(to_top,rgb(0_0_0/0.663)_0,transparent_23%)]"
              />
              <DiagonalLinesComponent className="absolute bottom-0 left-0 h-[32.63%] w-[67.37%] opacity-50" />
              <div aria-hidden className="absolute right-0 bottom-0 size-[32.63%] bg-orange" />
            </div>

            <div className="flex min-w-0 flex-col xl:pt-[60px]">
              <SectionEyebrowComponent className="reveal xl:gap-2.5!">Servicios Ofrecidos por wcar</SectionEyebrowComponent>

              {/* TODO: confirmar con diseño: "Garantias" sin tilde. */}
              <h2 id="garantias-title" className="reveal mt-[11px] text-subheadline-1 font-bold text-dark-gray">
                Garantias y seguros
              </h2>

              {/* TODO: confirmar con diseño: "Wcar" con mayúscula y sin punto final. */}
              <p className="reveal mt-[23px] text-body font-medium text-gray-dark">
                En Wcar, garantizamos su tranquilidad ofreciéndole cobertura integral para la reparación o
                sustitución de piezas defectuosas. Asimismo, al adquirir su póliza con Wcar Seguros, nuestros talleres
                especializados se encargarán de solventar cualquier daño en su vehículo, brindándole un respaldo
                absoluto
              </p>

              {/* TODO: confirmar con diseño: "TECNICO" sin tilde. */}
              <div className="reveal mt-10 flex flex-col items-start gap-4 xl:mt-[48px] xl:flex-row xl:gap-11">
                <ButtonComponent href={ROUTES.contact} variant="primary" icon={arrowCircle}>
                  Solicitar servicio tecnico
                </ButtonComponent>
                <ButtonComponent
                  href={ROUTES.insurance}
                  newTab
                  variant="secondary"
                  icon={arrowCircle}
                  className="bg-transparent!"
                >
                  Ver wcar seguros
                </ButtonComponent>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-10 xl:mt-[67px] xl:ml-[203px] xl:flex-row xl:gap-[130px]">
            <FeatureCardComponent
              icon={iconChip}
              title="Equipos de Diagnóstico"
              titleItalic="Especializados"
              description="Utilizamos tecnología avanzada de diagnóstico para identificar problemas de manera rápida y precisa, asegurando que tu auto reciba el tratamiento adecuado."
              className="reveal xl:w-[376px]"
            />
            <FeatureCardComponent
              icon={iconGuidance}
              title="Orientación sobre Uso y"
              titleItalic="Mantenimiento del Vehículo"
              description="Nuestro equipo está aquí para ofrecerte asesoría técnica sobre el uso y mantenimiento de tu auto, ayudándote a prolongar su vida útil y mejorar su rendimiento."
              className="reveal xl:w-[381px]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
