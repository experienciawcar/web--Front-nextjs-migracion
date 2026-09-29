#!/usr/bin/env python3
"""Pasa un degradado lineal de Figma (paradas + `gradientTransform`) a un
`linear-gradient(...)` de CSS para una caja de W x H px.

Por qué: `get_design_context` escribe mal los degradados cuyas paradas caen fuera
de la caja, y a mano la matriz `gradientTransform` no se lee. Con `use_figma` (solo
lectura) se sacan las paradas y la matriz de cada relleno:

    fills: n.fills.map(f => ({ type: f.type, stops: f.gradientStops, gt: f.gradientTransform }))

y este script devuelve el CSS con las posiciones en px sobre la línea del degradado
(pueden caer fuera de 0..largo: CSS extiende el primer y el último color, igual que
Figma).

Cómo se lee la matriz: `gt = [[a, b, c], [d, e, f]]` lleva la caja normalizada
(0..1) al espacio del degradado, y la posición de un punto sobre la línea es
`t = a·x + b·y + c` (la primera fila; la segunda es el eje perpendicular y no
importa para un degradado lineal). Comprobado contra el export de Figma en el hero
del inicio y en las tarjetas de servicios.

Uso:
    figma_degradado.py --caja 1440,544 \\
        --transform 1.522,0.0055,-0.0027,-0.0055,0.2188,0.3906 \\
        --paradas '246,247,249,1,0.517;246,247,249,0,0.828'

Cada parada es `r,g,b,alfa,posicion` (color 0-255, alfa 0-1, posicion 0-1). Sale una
línea: `linear-gradient(90deg, rgba(...) 489px, rgba(...) 783px)`. Con `--json`
sale un objeto con el ángulo y el largo de la línea.

Ojo con el nodo girado o volteado: la matriz es del espacio LOCAL del nodo; si el
nodo va rotado 180°, el degradado sale invertido en la pantalla (la caja que se
pasa aquí es la del nodo sin girar).
"""

import argparse
import json
import math


def gradiente_css(w, h, gt, paradas):
    (a, b, c), _ = gt
    gx, gy = a / w, b / h  # cuánto sube t por px, en x y en y
    mag = math.hypot(gx, gy)
    if mag == 0:
        raise SystemExit("la matriz no define una dirección")
    ux, uy = gx / mag, gy / mag
    # Ángulo de CSS: 0deg = hacia arriba, 90deg = hacia la derecha. Vector (sen, -cos).
    angulo = math.degrees(math.atan2(ux, -uy)) % 360
    largo = abs(w * ux) + abs(h * uy)  # largo de la línea de degradado de CSS
    cx, cy = w / 2, h / 2
    t0 = mag * (-largo / 2 + cx * ux + cy * uy) + c

    partes = []
    for r, g, bl, alfa, pos in paradas:
        px = (pos - t0) / mag  # px sobre la línea, contados desde su inicio
        color = f"rgba({round(r)},{round(g)},{round(bl)},{alfa:g})"
        partes.append(f"{color} {px:.1f}px")
    return angulo, largo, f"linear-gradient({angulo:.2f}deg, {', '.join(partes)})"


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--caja", required=True, help="W,H del nodo en px de diseño")
    ap.add_argument("--transform", required=True, help="las seis cifras de gradientTransform, fila por fila")
    ap.add_argument("--paradas", required=True, help="r,g,b,alfa,pos;r,g,b,alfa,pos;...")
    ap.add_argument("--json", action="store_true")
    args = ap.parse_args()

    w, h = (float(v) for v in args.caja.split(","))
    t = [float(v) for v in args.transform.split(",")]
    gt = [t[0:3], t[3:6]]
    paradas = [tuple(float(v) for v in p.split(",")) for p in args.paradas.split(";")]
    angulo, largo, css = gradiente_css(w, h, gt, paradas)
    if args.json:
        print(json.dumps({"angulo": angulo, "largo": largo, "css": css}))
    else:
        print(css)


if __name__ == "__main__":
    main()
