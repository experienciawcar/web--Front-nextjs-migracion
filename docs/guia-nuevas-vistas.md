# Guía para integrar una vista nueva

Cómo pasar una vista del diseño a este proyecto sin repetir los tropiezos de "Sobre Nosotros" (`/about-us`, 10 secciones más navbar y footer, ~4.100 líneas). Está escrita con lo que pasó de verdad: cada regla existe porque su ausencia costó tiempo.

> El skill `nueva-vista` (`.claude/skills/nueva-vista/`) automatiza la parte pesada: copia aislada para probar, medición y capturas a varios anchos, y conversión de SVG de Figma con fotos a WebP. Esta guía es la referencia; el skill es el atajo.

---

## 0. En once líneas

1. **Antes de empezar, reúne los insumos** (§2). La mayor parte del tiempo perdido fue esperar o adivinar lo que no venía.
2. **Estructura por capas:** `types/` (DTO) → `services/` (fetch con `apiUrl`) → `components/`. La página solo compone secciones.
3. **Server Component por defecto.** `"use client"` solo para la interacción, en un archivo aparte que recibe datos por props.
4. **Lienzo de 1440 centrado; los fondos sangran** hasta el borde de la ventana. Nada posicionado en píxeles desde el borde izquierdo de la ventana (§4).
5. **Reutiliza antes de crear:** botones, flechas, carruseles, etiquetas laterales, rayas, zigzag (§3.2).
6. **Los botones son `ButtonComponent`**, sin excepciones.
7. **Fotos: WebP a ≤2× del tamaño en pantalla.** Los SVG de Figma con fotos incrustadas se convierten con `svg_a_webp.py`, nunca se suben tal cual (§6); si hay acceso a Figma, las fotos salen del MCP y las recortadas/espejadas se hornean con `figma_imagen.py` (§14).
8. **El texto del diseño se reproduce tal cual** (lorem, erratas) con un `TODO`; no se inventa copy ni datos (§9).
9. **Verifica con números**, a 1440, 1900 y 393 px, **en una copia aislada** (§7).
10. **Documenta en el componente** el nodo de Figma, las medidas y las decisiones, y deja los pendientes como `TODO`.
11. **SEO desde el principio, no al final** (§16): `title` y `description` propios, un solo `<h1>` con el tema de la página, `alt` en cada foto, enlaces por `AppLinkComponent`/`ROUTES`, canonical y Open Graph, y `auditar_seo.py` sin errores antes de dar la vista por terminada.

---

## 1. Cómo está armado

