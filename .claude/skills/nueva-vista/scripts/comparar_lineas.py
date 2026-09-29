#!/usr/bin/env python3
"""Compara, renglón por renglón, el texto del render con el de la captura.

Complementa a `comparar_captura.py` (que da UN número por región): este da dónde
cae la línea base de cada renglón y sus extremos en x, en las dos imágenes, para
ver cuánto hay que mover un bloque de texto (guía §12.6). En "Servicios Postventa"
fue lo que reveló que una tarjeta tenía interlineado de 22 y la de al lado de 24
(las líneas base de una iban 479, 501, 523... y las de la otra 510, 534, 558...).

Uso:
  comparar_lineas.py RENDER CAPTURA X0 X1 Y0 Y1 [--umbral N] [--sobre-oscuro]

  RENDER     el PNG de la sección (de `medir_seccion.py`).
  CAPTURA    la captura ya pasada a px de diseño: el `captura.png` que deja
             `comparar_captura.py` en su --salida (mismas coordenadas que el render).
  X0 X1 Y0 Y1  la caja donde buscar el texto, en px de diseño de la sección.
  --umbral   suma R+G+B por debajo de la cual un píxel cuenta como texto (600 por
             defecto: sirve para gris azulado sobre blanco; 700 para gris sobre
             gris claro). Con --sobre-oscuro es la MÍNIMA: cuenta lo más claro que
             ella (110 por defecto sobre 3 canales, o sea texto claro sobre fondo
             oscuro).

Salida: para cada renglón, (línea base, "x_inicio-x_fin"). La línea base es la
última fila con al menos el 45 % de la tinta del renglón (la de las letras sin
ascendentes ni descendentes). Una diferencia de 1 px es ruido de la captura (que
está a 0,64): busca las de 2 o más.
"""

import argparse

import numpy as np
from PIL import Image


def analizar(ruta, x0, x1, y0, y1, umbral, oscuro):
    im = np.asarray(Image.open(ruta).convert("RGB")).astype(int)
    sub = im[y0:y1, x0:x1]
    tinta = (sub.min(axis=2) > umbral) if oscuro else (sub.sum(axis=2) < umbral)
    filas = tinta.sum(axis=1).astype(float)
    salida, i, n = [], 0, len(filas)
    while i < n:
        if filas[i] > 0:
            j = i
            while j < n and (filas[j] > 0 or (j + 1 < n and filas[j + 1] > 0)):
                j += 1
            seg = filas[i:j]
            pico = seg.max()
            idx = [k for k, v in enumerate(seg) if v >= 0.45 * pico]
            cols = np.where(tinta[i:j].any(axis=0))[0]
            salida.append((round(y0 + i + max(idx) + 1, 1), x0 + int(cols.min()), x0 + int(cols.max()) + 1))
            i = j
        else:
            i += 1
    return salida


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("render")
    ap.add_argument("captura")
    ap.add_argument("x0", type=int)
    ap.add_argument("x1", type=int)
    ap.add_argument("y0", type=int)
    ap.add_argument("y1", type=int)
    ap.add_argument("--umbral", type=int, default=None)
    ap.add_argument("--sobre-oscuro", action="store_true")
    a = ap.parse_args()
    umbral = a.umbral if a.umbral is not None else (110 if a.sobre_oscuro else 600)
    for nombre, ruta in (("render ", a.render), ("captura", a.captura)):
        lineas = analizar(ruta, a.x0, a.x1, a.y0, a.y1, umbral, a.sobre_oscuro)
        print(nombre + ":", [(b, f"x{x}-{f}") for b, x, f in lineas])


if __name__ == "__main__":
    main()
