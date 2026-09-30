import type {
  ExpertiseField,
  ExpertiseNoveltyGroup,
  ExpertiseReport,
} from "../types/expertise";

/**
 * Reparte el certificado de Automás en hojas A4 (794 x 1123 px), como el del sitio de referencia
 * (`docs/VER_PERITAJE.md` §5.4). Allá se mide el DOM; aquí todo tiene alto conocido (las filas son
 * de una línea y no se parten), así que se calcula con las medidas del CSS y se estima solo lo que
 * depende del texto (observaciones y accesorios). Las hojas no fijan su alto (`min-height`): si
 * una estimación se queda corta, la hoja crece un poco en vez de recortar.
 *
 * Orden del flujo: novedades → observaciones → accesorios y valores → detalles → anexo fotográfico.
 * Un bloque entero que no cabe salta de hoja; los largos (novedades, detalles, anexo) se parten por filas.
 */

/** Espacio libre de la hoja 1 tras la portada (cabecera, resumen, fotos y diagnóstico). */
const FIRST_SHEET = 190 + 72;
/** Espacio libre de las demás hojas bajo la cabecera. */
const OTHER_SHEET = 1018;
/** Separación entre bloques (`.pa-flujo`). */
const GAP = 20.48;

const NOVELTY = { frame: 72, title: 30.4, item: 27.84 };
const DETAILS = { frameWithType: 119, frameWithoutType: 72, row: 46.72, perRow: 4 };
const ANNEX = { frame: 85, row: 188.2, gap: 10.24, perRow: 3 };

export type ExpertisePiece =
  | { kind: "novelties"; columns: NoveltyPart[][]; continued: boolean }
  | { kind: "notes" }
  | { kind: "columns" }
  | { kind: "details"; rows: ExpertiseField[][]; withType: boolean; continued: boolean }
  | { kind: "annex"; photos: string[]; number: number; total: number };

export type ExpertiseSheet = ExpertisePiece[];

/** Un grupo de novedades, o el pedazo de uno que se partió entre columnas u hojas (`continued`). */
export type NoveltyPart = ExpertiseNoveltyGroup & { continued: boolean };
type Group = NoveltyPart;

function groupsHeight(groups: Group[]): number {
  return groups.reduce(
    (sum, group) => sum + NOVELTY.title + group.items.length * NOVELTY.item,
    0,
  );
}

function columnsHeight(columns: Group[][]): number {
  return Math.max(0, ...columns.map(groupsHeight));
}

/**
 * Llena columnas de arriba abajo con un presupuesto de alto por columna. Un grupo puede partirse
 * entre columnas (la segunda parte lleva "(cont.)"); con `allowSplit` falso solo se parte si no cabe entero.
 */
function fill(
  groups: Group[],
  budget: (column: number) => number,
  allowSplit = true,
): Group[][] {
  const minimum = NOVELTY.title + NOVELTY.item;
  const columns: Group[][] = [];
  let column: Group[] = [];
  let left = budget(0);
  const close = () => {
    columns.push(column);
    column = [];
    left = budget(columns.length);
  };

  for (const group of groups) {
    let items = group.items;
    let continued = group.continued;
    while (items.length > 0) {
      const whole = NOVELTY.title + items.length * NOVELTY.item;
      const full =
        column.length === 0
          ? left <= 0
          : left < minimum || (!allowSplit && left < whole);
      if (full) {
        close();
        continue;
      }
      const take = Math.max(1, Math.floor((left - NOVELTY.title) / NOVELTY.item));
      const chunk = items.slice(0, take);
      column.push({ title: group.title, continued, items: chunk });
      left -= NOVELTY.title + chunk.length * NOVELTY.item;
      items = items.slice(chunk.length);
      continued = true;
    }
  }
  if (column.length > 0) columns.push(column);
  return columns;
}

/** Une los pedazos de un mismo grupo que quedaron en columnas distintas. */
function mergeContinued(groups: Group[]): Group[] {
  return groups.reduce<Group[]>((merged, group) => {
    const last = merged[merged.length - 1];
    if (last && group.continued && last.title === group.title)
      merged[merged.length - 1] = { ...last, items: [...last.items, ...group.items] };
    else merged.push(group);
    return merged;
  }, []);
}

/** El menor alto por columna con el que todo cabe en 2 columnas (o `null` si ni con `limit`). */
function fitInTwo(groups: Group[], limit: number, allowSplit: boolean): Group[][] | null {
  for (
    let budget = Math.max(Math.ceil(groupsHeight(groups) / 2), NOVELTY.title + NOVELTY.item);
    budget <= limit;
    budget += 1
  ) {
    const columns = fill(groups, () => budget, allowSplit);
    const complete = columns.flat().length === groups.length;
    if (columns.length <= 2 && (allowSplit || complete)) return columns;
  }
  return null;
}

