---
name: revisar-responsive
description: "Auditar el responsive de las vistas ya hechas de WCAR: barrido automático a varios anchos (320 a 1900) que detecta desbordes, texto que se pisa, zonas táctiles chicas, imágenes deformadas/pesadas/sin cargar y descentrados; y, si la vista tiene Figma, comparar cada texto (tamaño, líneas, posición) contra el marco. Úsalo cuando el usuario pida revisar, auditar o verificar el responsive de una o varias páginas, o pregunte qué se puede mejorar de una vista ya construida."
---

# Revisar el responsive de una vista (WCAR)

No maqueta nada: **audita** lo que ya existe. Para construir o continuar una vista, usa el skill `nueva-vista`; este solo mide y reporta. Sigue el mismo método de verificación de esa guía (copia aislada, `cdp.py`, comparación numérica) — léela si algo de abajo no tiene sentido.

## 1. Preparar

Nunca contra la carpeta real (varias sesiones y el `next dev` del usuario comparten `.next`):

```bash
S=.claude/skills/nueva-vista/scripts
$S/copia_aislada.sh start    # copia, compila y sirve en :3100; comprueba HTML y CSS = 200
```

Si el puerto 3100 lo usa otra sesión (`lsof -iTCP -sTCP:LISTEN -P`), usa `WCAR_PUERTO`/`WCAR_COPIA` con otro puerto en `start` y en `stop`.

**Si `nohup ... &` no deja el servidor corriendo** entre una llamada de shell y la siguiente (pasó una vez): entra a la copia y lanza `next start` tú mismo con `< /dev/null` y `disown`, y comprueba con `ps aux` antes de seguir:

```bash
cd "$WCAR_COPIA" && nohup npx next start -p 3100 > server.log 2>&1 < /dev/null & disown
```

## 2. Barrido automático (sin Figma)

```bash
S=.claude/skills/revisar-responsive/scripts
python3 $S/barrido_responsive.py --base http://localhost:3100 [/ruta ...] \
    [--anchos 320,393,768,1024,1440,1900] [--json salida.json]
```

Sin rutas, las saca de `src/app/**/page.tsx`. Recorre cada ruta a cada ancho, hace scroll completo (activa `loading="lazy"` y `reveal`) y devuelve una tabla + una lista de hallazgos agrupados (mismo problema en varios anchos, un solo renglón), en tres niveles:

- **ERROR**: desborde horizontal real, texto que se pisa con otro, sin `<meta viewport>`. Rompe la vista.
- **AVISO**: texto bajo 12px, zona táctil bajo 24px (falla WCAG 2.2 AA 2.5.8), imagen deformada/sin cargar/pegada al borde/descentrada.
- **MEJORA**: zona táctil entre 24 y 44px (cómoda pero no ideal), imagen más pesada de lo que se ve (revisar `sizes`).

Sale con código 1 si hubo algún ERROR.

**Antes de reportar cualquier hallazgo, mírate la sección con `cdp.py` o una captura** (`captura_pagina.py`). El script da la pista; los números por sí solos han dado falsos positivos reales (ver Trampas).

## 3. Comparar contra Figma (si la vista lo tiene)

Sirve para lo que el barrido no ve: que un texto sea del tamaño de Figma, tenga las líneas que debe y no se haya corrido. Complementa a `comparar_figma.py`/`comparar_elemento.py` de `nueva-vista` (que comparan píxeles); este compara **texto por texto**.

1. Saca los textos del marco con `use_figma` **de solo lectura** (carga antes `figma:figma-use`): recorre `findAll(n=>n.type==='TEXT')`, salta los ocultos y los del navbar/footer, y para cada uno guarda `{id, t: characters, x, y (relativos al marco), w, h, fs: fontSize, lh: lineHeight en px, al: textAlignHorizontal}`. Ojo: `findAll` no entra en instancias de componentes (tarjetas, botones) — sus textos hay que sacarlos aparte recorriendo esos nodos a mano (`n.children`).
2. Guarda esa lista como JSON (una lista plana, o `{"textos": [...]}`).
3. Corre:

   ```bash
   python3 $S/comparar_textos_figma.py --url http://localhost:3100/<ruta> --ancho 393 \
       --figma textos.json --offset-y <navbar Figma − navbar página>
   ```

