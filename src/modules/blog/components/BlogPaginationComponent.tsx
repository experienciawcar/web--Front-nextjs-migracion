import Link from "next/link";

import { blogListHref } from "../utils/href";

/** Números de página con "…" cuando son muchas (hoy son 10). */
function buildPageList(page: number, numPages: number): (number | "ellipsis")[] {
  if (numPages <= 7) return Array.from({ length: numPages }, (_, i) => i + 1);

  const sorted = [...new Set([1, numPages, page, page - 1, page + 1])]
    .filter((p) => p >= 1 && p <= numPages)
    .sort((a, b) => a - b);

  const result: (number | "ellipsis")[] = [];
  sorted.forEach((p, index) => {
    if (index > 0 && p - sorted[index - 1] > 1) result.push("ellipsis");
    result.push(p);
  });
  return result;
}

/**
 * Paginación del listado con enlaces reales (`?page=N`, con la categoría si hay): se puede abrir
 * en otra pestaña y la ven los buscadores. Mismo aspecto que la del catálogo. Las flechas de los
 * extremos se apagan (no son enlaces) en la primera y la última página.
 */
export default function BlogPaginationComponent({
  page,
  numPages,
  tag,
}: {
  page: number;
  numPages: number;
  tag: string;
}) {
  if (numPages <= 1) return null;

  const arrowClass = "grid h-8 w-8 place-items-center rounded-[3px] bg-orange text-white";
  const cellClass = "-ml-px grid h-8 min-w-8 place-items-center border border-[#d9d9d9] px-2 text-body";

  const arrow = (target: number, label: string, path: string) =>
    target < 1 || target > numPages ? (
      <span aria-hidden className={`${arrowClass} bg-gray`}>
        <ArrowIcon path={path} />
      </span>
    ) : (
      <Link href={blogListHref({ page: target, tag })} aria-label={label} className={arrowClass}>
        <ArrowIcon path={path} />
      </Link>
    );

  return (
    <nav aria-label="Paginación del blog" className="mt-12 flex flex-wrap items-center justify-center gap-1">
      {arrow(page - 1, "Página anterior", "M20 12H4m0 0 6-6m-6 6 6 6")}
      <div className="flex flex-wrap items-center justify-center pl-px">
        {buildPageList(page, numPages).map((item, index) =>
          item === "ellipsis" ? (
            <span key={`ellipsis-${index}`} className={`${cellClass} text-orange`}>
              …
            </span>
          ) : (
            <Link
              key={item}
              href={blogListHref({ page: item, tag })}
              aria-current={item === page ? "page" : undefined}
              className={`${cellClass} ${item === page ? "bg-orange font-bold text-white" : "bg-white text-dark-gray"}`}
            >
              {item}
            </Link>
          ),
        )}
      </div>
      {arrow(page + 1, "Página siguiente", "M4 12h16m0 0-6-6m6 6-6 6")}
    </nav>
  );
}

function ArrowIcon({ path }: { path: string }) {
  return (
    <svg viewBox="0 0 24 24" className="size-5" aria-hidden>
      <path d={path} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}
