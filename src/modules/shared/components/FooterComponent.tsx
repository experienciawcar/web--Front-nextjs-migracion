import Image from "next/image";
import Link from "next/link";

import iconFacebook from "../assets/footer/icon-facebook.svg";
import iconInstagram from "../assets/footer/icon-instagram.svg";
import iconLinkedin from "../assets/footer/icon-linkedin.svg";
import iconYoutube from "../assets/footer/icon-youtube.svg";
import logoIndustriaYComercio from "../assets/footer/logo-industria-y-comercio.png";
import logoWcar from "../assets/navbar/logo-wcar.svg";
import { ROUTES } from "../constants/routes";
import FooterHeadingComponent from "./FooterHeadingComponent";
import FooterLinkListComponent, { type FooterLink } from "./FooterLinkListComponent";
import FooterTermsComponent from "./FooterTermsComponent";

const SLOGAN = "Más que vender, te aconsejamos";

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
  { label: "Políticas y tratamiento de datos", href: "/politica-de-privacidad" },
  { label: "Términos y condiciones comprador", href: "/politicas-comprador" },
  { label: "Términos y condiciones vendedor", href: "/politicas-vendedor" },
];

/**
 * Cada glifo tiene su propio tamaño: en el sitio anterior eran íconos de
 * react-icons a 16, 18, 19 y 16px dentro de un círculo de 38px.
 */
const SOCIAL_LINKS = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/wcarcolombia?mibextid=ZbWKwL",
    icon: iconFacebook,
    iconClass: "size-4",
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/wcar.oficial?igshid=NGVhN2U2NjQ0Yg%3D%3D",
    icon: iconInstagram,
    iconClass: "size-[18px]",
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/@wcarcolombia?si=SAfvApSkimvFnxHK",
    icon: iconYoutube,
    iconClass: "size-[19px]",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/wcarcol/",
    icon: iconLinkedin,
    iconClass: "size-4",
  },
];

/**
 * Las fotos viven en public/assets/shared/footer/sedes/ (110x90 en pantalla,
 * exportadas a 3x salvo la de Barranquilla, que es la única que se tenía a 1x).
 * Teléfonos y direcciones son los del sitio anterior.
 */
const SEDES = [
  {
    title: "Punto de Venta Morato",
    phone: "+57 324 4001212",
    address: "Cll 98a #69B-35",
    image: "/assets/shared/footer/sedes/sede-morato-footer.webp",
  },
  {
    title: "Compramos tu auto usado Morato",
    phone: "+57 324 4001212",
    address: "Calle 98a # 69 - 45",
    image: "/assets/shared/footer/sedes/sede-compra-tu-carro-morato.webp",
  },
  {
    title: "WCAR VITRINA VENTAS W4",
    phone: "+57 324 8264550",
    address: "Calle 98A 69 55",
    image: "/assets/shared/footer/sedes/wcar-vitrina.webp",
  },
  {
    title: "WCAR - Caribe compra o vende tu auto",
    phone: "+57 324 4001212",
    address: "Av. Circunvalar, Cl. 110 #43c91, Barranquilla, local A2-1",
    image: "/assets/shared/footer/sedes/barranquilla.webp",
  },
  {
    title: "Taller",
    phone: "+57 324 8264550",
    address: "Cr 69b #98-28",
    image: "/assets/shared/footer/sedes/sede-taller.webp",
  },
  {
    title: "Cajicá - Chía",
    phone: "+57 324 4001212",
    address: "Cra 5 #9-26 sur Cajicá. Torre 3 - Local 3",
    image: "/assets/shared/footer/sedes/sede-cajica-chia.webp",
  },
  {
    title: "wcar Puente Aranda",
    phone: "+57 324 4001212",
    address: "Carrera. 50 #15-55 Bogotá",
    image: "/assets/shared/footer/sedes/sede-puente-aranda.webp",
  },
  {
    title: "wcoffe Morato",
    phone: "+57 324 4001212",
    address: "Cll 98a #69B-35",
    image: "/assets/shared/footer/sedes/sede-wcoffe.webp",
  },
  {
    title: "Wcar La Felicidad",
    phone: "+57 324 4001212",
    address: "Cl. 17 #80A-30, Bogotá, Colombia",
    image: "/assets/shared/footer/sedes/sede-la-felicidad.webp",
  },
];

/**
 * Footer global (va en el layout). Se maqueta desde el footer del sitio
 * anterior (código y render en producción), no desde Figma.
 * TODO: comparar contra el frame de Footer del archivo de Figma 2026.
 *
 * Tres bloques: columnas (marca, menú, términos), sedes y fila legal.
 *
 * Desktop desde `xl` (1280px), igual que el navbar, y con el ancho de
 * contenido del resto de la web (`container-wcar`, 1192px). El sitio anterior
 * usaba 1320px; se ajusta para que el logo caiga alineado con el del navbar.
 * Por debajo de `xl` todo se apila y el bloque de marca pasa al final, como en
 * el sitio anterior: por eso es un solo bloque con `order-last` y no dos
 * copias del markup.
 */
