#!/usr/bin/env python3
"""Reproduce un relleno de imagen de Figma (recorte, espejo, inclinación, estirado y
ajustes de color) para dejar la foto lista en un WebP, cuando `object-cover` no
alcanza.

Cuándo sirve: con acceso a Figma, `get_design_context` solo da `object-bottom size-full`
(no dice el modo de relleno) y CSS no sabe hacer un recorte afín ni los "ajustes de
imagen" de Figma (contraste, luces, sombras, temperatura, tinte...). Con esto sale la
foto tal como se ve en el nodo, y las capas de diseño (degradados, oscurecimientos) se
dejan para CSS.

Por qué la foto de Figma suele ser enorme para lo poco que se ve: el diseñador arrastra
una foto de stock o un banco de fotos (a veces de varios miles de px) y la ENCUADRA
recortándola con el `imageTransform` del relleno (mueve/escala qué parte de la foto cae
dentro del nodo), sin recortar nunca el ARCHIVO. `download_assets` da ese archivo
completo tal cual, así que bajarlo y usarlo directo (o solo cambiarle el tamaño) manda al
sitio la foto entera para enseñar un recorte chiquito. Este script existe justo para eso:
aplica el mismo recorte que hizo el diseñador y GUARDA SOLO el resultado, del tamaño real
que se ve (más `--escala` para pantallas retina) — no el original.

1) Lee los datos del relleno con `use_figma` (SOLO lectura; carga antes el skill
   `figma-use`), un nodo por id:

     const n = await figma.getNodeByIdAsync("188:11275");
     return { w: n.width, h: n.height, rel: n.relativeTransform,
              fills: n.fills.map(f => ({ type: f.type, scaleMode: f.scaleMode,
                imageTransform: f.imageTransform, filters: f.filters,
                gradientStops: f.gradientStops, gradientTransform: f.gradientTransform })) };

   - `scaleMode: "FILL"`  = `object-cover` centrado. No hace falta este script.
   - `scaleMode: "CROP"` con `imageTransform` [[a,b,c],[d,e,f]] = recorte. Si
     b = d = 0 y a, e son parecidos, es `object-cover` con `object-position`:
     x% = c / (1 - a), y% = f / (1 - e). Si no (espejo con a < 0, inclinación con b o d
     distintos de 0, o a y e muy diferentes = foto ESTIRADA), usa este script.
   - Un nodo con `relativeTransform` [[-1,0,W],[0,1,0]] está espejado (`--espejo`).
   - `filters` distinto de 0 = ajustes de imagen: se hornean con `--ajuste-color`.
   - Ojo: `x`/`y` de un nodo girado o volteado (metadatos, `get_metadata`) son los del
     ORIGEN local, no los de su caja: mide esos nodos en el render, no con esa cifra.

2) Baja el export del nodo (marco que lo contiene) con `download_assets` a escala 1 (el
   tope es 4096 px de alto: un marco más alto sale reducido y la escala vertical cambia).

3) Aplica:

  figma_imagen.py aplicar FOTO.png \\
      --transform='a,b,c,d,e,f' --caja W,H [--escala 2] [--espejo] [--relleno 400] \\
      [--ajuste-color EXPORT.png --origen-export X,Y --region x0,y0,x1,y1 [--dividir 0.84]] \\
      [--recorte x0,y0,x1,y1] --salida foto.webp [--calidad 82]

  --transform   las seis cifras de `imageTransform`, fila por fila. Va con `=`
                (`--transform='-1.04,0.01,...'`): empieza con «-» y argparse lo toma por
                otra opción.
  --caja        ancho y alto del nodo en px de diseño. La salida mide caja × escala.
  --relleno N   rellena reflejando el borde de la foto los N px que la transformación
                deja fuera de ella (una foto inclinada deja una cuña vacía; en desktop
                la tapa otra pieza, en mobile se vería negra).
  --ajuste-color  ajusta un polinomio de color RGB→RGB (grado 3) entre la foto
                transformada y el export, en la --region (px de diseño DENTRO de la
                caja; sin logos, degradados ni textos encima) y lo aplica a toda la foto.
                Sale el error de validación (media por canal, en /255): 2-4 es bueno.
  --origen-export  dónde cae la esquina superior izquierda de la caja dentro del export.
  --dividir F   quita del export un oscurecimiento uniforme (p. ej. 0.84 = una capa
                negra al 16 %) para hornear solo el color de la foto; esa capa va en CSS.
  --recorte     recorta la salida a esa zona de la caja (px de diseño): sirve para no
                guardar lo que tapa un fondo sólido (p. ej. desde y=260).
  --alfa        para una foto YA recortada con transparencia real (una persona editada
                sobre fondo transparente, no un fondo sólido): conserva el canal alfa en
                vez de aplanar a RGB (no se puede combinar con --ajuste-color, pensado
                para fotos opacas). Sin esto, una foto con alfa sale con fondo negro donde
                debía ser transparente. Para el recorte final de una silueta (no para una
                foto de fondo grande) conviene sumar `--sin-perdida`: el WebP con pérdida
                comprime el canal alfa igual que el de color, y distintos navegadores
                decodifican esa compresión con una precisión ligeramente distinta —a veces
                se nota como un borde clarito alrededor de la silueta que no sale en todas
                partes igual. Sin pérdida no tiene ese riesgo (a cambio de un archivo más
                pesado, aceptable en una silueta chica).

                También "extiende" el color opaco hacia los píxeles ya transparentes antes
                de recortar (`limpiar_halo`, dilatación ponderada por alfa). Sin esto, el
                recorte sale con un halo claro en el borde: Figma no premultiplica, así que
                un píxel con alfa 0 sigue guardando el color del fondo de estudio que el
                editor recortó, y el `BICUBIC` del recorte (o la compresión WebP) lo mezcla
                con sus vecinos igual, sin mirar el alfa. El halo casi no se nota contra un
                fondo gris y se nota mucho contra un color fuerte (pruébalo así, no contra
                un gris neutro).

Ejemplos reales (vista Taller):
  hero        --transform='-1.04898,0.0150244,1.13579,-0.0693447,0.956432,0.0718779'
              --caja 900,509 --escala 2 --relleno 400 --ajuste-color hero_export.png
              --origen-export 540,0 --region 340,0,895,388 --dividir 0.84
  rueda       --transform='0.720093,0,0.19269,0,1.195531,-0.282231' --caja 404,1100
              --escala 2 --espejo --ajuste-color columna_export.png --origen-export 0,0
              --region 0,640,404,1080 --recorte 0,260,404,1100

Verifica siempre contra el export: la correlación de la geometría debe ser > 0,98 y
bajar a ~0,9 si se desplaza la foto 3 px (`comparar`).

  figma_imagen.py comparar FOTO_RESULTADO.webp EXPORT.png --origen-export X,Y --region x0,y0,x1,y1

Solo numpy y Pillow.
"""

