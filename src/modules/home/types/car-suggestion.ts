/** Sugerencia tal como la entrega GET /v2/car-suggestions/. */
export type CarSuggestionDto = {
  id: number;
  /** Marca + modelo + versión, ya armado. */
  name: string;
  /** Tipo de carrocería ("Sedan", "Camioneta - SUV"...). */
  type: string;
};

export type CarSuggestion = CarSuggestionDto;
