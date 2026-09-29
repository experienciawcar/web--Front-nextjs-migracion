import Link from "next/link";

import { isExternalHref } from "../constants/routes";

/**
 * Enlace que decide solo si es interno (<Link>, con precarga y navegación del
 * lado del cliente) o externo (<a>). Así el navbar y el footer no repiten el
 * `if` cada vez que un item puede apuntar a otro dominio.
 *
 * Solo expone las props que hacen falta y que valen para los dos casos: <Link>
 * acepta otras (`prefetch`, `scroll`...) que en un <a> serían atributos
 * inválidos.
 *
 * `target="_blank"` va siempre con `rel="noopener noreferrer"`: quien lo pide
 * (`ButtonComponent` con `newTab`) no tiene que acordarse.
 */
export default function AppLinkComponent({
  href,
  className,
  rel,
  target,
  onClick,
  children,
}: {
  href: string;
  className?: string;
  rel?: string;
  target?: "_blank";
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
  children: React.ReactNode;
}) {
  const safeRel = target === "_blank" ? [rel, "noopener noreferrer"].filter(Boolean).join(" ") : rel;

  if (isExternalHref(href)) {
    return (
      <a href={href} rel={safeRel} target={target} className={className} onClick={onClick}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} rel={safeRel} target={target} className={className} onClick={onClick}>
      {children}
    </Link>
  );
}
