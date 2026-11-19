/** Paso 1: el carro. */
export type QuoteCar = {
  /** Siempre en mayúsculas y sin separadores (ver `normalizePlate`). */
  plate: string;
  /** Solo dígitos, como texto: así el campo no pelea con el teclado. */
  kilometers: string;
};

/** Paso 2: quién vende. */
export type QuoteContact = {
  fullName: string;
  phone: string;
  /** Opcional. */
  email: string;
};

export type QuoteFormValues = {
  car: QuoteCar;
  contact: QuoteContact;
};

export const EMPTY_QUOTE_FORM: QuoteFormValues = {
  car: { plate: "", kilometers: "" },
  contact: { fullName: "", phone: "", email: "" },
};
