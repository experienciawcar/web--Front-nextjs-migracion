# Plan: vista {{TITULO}} (`{{RUTA}}`)

<!-- PLANTILLA del skill `plan-de-vista`. Todo lo que está entre comentarios HTML es instrucción para quien escribe el plan: bórralo al terminar. Los ejemplos ya escritos y ejecutados son `docs/planes/taller.md` y `docs/planes/financiacion.md`: ábrelos y copia su nivel de detalle. -->

Plan para integrar la vista **{{TITULO}}** en cascada: una tarea por sección, en orden, sin empezar la siguiente hasta cerrar la anterior. Se apoya en `docs/guia-nuevas-vistas.md` (sobre todo §12 y §13) y en el skill `nueva-vista`; aquí solo va lo propio de esta vista. Se creó con el skill `plan-de-vista` el {{FECHA}}.

## Cómo ejecutarlo

Un solo mensaje:

> Usa el skill `nueva-vista` y ejecuta `docs/planes/{{SLUG}}.md` tarea por tarea. Al terminar cada una: verifícala (lint, tipos y medidas en la copia aislada), márcala `[x]`, anota lo que estimaste o dejaste como `TODO` en el **Registro** del final y solo entonces sigue con la siguiente. Si una tarea depende de algo que no tienes, decide, marca `TODO` y sigue; no te detengas a preguntar por lo rutinario.

Para retomar tras un corte: "continúa `docs/planes/{{SLUG}}.md` desde la primera tarea sin marcar".

**Figma:** archivo `{{FIGMA_FILE}}`, nodo `{{FIGMA_NODO}}`. Si la sesión tiene el MCP de Figma cargado (se comprueba en la tarea 0), úsalo para medidas exactas y para exportar las imágenes (tarea de imágenes) en vez de estimar de las capturas. La cuenta con plan Pro es `disenotec@wcar.co` (200 llamadas/día); `efuentes@wcar.co` es Starter (20 al mes).

## Estado

<!-- Una casilla por tarea; los nombres, los de las secciones del diseño en el orden en que aparecen. La 0, la de imágenes y la de cierre van siempre. -->
- [ ] 0. Preparación (ruta, módulo, calibración, Figma, backend, decisiones)
- [ ] 1. <sección 1>
- [ ] 2. <sección 2>
- [ ] N. Imágenes (fotos, iconos y marcos compuestos)
- [ ] N+1. Cierre (costuras, mobile, verificación final, documentación)

## Contexto y decisiones ya tomadas

| Tema | Decisión |
|---|---|
| Ruta | `{{RUTA}}` → `{{RUTA_APP}}`. Si existe una clave en `ROUTES` (`shared/constants/routes.ts`), úsala; no escribas la URL a mano |
| Módulo | `src/modules/{{MODULO}}/{components,constants,services,types,assets}` |
| Imágenes | Fotos en `public/assets/{{ASSETS}}/<seccion>/`; vectores en `src/modules/{{MODULO}}/assets/<seccion>/`. Lista completa al final |
| Diseño | Capturas en `docs/planes/{{SLUG}}/` (tabla abajo) y el nodo de Figma. <!-- ¿hay diseño mobile? Casi nunca: "No hay diseño mobile → guía §4.3 y se marca en el JSDoc" --> |
| Capturas | <!-- Escala (ancho ÷ 1440) y qué se sabe: "marcos de 1440 reducidos a ≈0,xx; cada píxel son N px de diseño". Anclas conocidas para calibrar (contenedor 124…1316, barra 303, panel desde 124). Cómo encajan en vertical (un elemento que salga en dos capturas). --> |
| Datos | <!-- Resultado del sondeo del backend y de qué se alimenta cada dato. Sin endpoint: "contenido fijo en `constants/`". Con tabla "diseño vs backend" si difieren. --> |
| Reglas de negocio | <!-- Fórmulas, tasas, límites. Si hay un ejemplo con números en el diseño, comprobar que la regla lo reproduce (así se dedujo la del simulador de Financiación). Lo no confirmado: constante + `TODO`. --> |
| Copy | Se reproduce **tal cual, con sus erratas**, cada una con `TODO: confirmar con diseño` (guía §9). Lo que no se lee bien se amplía; si aun así no se sabe, se marca |
| SEO | <!-- Guía §16. Intención de búsqueda de la vista (una); `title` de 25-60 caracteres y `description` de 70-160, únicos; `canonical`; el `<h1>` (¿el del diseño dice de qué trata la página? si no, `TODO(seo)` pidiendo uno); JSON-LD que merece (`AutoDealer`/`AutoRepair` en Sedes y Taller, `Car` en un vehículo, `BreadcrumbList`) con datos reales; erratas del copy que caen en un h1/h2 ("erratas con efecto SEO"). Sin palabra clave de marketing: valor por defecto + `TODO(seo)`. --> |
| Botones | Todos `ButtonComponent`. Sin destino en el diseño: `ROUTES.contact` provisional + `TODO` |
| Imágenes sin entregar | Caja del tamaño exacto en gris con `TODO(imagen)`; íconos como SVG provisional con el **nombre definitivo** |