import argparse

import numpy as np
from PIL import Image


def _tuple(s, n, tipo=float):
    v = [tipo(x) for x in s.split(",")]
    if len(v) != n:
        raise SystemExit(f"se esperaban {n} valores separados por comas: {s!r}")
    return v


def limpiar_halo(rgba, pasadas=14):
    """Extiende el color opaco hacia los píxeles transparentes de una imagen RGBA
    (dilatación ponderada por alfa, vecindad de 3x3), sin tocar el alfa. Ver
    `--limpiar-halo` arriba: sin esto, recortar/reescalar una foto con alfa real dejaba
    un halo claro (el color del fondo de estudio que el editor recortó, sin premultiplicar)
    alrededor de la silueta."""
    a = np.asarray(rgba, dtype=float)
    rgb, alpha = a[..., :3], a[..., 3]
    w = alpha.copy()
    col = rgb * w[..., None]
    for _ in range(pasadas):
        wpad = np.pad(w, 1, mode="edge")
        cpad = np.pad(col, ((1, 1), (1, 1), (0, 0)), mode="edge")
        wsum = np.zeros_like(w)
        csum = np.zeros_like(col)
        for dy in (0, 1, 2):
            for dx in (0, 1, 2):
                wsum += wpad[dy : dy + w.shape[0], dx : dx + w.shape[1]]
                csum += cpad[dy : dy + w.shape[0], dx : dx + w.shape[1], :]
        crecer = w <= 0
        col_nuevo = np.where(
            crecer[..., None], np.divide(csum, wsum[..., None], out=np.zeros_like(csum), where=wsum[..., None] > 0), col
        )
        w_nuevo = np.where(crecer, np.clip(wsum / 9.0, 0, 1) * (wsum > 0), w)
        col, w = col_nuevo, np.maximum(w, w_nuevo * (w <= 0))
    rgb_limpio = col.copy()
    original = alpha > 0
    rgb_limpio[original] = rgb[original]
    salida = np.dstack([rgb_limpio, alpha]).clip(0, 255).astype("uint8")
    return Image.fromarray(salida, "RGBA")


