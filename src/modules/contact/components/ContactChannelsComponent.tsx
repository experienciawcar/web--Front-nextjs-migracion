import Image from "next/image";

import { CONTACT_CHANNELS } from "../constants/channels";

/**
 * Los tres círculos cian con el correo, el teléfono y la dirección.
 *
 * Desktop (1910 de ancho, medido en la captura): círculos de 64x63 con el dato
 * a 14px debajo, en tres tarjetas de 28px de relleno repartidas con
 * `justify-around` en una caja de 672px centrada. Cada tarjeta mide lo que su
 * texto, así que los centros no quedan a la misma distancia (733, 953 y 1175).
 *
 * Mobile: solo los círculos, juntos y centrados; el texto queda para lectores de
 * pantalla, como en el sitio anterior (`span{display:none}` bajo 768px), porque
 * tres datos no caben en fila en 393px. El sitio anterior los dibujaba pasados
 * del borde derecho; aquí van centrados.
 */
export default function ContactChannelsComponent() {
  return (
    <ul className="mx-auto mt-8 flex justify-center gap-6 xl:mt-0 xl:w-[672px] xl:justify-around xl:gap-0">
      {CONTACT_CHANNELS.map((channel) => (
        <li key={channel.id} className="reveal">
          <a
            href={channel.href}
            target={channel.newTab ? "_blank" : undefined}
            rel={channel.newTab ? "noopener noreferrer" : undefined}
            className="flex flex-col items-center gap-3.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-neon xl:p-7"
          >
            <Image src={channel.icon} alt="" aria-hidden className="shrink-0" />
            <span className="text-small leading-5 max-xl:sr-only">{channel.label}</span>
          </a>
        </li>
      ))}
    </ul>
  );
}
