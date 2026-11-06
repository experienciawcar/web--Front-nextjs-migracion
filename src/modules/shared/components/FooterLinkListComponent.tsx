import AppLinkComponent from "./AppLinkComponent";

export type FooterLink = {
  label: string;
  href: string;
};

/**
 * Lista vertical de enlaces del footer (14px, gris). `gap` y sangría los pone
 * quien la usa. `AppLinkComponent` decide si el enlace es interno o externo
 * (por ejemplo "Seguros" apunta a otro dominio); `nofollow` va en los
 * documentos legales, igual que en el sitio anterior.
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
    <ul className={`flex flex-col ${className}`}>
      {links.map((link) => (
        <li key={link.href}>
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
