#!/usr/bin/env python3
"""Compara UN elemento del render contra su export de Figma (PNG del nodo).

Sirve para las secciones mobile hechas con el MCP de Figma: `get_design_context` o
`download_assets` dan un PNG del nodo; esto recorta el mismo elemento de la página
real (a 393 por defecto), lo lleva al tamaño del export y da:
  - la diferencia media (0-255) y por bandas horizontales (dónde está lo que no cuadra),
  - los renglones de texto claro (grupos de filas con píxeles casi blancos) en el
    export y en el render: si un renglón está 2 px más arriba o abajo, sale ahí
    (así aparecieron el interlineado de 54 del tercer renglón del banner y los 6 px de aire
    que Figma deja debajo de un renglón con otro tamaño de letra),
  - un PNG `export | render | diferencia x4` en --salida.

Uso:
  comparar_elemento.py URL 'SELECTOR' EXPORT.png [--contiene 'texto'] [--ancho 393]
                       [--texto-x0 40 --texto-x1 290 --texto-y0 60 --texto-y1 160]
                       [--salida DIR] [--nombre banner]

  SELECTOR   CSS del elemento; con --contiene se queda con el primero que incluya ese texto.
  --texto-*  la caja (px del export) donde buscar renglones; sin ella, todo el elemento.

Trampas que ya mordieron:
  - Page.captureScreenshot con `clip` usa coordenadas de la PÁGINA, no de la ventana; aquí se
    hace scrollIntoView y se recorta la captura de la ventana (por eso funciona).
  - `captura_pagina.py` (página entera) a veces no pinta algún elemento; para comparar, este.
  - Una diferencia de 1 px en el texto es ruido (subpíxel de Figma); busca las de 2 o más.
"""

import argparse
import base64
import io
import json
import os
import sys
import time

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from cdp import Browser  # noqa: E402
from PIL import Image  # noqa: E402
import numpy as np  # noqa: E402


def renglones(img, x0, x1, y0, y1, umbral=235):
    a = np.array(img.convert("RGB")).astype(int)[y0:y1, x0:x1]
    mask = a.min(2) > umbral
    ys = [y0 + i for i, v in enumerate(mask.sum(1)) if v > 0]
    grupos = []
    for y in ys:
        if grupos and y - grupos[-1][1] <= 2:
            grupos[-1][1] = y
        else:
            grupos.append([y, y])
    return grupos


def main():
    p = argparse.ArgumentParser()
    p.add_argument("url")
    p.add_argument("selector")
    p.add_argument("export")
    p.add_argument("--contiene", default="")
    p.add_argument("--ancho", type=int, default=393)
    p.add_argument("--salida", default=".")
    p.add_argument("--nombre", default="elemento")
    for k in ("x0", "x1", "y0", "y1"):
        p.add_argument(f"--texto-{k}", type=int, default=None)
    a = p.parse_args()

    buscar = (
        f"[...document.querySelectorAll({json.dumps(a.selector)})]"
        f".find(e => e.textContent.includes({json.dumps(a.contiene)}))"
    )
    with Browser() as page:
        page.viewport(a.ancho, 852)
        page.goto(a.url)
        time.sleep(1)
        alto = page.js("document.documentElement.scrollHeight")
        y = 0
        while y < alto:  # recorrer: las imágenes perezosas cargan al acercarse
            page.js(f"window.scrollTo(0,{y})")
            time.sleep(0.2)
            y += 600
        page.js(f"(()=>{{const e={buscar}; if(!e) throw new Error('no hay elemento'); e.scrollIntoView({{block:'center'}})}})()")
        time.sleep(0.8)
        r = page.js(f"(()=>{{const r=({buscar}).getBoundingClientRect();return [r.x,r.y,r.width,r.height]}})()")
        cap = page.call("Page.captureScreenshot", format="png")
    vp = Image.open(io.BytesIO(base64.b64decode(cap["data"]))).convert("RGB")
    esc = vp.size[0] / a.ancho
    crop = vp.crop((round(r[0] * esc), round(r[1] * esc), round((r[0] + r[2]) * esc), round((r[1] + r[3]) * esc)))

    fig = Image.open(a.export).convert("RGB")
    w, h = fig.size
    mine = crop.resize((w, h), Image.LANCZOS)
    diff = np.abs(np.array(mine).astype(float) - np.array(fig).astype(float)).mean(2)
    print(f"elemento {r[2]:.0f}x{r[3]:.0f} (render) | export {w}x{h} | diferencia media {diff.mean():.2f}")
    paso = max(1, h // 8)
    print("bandas (y: diferencia):", ", ".join(f"{i}: {diff[i:i + paso].mean():.1f}" for i in range(0, h, paso)))

    x0 = a.texto_x0 or 0
    x1 = a.texto_x1 or w
    y0 = a.texto_y0 or 0
    y1 = a.texto_y1 or h
    print("renglones export:", renglones(fig, x0, x1, y0, y1))
    print("renglones render:", renglones(mine, x0, x1, y0, y1))

    os.makedirs(a.salida, exist_ok=True)
    lado = Image.new("RGB", (w * 3, h))
    lado.paste(fig, (0, 0))
    lado.paste(mine, (w, 0))
    lado.paste(Image.fromarray(np.clip(diff * 4, 0, 255).astype("uint8")).convert("RGB"), (2 * w, 0))
    ruta = os.path.join(a.salida, f"{a.nombre}_comparacion.png")
    lado.save(ruta)
    print("guardada:", ruta)


if __name__ == "__main__":
    main()
