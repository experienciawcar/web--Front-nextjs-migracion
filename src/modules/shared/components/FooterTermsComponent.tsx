import Image from "next/image";

import iconClose from "../assets/footer/icon-close.svg";
import iconPlus from "../assets/footer/icon-plus.svg";
import { ROUTES } from "../constants/routes";
import { getTermsLinks } from "../services/terms";
import FooterHeadingComponent from "./FooterHeadingComponent";
import FooterLinkListComponent, { type FooterLink } from "./FooterLinkListComponent";

/** Documentos fijos que el sitio anterior ponía a mano, fuera de la API. */
const PRIVACY_LINKS: FooterLink[] = [
  {
    label: "Aviso de privacidad de datos para usuarios",
    href: "/aviso-de-privacidad-de-datos-para-usuarios-app-wcar/20",
  },
  {
    label: "Políticas de privacidad",
    href: "/politicas-de-privacidad-de-la-aplicacion-movil-wcar/21",
  },
];

const BUYER_TERMS_LINK: FooterLink = {
  label: "Términos y condiciones comprador",
  href: ROUTES.buyerPolicies,
};

/**
 * Desplegable nativo (<details>), sin JavaScript: el `name` los agrupa y el
 * navegador cierra el otro al abrir uno, como hacía el estado `open` del sitio
 * anterior. El ícono pasa de "+" a "×" con `group-open`.
 */
function TermsAccordion({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <details name="footer-terms" className="group border-t border-[#cdd6da] last:border-b">
      <summary className="flex cursor-pointer items-center justify-between gap-3 py-4 pr-2.5 marker:content-none md:pr-0 [&::-webkit-details-marker]:hidden">
        <span className="text-left text-small font-semibold text-gray-dark">{title}</span>
        <Image src={iconPlus} alt="" aria-hidden className="size-[14px] shrink-0 group-open:hidden" />
        <Image
          src={iconClose}
          alt=""
          aria-hidden
          className="hidden size-[14px] shrink-0 group-open:block"
        />
      </summary>
      <div className="pb-4">{children}</div>
    </details>
  );
}

/**
 * Tarjeta "Términos y condiciones". Es asíncrona porque los documentos de los
 * desplegables vienen del backend (ver `getTermsLinks`). Los enlaces apuntan a
 * `/<slug>/<id>`, la forma del sitio anterior (las sirve `app/[title]/[id]`).
 *
 * "Términos y condiciones comprador" va al final de ambos desplegables porque
 * así estaba en el sitio anterior; parece un copia-pega, confirmar.
 */
export default async function FooterTermsComponent() {
  const terms = await getTermsLinks();

  const toLinks = (isApp: boolean): FooterLink[] =>
    terms.filter((item) => item.isApp === isApp).map(({ title, href }) => ({ label: title, href }));

  return (
    <div className="rounded-lg bg-white py-11 pr-[21px] pl-[37px] max-[1100px]:col-span-full md:px-12 md:py-10">
      <FooterHeadingComponent className="mb-4 text-[20px] [--bt:0px] [--bx:-15px] [--pl:0px] md:mb-3 md:[--bt:2px] md:[--bx:0px] md:[--pl:12px]">
        Términos y condiciones
      </FooterHeadingComponent>

      <FooterLinkListComponent
        links={PRIVACY_LINKS}
        nofollow
        className="gap-4 md:pl-3"
      />

      <div className="mt-4 md:ml-3">
        <TermsAccordion title="Términos y condiciones Website wcar">
          <FooterLinkListComponent
            links={[...toLinks(false), BUYER_TERMS_LINK]}
            nofollow
            className="gap-2.5"
          />
        </TermsAccordion>

        <TermsAccordion title="Mas términos y condiciones">
          <FooterLinkListComponent
            links={[...toLinks(true), BUYER_TERMS_LINK]}
            nofollow
            className="gap-2.5"
          />
        </TermsAccordion>
      </div>
    </div>
  );
}
