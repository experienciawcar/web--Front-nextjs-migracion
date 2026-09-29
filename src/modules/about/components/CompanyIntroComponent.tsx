import Image from "next/image";

import iconExternal from "@/modules/shared/assets/icons/external-link.svg";
import ButtonComponent from "@/modules/shared/components/ButtonComponent";
import SectionEyebrowComponent from "@/modules/shared/components/SectionEyebrowComponent";

/**
 * En Figma el texto es un solo bloque con dos saltos de línea en medio. Aquí
 * van como dos párrafos separados, que es lo mismo visualmente (la línea en
 * blanco mide 22px, igual que el interlineado) pero mejor semánticamente.
 */
const PARRAFOS = [
  "Cerca de 12 millones de personas en Latinoamérica frente a la compra y venta de vehículos usados sufren por la debilidad de las legislaciones y la ineficacia institucional, dejando a los consumidores en una vulnerabilidad alarmante. Este desafío trasciende todos los niveles socioeconómicos, forzando a los ciudadanos a enfrentar riesgos significativos en transacciones de vehículos, que a menudo es su segundo activo más preciado. Las empresas tradicionales frecuentemente se limitan a cumplir solo con la legislación básica, descuidando tanto las necesidades del cliente como su responsabilidad social.",
  "Aquí es donde wcar emerge no solo como una empresa, sino como un movimiento que busca revolucionar la compra-venta de autos usados en Latinoamérica. Nuestro enfoque trasciende la mera venta, enfocándonos en transacciones seguras y empoderadoras para el consumidor. Nos posicionamos en el núcleo de la transformación del sector, fusionando transparencia brutal y tecnología al alcance de todos para otorgar al usuario control total y claridad en cada transacción.",
];

/**
 * Sección "Nuestra Empresa" (nodos 2:9, 2:74 y 2:75 en desktop; 2:226 en mobile).
 *
 * Dos particularidades del diseño:
 *
 * 1. En desktop la sección se monta ENCIMA del hero. La tarjeta blanca arranca
 *    en y=429 y el hero termina en y=654, o sea que lo tapa 225px, y solo a lo
 *    ancho del contenedor: por los costados el hero sigue viéndose. De ahí el
 *    margen superior negativo y el fondo blanco.
 * 2. En mobile no existe la foto del edificio, el contenido va centrado y
 *    ocupa todo el ancho. No es el mismo layout reducido.
 */
export default function CompanyIntroComponent() {
  return (
    // Sin z-index a propósito: la sección no crea contexto de apilamiento para
    // que la foto (z-30) pueda quedar por encima de la barra negra de la
    // página (z-20) mientras el fondo blanco de la tarjeta queda por debajo.
    // Sobre el hero se monta igual, por orden en el DOM.
    <section className="relative">
      <div className="container-wcar">
        <div className="flex flex-col xl:-mt-[225px] xl:flex-row xl:gap-[86px] xl:bg-white">
          {/* La foto es el export del nodo y no su imagen de relleno: el nodo
              aplica un ajuste propio sobre el JPEG original, así que la fuente
              en alta (3024x4032) no reproduce lo que se ve en el diseño.

              Va por encima de la barra negra lateral, que pasa por detrás de
              ella. */}
          <div className="reveal reveal-left relative hidden h-[526px] w-[490px] shrink-0 xl:z-30 xl:block">
            <Image
              src="/assets/about-us/intro/edificio.jpg"
              alt="Sede de WCAR"
              fill
              sizes="490px"
              className="object-cover"
            />
          </div>

          <div className="flex flex-col items-center gap-6 pt-14 xl:w-[515px] xl:items-start xl:gap-3 xl:pt-16">
            <SectionEyebrowComponent className="reveal">Por qué nosotros</SectionEyebrowComponent>

            <h1 className="reveal w-full text-subheadline-1 font-bold text-dark-gray">Nuestra Empresa</h1>

            <div className="flex w-full flex-col items-center gap-12 xl:items-start xl:gap-8">
              <div className="reveal flex flex-col gap-[22px]">
                {PARRAFOS.map((parrafo) => (
                  <p key={parrafo.slice(0, 32)} className="text-small font-medium text-gray-dark">
                    {parrafo}
                  </p>
                ))}
              </div>

              <ButtonComponent href="/contacto" variant="cyan" icon={iconExternal} className="reveal">
                CONTACTA A UN ASESOR
              </ButtonComponent>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
