import Image from "next/image";

import arrowCircle from "@/modules/shared/assets/icons/arrow-circle.svg";
import ButtonComponent from "@/modules/shared/components/ButtonComponent";
import { ROUTES } from "@/modules/shared/constants/routes";

import type { FinancingProduct } from "../types/financing-product";

import iconCheck from "../assets/productos/icon-check-circulo.svg";

/** Ancho de la tarjeta en Figma: la cabecera se escala en `cqw` (1 % del ancho de la tarjeta). */
const CARD_WIDTH = 482;
const cq = (px: number) => `${((px / CARD_WIDTH) * 100).toFixed(3)}cqw`;

/**
 * Tarjeta de un producto de financiación (Credirápido, Credifácil): cabecera oscura
 * con el ícono, el nombre y el subtítulo, y debajo una lista de tres beneficios con
 * sus separadores y un botón.
 *
 * Figma (marcos 204:5654 y 204:5622): 482 x 489, borde de 1 px `gray` y esquinas de
 * 8; cabecera de 100 con `dark-gray` de fondo y un patrón de conchas al 5 % (tile de
 * 71 x 73 mostrado a 58,84 x 60,49, `patron-cabecera.png`; el PNG ya trae su 5 % de
 * alfa: en Figma la capa dice "opacidad 5 %" pero el render muestra las conchas a
 * +10/255 sobre el fondo, o sea solo el alfa del archivo; con las dos cosas juntas
 * no se verían) que un degradado de
 * `dark-gray` transparente a sólido (del x=116 al 51 % de sus 366 de ancho) tapa hacia
 * la derecha; el nombre de 36 (la primera parte en el color del acento y Bold, la
 * segunda en blanco y cursiva), el subtítulo de 20 SemiBold blanco, el ícono y, en la
 * esquina de la derecha, tres rayas de 2,2 px giradas 48,06° (`gray-light` en la
 * primera tarjeta y blanco en la segunda) que la cabecera recorta. Cuerpo blanco de
 * 389: tres filas con el ícono de check en círculo de 38 (`gray-dark`) y el texto
 * a 48 del borde de la fila, separadas por líneas de 1 px `gray` de 403, 20 arriba y
 * 20 abajo (la línea cae 19 debajo de la fila), y el botón `primary` con la flecha
 * en círculo en y=309 del cuerpo (409 de la tarjeta), a 40 del borde.
 *
 * La cabecera va en unidades `cqw` y la tarjeta es un contenedor (`container-type`):
 * a 482 de ancho 1cqw = 4,82 px y las medidas de Figma salen exactas; más angosta
 * (mobile) escala entera. El borde va en un `::after` para no restar ancho al
 * contenido (en Figma el borde entra en los 482). El cuerpo, en cambio, en mobile
 * deja de ser de tamaño fijo: las filas envuelven el texto y el botón sigue al
 * contenido. No hay diseño mobile.
 *
 * TODO: destino de los botones (hoy `ROUTES.contact`; en el sitio anterior eran
 * `<button>` que abrían un formulario).
 */
export default function FinancingProductCardComponent({ product }: { product: FinancingProduct }) {
  const { accent, iconBox, namePosition, subtitlePosition, linesPosition } = product;
  const accentText = accent === "orange" ? "text-orange" : "text-blue-neon";
  const linesColor = accent === "orange" ? "bg-gray-light" : "bg-white";

  return (
    <article className="relative w-full max-w-[482px] overflow-hidden rounded-lg bg-white [container-type:inline-size] after:pointer-events-none after:absolute after:inset-0 after:z-10 after:rounded-lg after:border after:border-gray xl:h-[489px] xl:w-[482px]">
      {/* ---------- Cabecera ---------- */}
      <header className="relative overflow-hidden bg-dark-gray" style={{ aspectRatio: `${CARD_WIDTH} / 100` }}>
        <div
          aria-hidden
          className="absolute inset-0 -right-5 -bottom-[7px] bg-[url('/assets/financiacion/productos/patron-cabecera.png')] bg-size-[58.84px_60.49px] bg-top-left"
        />
        <div
          aria-hidden
          className="absolute top-0 h-full bg-linear-to-r from-[rgb(30_30_30/0)] to-dark-gray to-[50.962%]"
          style={{ left: cq(116), width: cq(366) }}
        />
        <Image
          src={product.icon}
          alt=""
          aria-hidden
          className="absolute max-w-none"
          style={{ left: cq(iconBox.left), top: cq(iconBox.top), width: cq(iconBox.width), height: cq(iconBox.height) }}
        />
        <h3
          className={`absolute whitespace-nowrap ${product.nameClassName} ${accentText}`}
          style={{ left: cq(namePosition.left), top: cq(namePosition.top), fontSize: cq(36) }}
        >
          {product.nameLead}
          <span className={product.nameTailClassName}>{product.nameTail}</span>
        </h3>
        <p
          className="absolute leading-[normal] font-semibold whitespace-nowrap text-white"
          style={{ left: cq(subtitlePosition.left), top: cq(subtitlePosition.top), fontSize: cq(20) }}
        >
          {product.subtitle}
        </p>
        <div
          aria-hidden
          className="absolute flex items-center justify-center"
          style={{ right: cq(linesPosition.right), top: cq(linesPosition.top), width: cq(148.676), height: cq(136.276) }}
        >
          <div className="flex rotate-[48.06deg]" style={{ width: cq(18.636), height: cq(183.143), gap: cq(6) }}>
            <span className={`h-full flex-1 ${linesColor}`} />
            <span className={`h-full flex-1 ${linesColor}`} />
            <span className={`h-full flex-1 ${linesColor}`} />
          </div>
        </div>
      </header>

      {/* ---------- Cuerpo ---------- */}
      <div className="relative flex flex-col gap-5 px-6 py-8 xl:h-[389px] xl:px-10">
        {product.items.map((item, index) => (
          <div key={item.id} className="contents">
            <div
              className="flex items-start gap-[10px] xl:h-(--row-h)"
              style={
                {
                  "--row-h": `${item.rowHeight}px`,
                  "--text-top": `${item.textTop}px`,
                  "--icon-top": `${item.iconTop ?? 0}px`,
                } as React.CSSProperties
              }
            >
              <Image src={iconCheck} alt="" aria-hidden className="size-[38px] shrink-0 xl:mt-(--icon-top)" />
              <p className="min-w-0 font-medium text-dark-gray xl:mt-(--text-top) xl:whitespace-nowrap">
                <span className={item.mainClassName}>
                  {item.main.map((part) => (
                    <span key={part.text} className={part.className}>
                      {part.text}
                    </span>
                  ))}
                </span>
                {item.note && (
                  <span className={`block ${item.noteClassName ?? ""}`}>
                    {item.note.map((part) => (
                      <span key={part.text} className={part.className}>
                        {part.text}
                      </span>
                    ))}
                  </span>
                )}
              </p>
            </div>
            {index < product.items.length - 1 && (
              <span
                aria-hidden
                className="relative block h-0 w-full before:absolute before:inset-x-0 before:-top-px before:h-px before:bg-gray xl:w-[403px]"
              />
            )}
          </div>
        ))}

        <div className="mt-2 xl:absolute xl:top-[309px] xl:left-10 xl:mt-0">
          {/* TODO: destino del botón (ver el JSDoc). */}
          <ButtonComponent href={ROUTES.contact} icon={arrowCircle}>
            {product.buttonLabel}
          </ButtonComponent>
        </div>
      </div>
    </article>
  );
}
