import type { MetadataRoute } from "next";

import { ROUTES } from "@/modules/shared/constants/routes";
import { SITE_URL } from "@/modules/shared/utils/seo";

/**
 * Solo las rutas que tienen página (`ROUTES` trae además las del sitio anterior
 * que aún no existen: listarlas aquí las declararía 404 ante Google). Al crear
 * una vista nueva, añádela a esta lista.
 *
 * Sin `lastModified`: no hay una fecha real por página y una inventada (la de
 * cada build) le dice a Google que todo cambió siempre.
 * TODO(seo): `/compra-tu-camion` da 0 resultados hasta que el backend tenga la
 * categoría (ver `CATALOG_TRUCKS`); quitarla de aquí si negocio prefiere no
 * indexarla todavía.
 */
const PAGES = [
  ROUTES.home,
  ROUTES.aboutUs,
  ROUTES.headquarters,
  ROUTES.buyCar,
  ROUTES.buyMotorcycle,
  ROUTES.buyVan,
  ROUTES.buyTruck,
  ROUTES.sellCar,
  ROUTES.financing,
  ROUTES.procedures,
  ROUTES.workshop,
  ROUTES.contact,
  ROUTES.quote,
];

export default function sitemap(): MetadataRoute.Sitemap {
  return PAGES.map((path) => ({ url: path === "/" ? SITE_URL : `${SITE_URL}${path}` }));
}
