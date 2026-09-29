---
name: plan-de-vista
description: "Crear el plan (.md) de una vista o página nueva de WCAR a partir de capturas y/o un enlace de Figma: un archivo docs/planes/<vista>.md con una tarea por sección, copy exacto, reglas de negocio, imágenes necesarias y registro, listo para ejecutarse en cascada con el skill nueva-vista. Úsalo cuando el usuario pase capturas o un Figma de una página y pida 'el .md', 'el plan', 'planifica la vista' o 'prepara la página X' antes de programarla."
---

# Crear el plan de una vista (WCAR)

Este skill **escribe el plan**; no programa la vista. El plan (`docs/planes/<vista>.md`) se ejecuta después, tarea por tarea, con el skill `nueva-vista` (guía §13 de `docs/guia-nuevas-vistas.md`). Los dos planes ya hechos y ejecutados son la referencia de nivel de detalle: **`docs/planes/taller.md`** (ejecutado de punta a punta) y **`docs/planes/financiacion.md`**. Ábrelos antes de escribir.

Según `CLAUDE.md`: no preguntes lo rutinario; pregunta solo por arquitectura o **reglas de negocio** que no se puedan deducir. Lo que no se sepa se decide, se marca `TODO` y se avisa.

## 1. Reúne los datos de entrada (de lo que dio el usuario, sin preguntar lo obvio)

- **Nombre de la vista y ruta.** Mira si `ROUTES` (`src/modules/shared/constants/routes.ts`) ya tiene la clave (la ruta puede ser anidada: `/servicios/financiacion`).
- **Capturas** (las imágenes de la conversación están en el directorio de imágenes de la sesión; el sistema da su ruta) y/o **enlace de Figma** (`fileKey` y `node-id`, que en la URL va con guion: `193-8183` es `193:8183`).
- ¿Existe la página en el sitio anterior (`https://wcar.co/...`)? Casi siempre sí para las vistas que ya tenía.

## 2. Prepara lo mecánico con el script

```bash
P=.claude/skills/plan-de-vista/scripts
python3 $P/preparar_plan.py <slug> ruta/1.png ruta/2.png ... \
    --nombres hero-y-pasos,banner-y-simulador,... --titulo "Financiación" \
    --ruta /servicios/financiacion --modulo financing --assets financiacion \
    --figma "https://www.figma.com/design/…?node-id=193-8183" \
    --secciones hero,pasos,simulador,... --ampliar 2 \
    --sondear faqs,insurers --sitio-anterior https://wcar.co/financiacion \
    --buscar-js "cuota,Math.pow,tasa"
```

Copia las capturas a `docs/planes/<slug>/` (numeradas), dice la **escala** de cada una, deja copias **ampliadas** en `$TMPDIR/plan-<slug>/`, sondea el backend, baja el texto y los botones del sitio viejo, busca en su bundle reglas de negocio, crea las carpetas de imágenes y deja el **esqueleto** `docs/planes/<slug>.md` desde `plantilla-plan.md`. Es idempotente y no pisa un plan existente. Todas las opciones son opcionales.

## 3. Mira cada captura y transcribe (esto es el trabajo)

1. **Lee cada captura** (`Read`) y su copia ampliada. Un texto pequeño no se lee sin ampliar: recorta la zona y amplíala ×3 con Lanczos. Transcribe **cada texto tal cual, con sus erratas** (tildes que faltan, dobles espacios, lorem, mayúsculas raras): son la fuente del copy y de los `TODO`.
2. **Calibra**: la escala sale de `ancho ÷ 1440` y se comprueba con una medida conocida (el logo/la tarjeta blanca en x=124, la barra negra en 303). Las capturas suelen ser **marcos de 1440 reducidos**, no recortes, aunque un carrusel parezca cortado (sangra fuera del marco por diseño). Escribe la escala y qué error de medida implica (a 0,53 cada píxel son ~1,9 de diseño).
3. **Encaja las capturas en vertical** con un elemento que salga en dos (un botón, una forma que cruza la costura) y anota qué solapa con qué (barras que bajan a la sección siguiente, paneles que pisan a otros).
4. **Segmenta en secciones** siguiendo el diseño de arriba abajo: cada una es una tarea. Anota, por sección, lo que ya existe en el repo y lo que hay que construir.

## 4. Investiga el contexto (antes de escribir las tareas)

