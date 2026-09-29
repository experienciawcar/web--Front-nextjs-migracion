import type { Metadata } from "next";

import ProceduresComponent from "@/modules/procedures/components/ProceduresComponent";
import { buildPageMetadata } from "@/modules/shared/utils/seo";

// TODO(seo): confirmar con marketing la palabra clave. Título y descripción son los
// de la página del sitio anterior (wcar.co/tramites-de-vehiculos), que llevaba el
// año en el título ("… en 2026", con `new Date().getFullYear()`): aquí va sin él para
// que no envejezca.
export const metadata: Metadata = buildPageMetadata({
  title: "Trámites de vehículos | te ahorramos tiempo y dinero",
  description:
    "Realizamos todos tus trámites de vehículos al comprar o vender tu auto en Colombia, ahorramos tiempo y dinero en transacciones seguras para tu carro.",
  path: "/tramites-de-vehiculos",
});

/**
 * Vista Trámites de vehículos (`ROUTES.procedures`). Es la URL del sitio anterior
 * (wcar.co/tramites-de-vehiculos), que se conserva para no perder posicionamiento y
 * a la que ya apuntan el navbar y el footer.
 *
 * Diseño: dos capturas del desktop (1910 de ancho) de la página del sitio anterior
 * (el hero con la tarjeta y, más abajo, el acordeón y el recuadro negro); no hay
 * nodo de Figma ni diseño mobile. Las medidas salen del DOM de ese sitio medido con
 * Chrome (guía §12.17), los textos de su código y la foto de su carpeta de assets.
 *
 * No hay endpoint: los seis trámites y los datos del recuadro de asesoría son fijos
 * (`modules/procedures/constants/`), como en el sitio anterior.
 *
 * Está la única sección del diseño, con su foto. Faltan por agregar: el formulario o
 * modal de compra de "Compra tu seguro" y "Adquiere tu garantia" (en el sitio anterior
 * abrían un modal que llevaba a un pago en línea: hoy los botones van a destinos
 * provisionales) y el diseño mobile. El Navbar, el Footer y la pestaña "Contacta un
 * asesor" no van aquí: son globales y viven en el layout.
 */
export default function ProceduresPage() {
  return (
    <main className="flex-1">
      <ProceduresComponent />
    </main>
  );
}
