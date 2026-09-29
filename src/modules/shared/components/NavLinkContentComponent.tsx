import Image from "next/image";

import type { NavLink } from "../types/navigation";

/**
 * Interior de una fila de submenú: ícono opcional, texto y contador opcional.
 * Lo comparten el desplegable de escritorio y el menú mobile.
 *
 * El ícono lleva `alt` vacío: el nombre del tipo de vehículo ya está en el
 * texto de al lado, y repetirlo hace que el lector de pantalla lo diga dos
 * veces (el sitio anterior lo ponía en `alt` y en `title`).
 *
 * `loading="eager"`: el panel que los contiene está oculto hasta que se abre, y
 * con la carga diferida (lo normal en next/image) el navegador esperaría a que
 * fuera visible para pedirlos, así que los íconos aparecerían uno a uno con
 * retraso al abrir el menú. Son ocho PNG de menos de 1 KB.
 */
export default function NavLinkContentComponent({ item }: { item: NavLink }) {
  return (
    <>
      {item.iconUrl && (
        <Image
          src={item.iconUrl}
          alt=""
          aria-hidden
          width={24}
          height={24}
          sizes="24px"
          loading="eager"
          className="h-auto w-6 shrink-0"
        />
      )}
      <span>{item.label}</span>
      {item.count !== undefined && <span className="text-gray">({item.count})</span>}
    </>
  );
}
