/* eslint-disable @next/next/no-img-element -- SVG decorativo chico: next/image no optimiza SVG. */

/**
 * Banner naranja sobre el listado cuando el filtro activo es una categoría con contenido SEO
 * (hoy, Híbridos). Es el `<h1>` de la página en ese caso (ver `CatalogComponent`); las rayas
 * blancas de la derecha son decoración.
 */
export default function SeoBannerComponent({ title }: { title: string }) {
  return (
    <div className="relative mb-4 overflow-hidden rounded-lg bg-orange px-6 py-4 xl:mt-2">
      <h1 className="text-heading-1 font-normal text-white italic">{title}</h1>
      <img
        src="/assets/catalogo/seo/lines.svg"
        alt=""
        aria-hidden
        className="absolute inset-y-0 right-0 h-full"
      />
    </div>
  );
}
