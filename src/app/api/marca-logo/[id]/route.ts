import { getBrandLogoSource } from "@/modules/catalog/services/brands";

/**
 * `GET /api/marca-logo/{id}`: el logo de una marca con una URL que no cambia. El backend entrega
 * URLs firmadas de GCS con una firma nueva en cada respuesta; el optimizador de imágenes de Next
 * cachea por URL, así que con esas cada logo se descargaba y se reescalaba de nuevo (~1 s cada
 * uno, y hay más de 40). Aquí se descarga una vez y se sirve con caché largo del navegador/CDN.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!/^\d+$/.test(id)) return new Response(null, { status: 400 });

  try {
    const source = await getBrandLogoSource(id);
    if (!source) return new Response(null, { status: 404 });

    const upstream = await fetch(source, { next: { revalidate: 60 * 60 * 24 } });
    if (!upstream.ok) return new Response(null, { status: 502 });

    return new Response(upstream.body, {
      headers: {
        "Content-Type": upstream.headers.get("content-type") ?? "image/png",
        "Cache-Control": "public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800",
      },
    });
  } catch (error) {
    console.error("No se pudo servir el logo de la marca:", error);
    return new Response(null, { status: 502 });
  }
}
