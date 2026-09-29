#!/usr/bin/env python3
"""Compara el render de una sección contra la CAPTURA del diseño, con números.

Cuándo sirve: no hay Figma y solo hay una captura (guía §12.6). Pasa la captura
a px de diseño con la calibración de `registrar_foto.py` (origen y escala) y la
compara con la captura del render que da `medir_seccion.py` (a 1440), región por
región, tras un desenfoque (así el remuestreo y el antialias no cuentan).

Uso:
  comparar_captura.py CAPTURA RENDER --origen OX,OY --escala S
                      [--regiones "titulo:140,150,480,270;pestana:1390,130,1440,410"]
                      [--blur 1.2] [--salida DIR]

  CAPTURA     el PNG del diseño.
  RENDER      el PNG de la sección a 1440 (de `medir_seccion.py`), con su borde
              superior en el mismo punto del diseño que --origen (OY).
  --origen    px de la captura donde cae (0,0) del render: OX de la calibración
              (el px de captura del x=0 del diseño) y OY (el px de captura donde
              empieza la sección). Ej.: `--origen=-2.4,0` (con el signo menos va con `=`).
  --escala    px de captura por px de diseño (ancho de la captura ÷ 1440).
  --regiones  cajas en px de diseño relativos al render (x0,y0,x1,y1), con nombre.
              Sin ellas, solo da la diferencia media de toda la imagen.
  --blur      radio del desenfoque gaussiano, en px de diseño (1.2 por defecto).

Salida: diferencia media por canal (0-255) de cada región y `mezcla.png` (50/50
de captura y render), `diff.png` (la diferencia amplificada x4) y `captura.png`
(la captura en px de diseño) en --salida.

Referencias (guía §12.6, "Nuestras Sedes"): texto ~1,9 · líneas ~1,6 · fotos 8-12
(remuestreo) · formas de color plano 17 si el corrimiento de color no se calibró.
Una foto pendiente (caja gris) sale alta a propósito: excluye esa región.
"""

import argparse
import os

import numpy as np
from PIL import Image, ImageChops, ImageFilter


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("captura")
    ap.add_argument("render")
    ap.add_argument("--origen", required=True)
    ap.add_argument("--escala", type=float, required=True)
    ap.add_argument("--regiones", default="")
    ap.add_argument("--blur", type=float, default=1.2)
    ap.add_argument("--salida", default=".")
    a = ap.parse_args()

    ox, oy = (float(v) for v in a.origen.split(","))
    s = a.escala
    cap = Image.open(a.captura).convert("RGB")
    ren = Image.open(a.render).convert("RGB")
    w, h = ren.size

    # Captura -> px de diseño: la caja de la captura que cubre el render.
    box = (ox, oy, ox + w * s, oy + h * s)
    cap_d = cap.transform((w, h), Image.EXTENT, box, resample=Image.BICUBIC, fillcolor=(255, 255, 255))

    os.makedirs(a.salida, exist_ok=True)
    cap_d.save(os.path.join(a.salida, "captura.png"))
    Image.blend(cap_d, ren, 0.5).save(os.path.join(a.salida, "mezcla.png"))
    diff = ImageChops.difference(cap_d, ren).point(lambda v: min(255, v * 4))
    diff.save(os.path.join(a.salida, "diff.png"))

    cb = np.asarray(cap_d.filter(ImageFilter.GaussianBlur(a.blur)), dtype=float)
    rb = np.asarray(ren.filter(ImageFilter.GaussianBlur(a.blur)), dtype=float)
    d = np.abs(cb - rb)
    print(f"toda la imagen ({w}x{h}): {d.mean():.2f}/255")
    for item in filter(None, a.regiones.split(";")):
        nombre, coords = item.split(":")
        x0, y0, x1, y1 = (int(float(v)) for v in coords.split(","))
        x0, y0 = max(0, x0), max(0, y0)
        x1, y1 = min(w, x1), min(h, y1)
        reg = d[y0:y1, x0:x1]
        print(f"  {nombre:<22} {reg.mean():6.2f}/255  (R {reg[..., 0].mean():.1f} G {reg[..., 1].mean():.1f} B {reg[..., 2].mean():.1f})")
    print(f"guardado en {a.salida}: mezcla.png, diff.png, captura.png")


if __name__ == "__main__":
    main()
