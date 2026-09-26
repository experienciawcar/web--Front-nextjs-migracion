/** Tarjeta de calificación: un puntaje con estrellas y su fuente. */
export type RatingStat = {
  id: string;
  /** Puntaje ya formateado, tal como se muestra ("4.5"). */
  score: string;
  /** Valor de 0 a 5; los medios puntos pintan media estrella. */
  stars: number;
  /** Plataforma que da la calificación ("Google"). */
  source: string;
  /** Aclaración bajo la fuente ("(1.500 + reseñas)"). */
  detail: string;
};

/** Tarjeta de cifra: un dato duro con su descripción. */
export type FigureStat = {
  id: string;
  /** Cifra ya formateada ("#1", "+ 2.900"). */
  value: string;
  title: string;
  detail: string;
};

export type Stats = {
  ratings: RatingStat[];
  figures: FigureStat[];
};
