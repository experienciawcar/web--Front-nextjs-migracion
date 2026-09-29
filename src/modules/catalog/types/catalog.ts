export type CatalogKind = "carros" | "motos" | "vans" | "camiones";

/**
 * Lo que distingue a cada una de las 4 rutas del catálogo. Es la misma idea
 * de `CatalogoConfig` de la SPA anterior (un componente, 4 configs — ver
 * `docs/planes/compra-tu-carro/referencia-sitio-anterior.md` §2), adaptada:
 * `countLabel` es una función porque el texto real cambia de palabra por
 * variante ("Vehículos encontrados: 211" / "Motos encontradas: 28"), no solo
 * el número (confirmado contra la web en vivo, ver §B.2 de la referencia).
 */
export type CatalogConfig = {
  kind: CatalogKind;
  /** Ruta base (`ROUTES.buyCar`, etc.): a donde vuelve "Limpiar filtros". */
  route: string;
  /**
   * Id de `/type-cars/` fijo para esta variante, para el body de
   * `POST /v2/filter-cars/`. `undefined` solo en "carros" (el usuario elige
   * el tipo). En "camiones" es un id que el backend **no tiene** hoy (ver
   * `CATALOG_TRUCKS`): a propósito, para mostrar 0 resultados reales igual
   * que en producción, no "todo el catálogo sin filtrar" (que sería peor: un
   * usuario podría comprar un carro común desde la URL de camiones).
   */
  bodyTypeId?: string;
  /** Si el sidebar muestra el filtro "Tipo" (independiente de `bodyTypeId`: solo "carros" lo trae). */
  showTypeFilter: boolean;
  /**
   * Plantilla del contador de resultados, con `{count}` donde va el número
   * ("Vehículos encontrados: {count}" / "Motos encontradas: {count}" — el
   * texto cambia de palabra por variante, confirmado contra la web en vivo).
   * Es una plantilla y no una función a propósito: `CatalogConfig` viaja de
   * un `page.tsx` (servidor) a `CatalogComponent` (cliente) como prop, y
   * Next no deja pasar funciones a través de ese límite.
   */
  countLabelTemplate: string;
  seo: {
    title: string;
    description: string;
    h1: string;
  };
};