- **Piezas ya hechas:** `ls src/modules/shared/components src/modules/*/components`. Lista lo que se reutiliza y, sobre todo, **lo que se repite en dos o más secciones y aún no está en `shared/`** (se extrae la primera vez que se necesita). Ejemplos ya resueltos: `FeatureCardComponent` (título en cursiva, tono oscuro), `SideLabelComponent`, `SectionEyebrowComponent` (con 10 px hasta el texto: `xl:gap-2.5!`), `ButtonComponent`, `DiagonalLinesComponent`, `ZigZagComponent`, el carrusel con barra de progreso, el acordeón `<details name>`.
- **Backend:** el sondeo del script (y `grep apiUrl( src`). Sin endpoint = contenido fijo en `constants/` con el tipo con forma de futuro DTO. Si el diseño y los datos difieren, manda el backend y se deja escrito.
- **Sitio anterior:** su texto real (el diseño suele traer lorem donde el sitio viejo tiene contenido), los **destinos de los botones** (muchos son `<button>` sin enlace: no copiar enlaces raros como el de ZapSign), y las **reglas de negocio** que viven en su JavaScript.
- **Reglas de negocio con ejemplo numérico:** si el diseño trae un ejemplo (un simulador con un resultado), **comprueba con cuentas que la regla lo reproduce**. En Financiación el ejemplo no salía con la fórmula del sitio viejo (10 % / 12) y sí, al peso, con 1,98 % mensual, que era además el tope del rango de tasas del FAQ. Lo que no se pueda confirmar, se deja como constante con `TODO` y en "Insumos que faltan".
- **Figma:** `ToolSearch` por "figma". Si hay herramientas, el plan dice que se usen para medidas y para exportar imágenes; si no, dice que se sigue con las capturas.

## 5. Escribe el plan

Parte del esqueleto y **borra los comentarios de instrucción**. Debe quedar así (mira `taller.md`/`financiacion.md`):

- **Cabecera:** cómo ejecutarlo (el mensaje único), nota de Figma y cuentas, **Estado** con una casilla por tarea.
- **Contexto y decisiones:** ruta, módulo, carpetas de imágenes, diseño (¿mobile?), capturas (escala, anclas, encaje), datos, reglas de negocio, copy, **SEO**, botones, imágenes sin entregar. Y **piezas que se repiten**.
- **Tarea 0** (preparación y calibración), **una tarea por sección** (qué se ve con el copy exacto y las erratas entre comillas; cómo: componentes reutilizados, qué es cliente, solapes, mobile; `TODO`s esperados; **Hecho cuando** verificable), **tarea de imágenes** y **tarea de cierre**.
- **Dónde van las imágenes:** dos tablas (fotos → `public/assets/<vista>/<seccion>/`, vectores → `src/modules/<modulo>/assets/<seccion>/`) con qué es (sin capas encima), carpeta y **nombre final descriptivo en español**, y una línea de "ya existen".
- **Insumos que faltan** y un **Registro** vacío por tarea.

**Reglas de escritura del plan**
1. **Las imágenes van al final**; hasta entonces, cajas del tamaño exacto con `TODO(imagen)` e íconos como SVG provisionales con el nombre definitivo.
2. **El copy del diseño se reproduce tal cual**; el del sitio viejo va en un archivo de referencia (`docs/planes/<slug>/referencia-sitio-anterior.md`), no mezclado con el del diseño.
3. **Cada botón** es un `ButtonComponent`; destino desconocido: `ROUTES.contact` + `TODO`.
4. **Lo interactivo** (simulador, carrusel, acordeón) dice si es cliente y qué se prueba con `cdp.py`.
5. **Decisiones abiertas** (negocio, contenido real vs lorem) con su valor por defecto y a quién preguntar.
6. **No inventes medidas:** las que salen de la captura se dan como hipótesis a comprobar; no des un número que no mediste.
7. Un plan que resulte contradicho al ejecutarlo se corrige **en el Registro**, no en silencio.
8. **El SEO va en el plan, no al final** (guía §16): la fila "SEO" de la tabla de decisiones lleva la **intención de búsqueda** de la vista, el `title` (25-60 caracteres) y la `description` (70-160) propuestos, el **`<h1>`** (¿es el del diseño? ¿dice de qué trata la página?) y qué JSON-LD merece (Sedes/Taller: `AutoDealer`/`AutoRepair`; detalle de vehículo: `Car`). Si una sección trae fotos, su `alt`; si trae títulos partidos en dos líneas, el espacio antes del `block`. Las erratas del copy que caigan en un `h1`/`h2` se listan aparte como "erratas con efecto SEO". Las rutas a las que enlaza la vista y que aún no tienen página (serán 404 hasta que existan) van en "Insumos que faltan". La palabra clave no se inventa: si marketing no la dio, va como decisión abierta con su valor por defecto.

## 6. Entrega

Empieza el mensaje con una línea de para quién es el plan (el usuario y la sesión que lo ejecute). Luego, corto: dónde quedó el plan, cuántas tareas, **qué decisiones abiertas necesitan al usuario** (negocio, contenido), **qué imágenes se necesitan y en qué carpetas** (o que se bajarán de Figma), y el mensaje único para ejecutarlo. Si se descubrió algo nuevo que valga para los próximos planes, actualiza este skill y la guía.

## Archivos del skill

- `plantilla-plan.md` — el esqueleto del plan, con comentarios de instrucción y el bloque de tarea.
- `scripts/preparar_plan.py` — carpeta, capturas numeradas con escala, ampliaciones, sondeo del backend, lectura del sitio anterior (texto, botones y búsqueda en su bundle), carpetas de imágenes y esqueleto del plan.