def transformar(src, m, w, h, s=1.0, espejo=False, relleno=0):
    """La foto tal como se ve en un nodo de w x h px de diseño, a escala s.
    `m` = imageTransform de Figma (normalizado nodo -> normalizado imagen)."""
    W, H = src.size
    if relleno:
        src = Image.fromarray(np.pad(np.asarray(src), ((relleno, relleno), (relleno, relleno), (0, 0)), mode="reflect"))
    (m00, m01, m02), (m10, m11, m12) = m
    a = W * m00 / (s * w)
    b = W * m01 / (s * h)
    c = W * m02 + relleno
    d = H * m10 / (s * w)
    e = H * m11 / (s * h)
    f = H * m12 + relleno
    if espejo:  # x_local = s*w - x
        c += a * s * w
        f += d * s * w
        a, d = -a, -d
    return src.transform((round(w * s), round(h * s)), Image.AFFINE, (a, b, c, d, e, f), resample=Image.BICUBIC)


def _feats(rgb):
    r, g, b = (rgb[..., i] / 255.0 for i in range(3))
    return np.stack(
        [np.ones_like(r), r, g, b, r * r, g * g, b * b, r * g, r * b, g * b, r * r * r, g * g * g, b * b * b], -1
    )


def ajustar(src_rgb, dst_rgb):
    X = _feats(src_rgb.reshape(-1, 3).astype(float))
    Y = dst_rgb.reshape(-1, 3).astype(float) / 255.0
    return np.linalg.lstsq(X, Y, rcond=None)[0]


def aplicar_color(coef, rgb):
    forma = rgb.shape
    X = _feats(rgb.reshape(-1, 3).astype(float))
    return np.clip(X @ coef, 0, 1).reshape(forma) * 255.0


def _ncc(a, b):
    a = a - a.mean()
    b = b - b.mean()
    return float((a * b).sum() / np.sqrt((a * a).sum() * (b * b).sum()))


def _region_export(export, origen, region):
    ox, oy = origen
    x0, y0, x1, y1 = (int(v) for v in region)
    return np.asarray(export.convert("RGB"), float)[oy + y0 : oy + y1, ox + x0 : ox + x1]


