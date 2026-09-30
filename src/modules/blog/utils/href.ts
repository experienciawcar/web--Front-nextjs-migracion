/** Enlace al listado con su página y su categoría en la URL; sin ellas es `/blog`. */
export function blogListHref({ page = 1, tag = "" }: { page?: number; tag?: string } = {}): string {
  const query = new URLSearchParams();
  if (tag) query.set("tag", tag);
  if (page > 1) query.set("page", String(page));
  const text = query.toString();
  return text ? `/blog?${text}` : "/blog";
}
