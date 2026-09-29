"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

import iconClose from "@/modules/shared/assets/footer/icon-close.svg";
import ButtonComponent from "@/modules/shared/components/ButtonComponent";
import { ROUTES } from "@/modules/shared/constants/routes";

import iconGoogleMaps from "../assets/intro/icon-google-maps.svg";
import iconClockOrange from "../assets/modal/icon-clock-orange.svg";
import iconPinOrange from "../assets/modal/icon-pin-orange.svg";
import iconWaze from "../assets/modal/icon-waze.svg";
import { formatDistance } from "../services/nearest-headquarters";
import type { Headquarters } from "../types/headquarters";

import HeadquartersGalleryComponent from "./HeadquartersGalleryComponent";
import HeadquartersNameComponent from "./HeadquartersNameComponent";

/**
 * Modal de una sede, el que abre el botón VER de cada tarjeta. Es un
 * `<dialog>` nativo con `showModal()`: el navegador da el foco atrapado, Esc
 * para cerrar, el fondo inerte y devuelve el foco al botón que lo abrió. Lo que
 * se agrega aquí: cerrar al pulsar fuera del contenido y el desenfoque del
 * fondo (`::backdrop`); el bloqueo del scroll de la página va en globals.css
 * (`body:has(dialog[open])`).
 *
 * Diseño (captura del modal a escala ~0.576, sin Figma ni diseño mobile; la
 * escala sale de igualar el título a 36px y la comprueban el interlineado de
 * 24 de la descripción y el ancho de sus líneas):
 * 1114 de ancho en total, con la galería a la izquierda (480, sin fondo: las
 * miniaturas quedan sobre el fondo desenfocado) y, a 20, un panel blanco de 614
 * con 24 de padding. En el panel: raya naranja de 48x4, marca y nombre de 36/44
 * en negrita, la descripción de 16/24, "Ubicación" y "Horario" (ícono naranja
 * de 20 + etiqueta de 14 en negrita naranja, y debajo el dato de 14), el mapa de
 * 96 de alto, los botones WAZE y Google Maps (de 276, con 16 entre ellos) y
 * SOLICITAR RESERVA a todo el ancho, con 16 de aire entre filas.
 * Si la sede no trae horario no se pinta ese bloque.
 *
 * - El mapa es el embebido de Google Maps por dirección (`output=embed`): no
 *   necesita clave y solo carga al abrir el modal, porque el contenido no se
 *   pinta hasta entonces. El del diseño está más alejado (se ve Bogotá y la
 *   Sabana); aquí va a zoom 14 para que el punto se lea en 96px de alto.
 * - Si se abrió con el botón del banner ("la sede más cercana"), una línea
 *   entre la raya y el título dice "Sede más cercana a ti · a 3,2 km". No está en
 *   el diseño: sin ella el usuario no sabría por qué se le abrió esa sede.
 * - Waze y Google Maps abren en otra pestaña (`newTab`) con la dirección
 *   (`mapQuery` si la sede lo trae).
 * - El icono de Waze es un dibujo propio parecido; falta el oficial.
 *   TODO: pedir a diseño el icono de Waze.
 * - TODO: confirmar a dónde lleva SOLICITAR RESERVA. Hoy va a `ROUTES.contact`.
 * - "Lunes a Sabado" (sin tilde) en el modal del diseño: aquí va con tilde, como
 *   en la tarjeta (es el mismo dato).
 *
 * Mobile: no hay diseño. Todo en una columna dentro de un modal que se
 * desplaza: la galería arriba (foto de 480:455 a todo el ancho) y el panel
 * blanco debajo. TODO: pedir el mobile.
 */