Empareja cada texto de Figma con su elemento en la página por el contenido (no por posición: una sección movida no debe hacer perder el emparejamiento) y avisa si cambió el tamaño de fuente, el número de líneas, la x (o el centro, en texto centrado) o si hay un **salto** de derwrites vertical respecto al texto anterior (una sección que quedó más arriba o más abajo de lo que le toca). Los que no tienen pareja en la página salen como "sin par": o cambió el copy, o esa pieza no existe en esa vista.

**Si la vista no tiene diseño mobile** (la mayoría: Financiación, Taller, Home no lo tienen), esta comparación no aplica al 393 — ahí solo vale el barrido automático y la revisión visual; comparar contra el desktop de Figma daría decenas de "diferencias" que son la adaptación esperada, no errores.

## 4. Trampas conocidas

| Síntoma | Causa | Arreglo |
|---|---|---|
| Decenas de "texto-pisado" dentro de un `<details>` cerrado (FAQ, "Términos y condiciones" del footer), a **todos** los anchos por igual | El Chrome headless de este entorno (probado en 153.0.8010.53) no oculta el contenido de un `<details>` sin `open`: `getComputedStyle` da `display:block` y layout completo, como si estuviera abierto. Se comprobó hasta con un `<details>` recién creado en `about:blank`, sin ninguna clase del sitio: no es un bug de WCAR. | `barrido_responsive.py` ya filtra esto (`enDetailsCerrado`): cualquier texto dentro de un `<details>` sin `.open` cuenta como invisible. Si escribes un chequeo nuevo con `cdp.py`, replica el filtro o vas a reportar solapes que nadie ve. |
| "descentrado" en una sección con un carrusel que sangra al borde (`xl:mr-[calc(50%-50vw)]`) | Es a propósito: el carrusel se sale del contenedor centrado para invitar a seguir viendo tarjetas. Solo es visible en pantallas más anchas que 1440 (a 1440 el sangrado coincide con el borde de la ventana y no se nota). | No lo reportes como bug sin mirar el elemento: si el ancestro tiene `mr-[calc(50%-50vw)]`/similar, es intencional. Vale la pena preguntar si ese sangrado debe verse tan agresivo en pantallas de 1900+ (el margen derecho puede quedar en la quinta parte del izquierdo), pero es una pregunta de diseño, no un defecto de maquetación. |
| Una foto grande (3840w) tarda >8s o el optimizador de Next responde vacío/400 con ciertos `Accept` (`image/webp,*/*` colgó 12s; con `*/*` respondió al toque) | Parece un límite de concurrencia/caché fría del optimizador de imágenes en la copia aislada bajo el barrido (varias fotos grandes pedidas casi a la vez); en `curl` suelto la misma imagen cargó bien. No se confirmó que pase en producción. | Si `imagen-sin-cargar` sale en un ancho suelto y no en los vecinos, sospecha de esto antes de reportarlo como bug: repite esa ruta/ancho solo, con más espera. Si persiste igual, sí repórtalo. |
| Un input tipo radio oculto (`sr-only`) sale como "zona táctil chica" (1×1px) | El BUTTON real es su `<label>`, no el `<input>`. | `barrido_responsive.py` ya lo salta (`r.width<=2`); si añades un selector nuevo, exclúyelo igual y mide el `<label>`. |
| Ancho de caja que no cuadra con Figma en un campo o un `<select>` | El texto de un `<input>`/`<select>` no tiene cajas de línea (`getClientRects()` vacío); hay que medir el rect del elemento menos su `padding`. | `comparar_textos_figma.py` ya lo resuelve (detecta `l > r` y cae al rect del campo). |

## 5. Reportar

Por vista: la tabla de anchos (overflow-x, alto, márgenes, tamaño de `h1`/`h2`) y los hallazgos agrupados, separando lo **confirmado con captura o código** de lo que es solo la lectura del script. Si hay Figma y no hay diseño mobile, dilo explícito para que no se lea la comparación como "está mal hecho".

## Archivos del skill

- `scripts/barrido_responsive.py` — recorre rutas × anchos, hace scroll completo y devuelve desbordes, texto pisado/pequeño/cortado, zonas táctiles, imágenes (sin cargar/deformadas/ampliadas/pesadas) y centrado.
- `scripts/comparar_textos_figma.py` — empareja por contenido cada texto de un JSON de Figma con su elemento en la página y compara tamaño de fuente, líneas, posición y saltos verticales.
