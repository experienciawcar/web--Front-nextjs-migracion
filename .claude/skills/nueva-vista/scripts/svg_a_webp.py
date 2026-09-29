#!/usr/bin/env python3
"""Convierte los SVG que exporta Figma con fotos PNG/JPEG incrustadas (en base64,
de 1 a 30 MB) en WebP livianos, con el recorte EXACTO que hizo el diseñador.

Tres modos:

  extraer   SVG de UNA foto (o varias capas de fotos apiladas): saca la foto
            original, le aplica el recorte del diseño y la guarda en WebP.
  originales  TODAS las fotos incrustadas de cada SVG, enteras y sin recorte
            (también las capas ocultas y las que no usa ningún patrón). Sirve
            cuando la foto se va a recortar con CSS en otra proporción (el
            marco del SVG es vertical y la tarjeta nueva es horizontal), o
            cuando `extraer` dice "SIN FOTOS con patrón" o saca la foto
            equivocada: en el sitio anterior `vitrina-wcar.svg` trae la foto
            del café encima y la de la vitrina, oculta, debajo.
  renderizar  SVG COMPUESTO (fondo + foto + degradado + trazos): lo dibuja con
            Chrome, opcionalmente sin los <path> (logo y texto), y guarda el
            resultado en WebP.

Uso:
  svg_a_webp.py extraer  a.svg b.svg ... --salida DIR [--ancho-max 1000] [--calidad 82] [--hoja]
  svg_a_webp.py originales a.svg b.svg ... --salida DIR [--ancho-max 800] [--calidad 82] [--hoja]
  svg_a_webp.py renderizar marco.svg --salida panel.webp [--sin-trazos] [--escala 2]

Cómo lee el recorte (ver la guía, sección "Imágenes"): cada capa es un
<rect fill="url(#pattern)"> cuyo <pattern> trae <use transform="matrix(a 0 0 d e f)">
o "scale(a d)". Ese transform lleva la foto a fracciones del rect, así que la
zona visible en píxeles de la foto es u = (fx - e) / a, v = (fy - f) / d para
las esquinas del marco. Si a o d salen negativos, la foto va espejada.

Lo que NO hace, a propósito (lo avisa): el degradado negro que Figma pone sobre
la foto (va en CSS, no horneado), ni máscaras ni filtros. Si el SVG los trae, lo
imprime para que se decida a mano.

Requiere Pillow (`pip install pillow`) con soporte WebP.
"""

import argparse
import base64
import io
import os
import re
import shutil
import subprocess
import sys
import tempfile

from PIL import Image, ImageOps

Image.MAX_IMAGE_PIXELS = None
CHROME = os.environ.get("CHROME", "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome")


def atributos(etiqueta):
    return dict(re.findall(r'([\w:-]+)="([^"]*)"', etiqueta))


def leer(texto):
    """Devuelve marco, imágenes, patrones, capas (en orden, la última queda arriba) y degradados."""
    svg = atributos(re.search(r"<svg[^>]*>", texto).group(0))
    marco = (float(svg["width"]), float(svg["height"]))

    imagenes = {}
    for m in re.finditer(r"<image\b[^>]*>", texto):
        a = atributos(m.group(0))
        b64 = re.search(r"base64,([A-Za-z0-9+/=\s]+)", a.get("xlink:href", a.get("href", "")))
        if b64:
            imagenes[a["id"]] = (float(a["width"]), float(a["height"]), base64.b64decode(b64.group(1)))

    patrones = {}
    for m in re.finditer(r'<pattern\b[^>]*id="([^"]+)"[^>]*>(.*?)</pattern>', texto, re.S):
        uso = re.search(r"<use\b[^>]*>", m.group(2))
        if not uso:
            continue
        a = atributos(uso.group(0))
        ref = a.get("xlink:href", a.get("href", "")).lstrip("#")
        t = a.get("transform", "")
        if t.startswith("matrix"):
            va, _, _, vd, ve, vf = map(float, re.search(r"\(([^)]*)\)", t).group(1).replace(",", " ").split())
        elif t.startswith("scale"):
            va, vd = map(float, re.search(r"\(([^)]*)\)", t).group(1).replace(",", " ").split()[:2])
            ve = vf = 0.0
        else:
            va = vd = 1.0
            ve = vf = 0.0
        patrones[m.group(1)] = (ref, va, vd, ve, vf)

    capas = []
    for m in re.finditer(r"<rect\b[^>]*>", texto):
        a = atributos(m.group(0))
        f = re.match(r"url\(#([^)]+)\)", a.get("fill", ""))
        if f and f.group(1) in patrones:
            tr = a.get("transform", "")
            if tr.startswith("matrix"):
                ra, _, _, rd, re_, rf = map(float, re.search(r"\(([^)]*)\)", tr).group(1).replace(",", " ").split())
            else:
                ra = rd = 1.0
                re_, rf = float(a.get("x", 0)), float(a.get("y", 0))
            capas.append(dict(w=float(a["width"]), h=float(a["height"]), ra=ra, rd=rd, re=re_, rf=rf,
                              con_transform=tr.startswith("matrix"), patron=patrones[f.group(1)]))

    degradados = []
    for m in re.finditer(r'<rect\b[^>]*fill="url\(#(paint[^)]*)\)"[^>]*>', texto):
        a = atributos(m.group(0))
        g = re.search(r'<linearGradient\b[^>]*id="%s"[^>]*>(.*?)</linearGradient>' % re.escape(a["fill"][5:-1]), texto, re.S)
        if g:
            y = re.search(r'y1="([\d.]+)"[^>]*y2="([\d.]+)"', re.search(r"<linearGradient\b[^>]*>", g.group(0)).group(0))
            degradados.append(dict(alto=abs(float(y.group(1)) - float(y.group(2))) if y else None,
                                   opacidad=float(a.get("fill-opacity", 1))))
    return marco, imagenes, capas, degradados


