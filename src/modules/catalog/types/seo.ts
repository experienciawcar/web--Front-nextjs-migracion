/** Un ítem del acordeón SEO: título (`h2`), texto en párrafos y, opcional, imagen y enlace. */
export type SeoItem = {
  title: string;
  paragraphs?: string[];
  bullets?: string[];
  /** Enlace interno al final del texto (en el sitio anterior eran palabras sueltas sin `<a>`). */
  link?: { label: string; href: string };
  /** Archivo dentro de `/assets/catalogo/seo/<carpeta de la categoría>/` y su `alt`. */
  image?: { file: string; alt: string };
};

export type SeoCategoryKey = "camionetas" | "coupe" | "hibridos" | "sedan" | "hatchback" | "motos";

export type SeoCategory = {
  key: SeoCategoryKey;
  /** Texto del banner naranja (`<h1>`); sin él (motos) la página conserva su `<h1>` de siempre. */
  bannerTitle?: string;
  /** Columna izquierda y derecha del acordeón. */
  left: SeoItem[];
  right: SeoItem[];
};
