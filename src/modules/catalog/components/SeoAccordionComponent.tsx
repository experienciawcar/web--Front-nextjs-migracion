import Image from "next/image";
import Link from "next/link";

import { SEO_IMAGES_BASE } from "../constants/seo-categories";
import type { SeoCategoryKey, SeoItem } from "../types/seo";

/**
 * Acordeón "+" del contenido SEO, con `<details>` nativo: el texto está siempre en el HTML (lo
 * indexa Google aunque esté cerrado), abre con teclado y no necesita JS. `group` es el `name` que
 * comparten los `<details>` de una misma columna, para que abrir uno cierre el otro como en el
 * sitio anterior. Los títulos son `h2` (el `h1` es el banner o el de la variante).
 */
export default function SeoAccordionComponent({
  items,
  group,
  imagesDir,
}: {
  items: SeoItem[];
  group: string;
  imagesDir: SeoCategoryKey;
}) {
  return (
    <div className="h-fit border-t border-gray/40">
      {items.map((item) => (
        <details key={item.title} name={group} className="group border-b border-gray/40">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 marker:content-none [&::-webkit-details-marker]:hidden">
            <h2 className="text-body font-semibold text-dark-gray">{item.title}</h2>
            <svg
              viewBox="0 0 24 24"
              aria-hidden
              className="size-5 shrink-0 text-dark-gray transition-transform duration-200 group-open:rotate-45"
            >
              <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="none" />
            </svg>
          </summary>
          <div className="space-y-3 pb-6 text-body text-gray-dark">
            {item.paragraphs?.map((text) => <p key={text}>{text}</p>)}
            {item.bullets && (
              <ul className="list-disc space-y-1 pl-5">
                {item.bullets.map((text) => (
                  <li key={text}>{text}</li>
                ))}
              </ul>
            )}
            {item.link && (
              <p>
                <Link href={item.link.href} className="font-semibold text-orange hover:underline">
                  {item.link.label}
                </Link>
              </p>
            )}
            {item.image && (
              <Image
                src={`${SEO_IMAGES_BASE}/${imagesDir}/${item.image.file}`}
                alt={item.image.alt}
                width={300}
                height={200}
                sizes="300px"
                className="h-[200px] w-[300px] rounded object-cover"
              />
            )}
          </div>
        </details>
      ))}
    </div>
  );
}