def region_visible(capa, marco, imagenes):
    """Zona de la foto (en píxeles de la foto declarada) que se ve dentro del marco."""
    ref, pa, pd, pe, pf = capa["patron"]
    iw, ih, _ = imagenes[ref]
    (W, H) = marco
    # esquina del marco -> coordenadas locales del rect -> fracción -> píxel de la foto
    def a_foto(X, Y):
        x = (X - capa["re"]) / capa["ra"]
        y = (Y - capa["rf"]) / capa["rd"]
        return ((x / capa["w"]) - pe) / pa, ((y / capa["h"]) - pf) / pd

    u0, v0 = a_foto(0, 0)
    u1, v1 = a_foto(W, H)
    espejo_x, espejo_y = u1 < u0, v1 < v0
    caja = (min(u0, u1), min(v0, v1), max(u0, u1), max(v0, v1))
    dentro = caja[0] >= -1 and caja[1] >= -1 and caja[2] <= iw + 1 and caja[3] <= ih + 1
    return caja, dentro, espejo_x, espejo_y


def extraer(rutas, salida, ancho_max, calidad, hoja):
    os.makedirs(salida, exist_ok=True)
    resultados = []
    for ruta in rutas:
        texto = open(ruta, encoding="utf8").read()
        marco, imagenes, capas, degradados = leer(texto)
        nombre = re.sub(r"[^a-z0-9]+", "-", os.path.splitext(os.path.basename(ruta))[0].lower()).strip("-")
        print(f"\n== {os.path.basename(ruta)}  ({os.path.getsize(ruta) / 1048576:.1f} MB, marco {marco[0]:.0f}x{marco[1]:.0f})")
        if not capas:
            print("   SIN FOTOS con patrón: no es un SVG de foto. Si es un marco compuesto, usar `renderizar`.")
            continue
        for aviso, patron in (("<path", "trazos (logo/texto)"), ("<filter", "filtros (blur)"), ("<mask", "máscara")):
            if aviso in texto and not (aviso == "<mask" and "mask-type:alpha" in texto):
                print(f"   AVISO: trae {patron}: puede ser un marco compuesto; mirar `renderizar --sin-trazos`.")

        # Capa visible: la más alta que cubre todo el marco. Las de abajo quedan ocultas.
        analizadas = []
        for i, capa in enumerate(capas):
            caja, dentro, ex, ey = region_visible(capa, marco, imagenes)
            analizadas.append((i, capa, caja, dentro, ex, ey))
        cubren = [a for a in analizadas if a[3]]
        if not cubren:
            print("   AVISO: ninguna capa cubre el marco entero (se ve fondo por debajo). Se usa la de arriba; revisar a mano.")
            elegida = analizadas[-1]
        else:
            elegida = cubren[-1]
        for i, capa, *_ in analizadas:
            if i != elegida[0]:
                ref = capa["patron"][0]
                print(f"   capa {i + 1} de {len(capas)} OCULTA ({len(imagenes[ref][2]) / 1048576:.1f} MB): tapada por la de arriba, se descarta")

        i, capa, caja, dentro, espejo_x, espejo_y = elegida
        ref = capa["patron"][0]
        iw, ih, datos = imagenes[ref]
        foto = Image.open(io.BytesIO(datos))
        sx, sy = foto.width / iw, foto.height / ih
        caja_px = [caja[0] * sx, caja[1] * sy, caja[2] * sx, caja[3] * sy]

        # Figma a veces estira la foto: si la proporción no coincide con la del marco, se recorta centrado.
        ratio_marco = marco[0] / marco[1]
        bw, bh = caja_px[2] - caja_px[0], caja_px[3] - caja_px[1]
        if abs(bw / bh - ratio_marco) > 0.005:
            if bw / bh > ratio_marco:
                nw = bh * ratio_marco
                cx = (caja_px[0] + caja_px[2]) / 2
                caja_px[0], caja_px[2] = cx - nw / 2, cx + nw / 2
            else:
                nh = bw / ratio_marco
                cy = (caja_px[1] + caja_px[3]) / 2
                caja_px[1], caja_px[3] = cy - nh / 2, cy + nh / 2
            print("   (la foto estaba estirada en Figma: se recortó centrada a la proporción del marco)")

        # Color: sin perfil ICC no hay nada que hacer; con perfil (Display P3 de celular) se pasa a sRGB.
        icc = foto.info.get("icc_profile")
        if icc:
            try:
                from PIL import ImageCms
                foto = ImageCms.profileToProfile(foto.convert("RGB"), ImageCms.ImageCmsProfile(io.BytesIO(icc)),
                                                 ImageCms.createProfile("sRGB"), outputMode="RGB")
                print("   perfil ICC convertido a sRGB")
            except Exception as e:  # noqa: BLE001
                print(f"   AVISO: no se pudo convertir el perfil ICC ({e})")

        opaca = foto.mode != "RGBA" or foto.getchannel("A").getextrema()[0] == 255
        corte = foto.crop(tuple(round(x) for x in caja_px)).convert("RGB" if opaca else "RGBA")
        if espejo_x:
            corte = ImageOps.mirror(corte)
        if espejo_y:
            corte = ImageOps.flip(corte)

        w = min(corte.width, ancho_max)
        h = round(corte.height * w / corte.width)
        if w != corte.width:
            corte = corte.resize((w, h), Image.LANCZOS)
        destino = os.path.join(salida, nombre + ".webp")
        corte.save(destino, "WEBP", quality=calidad, method=6)
        kb = os.path.getsize(destino) / 1024
        print(f"   -> {os.path.basename(destino)}  {corte.width}x{corte.height}  {kb:.0f} KB"
              f"   (foto {foto.width}x{foto.height}, recorte {round(caja_px[2] - caja_px[0])}x{round(caja_px[3] - caja_px[1])}"
              f"{', espejada' if espejo_x else ''}{'' if opaca else ', CON TRANSPARENCIA'})")
        for g in degradados:
            if g["alto"]:
                print(f"   degradado negro encima: {g['alto'] / marco[1] * 100:.1f}% del alto, opacidad {g['opacidad']:g}"
                      "  -> va como overlay de CSS, no en la imagen")
        resultados.append(destino)

    if hoja and resultados:
        hoja_png = os.path.join(salida, "hoja-contacto.jpg")
        cols, cw, ch = 4, 430, 340
        filas = (len(resultados) + cols - 1) // cols
        sheet = Image.new("RGB", (cols * cw, filas * (ch + 20)), (240, 240, 240))
        from PIL import ImageDraw
        d = ImageDraw.Draw(sheet)
        for n, r in enumerate(resultados):
            im = Image.open(r).convert("RGB")
            im.thumbnail((cw - 10, ch - 10))
            x, y = (n % cols) * cw + 5, (n // cols) * (ch + 20) + 20
            d.text((x, y - 16), os.path.basename(r), fill=(0, 0, 0))
            sheet.paste(im, (x, y))
        sheet.save(hoja_png, quality=80)
        print(f"\nhoja de contacto para identificar las fotos: {hoja_png}")


def originales(rutas, salida, ancho_max, calidad, hoja):
    """Guarda cada imagen incrustada (base64) de los SVG, entera y sin recorte."""
    os.makedirs(salida, exist_ok=True)
    resultados = []
    for ruta in rutas:
        nombre = os.path.splitext(os.path.basename(ruta))[0]
        texto = open(ruta, encoding="utf8").read()
        fotos = list(re.finditer(
            r'<image\b[^>]*?(?:xlink:)?href="data:image/(?:png|jpe?g|webp);base64,([A-Za-z0-9+/=]+)"', texto))
        print(f"== {os.path.basename(ruta)}  ({os.path.getsize(ruta) / 1048576:.1f} MB, {len(fotos)} foto(s) incrustada(s))")
        if not fotos:
            print("   no trae fotos incrustadas: si es un marco compuesto, usar `renderizar`.")
        for n, m in enumerate(fotos):
            foto = ImageOps.exif_transpose(Image.open(io.BytesIO(base64.b64decode(m.group(1))))).convert("RGB")
            w, h = foto.size
            if w > ancho_max:
                foto = foto.resize((ancho_max, round(h * ancho_max / w)), Image.LANCZOS)
            destino = os.path.join(salida, f"{nombre}-{n}.webp")
            foto.save(destino, "WEBP", quality=calidad, method=6)
            print(f"   -> {os.path.basename(destino)}  {foto.width}x{foto.height}  "
                  f"{os.path.getsize(destino) / 1024:.0f} KB   (original {w}x{h})")
            resultados.append(destino)
    if hoja and resultados:
        hoja_contacto(resultados, os.path.join(salida, "hoja-contacto.jpg"))


def hoja_contacto(rutas, destino):
    """Hoja de contacto con el nombre de cada foto, para identificarlas a ojo."""
    from PIL import ImageDraw
    cols, cw, ch = 4, 430, 340
    filas = (len(rutas) + cols - 1) // cols
    sheet = Image.new("RGB", (cols * cw, filas * (ch + 20)), (240, 240, 240))
    d = ImageDraw.Draw(sheet)
    for n, r in enumerate(rutas):
        im = Image.open(r).convert("RGB")
        im.thumbnail((cw - 10, ch - 10))
        x, y = (n % cols) * cw + 5, (n // cols) * (ch + 20) + 20
        d.text((x, y - 16), f"{os.path.basename(r)} {im.width}x{im.height}", fill=(0, 0, 0))
        sheet.paste(im, (x, y))
    sheet.save(destino, quality=80)
    print(f"\nhoja de contacto para identificar las fotos: {destino}")


def renderizar(ruta, salida, sin_trazos, escala):
    texto = open(ruta, encoding="utf8").read()
    W, H = (float(v) for v in re.search(r'<svg[^>]*width="([\d.]+)"[^>]*height="([\d.]+)"', texto).groups())
    if sin_trazos:
        texto, n = re.subn(r'<path\b[^>]*/>\s*', "", texto)
        print(f"{n} trazos <path> quitados (logo y texto: van aparte, como SVG propio y texto real)")
    tmp = tempfile.mkdtemp(prefix="svgrender-")
    try:
        open(os.path.join(tmp, "m.svg"), "w", encoding="utf8").write(texto)
        open(os.path.join(tmp, "m.html"), "w", encoding="utf8").write(
            f'<!doctype html><body style="margin:0"><img src="m.svg" style="display:block;width:{W}px;height:{H}px">')
        png = os.path.join(tmp, "m.png")
        subprocess.run([CHROME, "--headless=new", "--disable-gpu", "--hide-scrollbars",
                        f"--force-device-scale-factor={escala}", f"--window-size={int(W)},{int(H)}",
                        "--virtual-time-budget=8000", f"--screenshot={png}", f"file://{tmp}/m.html"],
                       check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        im = Image.open(png).convert("RGB")
        im.save(salida, "WEBP", quality=85, method=6)
        print(f"-> {salida}  {im.width}x{im.height}  {os.path.getsize(salida) / 1024:.0f} KB  (origen {os.path.getsize(ruta) / 1048576:.1f} MB)")
    finally:
        shutil.rmtree(tmp, ignore_errors=True)


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = ap.add_subparsers(dest="modo", required=True)
    e = sub.add_parser("extraer")
    e.add_argument("svg", nargs="+")
    e.add_argument("--salida", required=True)
    e.add_argument("--ancho-max", type=int, default=1000, help="no se amplía nunca; solo se reduce (1000 por defecto)")
    e.add_argument("--calidad", type=int, default=82)
    e.add_argument("--hoja", action="store_true", help="genera hoja-contacto.jpg para identificar las fotos")
    o = sub.add_parser("originales")
    o.add_argument("svg", nargs="+")
    o.add_argument("--salida", required=True)
    o.add_argument("--ancho-max", type=int, default=800, help="no se amplía nunca; solo se reduce (800 por defecto)")
    o.add_argument("--calidad", type=int, default=82)
    o.add_argument("--hoja", action="store_true", help="genera hoja-contacto.jpg para identificar las fotos")
    r = sub.add_parser("renderizar")
    r.add_argument("svg")
    r.add_argument("--salida", required=True)
    r.add_argument("--sin-trazos", action="store_true")
    r.add_argument("--escala", type=int, default=2)
    a = ap.parse_args()
    if a.modo == "extraer":
        extraer(a.svg, a.salida, a.ancho_max, a.calidad, a.hoja)
    elif a.modo == "originales":
        originales(a.svg, a.salida, a.ancho_max, a.calidad, a.hoja)
    else:
        renderizar(a.svg, a.salida, a.sin_trazos, a.escala)


if __name__ == "__main__":
    sys.exit(main())
