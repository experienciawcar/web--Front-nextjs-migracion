---
name: nueva-vista
description: "Integrar una vista o sección nueva del diseño de WCAR en este proyecto Next.js 16 + Tailwind v4: maquetarla desde Figma o capturas, conectar su endpoint con DTO y servicio, optimizar las imágenes (incluidos los SVG de Figma con fotos incrustadas) y verificarla con números a 1440, 1900 y 393 px. Úsalo cuando el usuario pida integrar, hacer o continuar una vista/sección, pase una captura del diseño, un endpoint, un SVG pesado o pida optimizar imágenes de una sección."
---

# Integrar una vista nueva (WCAR)

**Antes de escribir código, lee `docs/guia-nuevas-vistas.md`.** Es la referencia; esto es el atajo. Está escrita con lo que pasó de verdad en "Sobre Nosotros" y cada regla existe porque su ausencia costó tiempo. Y lee la guía de Next de `node_modules/next/dist/docs/` que toque (lo exige `AGENTS.md`).

## 1. Insumos: revisa qué te falta y pídelo de una vez

Un solo mensaje al usuario con lo que falte, no goteando preguntas:

- Diseño **desktop y mobile** (link Figma con node-id, o capturas a 1440 y 393) y estados (hover, abierto, vacío).
- Fotos como **imagen** (PNG/JPG/WebP @2×); SVG solo para vectores.
- **URL del endpoint** y respuesta de ejemplo. Si no la dan, sondéala: `curl` a `/api/<nombre>/`.
- Copy final, o confirmación de que lo del diseño es provisional.

Contrasta diseño y backend **antes de maquetar** (`curl … | python3 -m json.tool`): campos que faltan, cantidades que no cuadran, unidades (`time` en segundos). Si el diseño y los datos no coinciden, manda el backend y se deja escrito.

Según `CLAUDE.md`: no preguntes lo rutinario; pregunta solo por arquitectura o reglas de negocio. Con lo que no se pueda saber (mobile, un estado), **decide, marca `TODO` y avisa al terminar**.

## 2. Construir

1. **Datos:** `types/x.ts` (`XDto` + tipo de vista) → `services/x.ts` con `apiUrl()`, `fetch` con `next.revalidate` (1 h, por las URLs firmadas de 24 h), `try/catch` que devuelve `[]` y `console.error`. El componente nunca ve el DTO. Ni `fetch` en componentes ni URLs a mano.
2. **Componente servidor** (datos + estructura) y, solo si hay interacción, **uno cliente aparte** por props.
3. **Lienzo de 1440 centrado con los fondos que sangran** (`guia §4.2`). Nada en px desde el borde de la ventana: se ve pegado a la izquierda en 1900. Sin `relative` en el `container-wcar` si dentro hay absolutos del lienzo.
4. **Reutiliza:** `ButtonComponent` (todos los botones), `useCarousel` + `CarouselArrowsComponent`, `SideLabelComponent`, `SectionEyebrowComponent`, `DiagonalLinesComponent`, `ZigZagComponent`, `FeatureCardComponent`, `StarRatingComponent`, `AppLinkComponent`, `ROUTES`. Acordeones con `<details name>`. Si algo se repite en dos vistas, súbelo a `shared/`.
5. **Controles de carrusel siempre visibles** y funcionales, aunque haya pocos elementos.
6. **Imágenes** (abajo). Añade la sección a `page.tsx` en el orden del diseño y actualiza "Faltan por agregar".
7. **Documenta en el JSDoc:** nodo de Figma, medidas, decisiones, qué se estimó de una captura y los `TODO`.

**El texto del diseño se reproduce tal cual** (lorem, erratas, teléfonos de relleno) con `TODO: confirmar con diseño`. No inventes copy ni conviertas datos de relleno en enlaces reales.

## 3. Imágenes

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
5. Si hay que decir qué carpeta usar: `public/assets/about-us/<seccion>/` para "Sobre Nosotros"; crea la carpeta para que el usuario suba ahí.

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
- Comprueba: `overflowX` = 0, imágenes cargadas, cajas contra las medidas del diseño, y **mira las capturas** (los números no ven un logo tapando una línea).
- Interacción real con `scripts/cdp.py` (hover con `page.mouse`, clics con `page.js`): flechas, rayas, abrir/cerrar, `prefers-reduced-motion`.
- Casos límite con un servidor falso: campo nulo, texto larguísimo, sin foto, 1 y 10 elementos, lista vacía. Construye la **copia** con `NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:PUERTO/api`.

## 5. Al terminar, reporta

Corto y sin adornos: qué quedó, qué se estimó o adaptó (mobile sin diseño, medidas de captura), **qué debe confirmar el usuario** (copy, colores, erratas, teléfono) y qué falta de otros (assets, backend). Si aprendiste algo nuevo que valga para la próxima vista, actualiza `docs/guia-nuevas-vistas.md` y este archivo.

## Archivos del skill

- `scripts/copia_aislada.sh` — `start|stop`: copia, compila y sirve sin tocar la carpeta real.
- `scripts/medir_seccion.py` — mide y captura una sección a varios anchos (cajas, `overflowX`, imágenes, hover).
- `scripts/svg_a_webp.py` — `extraer` (foto con su recorte) y `renderizar` (marco compuesto) a WebP.
- `scripts/cdp.py` — cliente mínimo del protocolo de Chrome (sin dependencias): viewport real, JS, mouse, capturas.
