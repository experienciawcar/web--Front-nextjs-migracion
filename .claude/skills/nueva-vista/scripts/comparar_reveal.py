#!/usr/bin/env python3
"""Comprueba la aparición al hacer scroll (clase `reveal`, ver `useScrollReveal`)
de una o varias páginas, con un Chrome real.

Por cada página y ancho:
  1. Carga la página y cuenta los `.reveal`: cuántos quedaron a la vista (ya
     revelados, sin animar), cuántos ocultos, si alguno a la vista quedó oculto
     y el scroll horizontal con todo oculto (`overflowX`, debe ser 0: un
     `reveal-left/right` mal puesto lo desborda solo en ese estado).
  2. La PRUEBA: captura la página de referencia (quitando `data-reveal-ready`,
     con todo visible), la recorre bajando para que se revele todo y la captura
     otra vez. Las dos capturas deben ser IDÉNTICAS al píxel: `reveal` no debe
     dejar rastro (un `transform` de sobra, un elemento fuera de su sitio, un
     contexto de apilamiento que tape algo). Se compara por franjas y en
     memoria (no escribe PNG grandes). Lo que cae dentro del footer se cuenta
     aparte y solo avisa: no lleva `reveal` y sus enlaces legales pintan distinto
     de una carga a otra (a 1900, una franja de ~15 px; pasa también sin `reveal`).
  3. Comprueba que cada `.reveal` terminó con la opacidad y el `transform` que
     tendría sin la clase (un elemento con `opacity-90` propio termina en 0,9:
     es lo esperado, y aquí cuenta como correcto).

Sale con código 1 si algo falla, así que sirve como comprobación final.

Uso (contra una copia aislada, ver `copia_aislada.sh`):
    python3 comparar_reveal.py --base http://localhost:3100 /about-us /taller \\
        [--anchos 1440,1900,393] [--puerto-chrome 9333] [--salida DIR]

Con `--salida` guarda, de las franjas que difieran, la de referencia y la
revelada (JPEG) para mirarlas. Sin él solo imprime.

Trampa: en `next dev` usa `localhost`, no `127.0.0.1` (Next 16 bloquea los
recursos de dev de otros orígenes y la página no hidrata: el hook no arranca).
"""

import argparse
import base64
import io
import json
import os
import sys

import numpy as np
from PIL import Image

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from cdp import Browser  # noqa: E402

FRANJA = 1000

ESTADO = """
(() => {
  const vh = innerHeight;
  const els = [...document.querySelectorAll('.reveal')];
  const filas = els.map(el => {
    const r = el.getBoundingClientRect();
    return { rev: el.hasAttribute('data-revealed'), op: getComputedStyle(el).opacity, top: r.top, w: r.width };
  });
  return JSON.stringify({
    ready: document.documentElement.hasAttribute('data-reveal-ready'),
    total: filas.length,
    alVer: filas.filter(f => f.rev).length,
    ocultos: filas.filter(f => !f.rev).length,
    aLaVistaOcultos: filas.filter(f => !f.rev && f.top < vh && f.w > 0).length,
    ocultosVisibles: filas.filter(f => !f.rev && f.op !== '0').length,
    overflowX: document.documentElement.scrollWidth - innerWidth,
  });
})()
"""

# Compara el estilo de cada elemento con el que tendría sin la clase.
NATURAL = """
(() => {
  const mal = [];
  document.querySelectorAll('.reveal').forEach(el => {
    if (!el.hasAttribute('data-revealed')) { mal.push('sin revelar: ' + el.tagName + ' ' + el.className.slice(0, 50)); return; }
    const a = getComputedStyle(el);
    const antes = [a.opacity, a.transform];
    el.classList.remove('reveal');
    const b = getComputedStyle(el);
    if (antes[0] !== b.opacity || antes[1] !== b.transform) mal.push('distinto: ' + el.tagName + ' ' + antes + ' / ' + [b.opacity, b.transform]);
    el.classList.add('reveal');
  });
  return JSON.stringify(mal);
})()
"""


def espera(page, ms):
    page.js(f"new Promise(r => setTimeout(r, {ms}))")


def recorrer(page, paso=300):
    """Baja por toda la página (revela lo de abajo y carga las fotos perezosas)."""
    alto = page.js("document.documentElement.scrollHeight")
    y = 0
    while y < alto:
        page.js(f"window.scrollTo(0, {y})")
        espera(page, 140)
        y += paso
    page.js(f"window.scrollTo(0, {alto})")
    espera(page, 300)