/** La última hoja de novedades se equilibra entre sus dos columnas, sin partir grupos si cuesta ≤ 2 filas. */
function balance(pair: Group[][], limit: number): Group[][] {
  const groups = mergeContinued(pair.flat());
  if (groups.length === 0) return pair;
  const split = fitInTwo(groups, limit, true);
  if (!split) return pair;
  const whole = fitInTwo(groups, limit, false);
  return whole && columnsHeight(whole) - columnsHeight(split) <= 2 * NOVELTY.item
    ? whole
    : split;
}

function chunk<T>(list: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let index = 0; index < list.length; index += size)
    chunks.push(list.slice(index, index + size));
  return chunks;
}

/** Líneas que ocupa un texto que se parte cada `perLine` caracteres. */
function lines(text: string, perLine: number): number {
  return Math.max(1, Math.ceil(text.length / perLine));
}

function notesHeight(report: ExpertiseReport): number {
  const text = report.observations || "Sin observaciones registradas en este peritaje.";
  return 38 + 51 + 35 + 15.4 + lines(text, 95) * 19.2;
}

function columnsBlockHeight(report: ExpertiseReport): number {
  const accessories =
    37 +
    38 +
    6.4 +
    35.5 +
    (report.accessories.length === 0
      ? 35
      : report.accessories.reduce(
          (sum, accessory) => sum + 20.6 + lines(accessory.description, 13) * 16,
          0,
        ));
  const values = 37 + 35.5 + report.values.length * 57.1;
  return Math.max(accessories, values);
}

export function paginateExpertise(report: ExpertiseReport): ExpertiseSheet[] {
  const sheets: ExpertiseSheet[] = [[]];
  let remaining = FIRST_SHEET;

  const current = () => sheets[sheets.length - 1];
  const isFresh = () => sheets.length > 1 && current().length === 0;
  const space = () => remaining - (current().length > 0 ? GAP : 0);
  const newSheet = () => {
    sheets.push([]);
    remaining = OTHER_SHEET;
  };
  const place = (piece: ExpertisePiece, height: number) => {
    remaining = space() - height;
    current().push(piece);
  };
  const placeWhole = (piece: ExpertisePiece, height: number) => {
    if (height > space() && !isFresh()) newSheet();
    place(piece, height);
  };
  /** Reparte filas de alto fijo entre hojas; cada trozo lleva su marco (título y relleno de la tarjeta). */
  const placeRows = <T>(
    rows: T[],
    metrics: { frame: (first: boolean) => number; row: number; gap: number },
    build: (rows: T[], first: boolean) => ExpertisePiece,
  ) => {
    let rest = rows;
    let first = true;
    while (rest.length > 0) {
      const frame = metrics.frame(first);
      const fit = Math.floor((space() - frame + metrics.gap) / (metrics.row + metrics.gap));
      if (fit < 1 && !isFresh()) {
        newSheet();
        continue;
      }
      const part = rest.slice(0, Math.max(1, fit));
      place(
        build(part, first),
        frame + part.length * metrics.row + (part.length - 1) * metrics.gap,
      );
      rest = rest.slice(part.length);
      first = false;
      if (rest.length > 0) newSheet();
    }
  };

  if (report.novelties.length > 0) {
    const firstBudget = Math.max(0, space() - NOVELTY.frame);
    const otherBudget = OTHER_SHEET - NOVELTY.frame;
    const groups: Group[] = report.novelties.map((group) => ({ ...group, continued: false }));
    const first = firstBudget >= NOVELTY.title + NOVELTY.item ? firstBudget : 0;
    const other = Math.max(otherBudget, NOVELTY.title + NOVELTY.item);
    const columns = fill(groups, (column) => (column < 2 ? first : other));
    const pairs = chunk(columns, 2);
    if (pairs.length > 0) {
      const last = pairs.length - 1;
      pairs[last] = balance(pairs[last], last === 0 ? first : other);
    }
    let continued = false;
    pairs.forEach((pair, index) => {
      if (index > 0) newSheet();
      if (pair.some((column) => column.length > 0)) {
        place(
          { kind: "novelties", columns: pair, continued },
          NOVELTY.frame + columnsHeight(pair),
        );
        continued = true;
      }
    });
  }

  placeWhole({ kind: "notes" }, notesHeight(report));
  placeWhole({ kind: "columns" }, columnsBlockHeight(report));

  placeRows(
    chunk(report.details, DETAILS.perRow),
    {
      frame: (first) => (first ? DETAILS.frameWithType : DETAILS.frameWithoutType),
      row: DETAILS.row,
      gap: 0,
    },
    (rows, first) => ({ kind: "details", rows, withType: first, continued: !first }),
  );

  placeRows(
    chunk(report.annexPhotos, ANNEX.perRow),
    { frame: () => ANNEX.frame, row: ANNEX.row, gap: ANNEX.gap },
    (rows) => ({ kind: "annex", photos: rows.flat(), number: 0, total: 0 }),
  );

  const annexCount = sheets.flat().filter((piece) => piece.kind === "annex").length;
  let number = 0;
  return sheets.map((sheet) =>
    sheet.map((piece) =>
      piece.kind === "annex" ? { ...piece, number: (number += 1), total: annexCount } : piece,
    ),
  );
}