export default function HeadquartersModalComponent({
  headquarters,
  distanceKm,
  onClose,
}: {
  headquarters: Headquarters | null;
  /** Distancia a quien lo abrió por "la sede más cercana"; `null` si se abrió con VER. */
  distanceKm: number | null;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  // El estado manda: con una sede se abre y sin ella se cierra. Si el usuario
  // cierra con Esc, el evento `close` avisa al padre y el estado vuelve a null.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (headquarters && !dialog.open) dialog.showModal();
    else if (!headquarters && dialog.open) dialog.close();
  }, [headquarters]);

  const query = headquarters ? encodeURIComponent(headquarters.mapQuery ?? headquarters.address) : "";
  const label = headquarters ? `${headquarters.brand} ${headquarters.name}` : "";

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="headquarters-modal-title"
      onClose={onClose}
      // El diálogo ocupa toda la ventana y el contenido va centrado dentro
      // (`m-auto`): un clic en el hueco que rodea al contenido cierra.
      onClick={(event) => {
        if (event.target === event.currentTarget) event.currentTarget.close();
      }}
      // `open:flex` y no `flex`: un `display` fijo taparía el `display: none`
      // que el navegador le pone al diálogo cerrado.
      className="m-0 size-full max-h-none max-w-none overflow-y-auto bg-transparent p-4 backdrop:bg-black/50 backdrop:backdrop-blur-md open:flex xl:p-6"
    >
      {headquarters && (
        <div className="m-auto flex w-full max-w-[560px] flex-col gap-5 xl:max-w-[1114px] xl:flex-row xl:items-start">
          <div className="xl:w-[480px] xl:shrink-0">
            <HeadquartersGalleryComponent
              key={headquarters.id}
              photos={headquarters.gallery ?? [headquarters.photo]}
              label={label}
            />
          </div>

          <div className="relative min-w-0 flex-1 rounded-lg bg-white p-6 pt-7">
            <button
              type="button"
              aria-label="Cerrar"
              onClick={() => dialogRef.current?.close()}
              className="absolute top-2.5 right-4 grid size-10 cursor-pointer place-items-center rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange"
            >
              <Image src={iconClose} alt="" aria-hidden className="size-3.5" />
            </button>

            <span aria-hidden className="block h-1 w-12 bg-orange" />

            {distanceKm !== null && (
              <p className="mt-3 text-small font-bold text-gray-dark">
                Sede más cercana a ti · a {formatDistance(distanceKm)}
              </p>
            )}

            <h2
              id="headquarters-modal-title"
              className={`mt-[18px] text-[28px] leading-9 font-bold text-dark-gray xl:text-subheadline-1 xl:leading-11 ${headquarters.balanceTitle ? "text-balance" : ""}`}
            >
              <HeadquartersNameComponent
                brand={headquarters.brand}
                name={headquarters.name}
                inlineBrand={headquarters.inlineBrand}
              />
            </h2>

            <div className="mt-1.5 flex flex-col gap-3 text-body font-medium text-gray-dark">
              {headquarters.description.map((paragraph) => (
                <p key={paragraph.slice(0, 40)}>{paragraph}</p>
              ))}
            </div>

            <dl className="mt-12 flex flex-col gap-3 text-small font-medium text-gray-dark">
              <div>
                <dt className="flex items-center gap-2 font-bold text-orange">
                  <Image src={iconPinOrange} alt="" aria-hidden className="size-5" />
                  Ubicación
                </dt>
                <dd className="mt-2.5 leading-[22px]">{headquarters.address}</dd>
              </div>
              {headquarters.schedule && (
                <div>
                  <dt className="flex items-center gap-2 font-bold text-orange">
                    <Image src={iconClockOrange} alt="" aria-hidden className="size-5" />
                    Horario
                  </dt>
                  <dd className="mt-2.5 leading-[22px]">{headquarters.schedule}</dd>
                </div>
              )}
            </dl>

            <iframe
              title={`Mapa de ${label}`}
              src={`https://maps.google.com/maps?q=${query}&z=14&output=embed`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="mt-4 h-32 w-full rounded-lg border-0 bg-gray-light xl:h-24"
            />

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <ButtonComponent
                href={`https://waze.com/ul?q=${query}&navigate=yes`}
                newTab
                variant="cyan"
                size="medium"
                className="w-full max-w-none!"
              >
                <Image src={iconWaze} alt="" aria-hidden className="size-6" />
                WAZE
              </ButtonComponent>
              <ButtonComponent
                href={`https://www.google.com/maps/search/?api=1&query=${query}`}
                newTab
                variant="secondary"
                size="medium"
                className="w-full max-w-none! normal-case!"
              >
                <Image src={iconGoogleMaps} alt="" aria-hidden className="h-[17px] w-3" />
                Google Maps
              </ButtonComponent>
            </div>

            <ButtonComponent
              href={ROUTES.contact}
              size="medium"
              className="mt-4 w-full max-w-none! justify-center!"
            >
              SOLICITAR RESERVA
            </ButtonComponent>
          </div>
        </div>
      )}
    </dialog>
  );
}
