"use client";

import Image from "next/image";
import { useState } from "react";

/**
 * Foto de perfil de quien dejó la reseña. Si no tiene, o si la de Google no
 * carga, se cae a la inicial sobre un círculo oscuro, que es lo que hace el
 * diseño con los autores sin foto ("J" en Jose Daniel).
 *
 * La foto se carga directa desde Google (`unoptimized`) y no por el optimizador
 * de Next: ya mide 128x128 para un círculo de 50px, y así no dependemos de que
 * Google acepte peticiones del servidor ni hay que abrir su dominio en
 * `next.config.ts`. `referrerPolicy="no-referrer"` es lo que evita que Google
 * rechace la foto según desde qué página se pida.
 */
export default function ReviewerAvatarComponent({
  name,
  photoUrl,
}: {
  name: string;
  photoUrl: string | null;
}) {
  const [failed, setFailed] = useState(false);

  if (!photoUrl || failed) {
    const initial = Array.from(name.trim())[0]?.toUpperCase() ?? "";
    return (
      <span
        aria-hidden
        className="grid size-[50px] shrink-0 place-items-center rounded-full bg-dark-gray text-[20px] font-medium text-white"
      >
        {initial}
      </span>
    );
  }

  return (
    <Image
      src={photoUrl}
      alt=""
      width={50}
      height={50}
      unoptimized
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className="size-[50px] shrink-0 rounded-full object-cover"
    />
  );
}
