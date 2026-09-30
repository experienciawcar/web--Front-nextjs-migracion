/**
 * El HTML de un párrafo llega del editor del backoffice y se inyecta con
 * `dangerouslySetInnerHTML`. Es contenido de confianza (solo lo escribe el equipo), pero se le
 * quita lo que ejecutaría código y se convierten los videos incrustados por el editor
 * (`<oembed url="...">`) en un iframe, que es lo que el navegador entiende.
 */

const YOUTUBE_ID = /(?:youtu\.be\/|youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/))([\w-]{11})/;

/** URL de incrustación de un enlace de YouTube; `null` si no lo es. */
export function getYoutubeEmbedUrl(url: string): string | null {
  const id = YOUTUBE_ID.exec(url)?.[1];
  return id ? `https://www.youtube.com/embed/${id}` : null;
}

/**
 * Reasigna los encabezados del HTML para que cuelguen del título del párrafo (`titleLevel`: 2 o 3, o 1 si el párrafo no tiene título y cuelga del `<h1>`)
 * sin saltar niveles: el más alto que trae el editor pasa a ser el siguiente al del título y los
 * demás conservan su distancia ("h4" bajo un "h2" del editor queda dos niveles más abajo, no tres).
 */
function shiftHeadings(html: string, titleLevel: number): string {
  const levels = [...html.matchAll(/<h([1-6])[\s>]/gi)].map((match) => Number(match[1]));
  if (levels.length === 0) return html;
  const offset = titleLevel + 1 - Math.min(...levels);
  const shift = (level: string) => `h${Math.min(6, Math.max(1, Number(level) + offset))}`;
  return html
    .replace(/<h([1-6])(?=[\s>])/gi, (_m, level: string) => `<${shift(level)}`)
    .replace(/<\/h([1-6])>/gi, (_m, level: string) => `</${shift(level)}>`);
}

export function prepareBlogHtml(html: string, titleLevel: 1 | 2 | 3): string {
  return shiftHeadings(html, titleLevel)
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/\son\w+\s*=\s*("[^"]*"|'[^']*')/gi, "")
    .replace(/(href|src)\s*=\s*("|')\s*javascript:[^"']*\2/gi, "")
    .replace(/<oembed\s+url="([^"]+)"[^>]*>(?:<\/oembed>)?/gi, (_match, url: string) => {
      const embed = getYoutubeEmbedUrl(url);
      return embed
        ? `<div class="blog-video"><iframe src="${embed}" title="Video del artículo" loading="lazy" allowfullscreen></iframe></div>`
        : "";
    });
}

/** "wcar news" → "Wcar News" (la categoría llega en minúsculas). */
export function capitalizeWords(text: string): string {
  return text.replace(/(^|\s)\S/g, (match) => match.toUpperCase());
}
