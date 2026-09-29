/** Fecha disponible tal como la entrega GET /date-avaliable-review-sell/. */
export type BookDateDto = {
  id: number;
  /** "AAAA-MM-DD". */
  date: string;
  typeSell: boolean;
};

export type BookDate = { id: string; date: string };

/** Franja horaria tal como la entrega GET /date-avaliable-review-sell/:dateId/. */
export type BookHourDto = {
  id: number;
  /** "HH:MM:SS". */
  hour_from: string;
  hour_to: string;
  date: number;
};

export type BookHour = { id: string; from: string; to: string };
