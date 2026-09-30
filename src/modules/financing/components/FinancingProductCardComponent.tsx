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
 * En desktop la cabecera va en unidades `cqw` y la tarjeta es un contenedor
 * (`container-type`): a 482 de ancho 1cqw = 4,82 px y las medidas de Figma salen
 * exactas. El borde va en un `::after` para no restar ancho al contenido (en Figma
 * el borde entra en los 482).
 *
 * Teléfono (< 1280, "Frame 298" 204:7906 / "Frame 299" 204:7947 de "financiación -
 * 394"): tarjeta de 367 (13 px de margen a cada lado), sin borde, con cabecera de
 * 80 cuyas piezas van en px reales (`product.mobile`; el nombre a 24 y el subtítulo
 * a 14) y cuerpo de relleno 24 x 28, filas separadas por 16 con el check de 28 (el
 * texto a 4 de él, 16 px, y las notas a 12) y el botón a 16 de la última fila. Las
 * piezas de la cabecera reciben su posición de teléfono y de desktop en variables
 * CSS (`--m-*` y `--d-*`) y las clases eligen cuál usar según el ancho.
 *
 * TODO: destino de los botones (hoy `ROUTES.contact`; en el sitio anterior eran
 * `<button>` que abrían un formulario).
 */
/** Posición de teléfono (px) y de desktop (cqw) de una pieza de la cabecera, como variables CSS. */
function place(mobile: { left: number; top: number }, desktop: { left: number; top: number }) {
  return {
    "--m-left": `${mobile.left}px`,
    "--m-top": `${mobile.top}px`,
    "--d-left": cq(desktop.left),
    "--d-top": cq(desktop.top),
  } as React.CSSProperties;
}

const PLACE = "left-(--m-left) top-(--m-top) xl:left-(--d-left) xl:top-(--d-top)";

export default function FinancingProductCardComponent({ product }: { product: FinancingProduct }) {
  const { accent, iconBox, namePosition, subtitlePosition, linesPosition, mobile } = product;
  const accentText = accent === "orange" ? "text-orange" : "text-blue-neon";
  const linesColor = accent === "orange" ? "bg-gray-light" : "bg-white";

  return (
    <article className="relative mx-auto w-full max-w-[482px] overflow-hidden rounded-lg bg-white [container-type:inline-size] after:pointer-events-none after:absolute after:inset-0 after:z-10 after:rounded-lg after:border-gray xl:after:border xl:h-[489px] xl:w-[482px]">
      {/* ---------- Cabecera ---------- */}
      <header className="relative h-20 overflow-hidden bg-dark-gray xl:aspect-[482/100] xl:h-auto">
        <div
          aria-hidden
          className="absolute inset-0 -right-5 -bottom-[7px] bg-[url('/assets/financiacion/productos/patron-cabecera.png')] bg-size-[58.84px_60.49px] bg-top-left"
        />
        <div
          aria-hidden
          className="absolute top-0 left-[116px] h-full w-[366px] bg-linear-to-r from-[rgb(30_30_30/0)] to-dark-gray to-[50.962%] xl:left-(--d-left) xl:w-(--d-width)"
          style={{ "--d-left": cq(116), "--d-width": cq(366) } as React.CSSProperties}
        />
        <Image
          src={product.icon}
          alt=""
          aria-hidden
          className={`absolute h-(--m-height) w-(--m-width) max-w-none xl:h-(--d-height) xl:w-(--d-width) ${PLACE}`}
          style={
            {
              ...place(mobile.iconBox, iconBox),
              "--m-width": `${mobile.iconBox.width}px`,
              "--m-height": `${mobile.iconBox.height}px`,
              "--d-width": cq(iconBox.width),
              "--d-height": cq(iconBox.height),
            } as React.CSSProperties
          }
        />
        <h3
          className={`absolute text-[24px] whitespace-nowrap xl:text-(length:--d-size) ${PLACE} ${product.nameClassName} ${accentText}`}
          style={{ ...place(mobile.namePosition, namePosition), "--d-size": cq(36) } as React.CSSProperties}
        >
          {product.nameLead}
          <span className={product.nameTailClassName}>{product.nameTail}</span>
        </h3>
        <p
          className={`absolute text-[14px] leading-[normal] font-semibold whitespace-nowrap text-white xl:text-(length:--d-size) ${PLACE}`}
          style={{ ...place(mobile.subtitlePosition, subtitlePosition), "--d-size": cq(20) } as React.CSSProperties}
        >
          <span className="xl:hidden">{mobile.subtitle}</span>
          <span className="hidden xl:inline">{product.subtitle}</span>
        </p>
        <div
          aria-hidden
          className="absolute top-(--m-top) right-(--m-right) flex h-[136.276px] w-[148.676px] items-center justify-center xl:top-(--d-top) xl:right-(--d-right) xl:h-(--d-height) xl:w-(--d-width)"
          style={
            {
              "--m-top": `${mobile.linesPosition.top}px`,
              "--m-right": `${mobile.linesPosition.right}px`,
              "--d-top": cq(linesPosition.top),
              "--d-right": cq(linesPosition.right),
              "--d-width": cq(148.676),
              "--d-height": cq(136.276),
            } as React.CSSProperties
          }
        >
          <div
            className="flex h-[183.143px] w-[18.636px] rotate-[48.06deg] gap-[6px] xl:h-(--d-height) xl:w-(--d-width) xl:gap-(--d-gap)"
            style={{ "--d-width": cq(18.636), "--d-height": cq(183.143), "--d-gap": cq(6) } as React.CSSProperties}
          >
            <span className={`h-full flex-1 ${linesColor}`} />
            <span className={`h-full flex-1 ${linesColor}`} />
            <span className={`h-full flex-1 ${linesColor}`} />
          </div>
        </div>
      </header>

      {/* ---------- Cuerpo ---------- */}
      <div className="relative flex flex-col gap-4 px-6 py-7 xl:h-[389px] xl:gap-5 xl:px-10 xl:py-8">
        {product.items.map((item, index) => (
          <div key={item.id} className="contents">
            <div
              className="flex h-(--m-row-h) items-start gap-1 xl:h-(--row-h) xl:gap-[10px]"
              style={
                {
                  "--m-row-h": `${item.mobile.rowHeight}px`,
                  "--m-text-top": `${item.mobile.textTop}px`,
                  "--m-icon-top": `${item.mobile.iconTop}px`,
                  "--row-h": `${item.rowHeight}px`,
                  "--text-top": `${item.textTop}px`,
                  "--icon-top": `${item.iconTop ?? 0}px`,
                } as React.CSSProperties
              }
            >
              <Image
                src={iconCheck}
                alt=""
                aria-hidden
                className="mt-(--m-icon-top) size-7 shrink-0 xl:mt-(--icon-top) xl:size-[38px]"
              />
              <p className="mt-(--m-text-top) min-w-0 font-medium text-dark-gray xl:mt-(--text-top) xl:whitespace-nowrap">
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

        <div className="xl:absolute xl:top-[309px] xl:left-10">
          {/* TODO: destino del botón (ver el JSDoc). */}
          <ButtonComponent href={ROUTES.contact} icon={arrowCircle}>
            {product.buttonLabel}
          </ButtonComponent>
        </div>
      </div>
    </article>
  );
}
