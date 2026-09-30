"use client";

import { useEffect, useReducer, useState } from "react";

import CarouselArrowsComponent from "@/modules/shared/components/CarouselArrowsComponent";

import {
  HERO_FADE_MS,
  HERO_SLIDE_SECONDS,
  HERO_TABS_TOP,
} from "../constants/hero-carousel";

/**
 * Colores de la barra de rótulos y de las rayas de mobile según lo que haya
 * detrás (ver `HeroSlide.tone`): el rótulo activo, los demás y la raya de cada
 * uno.
 */
const PAGER_TONES = {
  // Sobre gris claro; en el primer slide la cuña naranja pasa por debajo de los
  // rótulos de la derecha, por eso los apagados son `dark-gray` con opacidad (se
  // leen sobre el gris y sobre el naranja) y no el `gray` azulado.
  light: {
    active: "text-dark-gray",
    idle: "text-dark-gray/60",
    lineActive: "bg-orange",
    lineIdle: "bg-dark-gray/20",
  },
  dark: {
    active: "text-white",
    idle: "text-gray",
    lineActive: "bg-orange",
    lineIdle: "bg-white/25",
  },
} as const;

export type HeroSlide = {
  id: string;
  /** Nombre corto del slide, para el lector de pantalla. */
  label: string;
  /** Rótulo del slide en la barra de abajo: el título en negrita y, debajo, el subtítulo en cursiva. */
  tabTitle: string;
  tabSubtitle: string;
  /** Clases de fondo del slide (de borde a borde de la ventana). */
  background: string;
  /** Sobre qué fondo cae la barra de rótulos en este slide: `light` (gris claro) o `dark` (negro). */
  tone: keyof typeof PAGER_TONES;
  /** Lo mismo para las rayas de mobile, donde el fondo puede ser otro (el de Marcelo es gris azulado). */
  mobileTone: keyof typeof PAGER_TONES;
  /** El slide: arte, texto y todo lo que va dentro de su lienzo de 1440. */
  content: React.ReactNode;
  /** Lo que debe verse POR ENCIMA de la tarjeta de búsqueda (el jeep). Solo desktop. */
  foreground?: React.ReactNode;
  /**
   * TEMPORAL: quita este slide de la rotación y de las rayas SOLO en mobile
   * (`< md`); en desktop sigue intacto, con sus cuatro rótulos de siempre. Para
   * revertirlo, borrar esta propiedad (o ponerla en `false`) donde se use.
   */
  hiddenOnMobile?: boolean;
};

type State = { index: number; leaving: number | null };
type Action =
  | { type: "select"; index: number }
  | { type: "settled" }
  | { type: "jump"; index: number };

function reducer(state: State, action: Action): State {
  if (action.type === "settled")
    return state.leaving === null ? state : { ...state, leaving: null };
  // "jump": cambia de slide sin fundido ni dejar el anterior debajo (lo usa el
  // ajuste por `hiddenOnMobile`, para no fundir hacia/desde un slide que nunca
  // se vio en pantalla).
  if (action.type === "jump") return { index: action.index, leaving: null };
  return action.index === state.index
    ? state
    : { index: action.index, leaving: state.index };
}

