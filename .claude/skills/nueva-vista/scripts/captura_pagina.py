#!/usr/bin/env python3
"""Captura la página COMPLETA a un ancho de viewport real (también 393) y la deja
en un solo PNG, tras recorrer la página para que carguen las imágenes perezosas.

Uso:
  captura_pagina.py URL ANCHO SALIDA.png [--selector 'main > section']

Imprime cuántas imágenes de `main` cargaron (y cuáles no), el scroll horizontal y,
con --selector, la posición y alto de cada elemento (para encajarla contra Figma).
Sirve de entrada a `comparar_figma.py`.

Ojo: las imágenes ocultas con `display:none` (versión mobile/desktop de un mismo
componente) salen como "sin cargar" y es lo esperado: no las pide el navegador.
"""

import argparse
import json
import os
import sys
import tempfile
import time

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from cdp import Browser  # noqa: E402
from PIL import Image  # noqa: E402


def main():
    p = argparse.ArgumentParser()
    p.add_argument("url")
    p.add_argument("ancho", type=int)
    p.add_argument("salida")
    p.add_argument("--selector", default="main > section")
    a = p.parse_args()

    tmp = tempfile.mkdtemp()
    with Browser() as page:
        page.viewport(a.ancho, 1000)
        page.goto(a.url)
        alto = page.js("document.documentElement.scrollHeight")
        y = 0
        while y < alto:  # recorrer despacio: las imágenes `loading=lazy` cargan al acercarse
            page.js(f"window.scrollTo(0,{y})")
            time.sleep(0.35)
            y += 700
        page.js("window.scrollTo(0,0)")
        time.sleep(1.0)
        info = page.js(
            """(()=>{const imgs=[...document.querySelectorAll('main img')];
            return {n:imgs.length, ok:imgs.filter(i=>i.complete&&i.naturalWidth>0).length,
            sin_cargar:imgs.filter(i=>!(i.complete&&i.naturalWidth>0)).map(i=>i.currentSrc||i.src),
            overflowX:document.documentElement.scrollWidth-innerWidth,
            alto:document.documentElement.scrollHeight}})()"""
        )
        print(f"imágenes de main: {info['ok']}/{info['n']} cargadas · scroll horizontal: {info['overflowX']}px · alto: {info['alto']}")
        for u in info["sin_cargar"]:
            print("  sin cargar:", u)
        if a.selector:
            secs = page.js(
                f"""JSON.stringify([...document.querySelectorAll({json.dumps(a.selector)})].map(e=>({{
                id:e.getAttribute('aria-labelledby')||e.id||e.tagName, top:Math.round(e.getBoundingClientRect().top+scrollY),
                h:Math.round(e.getBoundingClientRect().height)}})))"""
            )
            for s in json.loads(secs):
                print(f"  {s['id']:28s} y={s['top']:5d}  alto={s['h']}")
        tiles, y = [], 0
        while y < info["alto"]:
            h = min(1000, info["alto"] - y)
            ruta = os.path.join(tmp, f"t{y:06d}.png")
            page.shot(ruta, x=0, y=y, w=a.ancho, h=h)
            tiles.append(ruta)
            y += 1000
    full = Image.new("RGB", (a.ancho, info["alto"]))
    y = 0
    for t in tiles:
        im = Image.open(t).convert("RGB")
        full.paste(im, (0, y))
        y += im.height
    full.save(a.salida)
    print("guardada:", a.salida, full.size)


if __name__ == "__main__":
    main()