def franjas(page, ancho):
    """La página entera en franjas de 1000 px, como arreglos en memoria.

    Devuelve (alto, y donde empieza el footer, franjas)."""
    page.js("window.scrollTo(0, 0)")
    espera(page, 1500)
    alto = page.js("document.documentElement.scrollHeight")
    footer = page.js("(() => { const f = document.querySelector('footer'); return f ? Math.round(f.getBoundingClientRect().top + scrollY) : document.documentElement.scrollHeight; })()")
    out, y = [], 0
    while y < alto:
        h = min(FRANJA, alto - y)
        r = page.call(
            "Page.captureScreenshot", format="png", captureBeyondViewport=True,
            clip={"x": 0, "y": y, "width": ancho, "height": h, "scale": 1},
        )
        out.append(np.asarray(Image.open(io.BytesIO(base64.b64decode(r["data"]))).convert("RGB")).astype(np.int16))
        y += FRANJA
    return alto, footer, out


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("rutas", nargs="+", help="rutas de la web, p. ej. /about-us")
    ap.add_argument("--base", default="http://localhost:3100")
    ap.add_argument("--anchos", default="1440,1900,393")
    ap.add_argument("--puerto-chrome", type=int, default=9333)
    ap.add_argument("--salida", help="carpeta donde guardar las franjas que difieran")
    args = ap.parse_args()

    fallos = 0
    with Browser(port=args.puerto_chrome) as page:
        for ancho in [int(a) for a in args.anchos.split(",")]:
            page.viewport(ancho, 900 if ancho > 500 else 852)
            for ruta in args.rutas:
                etiqueta = f"{ancho:>5} {ruta}"

                # 1. Estado al cargar, con lo de abajo oculto.
                page.goto(args.base + ruta)
                espera(page, 1200)
                e = json.loads(page.js(ESTADO))
                problemas = []
                if e["total"] and not e["ready"]:
                    problemas.append("el hook no arrancó (falta data-reveal-ready: ¿no hidrató?)")
                if e["aLaVistaOcultos"]:
                    problemas.append(f"{e['aLaVistaOcultos']} elementos a la vista quedaron ocultos")
                if e["overflowX"] > 0:
                    problemas.append(f"scroll horizontal de {e['overflowX']}px con todo oculto")
                print(
                    f"{etiqueta}: {e['total']} reveal · {e['alVer']} a la vista · {e['ocultos']} ocultos · overflowX {e['overflowX']}"
                )

                if not e["total"]:
                    print("        (sin elementos con `reveal`)")
                    continue

                # 2. Referencia: todo visible, recorrido igual para cargar las fotos.
                page.js("document.documentElement.removeAttribute('data-reveal-ready')")
                recorrer(page)
                alto0, _, ref = franjas(page, ancho)

                # ...y con la aparición activa, recorrida de arriba abajo.
                page.goto(args.base + ruta)
                espera(page, 1200)
                recorrer(page)
                espera(page, 1200)
                mal = json.loads(page.js(NATURAL))
                alto1, footer, rev = franjas(page, ancho)

                avisos = []
                if alto0 != alto1:
                    problemas.append(f"el alto de la página cambia: {alto0} sin ocultar, {alto1} revelada")
                else:
                    distintos, donde, ruido = 0, [], 0
                    for i, (a, b) in enumerate(zip(ref, rev)):
                        d = np.abs(a - b).sum(axis=2)
                        # El footer no lleva `reveal` y sus enlaces legales pintan distinto de una carga a otra
                        # (se reproduce comparando dos cargas SIN `reveal`): se cuenta aparte y no falla.
                        corte = max(0, min(FRANJA, footer - i * FRANJA))
                        ruido += int((d[corte:] > 0).sum())
                        d = d[:corte]
                        n = int((d > 0).sum())
                        distintos += n
                        if n:
                            ys, xs = np.nonzero(d > 0)
                            donde.append(f"y {i * FRANJA + int(ys.min())}-{i * FRANJA + int(ys.max())} x {int(xs.min())}-{int(xs.max())} ({n}px)")
                            if args.salida:
                                os.makedirs(args.salida, exist_ok=True)
                                base = os.path.join(args.salida, f"{ruta.strip('/').replace('/', '_')}-{ancho}-franja{i}")
                                Image.fromarray(np.clip(a, 0, 255).astype(np.uint8)).save(base + "-ref.jpg", quality=70)
                                Image.fromarray(np.clip(b, 0, 255).astype(np.uint8)).save(base + "-reveal.jpg", quality=70)
                    if distintos:
                        problemas.append(f"la página revelada difiere de la referencia en {distintos}px: {'; '.join(donde[:5])}")
                    if ruido:
                        avisos.append(f"{ruido}px distintos dentro del footer (desde y={footer}): ruido conocido de sus enlaces legales, no es de `reveal`")
                if mal:
                    problemas.append("estilo final distinto del natural: " + " | ".join(mal[:5]))

                if problemas:
                    fallos += 1
                    for p in problemas:
                        print("        ✗", p)
                else:
                    print("        ✓ idéntica a la referencia (0 px de diferencia fuera del footer) y todos los elementos terminan en su estilo natural")
                for a in avisos:
                    print("        ⚠", a)

    sys.exit(1 if fallos else 0)


if __name__ == "__main__":
    main()
