"use client";

import { useState } from "react";

import { buildFilterSections, type FilterSectionsParams } from "./filterSections";

/**
 * Contenido del bottom sheet mobile: dos columnas, como el panel de Ajustes de iOS que describe
 * la referencia (`docs/planes/compra-tu-carro/diseno-filtros-laterales.md` §3) — pestañas de
 * categoría a la izquierda (130px, con scroll propio) y el filtro activo a la derecha (con su
 * propio scroll). Mismos filtros que el acordeón de desktop, de `buildFilterSections`: un solo
 * estado en `CatalogComponent`, solo cambia cómo se presentan.
 *
 * Sin envoltorio propio a propósito: `FilterBottomSheetComponent` es quien decide la altura del
 * bottom sheet y por lo tanto el `flex` que hace que las dos columnas puedan scrollear cada una
 * por su cuenta dentro de esa altura.
 */
export default function FilterTabsComponent(props: FilterSectionsParams) {
  const sections = buildFilterSections(props);
  const [activeId, setActiveId] = useState(sections[0]?.id);
  const active = sections.find((section) => section.id === activeId) ?? sections[0];

  return (
    <>
      <div className="w-[130px] shrink-0 overflow-y-auto bg-[#f7f8fa] border-r border-[#e5e7eb]">
        {sections.map((section) => (
          <button
            key={section.id}
            type="button"
            onClick={() => setActiveId(section.id)}
            aria-current={section.id === active?.id}
            className={`block w-full border-l-[5px] px-3 py-5 text-left text-[13.6px] ${
              section.id === active?.id ? "border-orange bg-white font-bold text-orange" : "border-transparent text-[#6b7280]"
            }`}
          >
            {section.title}
          </button>
        ))}
      </div>

      <div className="min-w-0 flex-1 overflow-y-auto p-5">
        <h2 className="mb-5 text-[17.6px] font-extrabold text-[#1f2937]">{active?.title}</h2>
        {active?.content}
      </div>
    </>
  );
}
