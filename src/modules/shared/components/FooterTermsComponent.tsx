import Image from "next/image";

import iconClose from "../assets/footer/icon-close.svg";
import iconPlus from "../assets/footer/icon-plus.svg";
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
  href: "/politicas-comprador",
};

/**
 * Desplegable nativo (<details>), sin JavaScript: el `name` los agrupa y el
 * navegador cierra el otro al abrir uno, que es lo que hacía el estado
 * `open` del sitio anterior. El ícono cambia de "+" a "×" con `group-open`.
 *
 * Diferencia con el sitio anterior: allí el ícono se salía por la derecha de
 * la línea divisoria (la línea medía 325px y la fila 350). Aquí la línea y la
 * fila miden lo mismo.
 */
function TermsAccordion({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <details name="footer-terms" className="group border-b border-[#cdd6da]">
      <summary className="flex cursor-pointer items-center justify-between gap-4 py-4 marker:content-none [&::-webkit-details-marker]:hidden">
        <span className="text-small font-medium text-gray-dark">{title}</span>
        <Image src={iconPlus} alt="" aria-hidden className="size-[14px] shrink-0 group-open:hidden" />
        <Image
          src={iconClose}
          alt=""
          aria-hidden
          className="hidden size-[14px] shrink-0 group-open:block"
        />
      </summary>
      <div className="pb-5">{children}</div>
    </details>
  );
}

/**
 * Columna "Términos y condiciones" del footer. Es asíncrona porque los
 * documentos de los desplegables vienen del backend (ver `getTermsLinks`).
 *
 * Los enlaces apuntan a `/<slug>/<id>`, la misma forma que usaba el sitio
 * anterior. Esas páginas todavía no existen en este proyecto.
 * TODO: crear la ruta dinámica de documentos legales.
 *
 * Los dos desplegables repiten "Términos y condiciones comprador" porque así
 * estaba en el sitio anterior; parece un copia-pega, confirmar si en
 * "Campañas" debería ir.
 */
export default async function FooterTermsComponent() {
  const terms = await getTermsLinks();

  const toLinks = (isApp: boolean): FooterLink[] =>
    terms.filter((item) => item.isApp === isApp).map(({ title, href }) => ({ label: title, href }));

  return (
    <div>
      <FooterHeadingComponent>Términos y condiciones</FooterHeadingComponent>

      <FooterLinkListComponent links={PRIVACY_LINKS} nofollow className="mt-[25px]" />

      <div className="mt-3 border-t border-[#cdd6da]">
        <TermsAccordion title="Términos y condiciones Website wcar">
          <FooterLinkListComponent links={[...toLinks(false), BUYER_TERMS_LINK]} nofollow />
        </TermsAccordion>

        <TermsAccordion title="Términos y condiciones de Campañas de wcar">
          <FooterLinkListComponent
            links={[...PRIVACY_LINKS, ...toLinks(true), BUYER_TERMS_LINK]}
            nofollow
          />
        </TermsAccordion>
      </div>
    </div>
  );
}
