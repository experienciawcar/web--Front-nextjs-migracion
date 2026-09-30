import LegalPanelComponent from "@/modules/shared/components/LegalPanelComponent";

/**
 * Página legal de texto fijo (política de privacidad, términos de comprador y de vendedor): dentro
 * de `LegalPanelComponent`, una raya naranja de 56 x 3 sobre el título (`<h1>`, 36/44 semibold,
 * tal cual viene escrito: los términos llegan en mayúsculas) y el texto legal con
 * `.terms-content` (globals.css), de 14/20 con 28 entre bloques. A diferencia de los documentos
 * dinámicos (`TermsDocumentComponent`), aquí la raya va ARRIBA del título.
 *
 * Diseño: capturas del desktop 1920 del sitio anterior (sin Figma ni mobile): raya 48 bajo el
 * navbar, título centrado 28 bajo la raya, primer párrafo 54 bajo el título.
 * El texto es estático, copiado de wcar.co.
 * TODO: pedir el diseño mobile.
 */
export default function StaticLegalPageComponent({
  title,
  html,
}: {
  title: string;
  html: string;
}) {
  return (
    <LegalPanelComponent className="md:pt-12">
      <span aria-hidden className="block h-[3px] w-14 bg-orange" />
      <h1 className="reveal mt-1 mb-[22px] text-[24px] leading-8 font-semibold text-black md:text-[36px] md:leading-[44px]">
        {title}
      </h1>
      <div
        className="terms-content terms-content-static leading-5!"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </LegalPanelComponent>
  );
}