### Capturas

| Archivo | Tamaño | Escala |
|---|---|---|
{{TABLA_CAPTURAS}}

### Piezas que se repiten (constrúyelas una vez, reutilízalas)

<!-- Revisa `src/modules/shared/components/` y el resto de módulos ANTES de listar. Anota lo que ya existe (y dónde) y lo que se repite en dos o más secciones de esta vista y aún no está en `shared/`. -->
- …

---

## Tarea 0 · Preparación

- [ ] Leer `docs/guia-nuevas-vistas.md` (§12 y §13), `SKILL.md`, un plan ya ejecutado (`docs/planes/taller.md`) y la guía de Next que toque en `node_modules/next/dist/docs/` (lo exige `AGENTS.md`).
- [ ] Comprobar si hay MCP de Figma (`ToolSearch` por "figma") y, si lo hay, leer el nodo.
- [ ] **Calibrar las capturas** (guía §12.1 y §12.12) y anotar en el Registro la escala y el origen de cada una y cómo encajan en vertical.
- [ ] Crear `{{RUTA_APP}}` (metadata, JSDoc con "Faltan por agregar" y la fuente) y `src/modules/{{MODULO}}/`.
- [ ] Comprobar que el navbar y el footer enlazan la ruta.
- [ ] Sondear el backend una vez más y dejar escrito el resultado.
- [ ] <!-- lo propio de la vista: leer la referencia del sitio anterior, dejar constantes de reglas de negocio con su TODO, etc. -->

**Hecho cuando:** `{{RUTA}}` responde 200 con navbar y footer, sin secciones aún, y `npx eslint src && npx tsc --noEmit` pasa.

---

### Bloque de tarea (copiar una vez por sección y borrar este encabezado)

```markdown
## Tarea N · <Nombre de la sección> — captura `<archivo>.png` (<parte superior|inferior|entera>)

Qué se ve:
- (De arriba abajo y de izquierda a derecha: fondos, formas, textos EXACTOS con sus erratas entre comillas, íconos con su descripción, fotos con su descripción, botones con su variante y texto, adornos. Marca lo que ya existe en el repo.)

Cómo:
- (Componentes compartidos a reutilizar por nombre; qué es interactivo —cliente— y qué no; qué se mide por ancho natural; qué solapa con la sección anterior o la siguiente —z-index, barras o columnas que cruzan—; cómo baja a mobile: sin diseño, guía §4.3.)

`TODO`s esperados: (contenido, diseño por confirmar, imágenes, negocio)

**Hecho cuando:** (lo verificable: medidas a 1440/1900/393, `overflowX` = 0, comparación con la captura, interacción probada con `cdp.py`)
```

## Tarea N · Imágenes

