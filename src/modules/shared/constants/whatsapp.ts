import { SITE_URL } from "../utils/seo";

/**
 * Línea de WhatsApp del asesor (Wanda), con el indicativo y sin "+".
 * TODO(negocio): el 573000000000 es un número de PRUEBA; Comercial debe dar el real
 * (se cambia con `NEXT_PUBLIC_WHATSAPP_NUMBER`, sin tocar el código).
 */
export const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "573000000000";

/** Enlace `wa.me` con el mensaje ya escrito. */
export function whatsappHref(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

/** Mensaje de la ficha: carro, Stock ID, precio y enlace, para que el asesor sepa de cuál hablan. */
export function vehicleWhatsappMessage(v: {
  name: string;
  year: number | null;
  stockId: string;
  price: string;
  href: string;
}): string {
  return `Hola, me interesa el ${v.name}${v.year ? ` ${v.year}` : ""} · Stock ${v.stockId} · ${v.price}\n${SITE_URL}${v.href}\n¿Sigue disponible?`;
}
