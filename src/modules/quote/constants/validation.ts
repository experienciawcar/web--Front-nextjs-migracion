/**
 * Validaciones exactas del formulario de cotización, tal como las tenía el
 * sitio anterior (ver `docs/planes/cotizar.md`, §3.4 del documento de
 * referencia: los regex son los reales, no una aproximación).
 */

const EMAIL_REGEX = /^[a-zA-Z0-9.a-zA-Z0-9.!#$%&'*+-/=?^_`{|}~]+@[a-zA-Z0-9]+\.[a-zA-Z]+/;
const PHONE_REGEX = /^(?:[0-9] ?){5,13}[0-9]$/;

export function isValidEmail(value: string): boolean {
  return EMAIL_REGEX.test(value.trim());
}

export function isValidPhone(value: string): boolean {
  return PHONE_REGEX.test(value.trim());
}

export function isValidPersonName(value: string): boolean {
  const trimmed = value.trim();
  return trimmed.length >= 2 && trimmed.length <= 20;
}

export const MIN_YEAR = 1999;
export const MAX_YEAR = new Date().getFullYear() + 1;

/** 1999 al año actual + 1, el más reciente primero (como en el sitio anterior). */
export const YEAR_OPTIONS: number[] = Array.from(
  { length: MAX_YEAR - MIN_YEAR + 1 },
  (_, index) => MAX_YEAR - index,
);
