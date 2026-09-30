/**
 * Documento legal tal como lo entrega GET /api/terms/no-contents/ (la lista
 * llega sin el contenido, solo con lo necesario para enlazarlo). Se declaran
 * los campos que usa el footer.
 */
export type TermsDto = {
  id: number;
  title: string;
  /** Slug de la página del documento. Ojo: el backend lo guarda tal cual lo
   *  escribieron, con mayúsculas, tildes, espacios y hasta signos ("NO SEAS
   *  COMO BRAYAN!"), así que hay que codificarlo antes de armar el enlace. */
  url: string;
  active: boolean;
  /** true si es un documento de campaña/app; false si es del sitio web. */
  is_app: boolean;
};

/** Enlace de un documento legal, ya listo para pintarlo. */
export type TermsLink = {
  id: number;
  title: string;
  href: string;
  isApp: boolean;
};

/** Un bloque del documento (GET /api/terms/<id>/): subtítulo opcional y HTML del editor. */
export type TermsContentDto = {
  id: number;
  subTitle: string;
  paragraph: string;
};

/** Respuesta de GET /api/terms/<id>/. */
export type TermsDetailDto = {
  term: TermsDto & { contents_terms: TermsContentDto[] };
};

/** Documento legal completo, listo para pintarlo. */
export type TermsDocument = {
  id: number;
  title: string;
  /** Slug tal cual lo guarda el backend (sin codificar). */
  slug: string;
  sections: { id: number; title: string | null; html: string }[];
};
