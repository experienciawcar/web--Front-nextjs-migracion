import Image from "next/image";
import Link from "next/link";

import iconFacebook from "../assets/footer/icon-facebook-orange.svg";
import iconInstagram from "../assets/footer/icon-instagram-orange.svg";
import iconLinkedin from "../assets/footer/icon-linkedin-orange.svg";
import iconYoutube from "../assets/footer/icon-youtube-orange.svg";
import logoOnOrange from "../assets/footer/horizontal-on-orange.svg";
import logoIndustriaYComercio from "../assets/footer/logo-industria-y-comercio.png";
import { ROUTES } from "../constants/routes";
import FooterHeadingComponent from "./FooterHeadingComponent";
import FooterLinkListComponent, { type FooterLink } from "./FooterLinkListComponent";
import FooterSedesComponent from "./FooterSedesComponent";
import FooterTermsComponent from "./FooterTermsComponent";

/** Las rutas salen de `constants/routes`, las mismas que usa el navbar. */
const MENU_LINKS: FooterLink[] = [
  { label: "Nuestra empresa", href: ROUTES.aboutUs },
  { label: "Compra tu carro", href: ROUTES.buyCar },
  { label: "Vende tu carro", href: ROUTES.sellCar },
  { label: "Financiación", href: ROUTES.financing },
  { label: "Seguros", href: ROUTES.insurance },
  { label: "Trámites", href: ROUTES.procedures },
];

const LEGAL_LINKS: FooterLink[] = [
  { label: "Políticas y tratamiento de datos", href: ROUTES.privacyPolicy },
  { label: "Términos y condiciones comprador", href: ROUTES.buyerPolicies },
  { label: "Términos y condiciones vendedor", href: ROUTES.sellerPolicies },
];

const SOCIAL_LINKS = [
  { label: "Facebook", href: "https://www.facebook.com/wcarcolombia?mibextid=ZbWKwL", icon: iconFacebook },
  { label: "Instagram", href: "https://www.instagram.com/wcar.oficial?igshid=NGVhN2U2NjQ0Yg%3D%3D", icon: iconInstagram },
  { label: "YouTube", href: "https://www.youtube.com/@wcarcolombia?si=SAfvApSkimvFnxHK", icon: iconYoutube },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/wcarcol/", icon: iconLinkedin },
];

const CONTACT_LINK = "block text-small leading-[22px] font-semibold text-white";

/**
 * Footer global (en el layout), maquetado desde el footer 2026 de wcar.co
 * (ver docs/footer.md): tres tarjetas (marca, menú, términos), sedes y fila legal.
 * Anchos como el original: contenedor de 1200px; ≤1100px las tarjetas pasan a
 * dos columnas; ≤767px layout de 393px con las sedes en versión mobile.
 */
export default function FooterComponent() {
  return (
    <footer className="bg-gray-light px-2.5 pt-[27px] md:px-4 md:pt-5">
      <div className="mx-auto max-w-[393px] md:max-w-[1200px]">
        <div className="mx-3.5 flex flex-col gap-[25px] md:mx-0 md:grid md:gap-3 max-[1100px]:md:grid-cols-2 min-[1101px]:grid-cols-[300px_240px_1fr]">
          {/* Marca */}
          <div className="flex h-[341px] flex-col gap-3 rounded-lg bg-[#ff7300] pt-[30px] pr-6 pl-[61px] md:h-auto md:min-h-[341px] md:px-9 md:py-[30px]">
            <Image src={logoOnOrange} alt="wcar" width={130} height={40} className="h-auto w-[130px] md:-ml-2" />
            <span className="mb-5 text-[24px] text-white">
              <strong className="font-bold">Más que vender,</strong>
              <br />
              te aconsejamos
            </span>
            <div className="flex flex-col">
              <FooterHeadingComponent as="p" white className="mb-2 [--bt:2px] [--bx:-23px] [--pl:0px] md:[--bx:0px] md:[--pl:12px]">
                Síguenos
              </FooterHeadingComponent>
              <ul className="mt-1 flex gap-4">
                {SOCIAL_LINKS.map((social) => (
                  <li key={social.label}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${social.label} de WCAR`}
                      className="flex size-8 items-center justify-center rounded-full bg-white"
                    >
                      <Image src={social.icon} alt="" aria-hidden className="size-3.5" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col">
              <FooterHeadingComponent as="p" white className="mb-1 [--bt:2px] [--bx:-23px] [--pl:0px] md:[--bx:0px] md:[--pl:12px]">
                Contacto
              </FooterHeadingComponent>
              <a href="mailto:contacto@wcar.co" className={CONTACT_LINK}>
                contacto@wcar.co
              </a>
              <a href="tel:+573244001212" className={CONTACT_LINK}>
                +57 324 4001212
              </a>
            </div>
          </div>

          {/* Menú */}
          <nav aria-label="Menú del pie de página" className="rounded-lg bg-white py-[34px] pr-6 pb-[23px] pl-[59px] md:px-8 md:pb-[34px]">
            <FooterHeadingComponent className="mb-3 [--bt:0px] [--bx:-18px] [--pl:0px] md:[--bt:2px] md:[--bx:0px] md:[--pl:12px]">
              Menú
            </FooterHeadingComponent>
            <FooterLinkListComponent links={MENU_LINKS} className="gap-3 md:pl-3" />
          </nav>

          <FooterTermsComponent />
        </div>

        <FooterSedesComponent />

        {/* Fila legal */}
        <div className="flex flex-col gap-6 px-3.5 pt-8 pb-10 md:mt-8 md:flex-row md:items-start md:justify-between md:border-t md:border-gray md:px-4 md:pb-12">
          <div>
            <Image src={logoIndustriaYComercio} alt="Superintendencia de Industria y Comercio" className="h-10 w-auto" />
            <p className="mt-4 text-small font-medium text-gray">
              wcar - Todos los derechos reservados © {new Date().getFullYear()}
            </p>
          </div>
          <ul className="flex flex-col gap-[26px] md:flex-row md:gap-[45px] md:pt-2.5">
            {LEGAL_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} rel="nofollow" className="text-small font-medium text-gray transition-colors hover:text-orange">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
