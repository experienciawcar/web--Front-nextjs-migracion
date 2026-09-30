import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";

import { getTermsDocument, termsPath } from "@/modules/shared/services/terms";
import { buildPageMetadata } from "@/modules/shared/utils/seo";
import TermsDocumentComponent from "@/modules/terms/components/TermsDocumentComponent";

type PageProps = { params: Promise<{ title: string; id: string }> };

function safeDecode(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

async function loadDocument({ params }: PageProps) {
  const { title, id } = await params;
  // Solo cuenta el `id`; un `id` que no es un entero deja la URL sin documento.
  if (!/^\d+$/.test(id)) return { document: null, requestedSlug: safeDecode(title) };
  return { document: await getTermsDocument(Number(id)), requestedSlug: safeDecode(title) };
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const { document } = await loadDocument(props);
  if (!document) return {};

  return buildPageMetadata({
    title: `${document.title} | WCAR`,
    description: `Lee el documento legal de WCAR: ${document.title}.`,
    path: termsPath(document.slug, document.id),
  });
}

/**
 * Documento legal dinámico (`/<slug>/<id>`, `docs/TERMINOS_Y_CONDICIONES.md`, mecanismo A): el
 * contenido sale de `GET /terms/<id>/` y el footer lista los enlaces. Es la ruta que el sitio
 * anterior resolvía con el comodín `/:title/:id`.
 *
 * Mejoras sobre el sitio anterior:
 * - Un id inexistente, inactivo o no numérico da 404 real (antes, pantalla en blanco).
 * - Un solo canonical: si el slug de la URL no es el del documento se redirige (308) al canónico.
 * - Se quitó el bloque `id == 63` oculto a mano: pertenece al término 30, que está dado de baja
 *   y por eso ya responde 404.
 *
 * Las rutas reales de dos segmentos (`/blog/<slug>`, `/compra-tu-carro/...`) son más específicas y
 * ganan a esta; aquí solo llega lo demás.
 */
export default async function TermsPage(props: PageProps) {
  const { document, requestedSlug } = await loadDocument(props);
  if (!document) notFound();

  if (requestedSlug !== document.slug) permanentRedirect(termsPath(document.slug, document.id));

  return (
    <main className="flex-1">
      <TermsDocumentComponent document={document} />
    </main>
  );
}
