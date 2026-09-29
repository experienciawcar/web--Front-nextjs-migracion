import AppLinkComponent from "./AppLinkComponent";

export type FooterLink = {
  label: string;
  href: string;
};

/**
 * Lista vertical de enlaces del footer (14px, gris, 16px entre renglones).
 *
 * `AppLinkComponent` decide si el enlace es interno o externo (por ejemplo
 * "Seguros" apunta a otro dominio). `nofollow` se usa en los documentos
 * legales, igual que en el sitio anterior.
 */
export default function FooterLinkListComponent({
  links,
  nofollow = false,
  className = "",
}: {
  links: FooterLink[];
  nofollow?: boolean;
  className?: string;
}) {
  return (
    <ul className={`flex flex-col gap-4 ${className}`}>
      {links.map((link) => (
        <li key={link.href}>
          {/* `block` es lo que hace que cada renglón mida 22px y no 24: un <a>
              en línea hereda el interlineado del <li> (16px x 1.5) y separa 2px
              de más. */}
          <AppLinkComponent
            href={link.href}
            rel={nofollow ? "nofollow" : undefined}
            className="block text-small font-medium text-gray-dark transition-colors hover:text-orange"
          >
            {link.label}
          </AppLinkComponent>
        </li>
      ))}
    </ul>
  );
}
