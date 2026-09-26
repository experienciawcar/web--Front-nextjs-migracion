# Guía para integrar una vista nueva

Cómo pasar una vista del diseño a este proyecto sin repetir los tropiezos de "Sobre Nosotros" (`/about-us`, 10 secciones más navbar y footer, ~4.100 líneas). Está escrita con lo que pasó de verdad: cada regla existe porque su ausencia costó tiempo.

> El skill `nueva-vista` (`.claude/skills/nueva-vista/`) automatiza la parte pesada: copia aislada para probar, medición y capturas a varios anchos, y conversión de SVG de Figma con fotos a WebP. Esta guía es la referencia; el skill es el atajo.

---

## 0. En diez líneas

1. **Antes de empezar, reúne los insumos** (§2). La mayor parte del tiempo perdido fue esperar o adivinar lo que no venía.
2. **Estructura por capas:** `types/` (DTO) → `services/` (fetch con `apiUrl`) → `components/`. La página solo compone secciones.
3. **Server Component por defecto.** `"use client"` solo para la interacción, en un archivo aparte que recibe datos por props.
4. **Lienzo de 1440 centrado; los fondos sangran** hasta el borde de la ventana. Nada posicionado en píxeles desde el borde izquierdo de la ventana (§4).
5. **Reutiliza antes de crear:** botones, flechas, carruseles, etiquetas laterales, rayas, zigzag (§3.2).
6. **Los botones son `ButtonComponent`**, sin excepciones.
7. **Fotos: WebP a ≤2× del tamaño en pantalla.** Los SVG de Figma con fotos incrustadas se convierten con `svg_a_webp.py`, nunca se suben tal cual (§6).
8. **El texto del diseño se reproduce tal cual** (lorem, erratas) con un `TODO`; no se inventa copy ni datos (§9).
9. **Verifica con números**, a 1440, 1900 y 393 px, **en una copia aislada** (§7).
10. **Documenta en el componente** el nodo de Figma, las medidas y las decisiones, y deja los pendientes como `TODO`.

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
| Tokens | `src/app/globals.css` (`@theme`): colores, escala tipográfica; `container-wcar` y `button-shine` son `@utility` |
| Diseño | Figma "Wcar Website - 2026", fileKey `7ndc02TbteM7uS512k3nKS`. Desktop 1440 y mobile 393 |

Referencia de un módulo terminado: `src/modules/about/` (todas las secciones de Sobre Nosotros).

---

## 2. Antes de escribir código: qué pedir

Sin esto se trabaja de estimaciones y se rehace. Es **la mejora que más tiempo ahorra**.

- [ ] **Diseño desktop Y mobile** de cada sección (link de Figma con node-id, o capturas a 1440 y 393). Si falta mobile, se adapta con el criterio del resto de la página y se marca en el comentario.
- [ ] **Estados que no se ven:** hover, abierto/cerrado, vacío, error, cargando.
- [ ] **Assets exportados correctamente:** las fotos como **PNG/JPG/WebP a 2×**, no como SVG; SVG solo para vectores (logos, íconos, formas). Si hay una foto recortada en Figma, exportar el marco ya recortado.
- [ ] **El endpoint completo** (URL) con un ejemplo de respuesta, y qué campo alimenta qué parte del diseño.
- [ ] **El copy final**, o la confirmación de que lo del diseño (lorem, "Mas" sin tilde, teléfonos de relleno) es provisional.
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
| Flechas anterior/siguiente | `CarouselArrowsComponent` |
| Un carrusel con scroll-snap | `useCarousel<T>()` → `[ref, carrusel]` (`position`, `positions`, `canPrev`, `canNext`, `prev`, `next`, `scrollToPosition`) |
| Título partido con barra negra | `SideLabelComponent` |
| Antetítulo (raya + texto) | `SectionEyebrowComponent` (raya de 115 px) o `InlineEyebrowComponent` |
| Icono + título + descripción | `FeatureCardComponent` |
| Estrellas de calificación | `StarRatingComponent` (solo llena y media; no hay vacía) |
| Rayas diagonales / zigzag | `DiagonalLinesComponent` (`white`/`gray`), `ZigZagComponent` |
| Enlace interno o externo | `AppLinkComponent` (elige `<Link>` o `<a>`) |
| Rutas | `ROUTES` en `shared/constants/routes.ts` (no escribir `"/contacto"` a mano) |
| Acordeón | `<details name="…">` nativo con `group-open:` (como `FooterTermsComponent` y `ValuesComponent`); sin JavaScript |

Si una pieza se repite en dos vistas y aún no está aquí, **sácala a `shared/`** en vez de copiarla.

### 3.3 Reglas de interacción que el usuario ya pidió

- **Los controles de un carrusel se ven siempre**, aunque haya pocos elementos, y deben funcionar. Con menos elementos de los que caben, se deja un hueco final (`after:w-[calc(100%-…)]`) para que el último llegue al borde y se pueda avanzar.
- **Todo centrado en pantallas anchas** (§4).
- **Una raya de paginación por posición**, y clicable.

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
    <div aria-hidden className="absolute inset-0 bg-light-gray xl:right-[calc(50%-50vw)] xl:left-[303px]" />

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
5. **Casos límite de los datos** con un servidor falso (`python3` + `NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:PUERTO/api npx next build` en la **copia**): campo nulo, texto larguísimo, sin foto, 1 elemento, 10 elementos, lista vacía. La API real casi nunca trae los casos raros (3 asesores, todos completos).
6. **Mirar la captura.** Los números no ven todo: un logo tapando una línea, una comilla pegada a las estrellas.

Checklist final: lint ✓ · tipos ✓ · 1440/1900/393 ✓ · `overflowX` = 0 ✓ · imágenes cargadas ✓ · interacción probada ✓ · datos límite probados ✓ · JSDoc con medidas y `TODO` ✓ · `page.tsx` actualizado ✓ · copia borrada ✓.

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