def cmd_aplicar(a):
    if a.alfa and a.ajuste_color:
        raise SystemExit("--alfa no se puede combinar con --ajuste-color (piensa en fotos opacas)")
    if a.alfa:
        src = Image.open(a.foto).convert("RGBA")
        src = limpiar_halo(src)
    else:
        src = Image.open(a.foto).convert("RGB")
    t = _tuple(a.transform, 6)
    m = [t[0:3], t[3:6]]
    w, h = _tuple(a.caja, 2)
    s = a.escala
    x = np.asarray(transformar(src, m, w, h, s, a.espejo, a.relleno), float)
    if a.ajuste_color:
        export = Image.open(a.ajuste_color)
        origen = [int(v) for v in _tuple(a.origen_export, 2)]
        region = _tuple(a.region, 4)
        x1 = np.asarray(transformar(src, m, w, h, 1.0, a.espejo, a.relleno), float)
        x0, y0, xx1, yy1 = (int(v) for v in region)
        S = x1[y0:yy1, x0:xx1]
        D = np.clip(_region_export(export, origen, region) / a.dividir, 0, 255)
        sel = (np.add.outer(np.arange(S.shape[0]), np.arange(S.shape[1])) % 2) == 0
        coef = ajustar(S[sel], D[sel])
        err = np.abs(aplicar_color(coef, S[~sel]) - D[~sel]).mean()
        crudo = np.abs(S[~sel] - D[~sel]).mean()
        print(f"geometría (correlación en gris): {_ncc(S.mean(-1), D.mean(-1)):.3f}")
        print(f"color: error de validación {err:.1f}/255 (sin ajuste: {crudo:.1f})")
        coef = ajustar(S.reshape(-1, 3), D.reshape(-1, 3))
        x = aplicar_color(coef, x)
    out = Image.fromarray(x.round().clip(0, 255).astype(np.uint8), "RGBA" if a.alfa else "RGB")
    if a.recorte:
        c = _tuple(a.recorte, 4)
        out = out.crop(tuple(round(v * s) for v in c))
    if a.salida.lower().endswith(".webp"):
        out.save(a.salida, lossless=True, method=6) if a.sin_perdida else out.save(a.salida, quality=a.calidad, method=6)
    else:
        out.save(a.salida)
    print(f"{a.salida}: {out.size[0]} x {out.size[1]}")


def cmd_comparar(a):
    res = Image.open(a.resultado).convert("RGB")
    export = Image.open(a.export)
    origen = [int(v) for v in _tuple(a.origen_export, 2)]
    region = _tuple(a.region, 4)
    x0, y0, x1, y1 = (int(v) for v in region)
    D = _region_export(export, origen, region)
    R = np.asarray(res.resize((round(res.width / a.escala), round(res.height / a.escala)), Image.LANCZOS), float)
    R = R[y0 - a.desplazar_y : y1 - a.desplazar_y, x0:x1]
    print(f"correlación en gris: {_ncc(R.mean(-1), D.mean(-1)):.3f}   diferencia media: {np.abs(R - D).mean():.1f}/255")


def main():
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = p.add_subparsers(dest="cmd", required=True)
    a = sub.add_parser("aplicar")
    a.add_argument("foto")
    a.add_argument("--transform", required=True)
    a.add_argument("--caja", required=True)
    a.add_argument("--escala", type=float, default=1.0)
    a.add_argument("--espejo", action="store_true")
    a.add_argument("--relleno", type=int, default=0)
    a.add_argument("--ajuste-color")
    a.add_argument("--origen-export", default="0,0")
    a.add_argument("--region")
    a.add_argument("--dividir", type=float, default=1.0)
    a.add_argument("--recorte")
    a.add_argument("--alfa", action="store_true")
    a.add_argument("--salida", required=True)
    a.add_argument("--calidad", type=int, default=82)
    a.add_argument("--sin-perdida", dest="sin_perdida", action="store_true")
    a.set_defaults(fn=cmd_aplicar)
    c = sub.add_parser("comparar")
    c.add_argument("resultado")
    c.add_argument("export")
    c.add_argument("--origen-export", default="0,0")
    c.add_argument("--region", required=True)
    c.add_argument("--escala", type=float, default=2.0, help="escala del resultado respecto a px de diseño")
    c.add_argument("--desplazar-y", type=int, default=0, help="px de diseño que se recortaron por arriba (--recorte)")
    c.set_defaults(fn=cmd_comparar)
    args = p.parse_args()
    if args.cmd == "aplicar" and args.ajuste_color and not args.region:
        raise SystemExit("--ajuste-color necesita --region")
    args.fn(args)


if __name__ == "__main__":
    main()
