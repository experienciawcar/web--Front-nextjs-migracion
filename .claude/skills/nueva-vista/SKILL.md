---
name: nueva-vista
description: "Integrar una vista o sección nueva del diseño de WCAR en este proyecto Next.js 16 + Tailwind v4: maquetarla desde Figma o capturas, conectar su endpoint con DTO y servicio, optimizar las imágenes (incluidos los SVG de Figma con fotos incrustadas), dejarle su SEO (metadatos, un h1, alt, canonical, Open Graph, JSON-LD) y verificarla con números a 1440, 1900 y 393 px y con el auditor de SEO. Úsalo cuando el usuario pida integrar, hacer o continuar una vista/sección, pase una captura del diseño, un endpoint, un SVG pesado, pida optimizar imágenes de una sección o pida revisar/mejorar el SEO del sitio."
---

# Integrar una vista nueva (WCAR)

**Antes de escribir código, lee `docs/guia-nuevas-vistas.md`.** Es la referencia; esto es el atajo. Está escrita con lo que pasó de verdad en "Sobre Nosotros" y cada regla existe porque su ausencia costó tiempo. Y lee la guía de Next de `node_modules/next/dist/docs/` que toque (lo exige `AGENTS.md`).

**Si te pasan un plan (`docs/planes/<vista>.md`)**, o la vista tiene varias secciones: ejecútalo **tarea por tarea**, en orden, y no empieces una hasta verificar la anterior, marcarla `[x]` y anotar en su **Registro** lo medido, lo estimado y los `TODO`. Si una tarea depende de algo que no llegó (fotos, iconos), decide, deja una caja provisional con `TODO(imagen)` y sigue; no inventes. La plantilla es `docs/planes/taller.md`; el método, `guia §13`. **Si todavía no hay plan** (solo capturas o un Figma y la orden de "haz el .md"), usa primero el skill `plan-de-vista`. Empieza siempre por calibrar cada captura (`guia §12`).

## 1. Insumos: revisa qué te falta y pídelo de una vez

Un solo mensaje al usuario con lo que falte, no goteando preguntas:

- Diseño **desktop y mobile** (link Figma con node-id, o capturas a 1440 y 393) y estados (hover, abierto, vacío).
- Fotos como **imagen** (PNG/JPG/WebP @2×); SVG solo para vectores.
- **URL del endpoint** y respuesta de ejemplo. Si no la dan, sondéala: `curl` a `/api/<nombre>/`.
- Copy final, o confirmación de que lo del diseño es provisional.
- **Intención de búsqueda** de la vista (qué escribiría alguien para llegar) y, si marketing la tiene, `title` y `description`. Sin ella se escriben desde el diseño con `TODO(seo)`; no se inventa una palabra clave.

**Si hay acceso al MCP de Figma** (cuenta Pro: disenotec@wcar.co; carga los skills `figma:figma-design-to-code` y `figma:figma-use`): úsalo desde el principio en vez de estimar de capturas. `download_assets` da las fotos originales y los íconos, y `use_figma` (SOLO lectura) da el modo de relleno y el recorte de cada foto, las opacidades, los degradados y **el texto exacto** de cada `TEXT` (en las capturas se leía "vehiculo" sin tilde y era "vehículo"). Ojo con lo que engaña (`x`/`y` de nodos girados, export reducido a 4096 px, `get_design_context` que no dice el recorte): guía §14.

**Si la captura es del sitio anterior (`wcar.co`)**, no estimes de los píxeles: mide ese sitio con `cdp.py` (cajas y estilos de cada elemento) y lee su bundle JS (`/static/js/main.*.js`) para saber qué hace cada botón (guía §12.17). **Si solo hay una captura** (sin Figma): guía §12 (calibrar, colores de la captura ≠ hex, `registrar_foto.py`, tamaño de fuente por ancho natural, comparar contra la captura). Antes de pedir las fotos, mira si ya están en `public/assets/`.

Contrasta diseño y backend **antes de maquetar** (`curl … | python3 -m json.tool`): campos que faltan, cantidades que no cuadran, unidades (`time` en segundos). Si el diseño y los datos no coinciden, manda el backend y se deja escrito.

Según `CLAUDE.md`: no preguntes lo rutinario; pregunta solo por arquitectura o reglas de negocio. Con lo que no se pueda saber (mobile, un estado), **decide, marca `TODO` y avisa al terminar**.

## 2. Construir

