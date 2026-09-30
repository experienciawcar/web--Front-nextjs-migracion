import type { MetadataRoute } from "next";

import { SITE_URL } from "@/modules/shared/utils/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    // /vehiculo/<id> es la ruta interna de la ficha (ver next.config.ts): el canonical es la URL pública.
    rules: { userAgent: "*", allow: "/", disallow: ["/vehiculo/", "/api/", "/perfil", "/iniciar-sesion"] },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
