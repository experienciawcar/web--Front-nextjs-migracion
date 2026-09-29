/** Paso 1: Datos personales. */
export type QuoteContact = {
  name: string;
  lastname: string;
  companyName: string;
  phone: string;
  email: string;
};

/** Pasos 2 y 3: Datos del carro + Ubicación y detalles. */
export type QuoteCar = {
  brandId: string;
  reference: string;
  /** Texto de la versión elegida (no el id: ver `types/version.ts`). */
  version: string;
  year: number | "";
  departmentId: string;
  cityId: string;
  kilometers: number | "";
  colorId: string;
};

/** Paso 4: Agenda tu cita. */
export type QuoteBooking = {
  dateId: string;
  hourId: string;
};

export type QuoteFormValues = {
  contact: QuoteContact;
  car: QuoteCar;
  book: QuoteBooking;
};

export const EMPTY_QUOTE_FORM: QuoteFormValues = {
  contact: { name: "", lastname: "", companyName: "", phone: "", email: "" },
  car: {
    brandId: "",
    reference: "",
    version: "",
    year: "",
    departmentId: "",
    cityId: "",
    kilometers: "",
    colorId: "",
  },
  book: { dateId: "", hourId: "" },
};