1. **Datos:** `types/x.ts` (`XDto` + tipo de vista) → `services/x.ts` con `apiUrl()`, `fetch` con `next.revalidate` (1 h, por las URLs firmadas de 24 h), `try/catch` que devuelve `[]` y `console.error`. El componente nunca ve el DTO. Ni `fetch` en componentes ni URLs a mano.
2. **Componente servidor** (datos + estructura) y, solo si hay interacción, **uno cliente aparte** por props.
3. **Lienzo de 1440 centrado con los fondos que sangran** (`guia §4.2`). Nada en px desde el borde de la ventana: se ve pegado a la izquierda en 1900. Sin `relative` en el `container-wcar` si dentro hay absolutos del lienzo. **Una tarjeta que se monta sobre el hero con `-mt-*`:** pon `flow-root` en el contenedor que trae el fondo, o su margen colapsa hacia el padre, lo sube con el gris y tapa el hero (`guia §8`); y lo que deba verse encima de la tarjeta (el jeep) lleva `z-*` mayor.
4. **Reutiliza:** `ButtonComponent` (todos los botones), `useCarousel` (o `useInfiniteCarousel` si debe dar la vuelta) + `CarouselArrowsComponent` + `CarouselProgressComponent` (barra de progreso continua y clicable), `SideLabelComponent`, `SectionEyebrowComponent`, `DiagonalLinesComponent`, `ZigZagComponent`, `FeatureCardComponent` (`titleItalic`, `titleMarker` para "1. Título", `tone`, `iconClassName`), `StarRatingComponent`, `AppLinkComponent`, `ROUTES`. Acordeones con `<details name>`. Si algo se repite en dos vistas, súbelo a `shared/`.
   **Aparición al hacer scroll:** la clase `reveal` en los títulos, párrafos, tarjetas y fotos de cada sección (`reveal reveal-left` de costado, `reveal reveal-fade` solo fundido; en un componente compartido, por su `className`). Sin hooks ni componentes cliente: ya lo enciende el layout. En un carrusel, en su contenedor y no en cada tarjeta; no en fondos, barras ni rayados. Guía §3.4.
5. **Controles de carrusel siempre visibles** y funcionales, aunque haya pocos elementos.
6. **Imágenes** (abajo). Añade la sección a `page.tsx` en el orden del diseño y actualiza "Faltan por agregar".
7. **SEO de la vista** (guía §16, léela: hay mucho ya medido). En `page.tsx`: `metadata` con `title` de 25-60 caracteres y `description` de 70-160, **únicos**, y `alternates.canonical`; `openGraph` repitiendo lo compartido con un spread (el de la página reemplaza al del layout entero). En el marcado: **un solo `<h1>` que diga de qué trata la página**, `h1 → h2 → h3` sin saltos, un espacio real (`{" "}`) antes de un `<span className="block">` dentro de un título, `alt` descriptivo en cada foto de contenido (`alt=""` + `aria-hidden` en lo decorativo), `preload` solo en la foto del LCP (`priority` está deprecado), enlaces por `AppLinkComponent`/`ROUTES`. JSON-LD (`AutoDealer`/`AutoRepair`, `BreadcrumbList`…) solo con datos reales y con `<` escapado. **Antes de añadir robots, sitemap, `metadataBase`, `title.template` u Open Graph base, mira `ls src/app` y `layout.tsx`: son tareas de todo el sitio (guía §16.3) y quizá ya existen**; si no existen, no las metas a escondidas en una vista, avisa. Una ruta relativa en la metadata rompe el build sin `metadataBase`.
8. **Documenta en el JSDoc:** nodo de Figma, medidas, decisiones, qué se estimó de una captura y los `TODO` (incluidos los `TODO(seo)`).

**El texto del diseño se reproduce tal cual** (lorem, erratas, teléfonos de relleno) con `TODO: confirmar con diseño`. No inventes copy ni conviertas datos de relleno en enlaces reales. Si una errata cae en un `<h1>` o `<h2>` ("Santarder", "sutitución"), además de reproducirla, ponla en el reporte como **errata con efecto SEO**.

## 3. Imágenes

**Con Figma no hay SVG con fotos:** `download_assets` baja el PNG/JPEG original (ignora las miniaturas de 300-400 px). `FILL` y `CROP` con `b = d = 0` se resuelven con `object-cover` y su `object-position` (guía §14.4). Si la foto está **espejada, inclinada, estirada o con ajustes de imagen**, `scripts/figma_imagen.py` la hornea a un WebP ya recortado (y `comparar` la verifica contra el export); los oscurecimientos y degradados van en CSS. `sizes` = el ancho al que SE VE la foto.

**Solo con SVG de Figma (sin acceso al MCP):**

Los SVG de Figma con fotos traen el PNG/JPEG en base64 dentro (hasta 30 MB) y capas ocultas. **No los subas ni los dejes en el repo.**

