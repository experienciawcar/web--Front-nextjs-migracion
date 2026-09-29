import { ROUTES } from "@/modules/shared/constants/routes";

import type { CatalogConfig } from "../types/catalog";

/**
 * Los 4 catálogos, uno por ruta. `title`/`description`/`h1` son una propuesta
 * a partir de la intención de búsqueda de cada variante ("carros usados
 * Colombia", "motos usadas Colombia"...); no vienen de marketing.
 * TODO(seo): confirmar con marketing (palabra clave real, si hay una).
 */

export const CATALOG_CARS: CatalogConfig = {
  kind: "carros",
  route: ROUTES.buyCar,
  showTypeFilter: true,
  countLabelTemplate: "Vehículos encontrados: {count}",
  seo: {
    title: "Compra tu carro usado en Colombia | WCAR",
    description:
      "Explora cientos de carros usados certificados en WCAR: filtra por marca, precio, año, kilometraje y ciudad, con garantía y financiación.",
    h1: "Compra tu carro usado",
  },
};

export const CATALOG_MOTORCYCLES: CatalogConfig = {
  kind: "motos",
  route: ROUTES.buyMotorcycle,
  bodyTypeId: "18",
  showTypeFilter: false,
  countLabelTemplate: "Motos encontradas: {count}",
  seo: {
    title: "Compra tu moto usada en Colombia | WCAR",
    description:
      "Motos usadas certificadas en WCAR: filtra por marca, precio, año y kilometraje, con garantía y financiación disponible.",
    h1: "Compra tu moto usada",
  },
};

export const CATALOG_VANS: CatalogConfig = {
  kind: "vans",
  route: ROUTES.buyVan,
  bodyTypeId: "22",
  showTypeFilter: false,
  countLabelTemplate: "Vans encontradas: {count}",
  seo: {
    title: "Compra tu van usada en Colombia | WCAR",
    description: "Vans usadas certificadas en WCAR: filtra por marca, precio, año y kilometraje, con garantía y financiación.",
    h1: "Compra tu van usada",
  },
};

/**
 * `bodyTypeId: "21"` es un id que **no existe** en `/type-cars/` hoy (los
 * ids reales son 2, 3, 6, 8, 12, 13, 18, 22 — no hay ninguna categoría de
 * camión). Se deja a propósito, no en blanco: sin ningún `body_type` en el
 * body, `POST /v2/filter-cars/` devuelve **todo el catálogo sin filtrar**
 * (211 vehículos), que sería peor que el 0 actual — un usuario podría
 * terminar comprando un carro común desde `/compra-tu-camion`. Con este id
 * se reproduce el mismo 0 resultados que ya tiene producción hoy, de forma
 * intencional y documentada, hasta que el backend tenga la categoría real.
 * TODO(negocio/backend): crear la categoría "Camiones" en el backend y
 * reemplazar este id por el real.
 */
export const CATALOG_TRUCKS: CatalogConfig = {
  kind: "camiones",
  route: ROUTES.buyTruck,
  bodyTypeId: "21",
  showTypeFilter: false,
  countLabelTemplate: "Camiones encontrados: {count}",
  seo: {
    title: "Compra tu camión usado en Colombia | WCAR",
    description: "Camiones usados certificados en WCAR: filtra por marca, precio, año y kilometraje, con garantía y financiación.",
    h1: "Compra tu camión usado",
  },
};
