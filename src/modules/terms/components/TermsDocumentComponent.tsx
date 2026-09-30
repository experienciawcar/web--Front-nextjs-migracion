import { prepareBlogHtml } from "@/modules/blog/utils/content";
import LegalPanelComponent from "@/modules/shared/components/LegalPanelComponent";
import type { TermsDocument } from "@/modules/shared/types/terms";

/**
 * Documento legal dentro de `LegalPanelComponent`: el título
 * (`<h1>`, 44/54 medium) y, por cada bloque, una raya naranja corta con su subtítulo (`<h2>`,
 * 28/34 medium, en mayúsculas como lo escribe el backoffice) y el HTML del editor.
 *
 * El HTML se limpia con el saneador del blog (sin scripts ni `on*`) y se pinta con
 * `.terms-content` (globals.css).
 *
 * Diseño: captura del desktop 1920 del sitio anterior (sin Figma ni mobile): panel de x=312 a
 * 1608 pegado al navbar, relleno de 48, texto de 14/24 con 28 entre bloques.
 * TODO: pedir el diseño mobile.
 */
export default function TermsDocumentComponent({
  document,
}: {
  document: TermsDocument;
}) {
  return (
    <LegalPanelComponent>
      <h1 className="reveal text-[28px] leading-9 font-semibold text-black md:text-[46px] md:leading-[54px]">
        {document.title}
      </h1>

      <div className="mt-4">
        {document.sections.map((section) => (
          <section key={section.id}>
            {section.title && (
              <>
                <span
                  aria-hidden
                  className="mb-1 block h-[3px] w-14 bg-orange"
                />
                <h2 className="mb-6 text-[22px] leading-7 font-semibold text-black md:text-[28px] md:leading-[34px]">
                  {section.title}
                </h2>
              </>
            )}
            <div
              className="terms-content"
              dangerouslySetInnerHTML={{
                __html: prepareBlogHtml(section.html, section.title ? 2 : 1),
              }}
            />
          </section>
        ))}
      </div>
    </LegalPanelComponent>
  );
}