```bash
S=.claude/skills/nueva-vista/scripts
python3 $S/svg_a_webp.py extraer public/assets/<vista>/<seccion>/*.svg --salida "$TMPDIR/salida" --ancho-max 1000 --hoja
python3 $S/svg_a_webp.py renderizar marco.svg --salida panel.webp --sin-trazos --escala 2   # marcos compuestos
```

1. Corre `extraer` con `--hoja`, **mira `hoja-contacto.jpg`** para identificar cada foto y ponle un nombre descriptivo en español (`fachada-sede-calle.webp`).
2. Instala los WebP en `public/assets/<vista>/<seccion>/` y **aparta los SVG originales fuera del repo** (no los borres sin copia).
3. El degradado oscuro que Figma pone sobre la foto va en **CSS**, no en la imagen (el script da su % y opacidad).
4. Marco compuesto (fondo + foto + logo + texto): el fondo con `renderizar --sin-trazos`, el logo como SVG propio y el texto como texto real.
5. Si la foto se recorta con CSS en otra proporción, o `extraer` falla o saca la foto equivocada: `originales` (todas las fotos incrustadas, enteras). Los nombres de los SVG del sitio anterior engañan: mira siempre la hoja de contacto.
6. Si hay que decir qué carpeta usar: `public/assets/about-us/<seccion>/` para "Sobre Nosotros"; crea la carpeta para que el usuario suba ahí.

## 4. Verificar (obligatorio)

`npx eslint src && npx tsc --noEmit`, y después **siempre en una copia aislada**: en este repo trabajan varias sesiones y el usuario (`next dev`) y todos comparten `.next`. Un `next build` en la carpeta real deja el CSS en 500.

```bash
S=.claude/skills/nueva-vista/scripts
$S/copia_aislada.sh start          # copia, compila y sirve en :3100; comprueba HTML y CSS = 200
python3 $S/medir_seccion.py http://localhost:3100/<ruta> '<selector de la sección>' \
    --anchos 1440,1900,393 --cajas 'h2|<otro selector>' --salida "$TMPDIR/x" [--hover '<selector>']
$S/copia_aislada.sh stop           # apaga SOLO su puerto y borra la copia
```

- **Nunca** `pkill -f next` ni matar puertos ajenos. Solo lo que arrancaste tú.
- **`copia_aislada.sh start` apaga lo que escuche en su puerto y borra su carpeta de copia.** Antes mira `lsof -iTCP -sTCP:LISTEN -P`: si otra sesión usa el 3100 (pasó con "Contacto"), corre con `WCAR_PUERTO=3140 WCAR_COPIA=<scratchpad>/copia` (y `stop` con las mismas variables).
- Un elemento `fixed` no sale en la captura de `medir_seccion.py` (recorta la sección): captura la ventana con `page.call("Page.captureScreenshot", format="png")` y mide con `getBoundingClientRect`.
- Comprueba: `overflowX` = 0, imágenes cargadas, cajas contra las medidas del diseño, y **mira las capturas** (los números no ven un logo tapando una línea).
- Con Figma (una sección mobile o desktop): baja el export del nodo (`get_design_context` lo trae, o `download_assets`) y corre `comparar_elemento.py URL 'selector' export.png --contiene 'texto'`: diferencia por bandas y renglones de texto de ambos. La guía §17 tiene el caso del Home mobile.
- Con solo capturas (sin Figma): `comparar_captura.py` (diferencia media por región + `mezcla.png`), `comparar_lineas.py` (línea base y extremos de cada renglón, render contra captura) y `medir_texto.py` (ancho de tinta a varios tamaños, dentro de la página). Una diferencia de 1 px es ruido; busca las de 2 o más.
- Interacción real con `scripts/cdp.py` (hover con `page.mouse`, clics con `page.js`): flechas, rayas, abrir/cerrar, `prefers-reduced-motion`.
- Si usaste `reveal`: `python3 $S/comparar_reveal.py --base http://localhost:3100 /<ruta> --anchos 1440,1900,393`. La página revelada debe salir **idéntica al píxel** a la de referencia y sin `overflowX` con todo oculto; sale con error si no. Compara en memoria (no escribe PNG grandes). En `next dev` usa `localhost`, no `127.0.0.1`: en este último no hidrata.
- **Llevar una vista ya hecha a su marco mobile**: `get_screenshot` del marco con `maxDimension` = su alto real (imagen 1:1), captura a 393 y las dos lado a lado por tramos (desfase entre navbars aparte). Guía §21 (margen negativo que colapsa → `flow-root`, un solo texto con `<br>` por breakpoint, variables CSS para geometrías distintas, `ls shared/components` antes de crear uno nuevo). Si `cdp.py` devuelve "This page couldn't load", usa Chrome directo con `--screenshot`.
- Casos límite con un servidor falso: campo nulo, texto larguísimo, sin foto, 1 y 10 elementos, lista vacía. Construye la **copia** con `NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:PUERTO/api`.
- **SEO** con la copia levantada: `python3 $S/auditar_seo.py --base http://localhost:3100 /<ruta>` (lee el HTML que recibe un rastreador; solo GET). Cero **ERROR** (título/descripción ausentes o repetidos, `<h1>` distinto de uno, saltos de nivel, `<img>` sin `alt`, `noindex`, JSON-LD inválido). Los **AVISO** se arreglan o se justifican (título fuera de 25-60, palabras pegadas, precargas de más). Los **PENDIENTE** (canonical, Open Graph, JSON-LD, enlaces 404) son del sitio: al reporte, salvo que ya exista lo que falta, y entonces se corre con `--estricto`. Con `--sitio` revisa además robots, sitemap y la 404. Guía §16.2, punto 7.