- [ ] Si hay Figma: exportar **fotos como imagen a 2×** (no SVG) y los vectores como SVG. Si no: `python3 $S/svg_a_webp.py extraer public/assets/{{ASSETS}}/*/*.svg --salida "$TMPDIR/salida" --ancho-max 1000 --hoja` y **mirar `hoja-contacto.jpg` antes de nombrar nada** (guía §6.2).
- [ ] Nombres descriptivos en español y WebP q82 a ≤2× del tamaño en pantalla.
- [ ] Marcos compuestos (fondo + foto + logo + texto): `renderizar --sin-trazos` para el fondo; logo y texto aparte; degradados y rayados en CSS.
- [ ] Sustituir cada caja `TODO(imagen)` por su `<Image>` con `sizes`, `alt` y `object-position` (`registrar_foto.py`). `preload` solo en la foto del hero.
- [ ] Apartar los SVG originales pesados **fuera del repo** (`../originales/{{ASSETS}}/`; no borrar sin copia).
- [ ] Los vectores reemplazan a los provisionales con el mismo nombre.

**Hecho cuando:** no queda ningún `TODO(imagen)`, no hay SVG con base64 en el repo y todas las imágenes cargan.

---

## Tarea N+1 · Cierre

- [ ] **Costuras** a 1440 y 1900 entre todas las secciones. `overflowX` = 0.
- [ ] **Mobile 393** de toda la página con `cdp.py`, revisada visualmente.
- [ ] Verificación completa (guía §7) **en copia aislada** (`copia_aislada.sh`); nunca `next build` en la carpeta real.
- [ ] `grep -rn TODO src/modules/{{MODULO}}`: clasificarlos (contenido, diseño por confirmar, imágenes, negocio/backend) y ponerlos en el reporte.
- [ ] Actualizar la lista "Faltan por agregar" y el JSDoc de `page.tsx`.
- [ ] **SEO** (guía §16): `python3 .claude/skills/nueva-vista/scripts/auditar_seo.py --base http://localhost:3100 {{RUTA}}` sin **errores**; los avisos, arreglados o justificados en el Registro; los pendientes del sitio y los enlaces que dan 404 (rutas sin página), al reporte.
- [ ] Verificar que lo extraído a `shared/` no cambió las demás vistas.
- [ ] Documentar lo aprendido en la guía, en `SKILL.md` y en este skill si el plan tuvo que corregirse; guardar en la memoria del proyecto lo que valga.
- [ ] Reporte corto: qué quedó, qué se estimó, **qué debe confirmar el usuario** y qué falta de otros.

---

## Dónde van las imágenes

Las carpetas ya están creadas. Deja los archivos en la carpeta de su sección (o pide que se bajen de Figma). Si dudas, déjalos en `public/assets/{{ASSETS}}/` y se clasifican.

<!-- Dos tablas, una por tipo. Columnas: Sección | Qué es (sin capas encima: logos, texto, degradados y rayados van en código) | Carpeta | Queda como (nombre descriptivo en español). Cierra con "Ya existen (no hay que pasarlos): …". -->

### Fotos (WebP) → `public/assets/{{ASSETS}}/<seccion>/`

| Sección | Qué es | Carpeta | Queda como |
|---|---|---|---|

### Vectores (SVG) → `src/modules/{{MODULO}}/assets/<seccion>/`

| Sección | Qué es | Carpeta | Queda como |
|---|---|---|---|

---

## Insumos que faltan (para pedir de una vez)

<!-- Mobile · reglas de negocio por confirmar · contenido real vs lorem · destinos de botones · fotos a 2× y SVG (o el MCP de Figma) · palabra clave, title y description de marketing · rutas enlazadas que aún no tienen página -->
- …

---

## Registro

_Se completa al cerrar cada tarea: fecha, qué se estimó, qué `TODO` quedó y qué se aprendió._

| Tarea | Notas |
|---|---|
| 0 | |
