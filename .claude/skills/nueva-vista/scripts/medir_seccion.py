#!/usr/bin/env python3
"""Mide y captura una sección de una página a varios anchos, con un Chrome real.

Sirve para comprobar una sección recién maquetada contra el diseño con números
en vez de a ojo. Por cada ancho:
  - baja por la sección (para que carguen las imágenes `loading="lazy"`),
  - imprime su posición y alto, el scroll horizontal de la página (debe ser 0),
    cuántas imágenes cargaron y cuáles se rompieron,
  - imprime las cajas (x, y, ancho, alto, relativas a la sección) de los
    selectores que se pidan con --cajas, para compararlas con las de Figma,
  - guarda una captura PNG de la sección.

Uso:
    python3 medir_seccion.py URL SELECTOR [--anchos 1440,1900,393] [--salida DIR]
                             [--cajas 'h2|ul > li:first-child|button[aria-label=Siguiente]']
                             [--hover 'a[href="/contacto"]']

Ejemplos:
    python3 medir_seccion.py http://localhost:3100/about-us \\
        'section[aria-labelledby="values-title"]' --cajas 'h2|details'

Los anchos típicos del proyecto: 1440 (el canvas del diseño), 1900 (pantalla
ancha: comprueba que todo se centra y nada se pega a la izquierda) y 393 (el
canvas mobile). 393 funciona de verdad porque se fija el viewport por CDP.
"""

import argparse
import json
import os
import sys
import time

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from cdp import Browser  # noqa: E402


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("url")
    ap.add_argument("selector", help="selector CSS de la sección (uno solo; se usa el primero)")
    ap.add_argument("--anchos", default="1440,1900,393")
    ap.add_argument("--salida", default=".", help="carpeta de las capturas")
    ap.add_argument("--cajas", default="", help="selectores separados por | cuyas cajas se imprimen")
    ap.add_argument("--hover", default="", help="selector de un elemento sobre el que pasar el mouse y capturar aparte")
    args = ap.parse_args()

    os.makedirs(args.salida, exist_ok=True)
    sel = json.dumps(args.selector)
    cajas = [c.strip() for c in args.cajas.split("|") if c.strip()]
    nombre = "".join(ch if ch.isalnum() else "-" for ch in args.selector)[:40].strip("-") or "seccion"

    with Browser() as page:
        for ancho in [int(a) for a in args.anchos.split(",")]:
            page.viewport(ancho)
            page.goto(args.url, esperar_selector=args.selector)

            r = json.loads(page.js(
                f"(() => {{ const b = document.querySelector({sel}).getBoundingClientRect();"
                f" return JSON.stringify({{top: Math.round(b.top + scrollY), h: Math.round(b.height)}}); }})()"
            ))
            # Bajar por la sección: las imágenes lazy solo cargan cuando se acercan.
            y = r["top"] - 300
            while y < r["top"] + r["h"]:
                page.js(f"window.scrollTo(0, {y})")
                time.sleep(0.45)
                y += 350
            time.sleep(2)

            info = json.loads(page.js(f"""(() => {{
              const s = document.querySelector({sel}); const sb = s.getBoundingClientRect();
              const imgs = [...s.querySelectorAll('img')];
              const visibles = imgs.filter(i => i.getBoundingClientRect().width > 0);   // las de columnas ocultas no cargan a propósito
              return JSON.stringify({{
                seccion: {{ ancho: Math.round(sb.width), alto: Math.round(sb.height) }},
                overflowX: document.documentElement.scrollWidth - document.documentElement.clientWidth,
                imagenes: {{ visibles: visibles.length, cargadas: visibles.filter(i => i.complete && i.naturalWidth > 0).length,
                            rotas: visibles.filter(i => i.complete && i.naturalWidth === 0).map(i => i.alt || i.currentSrc.slice(-40)) }},
                cajas: {json.dumps(cajas)}.map(q => {{ const e = s.querySelector(q); if (!e) return [q, null];
                  const b = e.getBoundingClientRect(); return [q, [Math.round(b.left), Math.round(b.top - sb.top), Math.round(b.width), Math.round(b.height)]]; }}),
              }}); }})()"""))
            print(f"\n=== {ancho}px ===")
            print(f"sección: y={r['top']}  {info['seccion']['ancho']}x{info['seccion']['alto']}")
            print(f"scroll horizontal de la página: {info['overflowX']}px" + ("  <-- DEBE SER 0" if info["overflowX"] else ""))
            im = info["imagenes"]
            print(f"imágenes: {im['cargadas']}/{im['visibles']} cargadas" + (f"  ROTAS: {im['rotas']}" if im["rotas"] else ""))
            for q, caja in info["cajas"]:
                print(f"  {q}: " + (f"x={caja[0]} y={caja[1]} {caja[2]}x{caja[3]}" if caja else "NO EXISTE"))

            ruta = os.path.join(args.salida, f"{nombre}-{ancho}.png")
            page.shot(ruta, 0, r["top"], ancho, r["h"])
            print("captura:", ruta)

            if args.hover and ancho >= 1000:
                q = json.dumps(args.hover)
                c = json.loads(page.js(
                    f"(() => {{ const e = document.querySelector({q}); if (!e) return 'null'; e.scrollIntoView({{block: 'center'}});"
                    f" const b = e.getBoundingClientRect(); return JSON.stringify({{x: b.left, y: b.top + scrollY, w: b.width, h: b.height}}); }})()"
                ))
                if c:
                    time.sleep(0.6)
                    page.mouse(c["x"] + c["w"] / 2, c["y"] - page.js("scrollY") + c["h"] / 2)
                    time.sleep(0.55)
                    ruta = os.path.join(args.salida, f"{nombre}-hover-{ancho}.png")
                    page.shot(ruta, max(c["x"] - 20, 0), c["y"] - 20, c["w"] + 40, c["h"] + 40)
                    print("captura con hover:", ruta)


if __name__ == "__main__":
    main()