## 5. Al terminar, reporta

Corto y sin adornos: qué quedó, qué se estimó o adaptó (mobile sin diseño, medidas de captura), **qué debe confirmar el usuario** (copy, colores, erratas, teléfono, **palabra clave de la vista y erratas con efecto SEO**) y qué falta de otros (assets, backend). Del auditor de SEO: los errores y avisos que quedaron y por qué, y los enlaces de la vista que dan 404. Si aprendiste algo nuevo que valga para la próxima vista, actualiza `docs/guia-nuevas-vistas.md` y este archivo.

## Archivos del skill

- `scripts/copia_aislada.sh` — `start|stop`: copia, compila y sirve sin tocar la carpeta real.
- `scripts/medir_seccion.py` — mide y captura una sección a varios anchos (cajas, `overflowX`, imágenes, hover).
- `scripts/figma_imagen.py` — hornea una foto con el relleno de Figma (`imageTransform`: espejo, inclinación, estirado, recorte) y los ajustes de imagen (color por mínimos cuadrados contra el export) a WebP; `comparar` la verifica contra el export. Guía §14.
- `scripts/auditar_seo.py` — el SEO técnico de una o varias rutas visto como lo ve un rastreador (título y descripción únicos, un `<h1>`, saltos de nivel, `alt`, canonical, Open Graph, JSON-LD válido, palabras pegadas en títulos, enlaces internos que dan 404) y, con `--sitio`, robots, sitemap y la 404. Errores, avisos y pendientes del sitio; `--estricto` hace fallar a los pendientes. Sin dependencias, solo GET. Guía §16.
- `scripts/comparar_reveal.py` — comprueba la aparición al hacer scroll (`reveal`): la página revelada idéntica al píxel a la de referencia, estilo final natural de cada elemento y `overflowX` con todo oculto. Guía §3.4.
- `scripts/captura_pagina.py` — la página completa a un ancho real (también 393) en un PNG, con el conteo de imágenes cargadas y la posición de cada sección.
- `scripts/comparar_elemento.py` — UN elemento de la página real contra el PNG de su nodo de Figma: diferencia media y por bandas, y los renglones de texto de cada uno (delatan desfases de 2 px). Para las secciones mobile hechas con el MCP. Guía §17.
- `scripts/comparar_figma.py` — el render contra el export de Figma por regiones: diferencia y el desplazamiento vertical `dy` que mejor encaja (delata la sección corrida). Usa la escala vertical y horizontal del export por separado.
- `scripts/svg_a_webp.py` — `extraer` (foto con su recorte), `originales` (todas las fotos incrustadas, enteras y sin recorte) y `renderizar` (marco compuesto) a WebP.
- `scripts/registrar_foto.py` — escala y recorte de una foto dentro de una captura (correlación); para cuando no hay Figma (guía §12).
- `scripts/comparar_captura.py` — pasa la captura a px de diseño y da la diferencia media por región del render (más `mezcla.png` y `diff.png`); guía §12.
- `scripts/comparar_lineas.py` — línea base y extremos en x de cada renglón de texto, en el render y en la captura.
- `scripts/medir_texto.py` — ancho de caja y de tinta de un texto a varios tamaños con la fuente real, y línea base dentro de una línea de un alto dado (mide dentro de `main`, no del `body`).
- `scripts/cdp.py` — cliente mínimo del protocolo de Chrome (sin dependencias): viewport real, JS, mouse, capturas.
