#!/usr/bin/env python3
"""Compara el render de la página contra el EXPORT de Figma (`download_assets` del
marco entero) por regiones: diferencia media y, sobre todo, cuánto hay que
desplazar en vertical para que coincidan (dy). Un dy distinto de 0 dice que esa
sección está corrida, y en cuántos px de diseño.

Uso:
  comparar_figma.py RENDER.png FIGMA.png --alto-figma 5352 --offset-y 48 \\
      --region 'hero:1000,140,1400,470' --region 'galeria:157,3466,786,3852' ...

  RENDER.png    la captura de la página a 1440 (`captura_pagina.py`).
  FIGMA.png     el export del marco de Figma. OJO: `download_assets` limita el export a
                4096 px de alto: un marco de 5352 sale a 0,7653 en vertical y 0,7660 en
                horizontal. Pasa `--alto-figma` (el alto real del marco en px de diseño)
                para usar cada escala; con una sola se ve una deriva que no existe y
                que crece hacia abajo (costó un rato creerla).
  --offset-y    cuántos px de diseño está el marco de Figma por debajo del render
                (aquí, el navbar: hero en y=128 en Figma y 80 en la página = 48).
  --region      nombre:x0,y0,x1,y1 en px de diseño DE FIGMA. Elige zonas sin cosas que
                cambien a propósito (el navbar, un mapa, un footer distinto).

Salida por región: diferencia media/255 (tras un desenfoque; el export está a ~0,77 y
un texto fino nunca baja de 2-3) y el mejor dy en px de diseño. Referencias reales
(vista Taller): fotos 2-6 · texto 1-4 · rayado fino 8 · una sección corrida 3-4 px sube
a 8-10 y el dy la delata.
"""

import argparse

import numpy as np
from PIL import Image, ImageFilter


def main():
    p = argparse.ArgumentParser()
    p.add_argument("render")
    p.add_argument("figma")
    p.add_argument("--alto-figma", type=float, required=True)
    p.add_argument("--ancho-figma", type=float, default=1440)
    p.add_argument("--offset-y", type=float, default=0)
    p.add_argument("--region", action="append", required=True)
    p.add_argument("--rango", type=int, default=6, help="±dy a probar, en px de la exportación")
    a = p.parse_args()

    fig = Image.open(a.figma).convert("RGB")
    rend = Image.open(a.render).convert("RGB")
    kx, ky = fig.width / a.ancho_figma, fig.height / a.alto_figma
    rk = rend.resize((round(rend.width * kx), round(rend.height * ky)), Image.LANCZOS)
    F = np.asarray(fig.filter(ImageFilter.GaussianBlur(1.0)), float)
    R = np.asarray(rk.filter(ImageFilter.GaussianBlur(1.0)), float)
    off = round(a.offset_y * ky)
    for r in a.region:
        nombre, coords = r.split(":")
        x0, y0, x1, y1 = (float(v) for v in coords.split(","))
        fx0, fx1, fy0, fy1 = round(x0 * kx), round(x1 * kx), round(y0 * ky), round(y1 * ky)
        h = fy1 - fy0
        base = F[fy0:fy1, fx0:fx1]
        mejor = None
        for dy in range(-a.rango, a.rango + 1):
            ry0 = fy0 - off + dy
            if ry0 < 0 or ry0 + h > R.shape[0]:
                continue
            m = float(np.abs(base - R[ry0 : ry0 + h, fx0:fx1]).mean())
            if mejor is None or m < mejor[0]:
                mejor = (m, dy)
        m0 = float(np.abs(base - R[fy0 - off : fy0 - off + h, fx0:fx1]).mean())
        print(f"{nombre:36s} diff={m0:5.1f}   mejor dy={mejor[1]:+d} ({mejor[1] / ky:+.1f} px de diseño)  diff={mejor[0]:5.1f}")


if __name__ == "__main__":
    main()
