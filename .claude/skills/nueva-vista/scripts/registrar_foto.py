#!/usr/bin/env python3
"""Dice a qué escala y con qué recorte está puesta una foto en una CAPTURA del
diseño, comparando la captura con el archivo de la foto (correlación cruzada
normalizada, solo numpy + Pillow).

Cuándo sirve: no hay acceso a Figma y solo hay una captura. Sin esto, la escala
y el `object-position` de cada foto salen a ojo. Con esto salen con un número
(la correlación) que dice cuánto se puede confiar: > 0.9 es un buen registro.

Uso:
  registrar_foto.py CAPTURA FOTO --origen X0,Y0 --escala S --region x0,y0,x1,y1
                    [--k 0.5,1.5] [--paso 0.01] [--ancla-derecha 1440]

  --origen / --escala   calibración de la captura: el px de la captura donde cae
                        (0,0) del diseño y cuántos px de captura mide 1 px de
                        diseño (ancho de la captura ÷ 1440). Se saca de dos
                        elementos de medida conocida (contenedor, barra lateral).
  --region              zona de la captura donde se ve la foto SIN lo que la
                        tapa (logos, degradado, rayado), en px de diseño.
  --k                   rango de escalas a probar: px de diseño por px de la
                        foto. El resultado sale en `k`.
  --ancla-derecha       si se sabe que la foto llega al borde derecho del lienzo
                        (p. ej. 1440), lo usa para dar también `left` exacto.

Salida (por mejor escala): tamaño de la foto en px de diseño, `left`/`top` de su
esquina en el lienzo, y la correlación. Para una caja de `object-cover`, el
`object-position` sale de `top`: y% = -top / (alto_mostrado - alto_caja).

Ojo: la captura tiene otros colores (el naranja #FF8000 del logo se ve
255,113,42), pero la correlación no lo nota porque trabaja en gris.
"""

import argparse

import numpy as np
from PIL import Image


def ncc_map(img, tpl):
    """NCC de `tpl` deslizada sobre `img` (FFT). Devuelve el mapa de correlación."""
    ih, iw = img.shape
    th, tw = tpl.shape
    n = th * tw
    t = tpl - tpl.mean()
    t_norm = np.sqrt((t * t).sum())
    if t_norm == 0:
        return None
    fh, fw = ih + th, iw + tw
    corr = np.fft.irfft2(np.fft.rfft2(img, (fh, fw)) * np.conj(np.fft.rfft2(t, (fh, fw))), (fh, fw))
    corr = corr[: ih - th + 1, : iw - tw + 1]
    # media y energía local de `img` bajo la ventana, con imágenes integrales
    s1 = np.pad(img, ((1, 0), (1, 0))).cumsum(0).cumsum(1)
    s2 = np.pad(img * img, ((1, 0), (1, 0))).cumsum(0).cumsum(1)

    def box(s):
        return s[th:, tw:] - s[:-th, tw:] - s[th:, :-tw] + s[:-th, :-tw]

    sum1, sum2 = box(s1), box(s2)
    var = np.maximum(sum2 - sum1 * sum1 / n, 1e-9)
    return corr / (t_norm * np.sqrt(var))


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("captura")
    ap.add_argument("foto")
    ap.add_argument("--origen", required=True, help="X0,Y0 en px de la captura")
    ap.add_argument("--escala", required=True, type=float)
    ap.add_argument("--region", required=True, help="x0,y0,x1,y1 en px de diseño")
    ap.add_argument("--k", default="0.5,1.5")
    ap.add_argument("--paso", type=float, default=0.01)
    ap.add_argument("--ancla-derecha", type=float, default=None)
    a = ap.parse_args()

    x0c, y0c = (float(v) for v in a.origen.split(","))
    s = a.escala
    rx0, ry0, rx1, ry1 = (float(v) for v in a.region.split(","))
    cap = Image.open(a.captura).convert("RGB")
    tpl = np.asarray(
        cap.crop((round(x0c + rx0 * s), round(y0c + ry0 * s), round(x0c + rx1 * s), round(y0c + ry1 * s))).convert("L"),
        dtype=float,
    )
    photo = Image.open(a.foto).convert("L")
    pw, ph = photo.size
    kmin, kmax = (float(v) for v in a.k.split(","))

    results = []
    for k in np.arange(kmin, kmax + 1e-9, a.paso):
        w, h = round(pw * k * s), round(ph * k * s)
        if h < tpl.shape[0] or w < tpl.shape[1]:
            continue
        m = ncc_map(np.asarray(photo.resize((w, h), Image.BILINEAR), dtype=float), tpl)
        if m is None:
            continue
        oy, ox = np.unravel_index(np.argmax(m), m.shape)
        # (ox, oy) = dónde cae la esquina de la región dentro de la foto mostrada, en px de captura
        left, top = rx0 - ox / s, ry0 - oy / s
        results.append((float(m[oy, ox]), float(k), left, top))

    results.sort(reverse=True)
    print(f"foto {pw}x{ph}; región {rx1 - rx0:.0f}x{ry1 - ry0:.0f} px de diseño")
    for ncc, k, left, top in results[:4]:
        line = (
            f"ncc={ncc:.3f}  k={k:.3f}  foto mostrada {pw * k:.0f}x{ph * k:.0f}  left={left:.0f}  top={top:.0f}"
            f"  (derecha={left + pw * k:.0f}, abajo={top + ph * k:.0f})"
        )
        if a.ancla_derecha is not None:
            line += f"  | anclada a {a.ancla_derecha:.0f}: left={a.ancla_derecha - pw * k:.0f}"
        print(line)
    if results and results[0][0] < 0.85:
        print("AVISO: correlación baja: la región incluye logos/degradados, o el rango --k no alcanza.")


if __name__ == "__main__":
    main()