export default function FooterComponent() {
  return (
    <footer className="bg-gray-light pt-10 xl:pt-16">
      <div className="container-wcar">
        <div className="flex flex-col gap-12 xl:flex-row xl:justify-between xl:gap-[100px]">
          {/* Marca, redes y contacto. */}
          <div className="order-last flex flex-col items-center gap-4 xl:order-none xl:flex-1 xl:items-start">
            <div className="flex flex-col items-center gap-6 xl:mt-[11px] xl:items-start">
              <Image src={logoWcar} alt="WCAR" className="h-11 w-[136px]" />
              <p className="text-body font-medium text-gray-dark">{SLOGAN}</p>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-body leading-6 font-bold text-orange">Síguenos</span>
              <ul className="flex gap-4">
                {SOCIAL_LINKS.map((social) => (
                  <li key={social.label}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${social.label} de WCAR`}
                      className="flex size-[38px] items-center justify-center rounded-full border border-gray transition-colors hover:border-orange"
                    >
                      <Image src={social.icon} alt="" aria-hidden className={social.iconClass} />
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* El sitio anterior lo mostraba solo desde tablet, no en mobile. */}
            <div className="hidden items-start gap-4 xl:flex">
              <span className="text-body leading-6 font-bold text-orange">Contacto</span>
              <div className="flex flex-col gap-0.5 text-small font-medium text-dark-gray">
                <a href="mailto:contacto@wcar.co" className="transition-colors hover:text-orange">
                  contacto@wcar.co
                </a>
                <a href="tel:+573244001212" className="transition-colors hover:text-orange">
                  +57 324 4001212
                </a>
              </div>
            </div>
          </div>

          <nav aria-label="Menú del pie de página" className="xl:w-[170px] xl:shrink-0">
            <FooterHeadingComponent>Menú</FooterHeadingComponent>
            <FooterLinkListComponent links={MENU_LINKS} className="mt-[25px]" />
          </nav>

          <div className="w-full max-w-[350px] xl:shrink-0">
            <FooterTermsComponent />
          </div>
        </div>
      </div>

      {/* Sedes. Las líneas van de borde a borde en mobile y solo del ancho del
          contenido en desktop, como en el sitio anterior. */}
      <section
        aria-labelledby="sedes-titulo"
        className="mt-12 border-y border-gray xl:mt-[59px] xl:border-0"
      >
        <div className="container-wcar">
          <div className="py-6 xl:border-y xl:border-gray">
            <div className="flex flex-col items-center xl:items-start">
              <span aria-hidden className="block h-1 w-20 bg-orange" />
              <h2
                id="sedes-titulo"
                className="mt-2.5 text-[32px] leading-8 italic text-dark-gray"
              >
                <span className="font-bold">Nuestras</span>{" "}
                <span className="font-thin text-orange">sedes</span>
              </h2>
            </div>

            {/* `items-start`: cada sede mide lo que mide su contenido, y la foto se
                centra contra SU texto, no contra la fila. Sin esto, la foto de
                Barranquilla (cuyo texto ocupa tres renglones más) arrastraba a
                las otras tres de su fila hacia abajo. */}
            <ul className="mt-6 grid grid-cols-2 items-start gap-x-4 gap-y-8 md:grid-cols-3 xl:mt-[27px] xl:grid-cols-4 xl:gap-y-4">
              {SEDES.map((sede) => (
                <li
                  key={sede.title + sede.address}
                  className="flex flex-col items-center gap-2.5 text-center xl:flex-row xl:text-left"
                >
                  <Image
                    src={sede.image}
                    alt={`Sede ${sede.title}`}
                    width={110}
                    height={90}
                    sizes="110px"
                    className="h-[90px] w-[110px] shrink-0 rounded-[10px] object-cover"
                  />
                  <div className="flex flex-col gap-2">
                    <p className="text-small leading-5 font-bold text-gray-dark">{sede.title}</p>
                    <p className="text-caption leading-[19px] font-bold text-gray">{sede.phone}</p>
                    <p className="text-caption leading-[19px] font-medium text-gray-dark">
                      {sede.address}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Fila legal. En mobile los enlaces van arriba y el logo abajo; en
          desktop, al revés y en una sola fila. */}
      <div className="container-wcar">
        <div className="flex flex-col-reverse items-center gap-8 pt-8 pb-6 xl:flex-row xl:justify-between xl:pb-16">
          <div className="flex flex-col items-center gap-4 xl:items-start">
            <Image
              src={logoIndustriaYComercio}
              alt="Superintendencia de Industria y Comercio"
              className="h-10 w-auto"
            />
            <p className="text-small font-medium text-dark-gray">
              wcar - Todos los derechos reservados © {new Date().getFullYear()}
            </p>
          </div>

          {/* Gris claro en mobile y gris medio en desktop, como en el sitio
              anterior (eran dos listas distintas con dos colores). */}
          <ul className="flex flex-col items-center gap-4 text-center xl:flex-row xl:gap-5">
            {LEGAL_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  rel="nofollow"
                  className="block text-small font-medium text-gray transition-colors hover:text-orange xl:text-gray-dark"
                >
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