| Cosa | Dónde / cómo |
|---|---|
| Stack | Next **16.2** (App Router, **sin** `cacheComponents`), React 19, Tailwind **v4**, TypeScript estricto, pnpm |
| Antes de tocar Next | Leer la guía correspondiente en `node_modules/next/dist/docs/` (lo exige `AGENTS.md`: esta versión no es la que conoces) |
| Módulos | `src/modules/<vista>/{components,services,types,constants,assets,hooks}` y `src/modules/shared/…` para lo que sirve a varias vistas |
| Páginas | `src/app/<ruta>/page.tsx` **solo compone** secciones y trae los metadatos |
| Componentes | `NombreComponent.tsx` (PascalCase con sufijo `Component`) |
| Servicios y tipos | archivos en minúscula con guiones (`vehicle-types.ts`); DTO del backend `XDto`, tipo de vista `X` |
| Fotos | `public/assets/<vista>/<seccion>/nombre-descriptivo.webp` (se citan por ruta) |
| SVG e íconos | `src/modules/<modulo>/assets/<seccion>/` (se importan: `import icon from "./x.svg"`) |
| Comentarios | En español. Explican el **por qué**, el nodo de Figma, las medidas y las decisiones. `TODO:` para lo pendiente |
| Tokens | `src/app/globals.css` (`@theme`): colores (las variables de diseño: `orange` #FF8000, `orange-dark`, `yellow`, `blue-neon`, `dark-gray`, `gray-dark`, `gray`, `gray-light`; más `label-green` y `label-yellow`) y escala tipográfica; `container-wcar` y `button-shine` son `@utility` |
| Diseño | Figma "Wcar Website - 2026", fileKey `7ndc02TbteM7uS512k3nKS`. Desktop 1440 y mobile 393 |

Referencia de un módulo terminado: `src/modules/about/` (todas las secciones de Sobre Nosotros).

---

## 2. Antes de escribir código: qué pedir

Sin esto se trabaja de estimaciones y se rehace. Es **la mejora que más tiempo ahorra**.

- [ ] **Diseño desktop Y mobile** de cada sección (link de Figma con node-id, o capturas a 1440 y 393). Si falta mobile, se adapta con el criterio del resto de la página y se marca en el comentario.
- [ ] **Acceso al MCP de Figma** (cuenta con plan Pro: disenotec@wcar.co). Con él las medidas, los recortes de las fotos, las opacidades y **el copy exacto** se leen en vez de estimarse de una captura (§14). En Taller se había hecho todo de capturas y al llegar Figma hubo que corregir medidas de 1 a 4 px, el tamaño del h1, las tildes de dos palabras y la posición de una sección entera.
- [ ] **Estados que no se ven:** hover, abierto/cerrado, vacío, error, cargando.
- [ ] **Assets exportados correctamente:** las fotos como **PNG/JPG/WebP a 2×**, no como SVG; SVG solo para vectores (logos, íconos, formas). Si hay una foto recortada en Figma, exportar el marco ya recortado.
- [ ] **El endpoint completo** (URL) con un ejemplo de respuesta, y qué campo alimenta qué parte del diseño.
- [ ] **El copy final**, o la confirmación de que lo del diseño (lorem, "Mas" sin tilde, teléfonos de relleno) es provisional.
- [ ] **La intención de búsqueda de la vista** (qué escribiría alguien para llegar aquí: "taller de reacondicionamiento en Bogotá", "financiar carro usado") y, si marketing la tiene, el `title` y la `description` (§16.2). Sin ella se escriben desde el diseño y se deja `TODO(seo)`; no se inventa una palabra clave.
- [ ] **Referencia del sitio anterior** (`wcar.co`) si la vista existe allí: sirve para ver el render real y bajar assets públicos.
- [ ] **Componentes de la librería** que ya existan en el sitio anterior (botones, tarjetas): pedir su guía antes, no al final.

**Contrasta el diseño con el backend antes de maquetar:**

```bash
curl -s "$NEXT_PUBLIC_API_BASE_URL/partners/" | python3 -m json.tool | head -40   # campos reales, vacíos, cuántos hay
```

En este proyecto pasó tres veces que **diseño y datos no coincidían** y se descubrió tarde: el asesor no trae su sede (`/advisors/` vs `/sedes/`), el mockup mostraba 24 aliados y el API da 26, y las reseñas de `/map/` traen `time` en segundos. Un `curl` de un minuto lo evita.

---

## 3. Receta para una sección

### 3.1 Pasos

1. **Medir el diseño.** En una captura, la escala sale de una medida conocida (el contenedor mide 1192 px, la barra lateral 303). Convertir todo a px de diseño antes de escribir clases.
2. **Datos** (§5): DTO → servicio → tipo de vista.
3. **Componente servidor** con el encabezado y la estructura; **componente cliente** aparte solo si hay interacción (carrusel, pestañas).
4. **Maquetar** sobre el lienzo (§4) con los componentes compartidos (§3.2).
5. **Assets** (§6).
6. **Añadir a `page.tsx`** en el orden del diseño y actualizar la lista "Faltan por agregar".
7. **Verificar** (§7).
8. **Documentar** en el JSDoc del componente: qué nodo de Figma es, medidas clave, qué se decidió y por qué, qué se estimó (si se hizo desde captura) y los `TODO`.

### 3.2 Piezas compartidas (usar antes de crear)

| Necesito | Uso |
|---|---|
| Un botón o un enlace-botón | `ButtonComponent` (variantes `primary`, `secondary`, `tertiary`, `cyan`, `black`; `size="medium"`; `icon`; `shine`) |
| Un modal | `<dialog>` nativo con `showModal()` (foco atrapado, Esc, fondo inerte y devuelve el foco solos). Patrón de `headquarters/`: un `Provider` cliente guarda la sede abierta y pinta el modal; el botón que lo abre es un componente cliente mínimo y las tarjetas siguen en servidor. Ver `HeadquartersModalComponent` |
| "La más cercana a mí" | `services/nearest-headquarters.ts` (`findNearestHeadquarters`, Haversine, sobre `coordinates` de cada sede) + `NearestHeadquartersButtonComponent` (pide la ubicación, abre el modal, y si falla avisa con un enlace de respaldo). El proveedor del modal envuelve la página para que lo abran botones de secciones distintas |
| Un enlace a un mapa o app externa | `ButtonComponent` con `newTab` (abre en otra pestaña con `rel="noopener noreferrer"`) |
| Flechas anterior/siguiente | `CarouselArrowsComponent` |
| Un carrusel con scroll-snap | `useCarousel<T>()` → `[ref, carrusel]` (`position`, `positions`, `canPrev`, `canNext`, `prev`, `next`, `scrollToPosition`) |
| Un banner que rota solo (fundido, pausa con el mouse, barra de rótulos con flechas) | `HeroCarouselComponent` (`slides[]` con `content`, `background`, `tabTitle`, `tabSubtitle`, `tone`, `foreground`) y `constants/hero-carousel.ts` (`HERO_SLIDE_SECONDS`, `HERO_FADE_MS`, `HERO_BAND_END`: donde acaba la franja de color de todos los slides, `HERO_TABS_TOP`: donde arranca la barra). Los slides se apilan en una celda de cuadrícula (el alto no salta en mobile); solo se muestran el activo, el que se va y el siguiente en desktop, así el resto no descarga sus imágenes. Cada slide es un componente con su lienzo de 1440 (`HeroSlide…Component`, solo desktop) y otro para mobile (`HeroSlide…MobileComponent`, alto fijo `HERO_MOBILE_HEIGHT` en todos: si los diseños mobile miden distinto, el banner no puede cambiar de alto al rotar); el `<h1>` vive en el de desktop y el título mobile es un `role="heading" aria-level="1"` (un solo `<h1>` en el HTML). **Fotos con giro/recorte/ajustes que Figma NO exporta con alfa** (el export de un nodo girado sale con fondo blanco): tomar el PNG con transparencia del diseño (`get_design_context`) y hornear los colores con un ajuste polinómico contra el export desgirado (`figma_imagen.ajustar`); las piezas girables/volteadas de Figma, con `HeroSlideShapeComponent` |
| Un carrusel **infinito** (tras la última sigue la primera) | `useInfiniteCarousel<T>(count)` → `[ref, carrusel]` (`position`, `positions`, `side`, `looping`, `prev`, `next`, `scrollToPosition`; las flechas nunca se deshabilitan). La pista es un `<div relative>` con tres `<ul className="contents">` (el del medio es el real; los otros llevan `aria-hidden data-clon` y son los clones que pinta el componente con `carrusel.side`). Los clones solo existen tras hidratar (el HTML del servidor trae una lista) y el hook les quita el foco de teclado pero los deja clicables. Ejemplo: `FeaturedVehiclesCarouselComponent` |
| Título partido con barra negra | `SideLabelComponent` (segunda línea en cursiva con `italic`, o en negrita sin cursiva con `second`: "Taller / wcar") |
| Antetítulo (raya + texto) | `SectionEyebrowComponent` (raya de 115 px) o `InlineEyebrowComponent` |
| Icono + título + descripción | `FeatureCardComponent` (`titleItalic`: parte del título en cursiva y en su renglón; `tone="dark"` para fondos oscuros; `iconClassName` para cajas de icono de 48; `titleClassName`/`descriptionClassName` para las desviaciones puntuales) |
| Flechas + barra de progreso continua de un carrusel | `CarouselArrowsComponent` + `CarouselProgressComponent` (`position`, `positions`, `onSelect`; el color y el grosor de la pista y del tramo llegan por `trackClassName`/`activeClassName`). La barra es clicable: un botón invisible por posición. La usan Taller (oscuro) y los pasos de Financiación (claro); comprobado que extraerla no cambió a Taller (0,0 de diferencia entre capturas) |
| Numeración delante de un título ("1. Simulación") | `FeatureCardComponent` con `titleMarker="1."`: el número va a la derecha en un hueco de 33 px y el texto arranca siempre en el mismo sitio (con el número pegado al texto, "1. " es 4,5 px más angosto que "2. " y las palabras no alinean) |
| Estrellas de calificación | `StarRatingComponent` (solo llena y media; no hay vacía) |
| Logos blancos wcar y Santander, marca de agua "W wcar" | `shared/assets/hero/` (`logo-wcar-white.svg`, `logo-santander.png`, `watermark.svg`): los usan el hero de Sobre Nosotros y el de Sedes |
| Rayas diagonales / zigzag | `DiagonalLinesComponent` (`white`/`gray`), `ZigZagComponent` |
| Texto sobre una foto que no siempre es oscura ahí (un rótulo, una etiqueta) | Un velo `linear-gradient(to bottom, transparent, rgba(0,0,0,.75) 55%, rgba(0,0,0,.8))` detrás del texto, del tono del slide, no del texto mismo: así sirve para cualquier foto que venga después. No basta con mirar el render a ojo a baja resolución para confiar en que se lee: medir el color de fondo con PIL en el punto exacto del texto, antes y después |
| Una foto recortada a mano (por distancia de color) sale con un borde blanco/halo | El `export`/`download_assets` de un nodo con relleno de imagen sale COMPUESTO sobre blanco cuando ese nodo no tiene su propio alfa de capa, aunque el PNG original detrás (`rawImage`, no el `export`) SÍ tenga la silueta recortada con transparencia real (frecuente en fotos de personas ya editadas para no llevar fondo) | Comprobar el `rawImage` con PIL: si su `alpha` no es uniformemente 255, ya trae el recorte. `figma_imagen.py aplicar --alfa` (con el `imageTransform` de ese nodo, leído con `use_figma` de solo lectura) en vez de recortar el export a mano; de paso limpia el halo (ver la fila de abajo), así que no hace falta nada más |
| Un recorte con alfa real (`rawImage` de Figma, no compuesto a mano) SIGUE con un halo claro en el borde, sobre todo contra un fondo de color fuerte | El PNG trae, en los píxeles YA transparentes, el color del fondo de estudio que el editor recortó (alfa 0 pero RGB sin premultiplicar, con ese color de fábrica). `Image.transform`/`resize` (BICUBIC) y la compresión WebP mezclan un píxel con sus vecinos sin mirar el alfa: ese color se filtra al borde de la silueta | `figma_imagen.py aplicar --alfa` ya lo resuelve solo (extiende el color opaco hacia la zona transparente antes de recortar, sin tocar el alfa). Verificar contra el peor fondo real (no un gris neutro): un mismo halo pasa inadvertido en gris y se nota mucho contra naranja/color fuerte |
| Un adorno detrás de una foto no cuadra con sus coordenadas de Figma medidas en el render | Si el adorno queda casi tapado por lo que va delante (solo asoma alrededor de su silueta), lo que se ve en el render es la MEZCLA de los dos, no el adorno solo: sus coordenadas no se pueden leer directo de ahí | Reconstruir el contorno del adorno a partir de dónde aparece/desaparece su color en varias columnas/filas del render (`verificar-figma-contra-render`), no de la resta directa de coordenadas de página |
| Un elemento a ancho o alto fijo (px del diseño, ej. `w-[393px]`) dentro de un layout mobile fluido deja una tira del fondo a un lado, o se desborda en un teléfono más angosto | El diseño de Figma es de un ancho de mobile (393, 428…) pero los teléfonos reales varían (390 a 430+): un ancho en px, no en `%`/`w-full`, no se estira ni encoge con la ventana real | Medir a un ancho DISTINTO del de diseño (no solo al exacto), no solo a 393/1440/1900: si algo se ve mal ahí y bien a 393, es este caso. `w-full` (o `%`) para lo que deba llegar al borde; los `left-[Npx]` de un texto/logo alineado a la izquierda pueden quedarse fijos, no hace falta que sean fluidos |
| Un `w-full` ya puesto en el fondo de un slide mobile NO alcanza el borde en pantallas más anchas que el diseño (393-430) | El fondo (foto, tarjeta) estaba anidado DENTRO del mismo contenedor `max-w-[600px]` que el texto (para que el texto no se estire sin límite en una pantalla ancha): `w-full` ahí es 100% de ESE contenedor ya topado en 600, no de la ventana real. Pasado 600 quedan franjas del fondo del slide a los lados | Sacar del `max-w-600` lo que deba llegar al borde (foto, tarjeta, decoración) a un contenedor propio con `inset-x-0` (no anidado, 100% de la ventana); solo el TEXTO se queda en su columna centrada de hasta 600. Probar a un ancho intermedio real (600-760, no solo 393 y 1440) |
| Un patrón de teselas (arcos, puntos) o un degradado a blanco sobre las tarjetas | Tesela PNG en `public/assets/home/decor/` como `background-image` + `opacity` + `mask-image` para el desvanecido; opacidad y perfil **medidos** contra el export del nodo (`(claro - oscuro) / (claro - color de la tesela)` por franjas con PIL), no a ojo: el patrón de arcos sale al 7 % en el banner y al 10,5 % en la foto; el degradado de Destacados no es lineal (0 → 31 % → 72 % → 100 %) |
| Que un arte de Figma de 1440 ocupe TODO el ancho en pantallas anchas | Dejar el arte en su lienzo (`overflow-hidden`) y prolongar cada lado con elementos hermanos `left-full` / `right-full` de `w-[calc(50vw-50%)]`. Según qué haya en el borde: **color liso** si es liso; **la diagonal continuada** si una cuña llega al borde en diagonal (medir la pendiente en el export: en los slides es de 45°, `y = c - x`; el negro va de fondo y solo el triángulo de arriba, con `clip-path: polygon(0 0, 100% 0, 0 100%)`, conserva lo que hay sobre la diagonal); **la foto en espejo** (`-scale-x-100` de una copia de la capa de la foto, con `overflow-hidden` y un ancho tope) si es una foto con detalle, sin pasar de donde entraría un logo o una persona; y solo como último recurso **la columna de 1 px del borde del export** estirada (promedio de las últimas columnas, con los rayados sustituidos por el color de base): estirada en horizontal deja un codo donde acaba una diagonal y bandas si el borde cae en un objeto. Los rayados se continúan aparte con su fase (`(x_borde - x_inicio) mod 13` como `background-position`). **La marca de agua que empieza fuera del lienzo (`left-[-94px]`) va FUERA del `overflow-hidden` del arte**: dentro, el lienzo la corta aunque a la ventana le sobre espacio; fuera, solo la corta el borde de la ventana. Ejemplo: los slides de `HeroSlide…Component` |
| Un adorno que Figma corta con el marco (zigzag partido por la mitad) | Caja con `overflow-hidden` del ancho visible pegada al borde (`right-[calc(50%-50vw)]`) y la imagen entera dentro; si en Figma está volteado (su `x` cae fuera del marco), `-scale-x-100` |
| Enlace interno o externo | `AppLinkComponent` (elige `<Link>` o `<a>`) |
| Rutas | `ROUTES` en `shared/constants/routes.ts` (no escribir `"/contacto"` a mano) |
| Que algo **aparezca al hacer scroll** | La clase `reveal` en el elemento (`reveal reveal-left` de costado, `reveal reveal-fade` solo fundido). Nada más: `ScrollRevealComponent` (ya en el layout) y `useScrollReveal` lo hacen todo y las secciones siguen en servidor. Los componentes compartidos ya reciben `className`. Reglas en §3.4 |
| Acordeón | `<details name="…">` nativo con `group-open:` (como `FooterTermsComponent` y `ValuesComponent`); sin JavaScript. El "+"/"×" de la cabecera: SVG **en línea** (`fill="currentColor"`, ver `AccordionIconComponent` de Trámites), no `<Image>`. `FinancingFaqComponent` los trae con `loading="eager"` porque uno de los dos siempre está `display:none` y uno perezoso no se pediría hasta abrir; pero `next/image` con `eager` sale como `<link rel=preload>` en el `<head>` y compite con la foto del LCP (el auditor lo avisa). En línea no hay petición ni precarga |
| Correo, teléfono y dirección de WCAR | `CONTACT_INFO` y `CONTACT_MAPS_URL` en `shared/constants/contact.ts` (el footer todavía los repite literales) |
| Una pestaña fija al borde de la ventana con el texto girado | `ContactAdvisorTabComponent`: un `ButtonComponent` `cyan` girado 90° con `translate-x-[40%] rotate-90` (`translate` va antes de `rotate` en Tailwind, como `translateX() rotate()` en CSS) |

Si una pieza se repite en dos vistas y aún no está aquí, **sácala a `shared/`** en vez de copiarla.

### 3.3 Reglas de interacción que el usuario ya pidió

- **Los controles de un carrusel se ven siempre**, aunque haya pocos elementos, y deben funcionar. Con menos elementos de los que caben, se deja un hueco final (`after:w-[calc(100%-…)]`) para que el último llegue al borde y se pueda avanzar.
- **Todo centrado en pantallas anchas** (§4).
- **Una raya de paginación por posición**, y clicable.

### 3.4 Aparición al hacer scroll (`reveal`)

Cada elemento que debe entrar con un fundido y un ascenso corto la primera vez que se ve lleva la clase `reveal` (en un componente compartido, por su `className`). Modificadores, siempre junto a `reveal`: `reveal-left` / `reveal-right` (entra de costado: etiquetas sobre la barra negra, fotos de un lado) y `reveal-fade` (solo fundido: paneles y fotos de fondo). Los estilos están en `globals.css`; el resto (`useScrollReveal` en `shared/hooks/`, montado una vez en el layout por `ScrollRevealComponent`) escalona lo que entra en el mismo cuadro y vigila el DOM, así que también anima la página nueva de una navegación del cliente.

**Qué marcar**
- Antetítulos, títulos, párrafos, botones y columnas de texto; una tarjeta de una cuadrícula cada una (entran escalonadas por fila); las fotos.
- **El contenedor** de un carrusel de scroll horizontal, no cada tarjeta: el observador solo ve lo que asoma del contenedor y las tarjetas de fuera se quedarían ocultas hasta deslizar.
- **La tabla entera**, no cada celda: si se mueven las celdas, las líneas entre filas se despegan mientras animan (así van los aliados).
- Los paneles grandes con foto (columna naranja de Taller, foto de "Nuestros valores"), con `reveal-fade`.

**Qué no**
- Fondos, barras negras, rayados y cuadros de color: son la estructura y se quedan. (Durante el fundido lo semitransparente deja ver lo de detrás: una foto sobre la barra negra deja verla un momento, y es lo esperado.)
- Un elemento con su propio `transform` inclinado o su propio `transition` (`skew-*`, `transition-*`): el mío pisa el suyo. Márcalo por su contenedor. La opacidad propia (`opacity-90`) no molesta: termina en su valor.
- Nada `fixed` (la pestaña "Contacta un asesor").
- `reveal-left`/`reveal-right` solo donde a 2rem del borde de la pantalla haya sitio o el contenedor lleve `overflow-x-clip`: si no, la página desborda mientras está oculto.

**Cómo se comporta (para no sorprenderse)**
- **Lo que ya se ve al cargar, o al llegar a la página, no se anima**; lo de más abajo entra al bajar. Así no hay parpadeo, el contenido de arriba no espera a que hidrate el JavaScript y marcar el hero es inofensivo.
- Sin JavaScript, antes de hidratar, si el hook falla, con "reducir movimiento" o al imprimir, **no se oculta nada**: el estado oculto solo existe con `data-reveal-ready` en `<html>`, que pone el hook.
- Es de una sola vez. Tras un salto (fin de página, ancla) lo que se pasó de largo sigue oculto hasta que se sube y entra: el observador solo avisa de lo que cruza la pantalla.
- El estado (`data-revealed`) va en un atributo, no en una clase, para que un componente cliente que se vuelva a pintar con otro `className` no lo pise.

**Cómo se verifica.** La página, tras bajar por ella, debe quedar **idéntica al píxel** a la misma página sin ocultar nada, y no debe haber scroll horizontal con todo oculto: `scripts/comparar_reveal.py` (§7). Vale también para vistas de otros módulos: basta con que tengan la clase.

---

## 4. Maquetación

### 4.1 Los números

- Lienzos del diseño: **1440** (desktop) y **393** (mobile). El breakpoint de desktop es `xl` (1280).
- Contenido: `container-wcar` → 1192 px centrados con 32 px de margen lateral.
- Medir siempre a **1440**, **1900** (que se centre y nada quede pegado a la izquierda) y **393**.

### 4.2 El lienzo centrado y los fondos que sangran

El diseño está dibujado en px desde el borde izquierdo de 1440. Si se copian esos px como `left-0` o `pl-[435px]`, en una pantalla de 1900 esas piezas se pegan a la ventana mientras el resto se centra. **Receta:**

```tsx
<section className="relative overflow-x-clip">
  <div className="relative mx-auto xl:max-w-[1440px]">          {/* el lienzo: los px del diseño valen aquí */}
    {/* fondo que sangra a la IZQUIERDA (barra negra de 303px) */}
    <div aria-hidden className="absolute inset-y-0 hidden bg-dark-gray xl:left-[calc(50%-50vw)] xl:block xl:w-[calc(303px+50vw-50%)]" />
    {/* fondo que sangra a la DERECHA (panel gris que arranca en x=303) */}
    <div aria-hidden className="absolute inset-0 bg-gray-light xl:right-[calc(50%-50vw)] xl:left-[303px]" />

    <div className="container-wcar py-16 xl:pt-[…]">…</div>     {/* el contenido, sin `relative` (ver abajo) */}
  </div>
</section>
```

- `50%` (de un elemento posicionado en el lienzo) = medio lienzo; `50vw` = media ventana. Su diferencia es **cuánto sobresale el lienzo a cada lado**. En 1440 vale 0.
- `overflow-x-clip` en la sección: `100vw` incluye la barra de scroll y sin él el sangrado causa scroll horizontal. Hay que verificarlo (`overflowX` debe ser 0).
- **No pongas `relative` en el `container-wcar`** si dentro hay elementos `absolute` con medidas del lienzo: el contenedor tiene 32 px de padding y todo se correría. Sin `relative`, el absoluto mide contra el lienzo.
- Un elemento que lleva a un borde: `xl:mr-[calc(50%-50vw)]` (el padre debe medir el lienzo completo).

### 4.3 Mobile

Cuando el diseño mobile no existe (pasó en casi todas las secciones): panel gris a todo el ancho; la etiqueta lateral baja a título normal con raya naranja; `py-16` arriba y abajo; carruseles con `scroll-snap` y la siguiente tarjeta asomando (`-mr-8 pr-8`), **sin flechas**; columnas decorativas ocultas con `hidden xl:block` (así el navegador no descarga sus imágenes). Marcarlo en el comentario del componente.

### 4.4 Tailwind v4 (lo que ya mordió)

| Escribir | No escribir | Por qué |
|---|---|---|
| `w-[131.8%]!` | `!w-[131.8%]` | En v4 el `!` va al final; al principio **no falla, simplemente no aplica** |
| `bg-linear-to-t` | `bg-gradient-to-t` | Renombrado en v4 |
| `calc(50%-50vw)` | | Tailwind inserta los espacios solo |
| clases completas en el código | `` `col-start-${n}` `` | Tailwind solo ve cadenas literales: usar un mapa `{1: "col-start-4"}` |
| `[--shine-color:var(--color-orange)]` | | Variable CSS por elemento |
| `@utility nombre { … }` en `globals.css` | | Para CSS que no cabe en una clase (ver `container-wcar`, `button-shine`) |
| medidas en el contenedor del `<Image fill>` | `!` sobre el `<Image>` | `fill` inyecta `width`/`height`/`left` inline y le gana a las clases; mejor un contenedor posicionado con las medidas |
| `leading-9 xl:text-subheadline-1 xl:leading-11` | `leading-9 xl:text-subheadline-1` | `leading-9` fija `--tw-leading` en la base y le gana a la altura de línea que trae `xl:text-*`: en desktop queda 36 en vez de 44. Hay que repetir el `leading` en `xl:` |
| `className="max-w-none! normal-case!"` en un `ButtonComponent` | `max-w-none normal-case` | El botón ya trae `max-w-[180px]` (`medium`) y `uppercase`; sin `!` no se sabe cuál gana. Un pin a la izquierda del texto: pasar el `<Image>` como hijo (el `icon` del botón va a la derecha) |
| un componente que recibe `className` como el ÚNICO lugar donde fijar `position` (`absolute`/`fixed`/`sticky` del llamador) | poner `relative` fijo en el propio componente y esperar que el `absolute` del `className` lo pise | Dos utilidades de `position` en la misma cadena no se resuelven por orden de aparición en el string: gana la que Tailwind generó después en la hoja de estilos, que no es necesariamente la última que escribiste. Aquí `relative` (del componente) le ganó a `absolute` (del llamador) y la foto quedó con 0 de alto, sin salir del flujo. Arreglo: el `position` variable va SIEMPRE en el elemento externo (recibido por `className`, sin `relative` propio ahí); si hace falta `relative` para un `<Image fill>` de adentro, ponlo en un `<div>` interno aparte que no reciba esa prop |

Otros: `aspect-[a/b]`, `size-*`, `line-clamp-4`, `group-open:`, `first:`/`last:`, `scroll-pl-2`.

---

## 5. Datos

### 5.1 El patrón (todos los servicios lo siguen)

```ts
// types/x.ts
export type XDto = { id: number; nombre: string; imagen?: string | null };   // lo que manda el backend (campos usados)
export type X = { id: number; name: string; imageUrl: string | null };       // lo que necesita el componente

// services/x.ts
import { apiUrl } from "@/modules/shared/services/api";

const REVALIDATE_SECONDS = 60 * 60;

export async function getX(): Promise<X[]> {
  const url = apiUrl("/x/");                       // barra final: el backend es Django
  try {
    const response = await fetch(url, { next: { revalidate: REVALIDATE_SECONDS } });
    if (!response.ok) throw new Error(`GET ${url} respondió ${response.status}`);
    const items: XDto[] = await response.json();
    return items.map(toX);
  } catch (error) {
    console.error("No se pudo cargar X:", error);
    return [];                                     // la página no se cae; la sección no se pinta
  }
}
```

- **Una sola base URL:** `NEXT_PUBLIC_API_BASE_URL` (en `.env.local`, ya incluye `/api`), siempre vía `apiUrl(path)`. Si falta lanza a propósito (error de configuración, no de red).
- **El componente nunca ve el DTO.** El servicio normaliza: `trim()`, valores por defecto ("Asesor de ventas"), campos nulos, formatos (fechas en zona `America/Bogota`, segundos → `Date`).
- **Si el backend falla, la sección se oculta** (`if (items.length === 0) return null`).
- **Si falta un campo que el diseño necesita**, decláralo en el DTO como opcional con un `TODO` que diga que el backend aún no lo manda (así se hizo con `sede`). El front queda listo y se activa solo.
- **Nada de URLs del backend a mano.** Nada de `fetch` en componentes.

### 5.2 Caché y URLs firmadas

- Sin `cacheComponents`, `fetch(..., { next: { revalidate } })` vuelve la ruta **ISR**; el build lo muestra (`/about-us  1h  1y`).
- Las fotos del backend son **URLs firmadas de Google Cloud Storage que caducan a las 24 h** (`X-Goog-Expires=86400`). La página cacheada las lleva dentro: `revalidate` tiene que ser bastante **menor** a 24 h (1 h). Límite conocido: si la página se queda sin visitas más de 24 h, la primera visita recibe fotos caducadas mientras se regenera.
- Un servicio nuevo copia su propia constante `REVALIDATE_SECONDS` (así están todos hoy; ver §10 sobre un helper compartido).
- **`.next/cache/fetch-cache` persiste entre builds** y sirve datos viejos de la misma URL: bórralo al probar con datos falsos.

### 5.3 Imágenes remotas

- `next.config.ts` → `images.remotePatterns`, con `hostname` y **`pathname` específicos** del bucket (`/wcar-images/partners/**`). No abrir `**`.
- La carpeta del bucket puede tener erratas (`images-tpyes`): se copia tal cual.
- Fotos de terceros (avatares de Google): `unoptimized` + `referrerPolicy="no-referrer"`; se cargan directo y no hay que abrir su dominio.
- `sizes` siempre que se use `fill`, acorde a lo que mida de verdad la columna.

---

## 6. Imágenes

### 6.1 Reglas

- **WebP**, calidad 82, a **≤ 2× del tamaño en pantalla**. Nunca se amplía por encima del original.
- **Nombres descriptivos** en español y en minúscula: `fachada-sede-calle.webp`, no `unsplash_x2Tmfd1.svg`.
- **Los originales pesados no entran al repo** (un archivo de 30 MB en git queda en el historial para siempre): se apartan fuera del proyecto.
- **El degradado oscuro que Figma pone sobre una foto es una capa de diseño → va en CSS**, no horneado (`bg-linear-to-t from-black to-transparent`, `h-[23.4%]`, opacidad según Figma).
- `alt` descriptivo (o `""` si es puramente decorativa).
- **`sizes` = el ancho al que SE VE la foto**, no el de su caja: con `fill` + `object-cover` la foto se escala por el lado que más pide (una caja de 468 x 386 con una foto 3:2 la muestra a 579 de ancho; la de 380 x 380, a 571). Con el `sizes` de la caja se sirve una versión más chica y se ve blanda en pantallas 2×.
- `next/image` **no optimiza SVG**: un logo vectorial pesa poco, una foto en SVG no debe existir.

### 6.2 Convertir SVG de Figma con fotos incrustadas

Figma exporta las fotos como SVG con el PNG/JPEG **en base64 dentro** (1 a 30 MB) y un `transform` que hace el recorte. Además puede apilar capas ocultas (en "Nuestros valores" el SVG traía la foto de un repartidor de 8,6 MB completamente tapada por la de arriba).

```bash
S=.claude/skills/nueva-vista/scripts

# Una foto (o varias capas): saca la de arriba con el recorte exacto del diseño
python3 $S/svg_a_webp.py extraer public/assets/<vista>/<seccion>/*.svg --salida "$TMPDIR/salida" --ancho-max 1000 --hoja
# `--hoja` genera hoja-contacto.jpg para identificar las fotos y ponerles nombre

# Marco compuesto (fondo + foto + degradado + logo + texto): render con Chrome, sin los <path>
python3 $S/svg_a_webp.py renderizar marco.svg --salida panel.webp --sin-trazos --escala 2
```

El script avisa de: capas ocultas, fotos estiradas, degradados (con su % de alto y opacidad para el CSS), perfiles ICC, y de marcos compuestos. Con un marco compuesto: el logo va aparte como SVG propio y el texto como **texto real** (sus curvas dan el tamaño exacto: alto de mayúscula ÷ 0,7 ≈ `font-size`).

Si la foto se va a recortar con CSS en **otra proporción** (el marco del SVG es vertical y la tarjeta nueva es horizontal), o `extraer` dice "SIN FOTOS con patrón", o saca la foto equivocada, usa `originales`: guarda TODAS las fotos incrustadas de cada SVG, enteras y sin recorte (también las capas ocultas):

```bash
python3 $S/svg_a_webp.py originales a.svg b.svg --salida "$TMPDIR/orig" --ancho-max 800 --hoja
```

Mira la hoja de contacto antes de nombrar nada: **los nombres del sitio anterior engañan** (en `wcar.co/assets/headquaters/`, `vitrina-wcar.svg` trae encima la foto del café y la de la vitrina, oculta, debajo). Luego, para elegir el `object-position` de cada foto en su caja, `registrar_foto.py` (§12) contra la miniatura del diseño.

**Lo mejor es evitarlo:** pedir las fotos exportadas como imagen (§2).

### 6.3 Logos y fondos de la API

Los logos de aliados llegan como PNG de 150×150 con el logo centrado (algunos con fondo blanco opaco). Se pintan en una caja cuadrada con `object-contain`; se dejan 1 px de holgura respecto a la línea de la celda, o un logo con borde blanco la tapa.

---

## 7. Verificación (antes de dar algo por terminado)

1. `npx eslint src && npx tsc --noEmit`.
2. **Probar en una copia aislada, nunca con `next build` en la carpeta real.** En este repo trabajan varias sesiones y tu `next dev`, y **todos comparten `.next`**: un build pisa el que otro servidor sirve, el CSS responde 500 y la página sale sin estilos. Costó una hora creer que era un bug del componente.

   ```bash
   S=.claude/skills/nueva-vista/scripts
   $S/copia_aislada.sh start        # copia, compila y sirve en :3100; comprueba HTML y CSS = 200
   python3 $S/medir_seccion.py http://localhost:3100/about-us 'section[aria-labelledby="x-title"]' \
       --anchos 1440,1900,393 --cajas 'h2|ul > li:first-child' --salida "$TMPDIR/x"
   $S/copia_aislada.sh stop         # apaga SOLO su puerto y borra la copia
   ```

   Regla: **nunca `pkill -f next` ni matar puertos ajenos**. Solo lo que arrancaste tú.
3. **Comparar con números, no a ojo.** `medir_seccion.py` da las cajas (x, y, ancho, alto) para contrastarlas con las medidas del diseño, más el `overflowX` de la página (debe ser 0) y las imágenes cargadas/rotas. Si hay un export del frame de Figma: diferencia media por canal con PIL (un export propio debe dar < 1; contrastar contra esa referencia).
4. **Interacción real**, con `cdp.py` (`Input.dispatchMouseEvent` para hover): el brillo del botón, abrir/cerrar, flechas y rayas (`scrollLeft` cambia exactamente un paso), teclado, y `prefers-reduced-motion`.
   Si la vista usa `reveal` (§3.4): `python3 $S/comparar_reveal.py --base http://localhost:3100 /about-us /taller --anchos 1440,1900,393`. Sale con error si la página revelada no es idéntica a la de referencia o desborda mientras está oculta. En `next dev` usa `localhost`, no `127.0.0.1` (ver §8).
5. **Casos límite de los datos** con un servidor falso (`python3` + `NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:PUERTO/api npx next build` en la **copia**): campo nulo, texto larguísimo, sin foto, 1 elemento, 10 elementos, lista vacía. La API real casi nunca trae los casos raros (3 asesores, todos completos).
6. **Mirar la captura.** Los números no ven todo: un logo tapando una línea, una comilla pegada a las estrellas.
7. **SEO** (§16), con la copia levantada: `python3 $S/auditar_seo.py --base http://localhost:3100 /<ruta>`. Cero **errores**; los **avisos** se leen y se arreglan o se justifican; los **pendientes del sitio** (canonical, Open Graph, JSON-LD, 404 de enlaces) no son de la vista y van al reporte, salvo que ya exista lo que falta (entonces `--estricto`).

Checklist final: lint ✓ · tipos ✓ · 1440/1900/393 ✓ · `overflowX` = 0 ✓ · imágenes cargadas ✓ · interacción probada ✓ · datos límite probados ✓ · SEO (`auditar_seo.py` sin errores) ✓ · JSDoc con medidas y `TODO` ✓ · `page.tsx` actualizado ✓ · copia borrada ✓.

---

## 8. Trampas conocidas

| Síntoma | Causa | Arreglo |
|---|---|---|
| Página sin estilos, CSS 500 | Otro proceso compartía `.next` | Copia aislada (§7) |
| Datos de una prueba anterior tras un build | `.next/cache/fetch-cache` persiste | Borrarlo, o usar la copia |
| Estilo `!x` no aplica y no hay error | Tailwind v4: `!` va al final | `x!` |
| Las piezas se pegan a la izquierda en una pantalla ancha | px del diseño desde el borde de la ventana | Lienzo centrado (§4.2) |
| Scroll horizontal de unos píxeles | `100vw` incluye la barra de scroll | `overflow-x-clip` en la sección |
| Foto rota tras un día | URL firmada de 24 h caducada | `revalidate` de 1 h (§5.2) |
| Chrome headless a 393 se ve como 500 | Ancho mínimo de ventana | `cdp.py` → `viewport(393)` (CDP) |
| Captura con imágenes vacías | `loading="lazy"` sin haber llegado a ellas | Bajar por la sección antes de capturar (lo hace `medir_seccion.py`) |
| `react-hooks/refs`: "Cannot access refs during render" | Un hook devolvía un objeto con el `ref` y los datos juntos | Devolver `[ref, datos]` como tupla |
| `Parsing error: ')' expected` en un condicional | Comentario `{/* */}` como hijo directo de `&& ( … )` | Comentario `//` dentro del paréntesis, o mover el JSX |
| Un logo tapa la línea entre filas | Su borde es blanco opaco y la caja mide lo mismo que la celda | Caja 1–4 px menor que la celda |
| Un carrusel arranca con `scrollLeft: 8` | El `snap` alinea la tarjeta al borde y se come el relleno lateral | `scroll-pl-2` |
| Un SVG "con dos fotos" pesa el doble | Capa oculta debajo | `svg_a_webp.py` la detecta |
| En `zsh`, `echo =====` o `for x in "a b"` fallan | zsh expande `=` y no separa palabras | Comillas / arrays |
| `sed -i` falla en macOS | BSD sed exige un argumento de respaldo | `sed -i ''` |
| `pkill -f next` mata el `next dev` de otra persona | Coincide por texto | `lsof -ti :PUERTO | xargs kill` |
| La flecha/botón se ve mal de "deshabilitado" | `opacity` apaga también el icono blanco | Bajar solo el fondo (`disabled:bg-orange/30`) |
| `next/image` con `priority` sale como obsoleto | En Next 16 se llama `preload` (`priority` está deprecado) | `preload` solo en la foto candidata a LCP y solo si es una; si hay dos versiones (mobile/desktop) de la imagen, no |
| `window.open` no abre nada tras pedir la ubicación (o cualquier `await`) | Los navegadores solo dejan abrir ventanas dentro del gesto del usuario; la respuesta de `navigator.geolocation` llega después | Abrir algo de la propia página (un modal) y que el enlace externo sea un `<a>` real dentro; en el error, un mensaje con enlace, no `window.open` |
| `navigator.geolocation` no responde en local/producción | Solo funciona en HTTPS (o `localhost`); sin permiso, en headless responde `PERMISSION_DENIED` | Producción con HTTPS. Para probar: sustituir `navigator.geolocation.getCurrentPosition` por un stub desde CDP (posición, error 1/2/3) |
| Un `<dialog>` con `flex`/`grid` no se cierra | Un `display` fijo tapa el `display: none` que el navegador le pone al diálogo cerrado | `open:flex` (variante `open:`), no `flex` |
| La página de atrás se desplaza con el modal abierto | `<dialog>` no bloquea el scroll del `body` | `body:has(dialog[open]) { overflow: hidden }` en `globals.css` (ya está) |
| El clic en el fondo del modal no lo cierra | El `::backdrop` no es un elemento con el que se pueda hacer clic | El `<dialog>` ocupa toda la ventana (`size-full`, contenido con `m-auto`) y el `onClick` cierra si `event.target === event.currentTarget` |
| Un `<dialog>` a `size-full` deja un hueco (~38px en Chrome) entre el contenido y el borde real del viewport (ej. un bottom sheet anclado con `mt-auto` que no toca el fondo) | El user-agent stylesheet de `<dialog>` trae su propio `max-height` (algo como `calc(100% - 38px)`), que gana aunque `height`/`size-full` digan 100% | `max-h-none` además de `max-w-none` — filtro por `getComputedStyle(dialogEl).maxHeight` con CDP si vuelve a pasar |
| `text-balance` no hace nada | Solo aplica a un bloque, no a un `<span>` en línea | Ponlo en el `<h3>`/`<p>` (y solo donde el corte del diseño lo pide: en otro título el corte codicioso era el correcto) |
| Un fondo que "se ve" opaco pero la foto debería verse a través | Es una sombra (degradado a transparente) sobre blanco, no una barra | Perfil de brillo a lo largo de x contra la foto sin sombrear (§12) |
| `copia_aislada.sh start` deja sin servidor a otra sesión | Apaga lo que escuche en su puerto (3100) y borra su carpeta de copia (`$TMPDIR/wcar-copia`); otra sesión puede estar usando las dos | Antes: `lsof -iTCP -sTCP:LISTEN -P`. Si el 3100 está tomado: `WCAR_PUERTO=3140 WCAR_COPIA=<scratchpad>/copia` (y lo mismo en `stop`) |
| Un elemento `fixed` (pestaña, botón flotante) no sale en la captura de `medir_seccion.py` | La captura es un recorte de la sección, no de la ventana | `page.call("Page.captureScreenshot", format="png")` sin `clip` (captura la ventana) y recortar con PIL; la caja se lee con `getBoundingClientRect` |
| Una foto de fondo repetida muestra una costura a 1440 | Se repetía desde el borde de la ventana: a 1910 la costura cae bajo el panel, a 1440 queda fuera | Un fondo por lado, anclado al panel (§12.19) |
| Un panel o fondo `absolute` tapa el texto de su sección | Un elemento posicionado pinta por encima del contenido estático (texto, imágenes), aunque esté antes en el DOM | Subir el contenido con `relative z-10`, o mandar el fondo detrás con `-z-10` dentro de un lienzo `isolate`. Ojo con `isolate` si una foto de esa sección tiene que quedar por encima de una barra `z-10` de la sección anterior: dentro de un contexto propio el z-index deja de competir; con `relative z-10` en el contenido, a igual z-index gana la sección posterior |
| Todo se corre ~112 px hacia abajo al poner un `ZigZagComponent` | Trae `relative` propio: su `className` con `absolute` no le gana y ocupa su alto en el flujo | Envolverlo en un `<div className="absolute …">` |
| El ancho medido de un texto da un 9 % de más (o de menos) | El `<span>` de medida colgaba del `body` en vez del contenido | Medir dentro de `main`: `scripts/medir_texto.py` |
| Un texto de la captura "mide 107 px" y en realidad es de 181 | La caja de búsqueda o el predicado de color cortaron el texto | Caja de búsqueda ancha y, si un antetítulo se repite en dos capturas, comparar los dos antes de decidir el tamaño |
| `comparar_captura.py --origen -2.4,0` falla con "expected one argument" | argparse toma `-2.4` por una opción | `--origen=-2.4,0` |
| `medir_seccion.py` falla con "Cannot read properties of null" | Un selector de `--cajas` empieza por `section[...]`: se busca DENTRO de la sección | Selectores relativos a la sección (`h2`, `ul > li:first-child`) |
| El WebP de una foto que acabas de cambiar sigue viéndose viejo | El optimizador de imágenes de `next dev` cachea por URL (`url`, `w`, `q`), no por contenido | Verificar imágenes **solo en la copia aislada** (build de producción) o cambiar el nombre; nunca concluir "el ajuste de color no funciona" desde `next dev` |
| `copia_aislada.sh start` falla con `ENOSPC: no space left on device` | El disco de la máquina está al 100 % (pasó con 209 MiB libres; se liberó solo horas después) | Mirar `df -h /System/Volumes/Data`; mientras tanto medir contra el `next dev` del usuario (solo lectura) y volver a la copia cuando haya espacio. No borrar `.next` ni carpetas de otras sesiones |
| Un `<summary>` no responde a Enter/Espacio en una prueba con CDP | `Input.dispatchKeyEvent` con `rawKeyDown` no activa el elemento | `keyDown` con `text` y `unmodifiedText` (`"\r"` o `" "`) + `keyUp`; para teclear en un campo, `Input.insertText` |
| Un `<label>` con `display:flex` pierde el espacio entre su texto y un `<span>` (`Valor *`) | En un contenedor flex el texto va en un elemento anónimo y su espacio final se colapsa | Envolver todo en un `<span>` |
| Un elemento que ocupa dos filas del grid arrastra hacia abajo a lo que va debajo en la otra columna | El alto extra del elemento que abarca dos filas `auto` se reparte entre ambas | `grid-rows-[auto_1fr]` |
| El recorte de una foto se desalinea de la foto al agrandar la ventana | Dos `<Image>` con `object-cover` en cajas distintas escalan distinto | Un "escenario" con la proporción de la foto (`aspect-[…] w-full`, centrado con `grid place-items-center`, **sin `transform`**: crearía un contexto de apilamiento y el recorte ya no podría ir por encima de otra pieza) y las dos imágenes en % de él; ver `FinancingHeroComponent` |
| Un marco compuesto (panel con foto, logo y texto) no escala en mobile | Sus medidas están en px | `container-type: inline-size` en el panel y **todo en `cqw`** (px ÷ ancho × 100): a 568 px de ancho miden lo de Figma y más angosto escala entero |
| En `xl:h-(--x)` la altura no cambia por fila | La variable CSS se define solo si se pasa por `style` a cada fila | `style={{"--row-h": "60px"} as React.CSSProperties}` y `xl:h-(--row-h)` (Tailwind v4) |
| La foto de un hero sale ampliada 1,6× y borrosa | Un `absolute` con `left-[540px]` y `right-…` PERO con `w-full` heredado del base: con ancho explícito el `right` se ignora y la caja mide el 100 % | `xl:w-auto` junto al `xl:aspect-auto` (se llevó un rato porque las medidas del resto cuadraban) |
| Una capa de oscurecimiento sale más oscura de lo que dice el diseño | `bg-black/16` pone `background-color` y `xl:bg-[linear-gradient(…)]` pone `background-image`: se apilan | `xl:bg-transparent` en la primera (comprobado: 14/255 de diferencia contra el export → 4) |
| Un degradado a "transparente" de otro color se ve distinto al de Figma | Figma interpola sin premultiplicar y CSS sí | Paradas intermedias con el color y el alfa calculados (§14.7) |
| Contra el export de Figma, cada sección "está" 1, 2, 3… px más abajo | El export de un marco alto sale reducido a 4096 px de alto: su escala vertical es otra que la horizontal | Usar cada escala (`comparar_figma.py --alto-figma`) |
| Un nodo "en y=2031" está en 1921 | `x`/`y` de un nodo girado o volteado son su origen local, no su caja | Medirlo en el render contra el export |
| `figma_imagen.py --transform -1.04,…` falla con "expected one argument" | argparse toma el «-» por una opción | `--transform=-1.04,…` (igual que `--origen=`) |
| Las tarjetas de un carrusel con `reveal` quedan ocultas hasta deslizar | El observador solo ve lo que asoma del contenedor con `overflow` | `reveal` en el contenedor del carrusel, no en cada tarjeta (§3.4) |
| Con la aparición activa las líneas entre celdas de una tabla se despegan | Cada celda se mueve por su lado mientras anima | `reveal` en la tabla entera, no en las celdas |
| Un elemento con `reveal` pierde su hover o su inclinación | El `transition` / `transform` de `reveal` pisa al suyo (va sin `@layer` para ganarle a `opacity-*`) | Marcar su contenedor (§3.4) |
| Tras saltar al final de la página, lo de en medio sigue oculto | `IntersectionObserver` solo avisa de lo que cruza la pantalla | Es lo esperado: se anima la primera vez que se ve, al subir |
| En `next dev`, con `http://127.0.0.1:3000`, la página no hidrata (no arranca ni el hook ni nada cliente) y no hay error | Next 16 bloquea los recursos de dev de orígenes distintos de `localhost` | Probar en `http://localhost:3000` |
| El título de un `<h1>`/`<h2>` sale pegado en el HTML ("mas segurode colombia", "wcarPunto de Venta") | Un `<span className="block">` parte el renglón en pantalla, pero entre los dos textos no hay espacio: quien lee el HTML sin CSS los ve unidos (el `<br/>` no tiene este problema) | Un espacio real antes del span: `mas seguro{" "}<span className="block">…`. `auditar_seo.py` los lista |
| El `openGraph` (o el `robots`) de una página borra el del layout | Next mezcla la metadata **superficialmente**: un objeto anidado que defina la página reemplaza al del layout entero (se pierde la imagen) | Repetir lo compartido con un spread: `openGraph: { ...openGraphBase, title, url }` |
| `next build` falla por un `canonical` u `og:image` "relativos" | Una ruta relativa en la metadata necesita `metadataBase` en el layout raíz | Definir `metadataBase` una vez (§16.3); no escribir el dominio a mano en cada página |
| En zsh, `grep -r … --include=*.tsx` dice "no matches found" y no busca nada | zsh expande el `*` antes de pasárselo a grep | `--include='*.tsx'` entre comillas (y `find … -name '*.tsx'`) |
| Comandos que siguen a un `cd` fallan con "No such file or directory: src" | El shell de la sesión conserva el `cd` de la llamada anterior (pasó tras entrar a `node_modules/next/dist/docs`) | Rutas absolutas, o `cd` a la raíz al principio de cada comando |
| Dos capturas de la MISMA página difieren en una franja de ~15 px del final a 1900 (Sobre Nosotros), la mitad de las veces | Los enlaces legales del footer pintan distinto de una carga a otra; se reproduce sin `reveal` de por medio | `comparar_reveal.py` lo cuenta aparte y solo avisa. Si una diferencia cae en `main`, esa sí es de `reveal` |
| Una tarjeta que se monta sobre el hero (margen negativo) lo deja cortado en seco: la cuña naranja acaba en el borde de la tarjeta y no se ve a su lado, y el jeep queda detrás | El `-mt-*` del hijo colapsa a través del contenedor padre (sin padding ni borde) y lo sube con su fondo gris, que tapa el hero | `flow-root` en el contenedor con el fondo (el gris arranca donde acaba el hero) y `z-*` mayor que el de la tarjeta en lo que debe verse encima (el jeep). Ojo: si ese elemento vive dentro de algo con fondo propio, `opacity` < 1 o `z-*` (un slide de carousel, por ejemplo), queda atrapado en su contexto de apilado y no sube: sácalo a una capa aparte del padre (`foreground` de `HeroCarouselComponent`) Se ve en píxeles: una columna a la derecha de la tarjeta debe seguir naranja |
| "No space left on device" al guardar capturas de página completa | El disco estaba al 100 % y un PNG de 1440 × 8700 pesa decenas de MB | `comparar_reveal.py` compara por franjas y en memoria; en tus scripts, no guardes lo que no vas a mirar |

---

## 9. Decisiones de contenido

- **Se reproduce el diseño, con `TODO`.** Lorem ipsum, "Mas" sin tilde, "automotris", comillas sin cerrar, "CONTÁCTA": se dejan como están y se marcan `TODO: confirmar con diseño`. No se corrige en silencio ni se inventa copy: si diseño escribió un error, es decisión suya.
- **Datos de relleno, jamás como si fueran reales.** Un teléfono de ejemplo no se convierte en enlace `tel:`.
- **Sin diseño para un estado, solución provisional marcada** con `TODO` y con lo mínimo (menú móvil abierto, panel de ciudad).
- **Cuando el diseño y el backend no coinciden, manda el backend**, y se deja escrito en el comentario.
- **No inventar copy propio:** el antetítulo que escribí a ojo ("Asesores wcar") resultó ser lorem en el diseño. Si no se lee, se pregunta o se marca.
- Hoy hay **30 `TODO`** abiertos: contenido (10), diseño por confirmar (6), diseño inexistente (4), imágenes (4), backend/funcionalidad (6). Se revisan con `grep -rn TODO src`.

---

## 10. Cómo hacerlo más rápido y fácil (recomendado)

En orden de retorno:

1. **Insumos completos** (§2). Es lo que más pesa: casi todas las vueltas de esta vista vinieron de algo que faltaba (mobile, un SVG, la URL del endpoint, la guía de botones al final, la relación asesor-sede).
2. **Autorizar el MCP de Figma** (cuenta Pro: `disenotec@wcar.co`; `efuentes@` es Starter, 20 llamadas al mes). Sin él, en sesiones no interactivas se trabaja de capturas y las medidas son estimadas. Se autoriza con `/mcp` en una sesión interactiva.
3. **Extraer lo que se repite a mano** (hoy se copia en varias secciones):
   - **`SectionCanvasComponent`**: el lienzo centrado + `overflow-x-clip` + la receta del sangrado (5 copias).
   - **`SideBarComponent`**: la barra negra lateral con sus rayas (3 copias: página, "Nuestra huella", "Testimonios").
   - **`fetchList<T>` + `REVALIDATE_SECONDS` compartidos** en `shared/services/api.ts` (5 servicios repiten el `fetch`, el `ok` y el `.json()`).
4. **Exportar fotos como imagen, no como SVG** desde Figma: elimina el paso de extracción.
5. **Tests visuales** (Playwright, cuando el sandbox lo permita): hoy la verificación es con scripts propios.
6. **Cerrar los `TODO`** con diseño/backend: cada uno es una pregunta abierta que reaparecerá.

---

## 11. Lecciones de "Sobre Nosotros"

Lo que más costó, y cómo se evita ahora:

| Qué pasó | Costo | Cómo se evita |
|---|---|---|
| Diseñado en px desde el borde izquierdo | Toda la vista pegada a la izquierda en pantallas anchas; rehacer barra, paneles y hero | Lienzo centrado desde el primer día (§4.2) |
| Sin acceso a Figma, todo desde capturas | Medidas estimadas; varias correcciones de ±5 px | Autorizar el MCP; pedir frames |
| Fotos como SVG de 30 MB | Un paso entero de extracción a mano | `svg_a_webp.py`; exportar como imagen |
| El diseño mostraba datos distintos a los del API | Sedes sin pestañas, aliados 24 vs 26 | Contrastar con `curl` antes de maquetar |
| La guía de botones llegó al final | Dibujé a mano la "marca" de la esquina, que era la animación de brillo | Pedir las guías de la librería primero |
| Ocultar los controles "cuando todo cabe" | El usuario pidió verlos siempre | Regla §3.3 |
| Builds en la carpeta compartida | CSS 500 y una hora perdida | Copia aislada (§7) |
| Copy inventado por mí | Un antetítulo que era lorem | §9 |
| Comprobar a ojo | Líneas tapadas por logos, un carrusel arrancando en `scrollLeft: 8` | Medir con números (§7) |

---

## 12. Cuando solo hay una captura (sin Figma)

Aprendido en "Nuestras Sedes" (primera sección, todo desde una captura del desktop). Todo esto se hizo con números en vez de a ojo, y la diferencia media contra la captura quedó en 1,9/255 en el texto y 1,6 en las líneas.

1. **Calibrar la captura.** Escala = ancho del marco ÷ 1440; origen = borde izquierdo del marco. Compruébalo con dos medidas conocidas (contenedor 124…1316, barra lateral 303). Si dos elementos independientes caen en 122 y no en 124, el origen está corrido ~2 px: no es el diseño.
2. **Los colores de la captura no son los hex.** El `#FF8000` del logo se ve `255,113,42`. Para saber qué hex es un elemento, compáralo con un asset de la misma captura cuyo hex se conoce (el SVG del logo): si se ven igual, es el mismo hex. Nunca copies el RGB de la captura. (Los tokens ya son los de diseño: `orange` = `#FF8000`, así que el logo, los botones y las rayas se ven iguales.)
3. **Fotos: escala y recorte por correlación**, no a ojo:
   ```bash
   python3 $S/registrar_foto.py captura.png foto.webp --origen 4.4,6 --escala 0.7119 \
       --region 700,10,1290,290 --k 0.7,1.0 --ancla-derecha 1440
   ```
   Da `k`, el tamaño mostrado y `left`/`top`. Con eso: `object-cover` en una caja del tamaño del recorte y `object-position` `y% = -top / (alto_mostrado - alto_caja)`. Una correlación > 0,9 es un buen registro. Toma una región sin logos ni degradados.
4. **Tamaño de fuente por ancho natural.** Mide, con un `<span>` oculto en la página, el ancho de la primera línea de un párrafo a 14, 15 y 16 px: debe caber en la columna y **no** caber con la palabra siguiente. (A 16 px el párrafo salía en 6 renglones y el diseño tenía 5: era de 14 px con interlineado de 24.) Igual para el peso de un título en cursiva.
5. **Sombras y degradados: perfil de brillo.** Toma el brillo a lo largo de x en una franja de cielo y divídelo por el de la foto sin sombra: da el alfa. Así se vio que la "barra negra + degradado" del banner era una sola sombra que se desvanece **sobre el blanco** donde no hay foto.
6. **Comparar el render contra la captura**: pasa la captura a px de diseño (`Image.transform((1440, alto), Image.EXTENT, (x0, y0, x0 + 1440*s, y0 + alto*s))`), mézclala 50/50 con la captura del render (`medir_seccion.py`) y saca la diferencia media por región tras un desenfoque (`comparar_captura.py` hace todo esto). Referencias de "Nuestras Sedes": texto 1,9 · líneas 1,6 · fotos 8-12 (por el remuestreo) · formas de color plano 17 (solo por el corrimiento de color del punto 2).
7. **El rayado** (`DiagonalLinesComponent`) trae las rayas en "/". Si el diseño las pide en "\", espejo con `-scale-x-100`; y baja la opacidad si se ve tenue (aquí ~35%: se mide con la media de brillo sobre un fondo liso).
8. **Fotos ya en el repo.** Antes de pedir el export, mira si la foto ya está (`public/assets/*/`): en Sedes las dos del diseño ya estaban en "Nuestra huella". Se copian (no se enlaza a otra vista) y se deja el `TODO` de pedir el 2×.
9. **Una captura pequeña se puede leer ampliándola.** A escala 0,32 el texto sale ilegible, pero un recorte ampliado 6× (Lanczos) deja leer direcciones y horarios. Las medidas salen igual: alto/ancho de cada pieza en px de la captura ÷ la escala. Con el ancho de una fila (el "pin" + la dirección era 14% más ancho que a 14px) se deduce el tamaño de la fuente: era de 16px.
10. **Cuadrículas de fotos: registra cada una** en un bucle contra su miniatura (`registrar_foto.py` con `--region` de la caja de cada tarjeta). Si la correlación sale < 0,7 (aquí: 2 de 8), la foto del diseño no es la que tienes: usa la más parecida, pon un `TODO` y pídela; el `object-position` de esa queda estimado.
11. **Datos de relleno del diseño.** Si el diseño trae direcciones repetidas o cruzadas y el API son filas de prueba (pasó con las sedes), la fuente son constantes en `constants/` con los datos del sitio anterior. Deja en el JSDoc una tabla "diseño vs aquí" por campo y el `TODO` de confirmarlas; el tipo (`Headquarters`) ya queda con la forma del futuro DTO.
12. **Las capturas de una vista larga son marcos de 1440 apilados**, no recortes: cada una mide 920-930 px (escala ≈ 0,64) y lo que parece cortado por la derecha (un carrusel) sangra fuera del marco por diseño. Calibra CADA una con dos medidas conocidas (tarjeta blanca = contenedor 124…1316, barra 303, panel gris desde 124) y **encájalas en vertical** con un elemento que salga en dos (un botón en la 1 y en la 2): así salen las alturas de sección y dónde se solapan. En Taller: la foto de una tarjeta baja 140 px sobre la sección siguiente, y una barra negra (920) y una columna naranja (1102) cruzan de una sección a la otra. **Ojo:** encajar capturas por arriba y por abajo no da las alturas reales: al llegar Figma, un panel medía 689 y no 685, y la galería empezaba 25 px más abajo de lo encajado (la captura 5 no arrancaba donde acababa la 4). Con Figma las posiciones salen de las cajas (§14).
13. **Un elemento que cruza dos secciones cuelga de la primera**, absoluto y con el alto total; la siguiente pasa por debajo. Lo que cae encima de la sección anterior lleva el z-index mayor (tarjeta `z-20`, barra `z-10`, cian de rayas `z-20`). La barra del lienzo que sangra y el contenido anclado al lienzo se reparten así: fondos con `calc(50%-50vw)`, contenido en px del lienzo.
14. **Compara con números, y renglón por renglón.** `comparar_captura.py` pasa la captura a px de diseño y da la diferencia media por región (más `mezcla.png` y `diff.png`); `comparar_lineas.py` da la línea base y los extremos de cada renglón en las dos imágenes; `medir_texto.py` da el ancho de tinta a varios tamaños y la línea base. Una diferencia de 1 px es ruido (la captura está a 0,64): busca las de 2 o más. Si todo sale corrido ~1 px, es la calibración, no el diseño: corrige el `--origen` (aquí `=-1.8,0.6`).
15. **Deducir el ancho de una columna de texto:** la columna W debe cumplir que cada renglón cabe (≤ W) y que renglón + " palabra siguiente" no cabe (> W). Sale un intervalo; escoge un número redondo dentro. Tarjetas contiguas pueden tener columnas distintas (278 y 293) y hasta interlineados distintos (22 y 24: se ve en las líneas base de `comparar_lineas.py`, no en el alto total).
16. **Un patrón que se repite no siempre se repite igual.** Mide cada instancia: el antetítulo era el de siempre pero con 10 px hasta el texto (16 en el componente), las tarjetas oscuras traían un icono de 48 y no de 32, y un título de una sola línea iba centrado en un bloque de 43 de alto en vez de arrancar arriba. Si la variación es de una sola pieza, un `className`/`titleClassName` con su comentario; si es de todas, un prop.

17. **Si la captura es del sitio anterior, mide el sitio, no los píxeles.** En "Contacto" la captura era `wcar.co/contacto` sin navbar ni footer. Con `cdp.py` a ese ancho (`viewport(1910, 940)`) se leen las cajas (`getBoundingClientRect`) y los estilos (`getComputedStyle`: tamaño, peso, interlineado) de cada elemento, y con `curl` se baja su bundle (`/static/js/main.*.js`) para ver **qué hace cada botón** (aquí: modales con formularios, no enlaces). Salió en minutos lo que por píxeles habría sido estimar: el panel de 1128px (contenedor de Bootstrap 1320 − 2×48 − 2×48), las tarjetas de 171/154/174px, el `translateX(40%) rotate(90deg)` de la pestaña. Luego se compara el render contra la captura: desplazamiento vertical por correlación (mejor `dy` con la diferencia media más baja: aquí 2,0/255 en todo el panel) y por regiones (texto 0,0–2,7 · círculos 0,4 · foto 4–6). Ojo: la captura puede venir recortada unos px por arriba (3 aquí) y traer 2 px de otra cosa abajo.
18. **La tipografía se decide por el ancho medido, con el peso probado.** Con Chrome y Urbanist se mide cada texto a varios tamaños y pesos y se compara con el ancho de tinta de la captura (la tinta mide ~2px menos que el avance): el cuerpo era Regular 400 (Medium daba 8px de más en 648), los títulos de bloque 28px Bold, el título 36px Bold. El diseño usa 28px, que no está en la escala (`text-[28px] leading-[34px]`, como en `HeadquartersHeroComponent`).
19. **Fotos de fondo a cada lado de un panel centrado.** No repitas una sola imagen desde el borde de la ventana: a otro ancho la costura queda a la vista. Dos capas `absolute` de `w-[calc(50%-<mitad del panel>)]`, una a cada borde, con `bg-size-[auto_100%]` y, en la derecha, `bg-position-[-Npx_0]` con la N que da la correlación (`ox` en una búsqueda de desplazamiento de la captura contra la foto escalada). Con `hidden xl:block` el navegador no descarga la foto en mobile. Si en mobile va la misma foto como `<img>` (`xl:hidden`, carga perezosa), en desktop no se pide (comprobado: `naturalWidth` 0 y una sola petición).
20. **Botones de un ancho fijo con el texto a la izquierda.** El `cyan` centra su contenido; si el diseño los pide todos de la misma anchura con el texto arrancando igual, `w-[271px] justify-start! pl-7!` (`pl-7` + los 2px de borde = 30px). Cada milímetro cuenta poco: el texto queda a 1px y el ícono a 3px de la captura por el `gap-2` del botón, y no se toca para no desviar el componente compartido.



---

## 13. Vistas largas: un plan en cascada

Cuando una vista tiene varias secciones (Taller: 7), en vez de dejar varios mensajes sueltos se escribe **un plan** y se ejecuta **tarea por tarea**: cada una empieza cuando la anterior está verificada, y el archivo dice dónde quedó si se corta la sesión. La plantilla, ya usada de punta a punta, es `docs/planes/taller.md` (con sus capturas en `docs/planes/taller/`). **Para escribir un plan nuevo hay un skill: `plan-de-vista`** (`.claude/skills/plan-de-vista/`: instrucciones, `plantilla-plan.md` y `scripts/preparar_plan.py`, que copia las capturas con su escala, las amplía, sondea el backend y lee el sitio anterior con sus reglas de negocio). El segundo plan hecho con él fue `docs/planes/financiacion.md`.

**El plan** (`docs/planes/<vista>.md`) lleva: la orden de ejecución, una lista de estado con casillas, las decisiones ya tomadas (ruta, módulo, carpetas, de dónde sale el diseño, qué se hace con el mobile y con el copy), las piezas que se repiten (para construirlas una vez), **una tarea por sección** (qué se ve, copy exacto, componentes a reutilizar, medidas de la captura, "Hecho cuando"), la tarea de imágenes al final, una tabla de dónde va cada imagen y un **Registro** por tarea.

**Cómo se ejecuta.** Un solo mensaje: *"Usa el skill nueva-vista y ejecuta `docs/planes/<vista>.md` tarea por tarea. Al terminar cada una: verifícala, márcala `[x]`, anota en el Registro y solo entonces sigue"*. Retomar: *"continúa el plan desde la primera tarea sin marcar"*.

**Reglas que funcionaron**
1. **Tarea 0 = preparación y calibración**: leer la guía y la de Next, sondear el backend, crear ruta y módulo y **calibrar cada captura** (§12.1 y §12.12). Se corrigió ahí una suposición del propio plan ("las capturas son recortes": eran marcos completos).
2. **Una sección por tarea, en el orden del diseño**, y al terminar cada una: lint y tipos, copia aislada, `medir_seccion.py` a 1440/1900/393 y `comparar_captura.py`. Se anota en el Registro lo medido, lo estimado, lo que se aprendió y los `TODO`.
3. **Las imágenes van al final.** Mientras no lleguen, una caja del tamaño exacto con `TODO(imagen)`; los iconos, un SVG provisional con el **nombre definitivo** (el del diseño lo reemplaza sin tocar código). Si no llegaron al terminar el resto, la tarea de imágenes queda abierta: no se inventa nada.
4. **Lo que se repite se construye la primera vez que aparece** y se anota (aquí: `titleItalic`/`tone`/`iconClassName` en `FeatureCardComponent`, `second` en `SideLabelComponent`, `ParallelogramsComponent`, el ícono de flecha en círculo).
5. **El plan se corrige cuando la realidad lo contradice** (y se deja escrito en el Registro): mis primeras suposiciones sobre eyebrows y tamaños de fuente salieron mal en dos tareas y se arreglaron al medir la captura siguiente.
6. **Cierre (última tarea):** costuras entre secciones a 1440 y 1900, mobile de toda la página, `overflowX` = 0, lista de `TODO` clasificados, esta guía y el skill al día, y el reporte.

---

## 14. Con acceso a Figma (MCP): lo que se lee, lo que engaña y cómo se verifica

Aprendido en la tarea 8 de Taller: la vista se hizo entera de cinco capturas (§12) y al llegar el Figma hubo que comparar todo otra vez. Lo que sigue es lo que conviene hacer **desde el principio** si hay acceso, y lo que se afinó al comparar.

1. **Qué da cada herramienta.** `get_metadata`: árbol y cajas. `download_assets`: la foto ORIGINAL (`rawImages`: PNG/JPEG; las de 300-400 px son miniaturas que Figma guarda: se ignoran), los íconos SVG y el `export` del nodo tal como lo pinta Figma (la referencia para comparar). `get_design_context`: código de referencia. `use_figma`: JavaScript dentro del archivo; aquí **solo para leer** (no se toca el diseño de otro). Antes de llamarlos hay que cargar los skills `figma:figma-design-to-code` y `figma:figma-use`. La cuenta con plan Pro es disenotec@wcar.co (la de efuentes@ es Starter y se agota).
2. **`get_design_context` no dice todo.** Pone `object-bottom size-full` a fotos que en realidad están recortadas, espejadas y estiradas; omite los ajustes de imagen; y escribe mal un degradado cuyas paradas caen fuera de la caja (el de la foto de Garantías salía "negro al 11 % → transparente al 23 %" y en realidad es "negro al 66 % en el borde inferior → transparente a 23 % de alto": se comprobó con el brillo de las filas del export). Sirve para estructura y textos; lo que manda es `use_figma` + el export.
3. **Qué leer con `use_figma`** (un solo script para varios ids, devolviendo JSON):
   ```js
   const n = await figma.getNodeByIdAsync("188:11275");
   return { w: n.width, h: n.height, opacity: n.opacity, rel: n.relativeTransform,
     fills: n.fills.map(f => ({ type: f.type, scaleMode: f.scaleMode, imageTransform: f.imageTransform,
       filters: f.filters, gradientStops: f.gradientStops, gradientTransform: f.gradientTransform })) };
   ```
   - **Opacidad de las instancias:** todos los "Lines 13px" van al 50 % (las capturas habían dado 40 % y 60 %; el color medio contra el export lo confirmó).
   - **El texto de cada `TEXT`** (`n.characters`, recorriendo el marco sin navbar ni footer): es el copy exacto. En las capturas se leía "vehiculo" y "asesoria" sin tilde y en Figma llevan tilde; el h1 era de 50 px y no de 52. Las erratas de verdad ("¿Que", "Garantias", "TECNICO", "Mas", "Donde", "Sabado") sí estaban.
   - `relativeTransform` [[-1,0,W],…] = nodo espejado.
4. **Modos de relleno.** `FILL` = `object-cover` centrado. `CROP` con `imageTransform` [[a,b,c],[d,e,f]]: si b = d = 0 y a ≈ e, es `object-cover` con `object-position` x = c/(1−a), y = f/(1−e) (la fachada: 77,9 % 50 %; el mecánico: 16,4 % 50 %). Si no —a < 0 es un espejo, b o d ≠ 0 una inclinación, a y e distintos una foto **estirada**— o si `filters` trae ajustes (contraste, luces, sombras, temperatura, tinte: CSS no los tiene), la foto se hornea con `scripts/figma_imagen.py`: transformación afín + ajuste de color por mínimos cuadrados contra el export, y sale un WebP ya recortado. Las capas de diseño (oscurecimientos, degradados) siguen en CSS (§6.1). Se verifica con la correlación contra el export (0,99; baja a 0,9 con 3 px de desvío) y el error de color (2-4/255). Si la inclinación deja una cuña vacía, se rellena reflejando el borde (`--relleno`): en desktop la tapa otra pieza, en mobile no.
5. **El export de un marco alto sale reducido** (tope de 4096 px de alto): la escala vertical deja de ser la horizontal y aparece una deriva que crece hacia abajo y no existe. `comparar_figma.py --alto-figma` usa cada escala. Los exports de nodos más chicos salen 1:1.
6. **`x` e `y` de un nodo girado o volteado no son su caja** sino su origen local: un zigzag "en y=2031" estaba en y=1921 y un rectángulo "en y=2896" tenía su borde superior en 2843. Esos se miden en el render contra el export, no con la cifra de los metadatos.
7. **Un degradado a "transparente" de OTRO color no es el de CSS.** Figma interpola sin premultiplicar: de `#FF8000` a `rgb(189 47 34 / 0)` el color viaja hacia el rojo mientras baja el alfa; CSS premultiplica y da un naranja que solo se desvanece (10/255 de diferencia contra el export). Nueve paradas intermedias con el color y el alfa ya calculados lo dejan en 2-3/255.
8. **Dos capas del mismo elemento se suman**: `bg-black/16` (color) + `xl:bg-[linear-gradient(…)]` (imagen) pintan las dos. Ver §8.
9. **Verificación contra el export en una pasada:** `scripts/captura_pagina.py URL 1440 salida.png` y `scripts/comparar_figma.py salida.png figma.png --alto-figma 5352 --offset-y 48 --region 'nombre:x0,y0,x1,y1'`. Da la diferencia media y el **`dy` que mejor encaja**: cada sección con `dy ≠ 0` está corrida. Con esto salieron, sin mirar a ojo: un panel de 685 que medía 689, la galería 25 px más arriba, dos textos 3-4 px más abajo, la foto del hero ampliada 1,6× y las opacidades de los rayados. Referencias (vista Taller, a 0,77): fotos 2-6 · texto 1-4 · rayado fino 8.
10. **Fotos generadas.** Una foto del diseño puede venir de un generador de imágenes, con su marca de agua (una estrella) que el diseño tapa con un parche borroso: se reproduce el parche (SVG en `assets/`, en porcentajes de la caja para que siga a la foto en mobile) y se avisa al usuario. Tampoco es la misma toma que una foto parecida que ya esté en el repo: comparar antes de reutilizarla.
11. **Los originales, fuera del repo** (`../originales/<vista>/`, con un `LEEME.txt` que diga los nodos, las transformaciones y los comandos para reproducir los WebP).
12. **Carrusel completo.** El marco de Figma puede traer más tarjetas fuera de los 1440 (Taller: 5 en vez de 3, dos a medias con la descripción en otro color). No se agregan solas: se documentan en el JSDoc y se pregunta.

---

## 15. Con Figma disponible (MCP): lo que sumó Financiación al §14

Aprendido en Financiación (9 tareas, 4.850 px de página) con el MCP de Figma autenticado con la cuenta Pro. **Con Figma se deja de estimar de capturas**: las medidas, los textos, los colores y las imágenes salen del archivo y el render de Figma es el patrón contra el que se compara.

**Flujo**
1. `whoami` (¿cuenta Pro?), `get_metadata` del nodo de la vista (posiciones absolutas; **la estructura es plana**, hijos con `x`/`y` sobre el marco, y los `y` de los hijos de un marco anidado son relativos a ÉL: el botón "en y=309" estaba a 309 del cuerpo de la tarjeta, no de la tarjeta) y `get_screenshot` del **marco entero** a 1x (`maxDimension` = su alto) → descargar con `curl`. Con ese PNG se calibra cualquier captura por fuerza bruta (escala ± 0,006, origen) y se compara el render: `comparar_captura.py REF.png RENDER.png --origen 0,0 --escala 1 --regiones …`.
2. `get_design_context` **por nodo** (el marco entero sale "disperso"): da tamaños, pesos, colores, interlineado, el texto exacto con sus espacios y erratas, y los degradados como CSS ya convertido. Va con `skillNames=figma-design-to-code` y exige cargar ese skill antes.
3. `download_assets` de un nodo: `rawImages` (las fotos originales, **también las repetidas a menor resolución**: mirar una hoja de contacto), `svgAssets` (vectores) y `export` (el nodo ya compuesto, a la escala que se pida: útil para un marco con demasiados degradados).
4. Para lo que el código de referencia no dice (recorte, filtros de imagen, matriz de un degradado): `use_figma` **solo de lectura** (cargar antes el skill `figma-use`): `n.fills[i].imageTransform`, `.filters`, `.gradientTransform`, `n.effects`. Con `imageTransform` [[a,0,c],[0,e,f]] la foto se ve a `w/a` × `h/e` en (`-c·w/a`, `-f·h/e`); un degradado lineal vale `t = a·u + b·v + c` con la primera fila de `gradientTransform` (con eso el alfa sale exacto).
5. Las fotos con **ajustes de imagen** de Figma (contraste, saturación, tinte…) se hornean con `figma_imagen.py`: ajuste polinómico de color contra el render. Con la **geometría exacta** (`transformar` con el `imageTransform` leído) el error baja a 2-3/255; con un registro por correlación uniforme era de 10.
6. Cada tarea se cierra con la comparación numérica contra el render de Figma (referencia de esta vista: total 0,9-2,6/255 por sección; texto 1-7 —el texto grande en negrita cae **1 px más arriba** en Chrome que en Figma, es sistemático—; fotos 2-4) y una **comparación de la página entera** (2,1/255 con las secciones apiladas a la altura exacta: sirve para ver costuras).

**Trampas de Figma**
- **Una capa con "opacidad 5 %" sobre un PNG que ya trae su alfa**: el render muestra solo el alfa del archivo (medí el brillo del render para decidir), no el producto de los dos.
- **Un relleno `overlay` dentro de un nodo con desenfoque de capa se ve como velo normal** (la fusión se resuelve dentro del nodo): probar los dos en Chrome contra el render (7,3 contra 2,4/255).
- **Un mismo objeto en dos rellenos** (el hero trae la foto y, encima de una forma, un recorte de las mismas personas con **otros** ajustes de color): hay que tratar cada uno con su propio ajuste.
- Un componente puede llegar **girado o espejado** (el zigzag de Financiación estaba girado 180°, y la `y` de sus metadatos es la del borde inferior): comparar máscaras de tinta con las cuatro variantes en vez de adivinar.
- Los rótulos pueden venir en **otra familia** (Plus Jakarta Sans en el formulario): `get_design_context` lo dice; `next/font/google` por componente.
- Un texto con espacios dobles o iniciales (`sustitución  de`, ` Elementum`) necesita `whitespace-pre-wrap`.
- `ButtonComponent` mide unos px más que el botón de Figma (borde transparente de 2 px + el texto avanza más: 213 contra 205): es del componente, no de la sección.
- Las **imágenes con el mismo nombre en Figma no son la misma** (dos "Lines 13px" con tile gris distinto): comparar el PNG con el de `public/assets/shared/` antes de reutilizar.
- Un cronómetro de tiempo: 4-6 llamadas a `get_design_context` por sección es lo normal; la cuenta Pro aguanta.

**Patrones que salieron de aquí**: `xl:h-(--var)` con variables por fila (alturas distintas medidas en Figma), `display:contents` en un envoltorio para que el `gap` de un flex alcance a hijos anidados, bordes en `::after` para no restar ancho al contenido, separadores centrados en el límite entre dos elementos (`::before` en `-top-[1.5px]`), radios nativos (`peer-checked:`) para "chips" de una lista, campo de dinero con el cursor conservado al reformatear (contar dígitos antes del cursor), y **redondear una cuota hacia arriba** (`Math.ceil`: con el ejemplo del diseño `Math.round` daba $3.921.854 y el diseño trae $3.921.855; además es lo prudente).

---

## 16. SEO: qué lleva cada vista y qué le falta al sitio

Sale de la auditoría del 28-09-2026: las 6 páginas existentes, rastreadas como lo haría un buscador (el HTML que sirve una copia aislada, con `scripts/auditar_seo.py`), y la documentación de Next 16 (`node_modules/next/dist/docs/01-app/`: `01-getting-started/14-metadata-and-og-images.md`, `02-guides/json-ld.md` y `03-api-reference/03-file-conventions/01-metadata/`). **§16.2 es lo que cada vista cumple desde que se hace.** §16.3 son tareas **de todo el sitio, una sola vez**: antes de hacer una, mira si ya existe (`ls src/app`).

### 16.1 Cómo está el sitio

| Ya lo tiene | Le falta |
|---|---|
| `lang="es"`, viewport, `<title>` y descripción **únicos** en las 6 páginas | `robots.txt` y `sitemap.xml` (los dos dan 404) |
| Un solo `<h1>` por página, sin saltos de nivel, con `header`, `nav aria-label`, `main` y `footer` | `metadataBase` y una URL pública (no existe `NEXT_PUBLIC_SITE_URL`) |
| Todo el contenido llega en el HTML del servidor (ISR de 1 h; entre 114 y 951 palabras en `main`, Contacto es la corta) y `reveal` no oculta nada sin JavaScript | `canonical` (0 de 6), Open Graph y `twitter:card` (0 de 6) e imagen para compartir |
| `alt` en todas las imágenes: descriptivo en las fotos de contenido y `alt=""` + `aria-hidden` en lo decorativo (ninguna sin atributo) | Datos estructurados JSON-LD (0) |
| `next/image` (WebP/AVIF con `sizes`), fuente con `next/font` y la home en 82 KB de HTML comprimido | Página 404 propia: hoy es la de Next, en inglés (sí lleva `noindex`, bien) |
| Las URLs del sitio anterior se conservan en `ROUTES` a propósito, para no perder posicionamiento | `title.template`: cada página escribe " \| WCAR" a mano y los títulos miden 13-21 caracteres, sin palabra clave |
| Enlaces con `AppLinkComponent` (`Link` o `<a>`, y `rel="noopener noreferrer"` con `target="_blank"`) | **53 de 59 enlaces internos únicos dan 404** (abajo) |

**Los 404 son lo más urgente antes de publicar.** Solo existen 6 rutas y el navbar y el footer las repiten en todas las páginas: `/comprar`, `/compra-tu-*` (5 tipos), `/vende-tu-carro`, `/cotizar`, `/tramites-de-vehiculos`, `/blog`, `/sign-in`, `/politicas-*`, unos 30 documentos legales que llegan de `GET /terms/no-contents/` (forma `/<slug>/<id>`, `services/terms.ts`) y el detalle de cada vehículo destacado (`vehicleHref`). Cada página lanza más de 45 enlaces a nada: gasta presupuesto de rastreo, es señal de baja calidad y es mala experiencia. Antes de cambiar el dominio, cada URL que hoy está indexada en `wcar.co` debe responder 200 o 301 (`redirects` en `next.config.ts`); la lista sale del sitemap del sitio anterior o de Search Console.

### 16.2 Lo que lleva cada vista

**1. Metadatos.** Un `export const metadata` en `page.tsx` (solo Server Components):

```ts
import type { Metadata } from "next";
import { buildPageMetadata } from "@/modules/shared/utils/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Taller de reacondicionamiento de vehículos en Bogotá",
  description: "…entre 70 y 160 caracteres, distinta de la de las demás páginas…",
  path: "/taller",   // canonical, og:url y og:image salen de aquí y de `metadataBase` (layout, dominio https://wcar.co)
});
```

`buildPageMetadata` (`shared/utils/seo.ts`) existe porque el `openGraph` de una página **reemplaza** al del layout y porque el archivo `opengraph-image` de Next también se pierde en cuanto la página define `openGraph`: la imagen va por import (`OG_IMAGE`). **Al crear una vista, añade su ruta también a `src/app/sitemap.ts`.**

- **`title`** de 25 a 60 caracteres, con lo que busca la gente **primero** y la marca al final. **`description`** de 70 a 160, distinta en cada página (es lo que se lee en el resultado). Ambas **únicas**: el script falla si se repiten.
- **La palabra clave la decide quien conoce el negocio** (§2): una intención de búsqueda por vista. Si no llegó, escribe el `title` y la `description` a partir del diseño y deja `TODO(seo): confirmar palabra clave`. No la inventes.
- **`canonical`** propio de cada página, sin parámetros. **`robots`** solo si la vista NO debe indexarse (`{ index: false }`); nunca de más.
- Una ruta relativa en la metadata rompe el build si falta `metadataBase`. No escribas el dominio a mano en cada página.

**2. Encabezados.**
- **Un solo `<h1>`, y dice de qué trata la página.** "Nuestra Empresa" (Sobre Nosotros) no dice qué es WCAR ni qué vende; si el diseño trae un h1 genérico se reproduce (§9) y se deja `TODO(seo)` pidiendo un subtítulo o un h1 más descriptivo. En un banner que rota, el `<h1>` va en el primer slide y los demás llevan `<h2>` (`HeroComponent`); todo llega pintado desde el servidor.
- Orden `h1 → h2 → h3` sin saltos. El script falla si hay uno.
- **Un título partido en dos con `<span className="block">` lleva un espacio real antes del span** (`{" "}`): en pantalla parte el renglón, pero en el HTML el texto queda pegado ("mas segurode colombia"). El `<br/>` no tiene este problema.
- Copy con erratas (§9): se reproduce, pero **en un h1 o h2 la errata desperdicia la palabra clave donde más pesa** ("Santarder", "sutitución"). Va al reporte como "errata con efecto SEO".

**3. Imágenes.**
- `alt` descriptivo (qué se ve, hasta 125 caracteres, sin "imagen de…") en **toda foto de contenido**. Decorativa: `alt=""` **y** `aria-hidden`. Logos: el nombre de la marca. Una foto de vehículo: su nombre (ya lo hace `VehicleGalleryComponent`).
- **`preload` solo en la foto candidata a LCP, y solo una por vista** (`priority` está deprecado en Next 16; ver §8). Lo demás, carga diferida. Hoy `priority` sigue en `HeroHomeJeepComponent`, `NavbarComponent` y `AboutHeroComponent` (dos veces): migrarlo.
- `sizes` = el ancho al que SE VE la foto (§6.1). Sin `sizes`, el navegador baja una imagen de más.
- Cuidado con lo que se monta en `<head>`: hoy los 8 íconos del navbar (`loading="eager"`, PNG de menos de 1 KB) salen como `<link rel=preload>` en las 6 páginas y compiten con la foto del hero. Las 9-12 precargas de imagen por página son las que el script avisa.

**4. Enlaces.**
- Internos siempre con `AppLinkComponent` y `ROUTES`, nunca un `<a href="/x">` a mano.
- El texto del enlace dice a dónde va. Si el diseño trae un "Ver más" suelto, `aria-label` con el destino.
- **Una vista no enlaza a una ruta sin página sin dejar un `TODO`.** Hoy pasa en todas (§16.1): mientras no exista la página o su redirección 301, cada enlace es un 404 para el rastreador.

**5. Datos estructurados (JSON-LD)**, solo con datos **reales** (los de `constants/`, `CONTACT_INFO` o el API; nunca horarios o teléfonos de relleno inventados):

| Dónde | Tipo de schema.org |
|---|---|
| Layout (todo el sitio) | `Organization` y `WebSite` |
| Sedes y Taller | `AutoDealer` (concesionario) o `AutoRepair` (taller), con `address`, `geo`, `openingHours` y `telephone`: `Headquarters` ya trae dirección, coordenadas y horario |
| Detalle de un vehículo (cuando exista) | `Car` con `offers` |
| Cualquier vista con migas de pan | `BreadcrumbList` |

- Se pinta como `<script type="application/ld+json">` **en el Server Component**, no con `next/script`, y **escapando `<`**: `JSON.stringify(datos).replace(/</g, "\\u003c")` (así lo pide la guía de Next; `auditar_seo.py` comprueba que el JSON sea válido y sin `<`).
- Tras publicar: Rich Results Test de Google o validator.schema.org. Un `FAQPage` en Financiación no da resultado enriquecido (Google lo dejó para sitios oficiales de gobierno y salud); no es prioridad.

**6. Rendimiento que se ve desde fuera.** Server Component por defecto y datos del API en el servidor (todo lo de hoy llega en el HTML; un `useEffect` con `fetch` no lo indexa igual). La home trae **203 `<img>`** (147 decorativas) y Sobre Nosotros 160: antes de sumar más adornos como `<Image>`, mira si van como fondo CSS. **Lo que no se midió**: Core Web Vitals (LCP, CLS, INP). No hay Lighthouse en el proyecto; se miden con PageSpeed Insights sobre la URL pública al desplegar.

**7. Comprobarlo.**

```bash
S=.claude/skills/nueva-vista/scripts
python3 $S/auditar_seo.py --base http://localhost:3100 /taller            # una vista
python3 $S/auditar_seo.py --base http://localhost:3100 --sitio            # todas las de src/app + robots, sitemap y 404
python3 $S/auditar_seo.py --base http://localhost:3100 --estricto /taller # los "pendientes del sitio" también fallan
```

Tres niveles: **ERROR** (falla siempre: HTTP, `lang`, título o descripción ausentes o repetidos, `<h1>` distinto de uno, salto de nivel, `<img>` sin `alt`, `noindex`, JSON-LD inválido), **AVISO** (título o descripción fuera de rango, poco texto, palabras pegadas, precargas de más) y **PENDIENTE** (canonical, Open Graph, JSON-LD y enlaces 404: lo que aún puede ser del sitio y no de la vista). Cuando §16.3 esté hecho, `--estricto` pasa a ser la regla. Solo lee (GET) y va contra la **copia aislada**, no contra la carpeta real.

### 16.3 Pendientes del sitio (una sola vez, en este orden)

1. **`NEXT_PUBLIC_SITE_URL`** (`.env.local`) y `metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL)` en `app/layout.tsx`. Sin esto no hay canonical, imagen social ni sitemap con URLs absolutas.
2. **`title: { default, template: "%s | WCAR" }`** en el layout y quitar el " | WCAR" escrito a mano de cada página. El template solo llega a los segmentos hijos: la `page.tsx` de la home comparte segmento con el layout, así que su `title` sale tal cual (con la marca dentro) o, si no define ninguno, toma el `default`.
3. **`app/robots.ts`** (`allow: "/"`, la línea `sitemap`, y `disallow` de lo privado, p. ej. `/sign-in`) y **`app/sitemap.ts`** con las rutas que **tienen página** (sale de `src/app`, no de `ROUTES`: lo que no existe daría 404 dentro del sitemap). Cada vista nueva se suma.
4. **`canonical`** en cada página existente y **Open Graph** base (`siteName: "WCAR"`, `locale: "es_CO"`, `type: "website"`) con `twitter: { card: "summary_large_image" }` y una imagen de 1200 × 630 (`app/opengraph-image.png` o `.tsx`). En Colombia lo que más se comparte es por WhatsApp: sin esto sale un enlace pelado.
5. **JSON-LD `Organization` + `WebSite`** en el layout y `AutoDealer`/`AutoRepair` en Sedes y Taller (§16.2, punto 5).
6. **`app/not-found.tsx` en español**, con `<h1>`, una frase y enlaces a Inicio, Contacto y Sedes (Next ya envía 404 con `noindex`).
7. **Los 53 enlaces que dan 404** (§16.1): crear la página o una redirección 301, y para los ~30 documentos legales una ruta dinámica (`/[slug]/[id]`, con cuidado de no tapar las rutas fijas). Antes del cambio de dominio, el mapa de redirecciones de todas las URLs de `wcar.co` indexadas.
8. **`title` y `description` con palabra clave** en las 6 páginas (hoy 13-21 caracteres): decide marketing, se aplica por vista.
9. **Palabras pegadas** en los títulos partidos con `block` (el script las lista: home, sedes, taller, financiación y Sobre Nosotros) y **`priority` → `preload`** (§16.2, punto 3).
10. **Favicon e íconos de la marca.** El `favicon.ico` de `src/app` parece el de `create-next-app` (25.931 bytes, con la fecha del proyecto recién creado); la carpeta `public/` aún trae los cinco SVG de ejemplo de Next (`next.svg`, `vercel.svg`, `file.svg`, `globe.svg`, `window.svg`) sin usar.
11. Menor: `Menú`, `Términos y condiciones` y `Nuestras sedes` son `<h2>` en **todas** las páginas (footer y menú); como `<p>` con `aria-label` dejan el esquema de cada página solo con su contenido.

### 16.4 Lo que se descartó (para no volver a medirlo)

- **El HTML de 1 MB de la home** no es un problema: son 82 KB en gzip (`next start` no comprime con brotli; el hosting o el CDN sí).
- **`hreflang`**: el sitio es solo en español; no hace falta. `lang="es"` (o `es-CO`) basta.
- **`<a>` sin `href`** y **`<img>` sin `alt`**: 0 en las 6 páginas.


---

## 17. Mobile del Home desde Figma (lo que enseñó)

El Figma tiene una página mobile del Home (`701:54961`, "mobile 398", 393 x 8139; ver la memoria `figma-wcar-2026`). No trae auto-layout: hay que **restar las `y` entre nodos** para sacar los espacios (relleno de arriba = `y` del título − `y` del fondo gris; el bloque de un panel = de su `y` al final del último hijo). Lo que se hizo con eso, sección por sección:

- **"Compra online…" (fondo gris):** título 36/44 centrado a 44 del borde, tarjetas con el ícono ARRIBA y el texto centrado (`FeatureCardComponent mobileCentered`), 32 entre tarjetas, y **dos rayas de 70 con 16 en medio** (la activa de 3 px naranja, la otra de 1 px `gray`) + cuadro cian de 54 sobre uno amarillo de 102 x 54 pegados al borde derecho. El diseño solo dibuja 3 de las 6 cualidades de desktop: con dos rayas eso son **dos páginas de tres** (decisión, con `TODO`).
- **Un grid de desktop que en mobile es carrusel, sin duplicar el contenido:** contenedor con scroll (`flex snap-x overflow-x-auto xl:grid xl:grid-cols-2`) y, dentro, una `<ul>` por página con `xl:contents`. En `xl` los `<li>` pasan a ser celdas del grid; en mobile cada `<ul>` es una página de `w-full` con su `px-8` (el carrusel sangra a todo el ancho y la siguiente página entra desde el borde de la ventana). Una sola copia del texto en el documento. El alto lo fija la página más alta: la primera queda con más aire abajo que en Figma (a propósito, para que no salte el contenido al deslizar).
- **Panel oscuro:** en mobile es `#1e1e1e` (`bg-dark-gray`) y el de desktop es negro; zigzag blanco + amarillo (`ZigZagComponent tone="light"`), rayado al 50 % abajo a la derecha. Los botones llevan el ícono `arrow_circle` pegado al texto por la izquierda (`justify-start!` + `iconClassName="xl:hidden"` si el desktop no lo lleva).
- **Foto "Transparencia brutal" abajo del panel** (en desktop es una columna absoluta): otra pieza (`TransparencyPhotoMobile`), no clases responsivas sobre la de desktop. El carro va **espejado**; se registró contra el export por correlación (escala = alto del nodo / alto de la foto original; probar `dx`, `dy` en ±14 px), se horneó el recorte a WebP y el degradado naranja se ajustó **por mínimos cuadrados columna a columna** (`alfa = ((export − foto)·(naranja − foto)) / |naranja − foto|²`) para sacar las paradas. Los arcos de fondo se desvanecen a la derecha: verlo con un recorte ampliado del canal de luminancia, no a ojo.
- **Banner "Tu auto viejo…":** 329 x 296. La foto de los autos NO va entera: la caja que la recorta empieza en `y=156` (el `overflow-hidden` es del contenedor de 209 de alto, no de la foto), y el degradado a naranja entre `y=60` y `156` desvanece los arcos hacia abajo. Se sale 101 px de la sección gris hacia la blanca (`-mb-[101px]`) y la sección siguiente (`Destacados`) sube su `pt` a 101 + 81. El rayado gris es fluido (`w-full max-w-[328px]`): a 320 px uno fijo de 328 desbordaba.
- **Texto que mezcla tamaños en una misma frase** ("Tu auto viejo es la / llave de tu auto nuevo." en 22 y "¡Cámbialo ahora!" en 28): Figma deja ~6 px más de aire bajo el renglón de 22; en CSS se reproduce con `leading-[54px]` en el span de 28 (medido, no supuesto). Para desktop y mobile a la vez, `<br className="xl:hidden">` y clases `xl:` por span.
- **Copy que difiere entre los dos diseños:** mobile "Compra online…", desktop "Compras online…". Se reproduce cada uno (`Compra<span className="hidden xl:inline">s</span>`) y se pregunta a diseño; no se elige por ellos.

**Verificar** (`comparar_elemento.py`): recorta el elemento de la página real y lo compara con el PNG del nodo: diferencia media, por bandas y **los renglones de texto de cada uno** (delatan 2 px de desfase que a ojo no se ven). Cifras de esta pasada: banner 8,1 → 3,3, texto idéntico al píxel de fila. Trampas: `Page.captureScreenshot` con `clip` usa coordenadas de la PÁGINA (no de la ventana), y `captura_pagina.py` (página entera) llegó a no pintar dos elementos absolutos que en la ventana real sí salen: para comparar, la captura de la ventana tras `scrollIntoView`.

**Entre 393 y `xl` (tablet, ventanas de 500 a 1200 px):** el diseño mobile solo dice qué pasa a 393; a partir de ahí hay que decidir, y una caja de ALTO FIJO con una foto que crece con el ancho se corta (le pasó al banner "Tu auto viejo…": entre 500 y 1200 los autos salían recortados por abajo). Reglas que salieron de arreglarlo:

- **Una pieza compuesta (foto + texto + logo en px) que debe verse igual a cualquier ancho:** proporción fija (`aspect-[329/296]`), ancho máximo (480) y `@container` con una unidad propia, `[--u:calc(100cqw/329)]` (= un px del diseño). Adentro, las medidas y las letras van en `calc(N*var(--u))` (`text-[length:calc(22*var(--u))]`: el `length:` evita que Tailwind lo lea como color) y lo relativo a la caja, en %. A 393 `--u` vale 1 y sale lo de Figma; a 768 todo crece a la vez y los autos no se cortan. En `xl` se restauran los px de desktop con `xl:`.
- **Lo que cuelga de esa pieza no debe depender de su alto:** el rayado de arriba del banner va DENTRO de su envoltorio (`absolute bottom-full mb-8`) y no a `bottom-[328px]`; el saliente hacia la sección de abajo se dejó fijo en 101 px (`-mb-[101px]`) para que `FeaturedVehiclesComponent` no tenga que saber cuánto mide el banner.
- **Fila de tarjetas de desktop (grid de 3) que en mobile es carrusel:** `flex snap-x overflow-x-auto` con `xl:grid`, tarjetas de ancho fijo (`w-[243px] shrink-0 snap-start`), la fila sangrando al borde (`-mx-8 px-4 scroll-pl-4`) y el relleno de arriba/abajo con margen negativo para que el `overflow` no recorte la sombra. Sin flechas ni rayas si el diseño no las trae (guía §4.3). Con más ancho simplemente caben más tarjetas.
- **Tarjetas de alto fijo y texto variable:** sin `gap` entre el texto y el enlace de abajo (`mt-auto`), o una descripción de tres renglones empuja el enlace fuera de la tarjeta. Y ojo con el copy que difiere entre diseños: "Peritaje gratis online" (mobile) vs "…disponible online" (desktop) no cabía en 146 de alto; se resolvió con un campo `titleItalicDesktopOnly` (un `<span className="hidden xl:inline">`, una sola copia del texto en el documento).

**Una sección larga de desktop en tablet (768 a 1279): no estirar la de mobile, adaptar la de desktop.** Un cuadrado de foto del ancho de la ventana (1242 x 1242) o una tarjeta de texto centrada a 1000 px "se ve rara". En "Transparencia brutal" se resolvió con la misma composición de desktop y medidas propias: foto vertical a la izquierda (300 de ancho a `md`, 380 a `lg`), y a su derecha el título, las seis cualidades en una columna y el panel oscuro, todo alineado a 36-40 px de la foto. Reglas:
- **Cada regla de tablet con `md:` y restaurada con `xl:`** (o con el mismo valor): así los valores de 1440 no cambian. Se comprobó midiendo a 1440 y 1900 antes y después (alto de la sección 1182, título en x=732, y=124, las mismas imágenes).
- **Un elemento posicionado a la derecha de la sección (zigzag, rayado de la esquina) choca con el texto cuando el panel se ensancha:** mirar la captura a 768, 1024 y 1242, no solo a 768. Se ocultaron desde `md` y `lg`.
- **No uses variantes arbitrarias de ancho (`min-[1100px]:`) para pisar a un `md:`:** Tailwind las ordena mal contra las de tema y el `md:` ganó a 1440 (las cualidades salieron en una columna y la sección creció 162 px). Usa `lg:`/`xl:`.
- **Centrar una fila de tarjetas que en mobile es carrusel:** `first:ml-auto last:mr-auto` en la primera y la última (con `justify-center` la primera queda fuera de alcance al desbordar).
- **Al verificar con Chrome headless:** si un `<img>` de `/_next/image` no carga, mira con `curl -H 'Accept: image/webp'` a esa URL antes de culpar al código; en la copia aislada una petición cortada a mitad (el script cierra Chrome) dejó atascado un ancho de imagen y ninguna petición posterior a ese ancho respondía. Reiniciar la copia lo arregla; y conviene calentar los anchos con `curl` antes de medir, o esperar la carga en vez de cerrar Chrome de golpe.
- **Formato:** este proyecto no trae `.prettierrc` y su código va a ~120 columnas: si pasas Prettier, `--print-width 120`, o reformatea archivos ajenos.

**Un lienzo de 1440 hecho con px absolutos (el hero) en tablet: escalarlo, no rehacerlo.** Reglas de la vez que se hizo con el hero del Home:
- **Cambiar el corte de `xl` a `md` en los componentes de desktop** (`hidden xl:block` → `hidden md:block`; también en el fondo de cada slide, que si no se queda con el color de mobile) y envolver cada slide en dos cajas: la de fuera con el alto ya escalado (`h-[calc(740px*var(--hero-s))] overflow-hidden`) y la de dentro con `w-[1440px] origin-top-left transform-[scale(var(--hero-s))]`. `transform` no cambia el tamaño de la caja: por eso la de fuera. Desde `xl` se restauran con `xl:h-auto`, `xl:w-auto`, `xl:transform-none`.
- **`--hero-s` (= ancho de la ventana / 1440):** en CSS con `tan(atan2(100vw, 1440px))` bajo `@supports`, con escalones de 32 px por ENCIMA del ancho real como respaldo (el lienzo sobra un poco por la derecha, no falta) y, la que manda, fijada por JS en `<html>` con `window.innerWidth / 1440`. Cuando una variable así es inválida en algún navegador, TODO lo que la usa cae a `auto`/`none`/`0` a la vez (el hero sale a tamaño completo y cortado, la barra de rótulos se cae sobre el buscador y la tarjeta deja de montarse): esos tres síntomas juntos son la firma de una variable inválida.
- **Los sangrados a la ventana (`calc(50% - 50vw)`) no valen con el lienzo escalado:** `vw` no se escala. Los que dan un ancho (`w-[calc(50vw-50%)]`) salen negativos y se anulan solos; los que mueven una pieza hacia adentro se multiplican por una variable (`right-[calc((50%-50vw)*var(--hero-bleed,1))]`, con `--hero-bleed: 0` dentro del lienzo escalado).
- **Dos bloques pegados que en 1440 tocan borde con borde dejan una línea fina al escalar** (subpíxel): solaparlos 1 px.
- **Lo que tiene texto que debe seguir legible no se escala** (la barra de rótulos): se coloca con `top: calc(400px * var(--hero-s))` y el solape de la tarjeta de búsqueda se calcula con la misma cifra (`-mt-[calc(340px*var(--hero-s)-73px)]`).
- **Al medir, cuidado con `querySelector('.grid > div > …')` en un carrusel con slides ocultas:** el primero puede ser un `display: none` y su `transform` sale `none`.
- **Espacio en disco:** con el disco al 100 % ningún comando arranca (ni para borrar). Antes de una prueba larga, `df -h /private/tmp`; y `next dev` dentro de la copia aislada (`node_modules/.bin/next dev -p 3101`) sirve para ver el CSS de desarrollo sin volver a compilar.

---

## 18. Vistas con mucha interacción de cliente (catálogo, filtros)

El catálogo de vehículos (`docs/planes/compra-tu-carro.md`) es la primera vista del sitio donde "Server Component por defecto" no alcanza: hay un buscador, ~14 filtros y paginación, todos contra un endpoint real, y todo tiene que re-buscar sin recargar la página. Lo que salió de construirla:

**`react-hooks/set-state-in-effect` (el linter de React 19) prohíbe `setState` síncrono en el cuerpo de un `useEffect`.** Pasó dos veces en esta vista y las dos veces era el mismo error real, no un capricho del linter: un `useEffect(() => { setLoading(true); fetch()... })` dispara renders en cascada. La solución que funcionó, sin pelear con la regla:
- El único `setState` dentro del efecto va **dentro del `.then()`** (asíncrono, eso sí lo permite la regla).
- Para "poner `loading=true` cuando cambia un filtro debounced" (sin saber de antemano cuándo va a cambiar, porque el debounce lo decide un `setTimeout` de un hook aparte): comparar el valor debounced contra el anterior **durante el render** (no en un efecto) y llamar `setState` ahí mismo si cambió — es el patrón que la propia documentación de React recomienda para "ajustar estado cuando cambia algo" (react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes). No dispara el lint porque no corre dentro de un `useEffect`.
- Para combinar varios valores debounced (buscador de texto a 1000ms, precio y kilometraje a 600ms) sin repetir el bloque de arriba tres veces: una sola "firma" (`JSON.stringify([...])`) de los tres, comparada una vez.
- El valor debounced **nunca se sincroniza hacia otro estado con un efecto** ("cuando cambie X, hacé `setY(X)`"): se combina en el punto de uso con `useMemo` (`effectiveFilters = useMemo(() => ({...filters, search: debouncedSearch}), [filters, debouncedSearch])`), y esa referencia memoizada es la que entra en el array de dependencias del efecto que de verdad busca.

**Un objeto de configuración con una función no puede viajar de un Server Component a un Client Component como prop.** `CatalogConfig.countLabel: (count) => string` reventó el build de la copia aislada con un error real y claro ("Functions cannot be passed directly to Client Components"): Next serializa los props del límite servidor→cliente y una función no es serializable. Arreglo: una plantilla de texto (`countLabelTemplate: "Vehículos encontrados: {count}"`) con `.replace()` en el cliente, no una función. Vale para cualquier objeto de config que se arme en `constants/` (server-ish) y se pase a un componente `"use client"`.

**Un filtro que llega por querystring y que solo necesita UNA de varias rutas hermanas no debe leerse con `useSearchParams()` en el componente cliente compartido:** eso fuerza a las rutas que no lo necesitan a salir del renderizado estático también (todas comparten el mismo Client Component). Se lee en el `page.tsx` (Server Component) con el `searchParams` que ya da Next (`Promise<{[k:string]: string|string[]|undefined}>`, hay que hacer `await`) y se pasa como prop ya resuelta (`initialFilters`). En este catálogo: 3 de las 4 rutas siguieron estáticas (`○` en el build) y solo la que de verdad necesita el querystring (`/compra-tu-carro`, con el catch-all opcional `[[...segmento]]`) quedó dinámica (`ƒ`).

**Paginación/grilla que desaparece al cambiar de página:** si el componente de resultados se oculta con `{!loading && <Grid/>}`, cambiar de página lo hace desaparecer un instante (justo lo que se acaba de clicar) y reaparecer con el resultado nuevo — se nota como un parpadeo y, peor, si la prueba automatizada consulta el DOM en ese instante no encuentra nada. Arreglo: el estado del último resultado (`result`) **no se limpia a `null`** al empezar una búsqueda nueva, solo se reemplaza cuando la búsqueda siguiente resuelve; mientras tanto la grilla se atenúa (`opacity-60`) en vez de sustituirse por el esqueleto de carga. El esqueleto completo queda solo para la carga **inicial** (sin ningún resultado todavía), como ya hacía `SkeletonCard` en el código de referencia de la SPA anterior.

**El mismo formulario de filtros, en dos presentaciones que además cambian de LAYOUT (acordeón fijo en desktop, bottom sheet de pestañas en mobile, no un simple drawer que reusa el mismo acordeón):** no hace falta un estado de filtros por presentación, pero tampoco hace falta duplicar la lista de filtros dos veces. Se separa el contenido (título + control de cada filtro) del layout que lo envuelve: una función que arma los doce filtros como datos (`buildFilterSections(...)` → `{id, title, content}[]`), y dos componentes de presentación que la consumen — uno los envuelve en `FilterAccordionComponent` (desktop), el otro los reparte en pestañas de dos columnas (mobile). Las props (`filters`, `onFiltersChange`, los drafts de precio/km, `options`) se arman una sola vez en el componente padre (`const filterProps = {...}`) y se le pasan a los dos con spread. React monta cada aparición como una instancia independiente (su propio "qué acordeón/pestaña quedó abierto"), pero las dos leen y escriben el mismo estado de filtros por props, así que filtrar en una y mirar la otra da el mismo resultado. No hace falta un Context ni duplicar el estado — ni la lista de filtros.

**Sincronizar filtros con la URL (deep-linking) desde un Client Component, sin forzar renderizado dinámico:** ni `useSearchParams()` de Next (mismo problema que el filtro de una sola ruta del párrafo de arriba: fuerza a TODAS las rutas hermanas que comparten el componente a salir de estático) ni `router.replace()` de `next/navigation` (revalida el RSC payload en cada cambio de filtro — lento para algo que se dispara por cada clic). Se lee/escribe con las APIs del navegador directo, igual que hacía la SPA anterior con React Router: `new URLSearchParams(window.location.search)` para leer (una vez, en un `useEffect` al montar) y `window.history.replaceState(null, "", url)` para escribir (nunca `pushState`, para no llenar el botón "Atrás" con un paso por filtro). Un solo booleano (`hydrated`) gatea tanto el efecto de búsqueda como el de escritura hasta que la lectura inicial de la URL termina: sin él, la primera búsqueda sale con los filtros vacíos del primer render y una fracción de segundo después se repite ya con los de la URL (dos búsquedas, y la segunda escritura pisa el `?search=`/`?min_price=` recién leído). Y como esa lectura inicial siembra estados que llevan debounce (buscador, precio, km), hay que sembrar también la "firma" que esos debounces comparan contra sí mismos — si no, cuando el debounce alcanza (600-1000ms más tarde) a un valor que ya estaba sembrado desde el montaje, lo detecta como "cambio nuevo" y resetea la página a 1 por las dudas. Ver `services/url-filters.ts` y el efecto de "Deep-linking" en `CatalogComponent.tsx`.

**Verificar un catálogo con filtros no es solo mirar la captura:** cada filtro se puede confirmar contra un `curl` directo al mismo endpoint con el mismo body (`POST /v2/filter-cars/`) — si el conteo que muestra la UI coincide con el que devuelve el backend para el mismo filtro, está bien probado de verdad, no solo "se ve bien". Sirvió para encontrar, sobre la marcha, que `brand` va por id (por nombre da HTTP 500) y `colors` por nombre (por id no filtra nada): son las dos formas más fáciles de escribir el filtro al revés y solo se ven mal con un dato real, no con la vista vacía.

---

## 19. Una vista sin Figma ni diseño nuevo: la propia página del sitio anterior como fuente

Vende tu Carro (`docs/planes/vende-tu-carro.md`) se construyó sin Figma y sin capturas fiables (el usuario pasó 4 capturas de `wcar.co/vende-tu-carro` a una escala rara, ≈1,99). Lo que valió la pena:

**Cuando la captura es del sitio anterior, medir ese sitio EN VIVO con `cdp.py` gana siempre a estimar píxeles de la captura.** Un script corto con `getBoundingClientRect()`/`getComputedStyle()` sobre `document.querySelectorAll('section')` (y sus hijos directos) dio en dos llamadas la estructura real de la página completa: alto de cada sección, dónde arranca cada una, tamaño de fuente exacto, y hasta el orden real (las capturas del usuario sugerían que la franja "collage" iba pegada al hero; medir el DOM mostró que en realidad es parte de la sección oscura siguiente, un contenedor distinto). Ver [[verificar-figma-contra-render]] y [[probar-en-copia-aislada-y-con-cdp]], que ya documentaban esto para una sola sección: aquí se hizo para una vista entera antes de escribir el plan, no solo para comprobar después.

**Antes de inventar contenido, sondear si esta vista repite datos que YA existen en el proyecto.** Dos hallazgos evitaron traer diseño/contenido nuevo:
- Las "Preguntas frecuentes" de esta vista son, letra por letra, los mismos seis `PROCEDURES` de `/tramites-de-vehiculos` (se confirmó comparando el texto extraído del sitio anterior contra `procedures/constants/procedures.ts`). Se reutilizó la constante importándola, sin copiarla, con un componente de acordeón propio (visual distinto: aquí sin la tarjeta blanca, a todo el ancho).
- Los "Testimonios y Opiniones" no son contenido fijo del diseño: el sitio anterior los pedía a `GET /api/map/` (`.filter(calification > 3)`) y ese mismo endpoint, con las mismas reseñas reales de Google, ya lo consumía `about/services/reviews.ts` para "¿Qué dicen de wcar?" de Sobre Nosotros. Se replicó el filtro (`getReviews({ minRating: 4 })`, parámetro nuevo y opcional para no tocar el comportamiento de Sobre Nosotros) en vez de escribir reseñas de prueba.

**Cuando una pieza pasa a usarse en un segundo módulo, promoverla a `shared/` es mecánico si se hace con `git mv` + grep de sus imports relativos.** En esta vista se promovieron cuatro piezas que antes vivían en `about/`/`procedures/`: el servicio y el tipo de reseñas, `ReviewerAvatarComponent`, `TestimonialCardComponent` (con su ícono) y `AccordionIconComponent`. El método que no dejó nada roto: `git mv` del archivo, luego `grep -rn "<ruta relativa vieja>"` en todo `src/` para encontrar cada import (no asumir que ya se conocen todos), reescribirlos a `@/modules/shared/...`, y `eslint`/`tsc` sobre todo el repo (no solo la vista nueva) para confirmar que el módulo de origen sigue intacto.

**Un componente compartido con un TODO de "esto es decorativo, falta conectarlo" es una señal de qué le falta antes de reutilizarlo.** `CarouselDotsComponent` ya traía escrito "al conectar la lógica del carrusel, convertirlos en botones con aria-label" (nunca se había necesitado hasta ahora). Se le agregó un `onSelect` **opcional**: sin él sigue siendo un `<div aria-hidden>` decorativo (no cambia el uso ya existente en Misión & visión), con él son botones reales con `aria-current`. Ampliar así, en vez de bifurcar el componente o copiarlo, es lo que pide la guía §3.2.

**`cdp.py`'s `shot()` con `captureBeyondViewport=True` puede devolver una región en blanco aunque el contenido ya esté pintado y con opacidad 1,** si esa parte del documento nunca estuvo dentro del viewport real (el método usa coordenadas de documento, pero Chrome no necesariamente renderiza contenido muy lejos del scroll actual bajo `next dev`/producción). Antes de sospechar de `reveal` o de un bug real, hacer `page.js("window.scrollTo(0, Y)")` y esperar ~1s antes de `page.shot(...)` cuando la región a capturar está lejos del top; si con eso aparece, era esto y no el componente.

**Cuando el sitio anterior manda un botón a una URL que en este proyecto ya está declarada mas no construida (`ROUTES.quote` = `/cotizar`, usada también por `ContactAdvisorTabComponent` en el layout global), no hay que inventar un destino ni preguntar:** el enlace es real (confirmado leyendo el DOM/bundle del sitio anterior) y ya existe la constante; simplemente da 404 hasta que exista esa página, igual que le pasa a otras vistas del sitio. Se anota en "Insumos que faltan" y en el reporte del auditor de SEO, no se cambia por `ROUTES.contact` ni por un ancla vacía. (Esa página, `/cotizar`, se construyó después: ver más abajo.)

---

## 20. Una vista que escribe en el backend de verdad: `/cotizar`

`/cotizar` (`docs/planes/cotizar.md`) es la primera vista de este proyecto cuyo envío crea un registro real en producción (`POST /sale-cars/create/`, confirmado contra `GET /sale-cars/`: 6.003 cotizaciones reales). Lo que salió de construirla, más allá de lo que ya cubre §18 (React 19, `set-state-in-effect`) y §19 (fuentes sin Figma):

**Nunca se prueba un envío que escribe contra el backend real, ni en desarrollo ni en verificación.** Los `GET` de catálogo son de solo lectura y sí valen contra el real (más rápido y con datos de verdad). Para el `POST`, se monta un servidor falso mínimo (`http.server` de Python con cabeceras CORS — ver §7, "Verificar", que ya lo pedía para "casos límite"; aquí se detalla el porqué CORS) y la copia aislada se apunta ahí con `NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:PUERTO/api`. El servidor falso puede devolver éxito o error según el valor de un campo cualquiera del body (aquí, un kilometraje mágico), para probar los dos caminos sin depender de que el backend real coopere.

**Un dato que depende de una elección del usuario (marca→versión, departamento→ciudad, fecha→hora) se pide desde el CLIENTE, no desde el servidor:** el componente que lo necesita hace su propio `fetch` con el mismo servicio (`DTO` + función + `apiUrl()`) que usaría un Server Component. Como `NEXT_PUBLIC_API_BASE_URL` empieza con `NEXT_PUBLIC_`, Next.js lo inyecta también en el bundle del navegador: no hace falta una ruta de API propia ni CORS especial del lado de este proyecto (el backend de WCAR ya responde `Access-Control-Allow-Origin` con el origen que pidió, confirmado con `curl -X OPTIONS`).

**Falsa alarma que casi se reporta como bug: un `fetch` desde un `useEffect` que "se cuelga" contra el backend real, mientras uno idéntico tecleado a mano en la consola responde al instante.** No era CORS ni un bug de React: es el arranque en frío de Cloud Run (la app corre en `*.run.app`), que tarda 5-7 segundos la primera vez que el contenedor estaba dormido. Antes de sospechar del código: esperar más (10-15s) y repetir. El estado "Cargando…" del campo ya cubre esto en producción; no hace falta ningún arreglo, solo no confundirlo con un cuelgue real al verificar.

**Cuando otra sesión está a mitad de editar un archivo compartido (visible en `git status` como recién tocado, o porque `npx tsc --noEmit` falla en un módulo que no se tocó) y hace falta verificar de todos modos:** `copia_aislada.sh` no sirve, porque `next build` tipa-chequea TODO el repo y falla por el archivo ajeno roto, no por el propio. En su lugar, una copia manual (mismo patrón: `tar` sin `node_modules`/`.next`/`.git`, luego clonar `node_modules` con `cp -Rc` en APFS) servida con `npx next dev -p PUERTO` en vez de `next build && next start`: Next compila por ruta bajo demanda y no bloquea con errores de rutas que no se visitan. Sirve para probar la vista propia mientras la otra sesión termina; el build de producción real (`copia_aislada.sh`) se corre al final, cuando el archivo ajeno ya esté sano otra vez (`npx tsc --noEmit` limpio en todo el repo antes de darlo por cerrado).

**Un formulario de varios pasos en este proyecto (que no usa `react-hook-form`) va con un único estado por página, no uno por paso:** los pasos son solo qué se pinta, todos leen y escriben el mismo objeto (`{contact, car, book}` aquí), así no se pierde nada al ir y volver con el stepper (probado con `cdp.py`: llenar el paso 1, avanzar, volver por el círculo del stepper, comprobar que el valor sigue ahí). La validación es manual, por paso, al intentar avanzar, no campo a campo al escribir.

**Buscar "el documento que más se parece" por texto en datos reales del backend puede fallar si se adivina la palabra:** se buscó un documento legal titulado con "vendedor" (razonable para un formulario de venta) y no existía — el backend solo tiene nombres de campañas puntuales. Antes de rendirse a un `TODO`, listar los datos reales (`GET /api/terms/no-contents/` completo) y elegir el más parecido de verdad ("WCAR te compra con amor", que sí es sobre vender un carro a wcar) en vez de quedarse con el primer intento fallido.

---

## 18. Ficha de un vehículo (lecciones)

- **Ruta:** un `[tipo]` no puede ser hermano de un catch-all opcional (`[[...typeVehicleName]]`). La ficha se resuelve dentro del mismo `page.tsx` (3 segmentos + id numérico), con `generateMetadata` que ramifica; lo demás, `notFound()`.
- **Figma sin enlace:** se encontró el marco listando las páginas del archivo con `use_figma` (solo lectura) y buscando "Detalles". Dos marcos casi iguales (`89:4207` y `238:4492`): confirmar contra las capturas del usuario cuál es. `exportAsync({format:"SVG_STRING"})` devuelve un SVG completo de un grupo de íconos (el `svgAssets` de `download_assets` los parte en piezas y su `export` trae todo el marco).
- **Backend:** `GET /cars/{id}/` ya trae `description_list` (no hace falta `/description-car/`); `/cars-related/{id}/` lleva barra final (sin ella, 301). Las fotos `/api/v2/img/<ancho>/…` responden 302: la `orig` tarda segundos en frío; una foto casi blanca sobre el panel gris parece "no cargada" en una captura temprana.
- **Grid en mobile:** una tira `overflow-x-auto` dentro de un grid item ensancha la columna (overflowX 2587): `grid-cols-[minmax(0,1fr)]`.
- **Placa:** `tuition` es la placa completa; el servicio solo conserva el último carácter.