/**
 * El banner del inicio como carousel: pasa solo de un slide a otro cada
 * `HERO_SLIDE_SECONDS` segundos (constante en `constants/hero-carousel.ts`), con
 * un fundido de `HERO_FADE_MS`, y trae una raya por slide para elegir uno.
 *
 * Los slides llegan ya pintados por el servidor (`slides[].content`) y aquí solo
 * se decide cuál se ve. Se apilan todos en la misma celda de una cuadrícula:
 * - El activo va encima, con opacidad 1; el que se va sigue debajo, opaco,
 *   mientras el nuevo se funde (si los dos fueran semitransparentes se vería un
 *   hueco a mitad del cambio).
 * - Los demás van `invisible` (y `inert`: sin foco ni clics ni lector de
 *   pantalla). En mobile siguen ocupando su sitio, así el alto del banner es el
 *   del slide más alto y no salta cada 10 s. En desktop el alto es fijo (740) y
 *   solo se muestran el activo, el que se va y el SIGUIENTE (`invisible`, para
 *   que el navegador vaya cargando sus imágenes con `loading="lazy"`); el resto
 *   va `display: none` y no descarga nada hasta que le toque.
 *
 * `foreground` es una capa aparte, `z-20`, con lo que debe verse encima de la
 * tarjeta de búsqueda (`z-10`, en `HeroSearchSectionComponent`): dentro de un
 * slide no podría, porque el slide tiene su propio fondo y su propio contexto de
 * apilado por debajo de la tarjeta.
 *
 * Se pausa con el mouse encima o el foco dentro, y no avanza solo si el sistema
 * pide "reducir movimiento" (ahí quedan las rayas, sin fundido).
 *
 * Tablet (`md` a `xl`, 768 a 1279; sin diseño propio): se ve la composición de desktop
 * con el lienzo de 1440 ESCALADO al ancho de la ventana (`--hero-s` = ancho / 1440, fijada
 * por JS aquí y con respaldo en globals.css): la caja de cada slide mide 740 x `--hero-s`, el jeep
 * (`foreground`) se escala igual, y la barra de rótulos baja a `HERO_TABS_TOP` x `--hero-s`
 * sin escalar sus letras (arranca donde arranca el arte y acaba donde acaba en desktop, para
 * no pisar las rayas cian). El fondo de cada slide es el gris de la página desde `md`
 * (`HeroComponent`). Desde `xl` no se toca nada; por debajo de `md`, el diseño mobile.
 *
 * Abajo, la barra de rótulos (desktop): flechas anterior/siguiente (que dan la
 * vuelta) y por cada slide su título, su subtítulo y una raya, alineada con la
 * tarjeta de búsqueda y a `HERO_TABS_TOP` del borde de arriba. Mobile (`< md`): cada
 * slide trae su propio diseño (`HeroSlide…MobileComponent`, todos de `HERO_MOBILE_HEIGHT`
 * de alto, así el banner no cambia de tamaño al rotar) y la barra de rótulos se
 * cambia por el título y el subtítulo del slide ACTIVO nada más (los cuatro no caben)
 * con su raya naranja, y a la derecha una raya corta por slide para elegir uno; 96 px
 * sobre el borde (la tarjeta de búsqueda se monta 64 px sobre el banner; si no, la
 * pisarían).
 *
 * `HeroSlide.hiddenOnMobile` (TEMPORAL): un slide con esa marca nunca se activa
 * en mobile (`< md`) — ni al rotar solo, ni con su raya, que tampoco aparece —
 * pero en desktop sigue intacto, con sus cuatro rótulos de siempre. Se resuelve
 * en JS (`mobileNarrow`, por `matchMedia`), no por CSS, para no dejar el banner
 * en blanco esperando a que rote solo; por eso en el primer pintado (antes de
 * que React monte los efectos) puede alcanzar a verse un instante ese slide en
 * mobile antes de saltar al siguiente.
 */
