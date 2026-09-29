import type { Metadata } from "next";

import ogDefault from "../assets/og-default.png";

/**
 * Dominio de producción. `metadataBase` (layout raíz) lo usa para volver
 * absolutas las rutas relativas del canonical y de las imágenes Open Graph;
 * `sitemap.ts` y `robots.ts` lo usan para armar sus URLs.
 */
export const SITE_URL = "https://wcar.co";

export const SITE_NAME = "WCAR";

/** Imagen al compartir el enlace (1200x630: logo sobre el naranja de marca). */
export const OG_IMAGE = { url: ogDefault.src, width: 1200, height: 630, alt: "WCAR: compra y vende tu vehículo" };

type PageSeo = {
  title: string;
  description: string;
  /** Ruta de la página, con barra inicial ("/taller"). Es su canonical y su `og:url`. */
  path: string;
};

/**
 * Metadata de una página con canonical, Open Graph y Twitter Card.
 *
 * Existe porque el `openGraph` de una página REEMPLAZA al del layout (no se
 * mezclan campo a campo): si cada página lo escribiera a mano, habría que
 * repetir `siteName` y `locale` en todas. La imagen va por import y no por el
 * archivo `opengraph-image` de Next: ese archivo se pierde en cuanto la página
 * define su propio `openGraph`.
 */
export function buildPageMetadata({ title, description, path }: PageSeo): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      locale: "es_CO",
      title,
      description,
      url: path,
      images: [OG_IMAGE],
    },
    twitter: { card: "summary_large_image", title, description, images: [OG_IMAGE.url] },
  };
}
