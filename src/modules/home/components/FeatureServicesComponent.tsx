import Image from "next/image";

import isotipoWcar from "@/modules/home/assets/servicios/isotipo-wcar.svg";
import logoWcar from "@/modules/home/assets/servicios/logo-wcar.svg";
import logoWcarseguros from "@/modules/home/assets/servicios/logo-wcarseguros.svg";
import logoWcartaller from "@/modules/home/assets/servicios/logo-wcartaller.svg";
import ButtonComponent from "@/modules/shared/components/ButtonComponent";
import logoSantander from "@/modules/shared/assets/hero/logo-santander.png";

import { HOME_SERVICES, type HomeService } from "../constants/services";

/**
 * El degradado que funde la foto con el panel blanco de abajo: una franja
 * naranja de ~8 % de alto justo en la costura (Figma: en las cuatro tarjetas hay
 * un `linear-gradient` vertical con esta misma matriz). Las tarjetas 3 y 4 traen
 * además un brillo diagonal sutil sobre la foto (reflejos del estudio
 * fotográfico); no se reproducen, son decorativos y no cambian la lectura.
 * TODO: confirmar con diseño si hace falta calcarlos.
 */
const BOTTOM_FADE = "linear-gradient(to top, var(--color-orange) 0%, transparent 12%)";

/** El logo o lockup que va sobre la foto: cada tarjeta trae uno distinto. */
function ServiceLogo({ id }: { id: HomeService["id"] }) {
  if (id === "seguros") return <Image src={logoWcarseguros} alt="wcarseguros" className="h-[27px] w-auto" />;
  if (id === "taller") return <Image src={logoWcartaller} alt="wcartaller" className="h-[27px] w-auto" />;
  if (id === "financiacion") {
    return (
      <div className="flex items-center gap-4">
        <Image src={logoWcar} alt="wcar" className="h-[27px] w-auto" />
        <span aria-hidden className="h-7 w-px bg-white/60" />
        <Image src={logoSantander} alt="Santander" className="h-[21px] w-[120px]" />
      </div>
    );
  }
  return (
    <div className="flex items-center gap-2">
      <Image src={isotipoWcar} alt="" aria-hidden className="h-[27px] w-auto" />
      <span className="text-[24px] leading-[29px] font-semibold text-black">wcoffee</span>
    </div>
  );
}

function ServiceCard({ service }: { service: HomeService }) {
  return (
    <li className="flex w-[280px] shrink-0 snap-start flex-col overflow-hidden rounded-lg bg-white shadow-[0_7px_14px_rgba(211,218,226,0.4)] xl:w-auto">
      <div className="relative h-[340px] shrink-0 overflow-hidden rounded-t-lg bg-orange">
        <Image src={service.photo} alt="" aria-hidden fill sizes="280px" className="object-cover" />
        <div aria-hidden className="absolute inset-0" style={{ backgroundImage: BOTTOM_FADE }} />

        <div className="absolute inset-x-0 top-[23px] flex justify-center px-8">
          <ServiceLogo id={service.id} />
        </div>

        {service.photoTitle && (
          <p className="absolute inset-x-10 top-[67px] text-center text-heading-1 font-bold text-white whitespace-pre-line">
            {service.photoTitle}
          </p>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-[10px] p-7">
        <h3 className="text-[22px] leading-[26px] font-bold text-dark-gray">
          {service.name}
          <span className="text-orange">{service.brand}</span>
        </h3>
        <p className="min-h-[34px] text-small leading-[17px] font-medium text-gray-dark">{service.description}</p>

        <ButtonComponent
          href={service.href}
          newTab={service.href.startsWith("http")}
          size="medium"
          withoutBorder
          className="mt-2 h-[42px]! w-[91px]! justify-center! px-0!"
        >
          Ver
          <span className="sr-only"> {service.name}{service.brand}</span>
        </ButtonComponent>
      </div>
    </li>
  );
}

/**
 * "Nuestros servicios": cuatro tarjetas (Seguros, Taller, Financiación y
 * wcoffee), cada una con una foto de estudio con el logo del servicio encima y,
 * debajo, el nombre, una descripción corta y el botón VER.
 *
 * Figma (nodo "Frame 541" 671:14228, 1192 x 520 en x=124): antetítulo de 14
 * bold `gray` ("Conoce nuestros productos y todo lo que tenemos para ofrecer"),
 * `<h2>` de 36 bold a 32 px, y las cuatro tarjetas a 45 px del título, de 280 de
 * ancho con 24 entre ellas (llenan los 1192 del contenedor). Cada tarjeta: foto
 * de 340 de alto con el logo centrado a 23 px del borde, y un panel blanco de
 * 180 con 28 de relleno.
 *
 * El eyebrow no usa `SectionEyebrowComponent` (esa raya es vertical, de 4 px, y
 * aquí es horizontal de 4 px también pero seguida del párrafo antes del
 * título, como en el resto del inicio): se arma igual que en
 * `FeaturedVehiclesComponent`.
 *
 * Mobile (sin diseño): las tarjetas se deslizan en un carrusel simple (sin
 * flechas ni rayas: son solo cuatro y el diseño no las pide), con la siguiente
 * asomando por el borde.
 */
export default function FeatureServicesComponent() {
  return (
    <section aria-labelledby="services-title" className="overflow-x-clip bg-white">
      <div className="container-wcar py-16 xl:py-16">
        <span aria-hidden className="block h-[4px] w-[115px] bg-orange" />
        <p className="reveal mt-4 text-small font-bold text-gray">Conoce nuestros productos y todo lo que tenemos para ofrecer</p>
        <h2 id="services-title" className="reveal mt-2 text-subheadline-1 font-bold text-dark-gray">
          Nuestros servicios
        </h2>

        <ul className="reveal -mx-4 -mr-8 mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pr-8 pb-2 [scrollbar-width:none] xl:mx-0 xl:mt-[45px] xl:grid xl:grid-cols-4 xl:gap-6 xl:overflow-visible xl:px-0 xl:pr-0 [&::-webkit-scrollbar]:hidden">
          {HOME_SERVICES.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </ul>
      </div>
    </section>
  );
}