export default function HeroCarouselComponent({
  slides,
}: {
  slides: HeroSlide[];
}) {
  const count = slides.length;
  const [{ index, leaving }, dispatch] = useReducer(reducer, {
    index: 0,
    leaving: null,
  });
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const paused = hovered || focused;
  const next = (index + 1) % count;

  // TEMPORAL (`HeroSlide.hiddenOnMobile`): si la ventana es `< md`, se sabe
  // aquí para saltar esos slides al rotar y para corregir el índice si cae en
  // uno de ellos. Solo afecta mobile: en desktop `mobileNarrow` queda en
  // `false` y nada de esto se activa.
  const [mobileNarrow, setMobileNarrow] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(max-width: 767px)");
    const sync = () => setMobileNarrow(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  // Si el slide activo está marcado `hiddenOnMobile` y ya se sabe que la
  // ventana es mobile (al montar, o al achicarla desde desktop), se salta al
  // siguiente que no lo esté, sin fundido (`jump`). Cubre el único caso en que
  // `index` podría quedar en uno oculto: el estado inicial (0) o venir de
  // deskto con ese slide activo.
  useEffect(() => {
    if (!mobileNarrow || !slides[index]?.hiddenOnMobile) return;
    let target = index;
    for (let step = 0; step < count; step++) {
      target = (target + 1) % count;
      if (!slides[target]?.hiddenOnMobile) break;
    }
    if (target !== index) dispatch({ type: "jump", index: target });
  }, [mobileNarrow, index, count, slides]);

  // El slide que se fue sigue visible debajo lo que dura el fundido del nuevo.
  useEffect(() => {
    if (leaving === null) return;
    const timer = setTimeout(() => dispatch({ type: "settled" }), HERO_FADE_MS);
    return () => clearTimeout(timer);
  }, [leaving]);

  // Cambio automático. Depende de `index`: cada cambio, sea automático o por una
  // raya, reinicia la cuenta de los segundos.
  useEffect(() => {
    if (count < 2 || paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const timer = setTimeout(() => {
      let target = index;
      for (let step = 0; step < count; step++) {
        target = (target + 1) % count;
        if (!(mobileNarrow && slides[target]?.hiddenOnMobile)) break;
      }
      dispatch({ type: "select", index: target });
    }, HERO_SLIDE_SECONDS * 1000);
    return () => clearTimeout(timer);
  }, [index, paused, count, mobileNarrow, slides]);

  // Escala exacta del lienzo de 1440 en tablet (`--hero-s`, ver globals.css). El CSS ya la
  // calcula con `tan(atan2())`, pero no todos los navegadores lo entienden: aquí se fija con
  // un número, que entienden todos, y se mantiene al cambiar el tamaño de la ventana.
  useEffect(() => {
    const root = document.documentElement;
    const update = () =>
      root.style.setProperty("--hero-s", String(window.innerWidth / 1440));
    update();
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("resize", update);
      root.style.removeProperty("--hero-s");
    };
  }, []);

  const select = (target: number) =>
    dispatch({ type: "select", index: (target + count) % count });

  const state = (i: number) =>
    i === index
      ? "active"
      : i === leaving
        ? "leaving"
        : i === next
          ? "next"
          : "idle";
  const tone = PAGER_TONES[slides[index].tone];
  const mobileTone = PAGER_TONES[slides[index].mobileTone];

  return (
    <section
      aria-roledescription="carrusel"
      aria-labelledby="hero-title"
      className="relative overflow-x-clip bg-gray-light"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget))
          setFocused(false);
      }}
    >
      <div className="grid">
        {slides.map((slide, i) => {
          const s = state(i);
          return (
            <div
              key={slide.id}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} de ${count}: ${slide.label}`}
              inert={s !== "active"}
              className={`col-start-1 row-start-1 ${slide.background} ${
                s === "active"
                  ? "z-[1] opacity-100 transition-opacity duration-700 motion-reduce:transition-none"
                  : s === "leaving"
                    ? "opacity-100"
                    : s === "next"
                      ? "invisible opacity-0"
                      : "invisible opacity-0 md:hidden"
              }`}
            >
              {/* Tablet (`md` a `xl`): el lienzo de 1440 se dibuja escalado al ancho de la
                  ventana (`--hero-s`, ver globals.css) y su caja mide lo que mide ya
                  escalado. Desde `xl` no se toca nada. `--hero-bleed: 0`: los sangrados
                  a la ventana (`calc(50% - 50vw)`) no aplican con el lienzo entero a la vista. */}
              <div className="md:h-[calc(740px*var(--hero-s))] md:overflow-hidden xl:h-auto xl:overflow-visible">
                <div className="md:w-[1440px] md:origin-top-left md:transform-[scale(var(--hero-s))] md:[--hero-bleed:0] xl:w-auto xl:transform-none xl:[--hero-bleed:1]">
                  {slide.content}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {slides.map((slide, i) =>
        slide.foreground ? (
          <div
            key={slide.id}
            aria-hidden={i !== index}
            className={`pointer-events-none absolute inset-0 z-20 hidden md:block ${
              i === index
                ? "opacity-100 transition-opacity duration-700 motion-reduce:transition-none"
                : "opacity-0"
            }`}
          >
            <div className="relative h-[740px] w-[1440px] origin-top-left transform-[scale(var(--hero-s))] xl:mx-auto xl:h-full xl:w-auto xl:max-w-[1440px] xl:transform-none">
              {slide.foreground}
            </div>
          </div>
        ) : null,
      )}

      {/* Velo oscuro tras el rótulo de mobile: las fotos de los slides oscuros
          (`HeroSlide…MobileComponent`) llegan hasta el borde de abajo del banner sin
          ningún oscurecido ahí (Santander y Marcelo no traen ninguno; el de Colserauto
          no basta cerca del borde), así que el rótulo quedaba montado directo sobre la
          foto, sin contraste. Se soluciona centralizado aquí (no en cada slide) para que
          sirva igual si se agrega un slide oscuro nuevo. En el slide claro (el primero)
          no hace falta: el rótulo cae sobre el fondo gris liso, sin foto detrás. */}
      {slides[index].mobileTone === "dark" && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-[190px] md:hidden"
          style={{
            backgroundImage:
              "linear-gradient(to bottom, transparent, rgba(0,0,0,.75) 55%, rgba(0,0,0,.8))",
          }}
        />
      )}

      {/* Barra de rótulos (desktop): las flechas a la izquierda y, por cada slide,
          su título en negrita, su subtítulo en cursiva y una raya debajo (naranja
          la del que se ve). Cuatro rótulos de 179 con 49 entre ellos, desde x=234
          (medido en la referencia): acaban en x=1094, antes de las rayas cian de
          la esquina de los slides oscuros. Va justo bajo el arte y sobre la tarjeta
          de búsqueda, que baja lo que ocupa (ver `HeroSearchSectionComponent`). */}
      <div
        className="container-wcar absolute inset-x-0 top-[calc(var(--tabs-top)*var(--hero-s))] z-20 hidden md:block md:pl-[calc(124px*var(--hero-s))] xl:top-(--tabs-top) xl:pl-8"
        style={{ "--tabs-top": `${HERO_TABS_TOP}px` } as React.CSSProperties}
      >
        <div
          role="group"
          aria-label="Elegir banner"
          className="flex items-end gap-6 xl:gap-11"
        >
          <CarouselArrowsComponent
            canPrev
            canNext
            onPrev={() => select(index - 1)}
            onNext={() => select(index + 1)}
            className="mb-[-10px] ml-1 shrink-0"
          />
          <div className="grid min-w-0 max-w-[calc(863px*var(--hero-s))] flex-1 grid-cols-[repeat(4,minmax(0,179px))] gap-x-6 xl:max-w-none xl:flex-none xl:grid-cols-[repeat(4,179px)] xl:gap-x-[49px]">
            {slides.map((slide, i) => (
              <button
                key={slide.id}
                type="button"
                aria-label={`Ir al banner ${i + 1} de ${count}: ${slide.label}`}
                aria-current={i === index}
                onClick={() => select(i)}
                className="min-w-0 cursor-pointer text-left"
              >
                <span
                  className={`block truncate text-[14px] leading-6 font-semibold transition-colors xl:text-[16px] duration-300 motion-reduce:transition-none ${
                    i === index ? tone.active : tone.idle
                  }`}
                >
                  {slide.tabTitle}
                </span>
                <span
                  className={`block truncate text-[14px] leading-[22px] font-medium italic transition-colors duration-300 motion-reduce:transition-none ${
                    i === index ? tone.active : tone.idle
                  }`}
                >
                  {slide.tabSubtitle}
                </span>
                <span
                  aria-hidden
                  className={`mt-2 block h-[3px] w-full transition-colors duration-300 motion-reduce:transition-none ${
                    i === index ? tone.lineActive : tone.lineIdle
                  }`}
                />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Rótulo + rayas (mobile): el título y el subtítulo del slide ACTIVO (los
          mismos `tabTitle`/`tabSubtitle` de la barra de desktop, no los cuatro: no
          caben), con su raya naranja debajo, y a la derecha una raya corta por
          slide para elegir uno. Todo sobre el borde de la tarjeta de búsqueda (que
          se monta 64 px sobre el banner). */}
      <div className="container-wcar absolute inset-x-0 bottom-24 z-20 flex items-end justify-between gap-4 max-md:px-6 md:hidden">
        <div className="min-w-0">
          <p
            className={`truncate text-[14px] leading-5 font-bold ${mobileTone.active}`}
          >
            {slides[index].tabTitle}
          </p>
          <p
            className={`truncate text-[12px] leading-4 font-medium italic ${mobileTone.idle}`}
          >
            {slides[index].tabSubtitle}
          </p>
          <span
            aria-hidden
            className={`mt-1.5 block h-[3px] w-14 ${mobileTone.lineActive}`}
          />
        </div>

        <div
          role="group"
          aria-label="Elegir banner"
          className="flex shrink-0 gap-2"
        >
          {slides.map((slide, i) =>
            // TEMPORAL (`hiddenOnMobile`): sin raya aquí, así tampoco se puede
            // elegir a mano en mobile. El selector de desktop no filtra nada.
            slide.hiddenOnMobile ? null : (
              <button
                key={slide.id}
                type="button"
                aria-label={`Ir al banner ${i + 1} de ${count}: ${slide.label}`}
                aria-current={i === index}
                onClick={() => select(i)}
                className="flex h-6 w-6 cursor-pointer items-center"
              >
                <span
                  aria-hidden
                  className={`h-[3px] w-full transition-colors duration-300 motion-reduce:transition-none ${
                    i === index ? mobileTone.lineActive : mobileTone.lineIdle
                  }`}
                />
              </button>
            ),
          )}
        </div>
      </div>
    </section>
  );
}
