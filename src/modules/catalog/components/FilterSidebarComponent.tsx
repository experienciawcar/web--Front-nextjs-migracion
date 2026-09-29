import { buildFilterSections, type FilterSectionsParams } from "./filterSections";
import FilterAccordionComponent from "./FilterAccordionComponent";

/**
 * Sidebar de filtros (desktop): los doce filtros de `buildFilterSections`, cada uno en su
 * propio acordeón independiente (Precio y Kilometraje abiertos de entrada, el resto cerrado —
 * `defaultOpen` de cada sección). La versión mobile de estos mismos filtros, en pestañas de dos
 * columnas dentro de un bottom sheet, es `FilterTabsComponent` — mismos datos, otro layout.
 */
export default function FilterSidebarComponent(props: FilterSectionsParams) {
  const sections = buildFilterSections(props);

  return (
    <div className="flex flex-col">
      {sections.map((section) => (
        <FilterAccordionComponent key={section.id} title={section.title} defaultOpen={section.defaultOpen}>
          {section.content}
        </FilterAccordionComponent>
      ))}
    </div>
  );
}
