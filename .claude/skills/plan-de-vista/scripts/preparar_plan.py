#!/usr/bin/env python3
"""Prepara todo lo mecánico para escribir el plan de una vista nueva.

Es el primer paso del skill `plan-de-vista`. Hace lo que no necesita criterio:

  1. Crea `docs/planes/<slug>/` y copia ahí las capturas, numeradas y con nombre.
  2. Dice de cada captura su tamaño y su escala probable (ancho ÷ 1440).
  3. (--ampliar) Deja copias AMPLIADAS y partidas en trozos legibles (el texto de
     una captura a 0,53 no se lee sin ampliar: guía §12.9).
  4. (--sondear) Prueba en el backend qué endpoints existen para esa vista.
  5. (--sitio-anterior) Baja la página del sitio viejo con Chrome, saca su texto,
     sus botones y enlaces y, con --buscar-js, busca en su bundle reglas de negocio
     (fórmulas, tasas): así salió la del simulador de Financiación.
  6. Crea las carpetas de imágenes de cada sección (--secciones).
  7. Crea `docs/planes/<slug>.md` desde `plantilla-plan.md` (sin pisar uno existente).

Lo que NO hace, a propósito: leer las capturas y escribir las tareas. Eso es el
trabajo del plan y lo hace quien lo escribe mirando cada imagen.

Uso:
  preparar_plan.py SLUG CAPTURA [CAPTURA ...] [opciones]

  --nombres a,b,c        nombres cortos de las capturas, en el mismo orden
                         (`1-a.png`, `2-b.png`…); por defecto, el del archivo.
  --titulo "Financiación"  nombre de la vista (por defecto, el slug).
  --ruta /servicios/financiacion   URL de la vista.
  --modulo financing     carpeta en src/modules (por defecto, el slug).
  --assets financiacion  carpeta en public/assets (por defecto, el slug).
  --figma URL            enlace de Figma (saca fileKey y node-id).
  --secciones hero,pasos,...   crea public/assets/<assets>/<sec>/ y
                         src/modules/<modulo>/assets/<sec>/ para cada una.
  --ampliar [K]          copias ampliadas K veces (2 por defecto) en $TMPDIR.
  --sondear a,b,c        endpoints extra a probar (además de los derivados del slug).
  --sitio-anterior URL   página equivalente del sitio viejo.
  --buscar-js p1,p2      palabras a buscar en el bundle de esa página.
  --forzar               reescribe el plan si ya existe (por defecto no lo toca).

Requiere: Pillow (capturas), curl y, para --sitio-anterior, Google Chrome.
"""

import argparse
import datetime
import html
import os
import re
import shutil
import subprocess
import sys
import tempfile
from urllib.parse import urljoin

from PIL import Image

RAIZ = subprocess.check_output(["git", "rev-parse", "--show-toplevel"], text=True).strip()
CHROME = os.environ.get("CHROME", "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome")
AQUI = os.path.dirname(os.path.abspath(__file__))
PLANTILLA = os.path.join(AQUI, "..", "plantilla-plan.md")


def tmp(slug):
    d = os.path.join(os.environ.get("TMPDIR", tempfile.gettempdir()), f"plan-{slug}")
    os.makedirs(d, exist_ok=True)
    return d


def copiar_capturas(slug, capturas, nombres):
    destino = os.path.join(RAIZ, "docs", "planes", slug)
    os.makedirs(destino, exist_ok=True)
    salida = []
    print(f"\n== Capturas en docs/planes/{slug}/ ==")
    print(f"{'archivo':<44}{'tamaño':>12}{'escala':>9}  nota")
    for i, ruta in enumerate(capturas, 1):
        stem = nombres[i - 1] if i - 1 < len(nombres) else os.path.splitext(os.path.basename(ruta))[0]
        stem = re.sub(r"[^a-z0-9]+", "-", stem.lower()).strip("-")
        nombre = f"{i}-{stem}.png"
        dst = os.path.join(destino, nombre)
        Image.open(ruta).convert("RGB").save(dst)
        w, h = Image.open(dst).size
        esc = w / 1440
        if 1400 <= w <= 1500:
            nota = "marco de 1440 a tamaño real: escala 1"
        elif 500 <= w <= 1100:
            nota = "marco de 1440 reducido: calibrar con dos medidas conocidas (guía §12.1, §12.12)"
        else:
            nota = "ancho raro: ¿es un recorte? no asumir escala"
        print(f"{nombre:<44}{f'{w}x{h}':>12}{esc:>9.3f}  {nota}")
        salida.append((nombre, w, h, esc))
    print("\nCada píxel de captura son 1/escala px de diseño (a 0,53: ~1,9): las medidas salen con ese error.")
    return destino, salida


def ampliar(slug, destino, k):
    d = tmp(slug)
    print(f"\n== Copias ampliadas x{k} en {d} ==")
    for nombre in sorted(os.listdir(destino)):
        if not nombre.endswith(".png"):
            continue
        im = Image.open(os.path.join(destino, nombre)).convert("RGB")
        grande = im.resize((im.width * k, im.height * k), Image.LANCZOS)
        trozos = 1 if grande.height <= 900 else 2 if grande.height <= 1800 else 3
        alto = -(-grande.height // trozos)
        for t in range(trozos):
            recorte = grande.crop((0, max(0, t * alto - 30), grande.width, min(grande.height, (t + 1) * alto + 30)))
            out = os.path.join(d, f"{os.path.splitext(nombre)[0]}-x{k}-{t + 1}.png")
            recorte.save(out)
            print("  ", out)
    print("Léelas con Read; para un texto pequeño, recorta y amplía x3 la zona (Lanczos).")


def sondear(extra, slug):
    env = os.path.join(RAIZ, ".env.local")
    base = None
    if os.path.exists(env):
        for linea in open(env, encoding="utf-8"):
            if linea.startswith("NEXT_PUBLIC_API_BASE_URL="):
                base = linea.split("=", 1)[1].strip().strip('"')
    print("\n== Backend ==")
    if not base:
        print("  sin NEXT_PUBLIC_API_BASE_URL en .env.local: no se puede sondear")
        return
    candidatos = []
    for c in [slug, slug + "s", slug.rstrip("s"), "faqs", "faq", "simulator", "insurers", "services"] + extra:
        if c and c not in candidatos:
            candidatos.append(c)
    for c in candidatos:
        codigo = subprocess.run(
            ["curl", "-s", "-o", "/dev/null", "-w", "%{http_code}", f"{base.rstrip('/')}/{c}/"],
            capture_output=True, text=True,
        ).stdout
        print(f"  /{c}/  {codigo}" + ("   <-- existe" if codigo.startswith("2") else ""))
    hallados = set()
    for raiz, _, archivos in os.walk(os.path.join(RAIZ, "src")):
        for f in archivos:
            if f.endswith(".ts"):
                for m in re.finditer(r'apiUrl\(\s*"([^"]+)"', open(os.path.join(raiz, f), encoding="utf-8").read()):
                    hallados.add(m.group(1))
    print("  endpoints que ya usa el código:", ", ".join(sorted(hallados)) or "(ninguno)")


def sitio_anterior(slug, url, buscar):
    d = tmp(slug)
    print(f"\n== Sitio anterior: {url} ==")
    if not os.path.exists(CHROME):
        print("  no hay Chrome en", CHROME)
        return
    r = subprocess.run(
        [CHROME, "--headless", "--disable-gpu", "--virtual-time-budget=15000", "--dump-dom", url],
        capture_output=True, text=True, timeout=120,
    )
    dom = r.stdout
    ruta_html = os.path.join(d, "sitio-anterior.html")
    open(ruta_html, "w", encoding="utf-8").write(dom)
    # texto visible, sin scripts ni estilos
    limpio = re.sub(r"<script.*?</script>|<style.*?</style>", "", dom, flags=re.S)
    limpio = html.unescape(re.sub(r"<[^>]+>", "\n", limpio))
    lineas = [l.strip() for l in limpio.split("\n") if l.strip()]
    ruta_txt = os.path.join(d, "sitio-anterior.txt")
    open(ruta_txt, "w", encoding="utf-8").write("\n".join(lineas))
    print(f"  {len(lineas)} líneas de texto -> {ruta_txt}")
    # Solo el contenido de la página: desde el primer <h1> (o <main>) hasta el <footer>,
    # para no listar el menú y el pie de todo el sitio.
    ini = min([i for i in (dom.find("<h1"), dom.find("<main")) if i >= 0] or [0])
    fin = dom.find("<footer", ini)
    cuerpo = dom[ini:fin if fin > 0 else len(dom)]
    print("  enlaces y botones del contenido (sin menú ni pie):")
    vistos = set()
    for m in re.finditer(r"<(a|button)\b([^>]*)>(.*?)</\1>", cuerpo, flags=re.S):
        texto = html.unescape(re.sub(r"\s+", " ", re.sub(r"<[^>]+>", " ", m.group(3)))).strip()
        href = re.search(r'href="([^"]*)"', m.group(2))
        destino = href.group(1)[:100] if href else "(sin href: abre un modal o formulario)"
        if texto and len(texto) < 70 and (texto, destino) not in vistos:
            vistos.add((texto, destino))
            print(f"    [{m.group(1)}] {texto!r} -> {destino}")
    if buscar:
        bundles = re.findall(r'src="(/static/js/main\.[^"]+\.js)"', dom)
        if not bundles:
            print("  no encontré un bundle main.*.js (¿otro empaquetador?)")
            return
        js = subprocess.run(["curl", "-s", urljoin(url, bundles[0])], capture_output=True, text=True).stdout
        ruta_js = os.path.join(d, "sitio-anterior-main.js")
        open(ruta_js, "w", encoding="utf-8").write(js)
        print(f"  bundle {bundles[0]} ({len(js)} bytes) -> {ruta_js}")
        for palabra in buscar:
            hits = [m.start() for m in re.finditer(re.escape(palabra), js)]
            print(f"  '{palabra}': {len(hits)} apariciones")
            for h in hits[:3]:
                print("     …" + js[max(0, h - 200):h + 260].replace("\n", " ") + "…")
        print("  Ojo: una fórmula encontrada se contrasta con el ejemplo del diseño (¿reproduce el número?).")


def carpetas(assets, modulo, secciones):
    print("\n== Carpetas de imágenes ==")
    for s in secciones:
        for base in (os.path.join("public", "assets", assets, s), os.path.join("src", "modules", modulo, "assets", s)):
            os.makedirs(os.path.join(RAIZ, base), exist_ok=True)
            print("  ", base)


def crear_plan(args, tabla):
    ruta = os.path.join(RAIZ, "docs", "planes", f"{args.slug}.md")
    if os.path.exists(ruta) and not args.forzar:
        print(f"\n== Plan: docs/planes/{args.slug}.md ya existe; no se toca (usa --forzar para rehacerlo) ==")
        return
    texto = open(PLANTILLA, encoding="utf-8").read()
    figma, node = "", ""
    if args.figma:
        m = re.search(r"design/([^/]+)/", args.figma)
        n = re.search(r"node-id=([\d\-:]+)", args.figma)
        figma = m.group(1) if m else ""
        node = n.group(1).replace("-", ":") if n else ""
    filas = "\n".join(f"| `{n}` | {w}x{h} | {e:.3f} |" for n, w, h, e in tabla)
    reemplazos = {
        "{{TITULO}}": args.titulo or args.slug,
        "{{SLUG}}": args.slug,
        "{{RUTA}}": args.ruta or f"/{args.slug}",
        "{{RUTA_APP}}": f"src/app{args.ruta or '/' + args.slug}/page.tsx",
        "{{MODULO}}": args.modulo or args.slug,
        "{{ASSETS}}": args.assets or args.slug,
        "{{FECHA}}": datetime.date.today().isoformat(),
        "{{FIGMA_FILE}}": figma or "(sin enlace de Figma)",
        "{{FIGMA_NODO}}": node or "(sin nodo)",
        "{{TABLA_CAPTURAS}}": filas or "| (sin capturas) | | |",
    }
    for k, v in reemplazos.items():
        texto = texto.replace(k, v)
    open(ruta, "w", encoding="utf-8").write(texto)
    print(f"\n== Plan creado: docs/planes/{args.slug}.md (esqueleto: falta escribir las tareas) ==")


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("slug")
    ap.add_argument("capturas", nargs="*")
    ap.add_argument("--nombres", default="")
    ap.add_argument("--titulo")
    ap.add_argument("--ruta")
    ap.add_argument("--modulo")
    ap.add_argument("--assets")
    ap.add_argument("--figma")
    ap.add_argument("--secciones", default="")
    ap.add_argument("--ampliar", nargs="?", const=2, type=int)
    ap.add_argument("--sondear", nargs="?", const="")
    ap.add_argument("--sitio-anterior")
    ap.add_argument("--buscar-js", default="")
    ap.add_argument("--forzar", action="store_true")
    a = ap.parse_args()

    for c in a.capturas:
        if not os.path.exists(c):
            sys.exit(f"no existe la captura {c}")
    tabla = []
    if a.capturas:
        destino, tabla = copiar_capturas(a.slug, a.capturas, [n for n in a.nombres.split(",") if n])
        if a.ampliar:
            ampliar(a.slug, destino, a.ampliar)
    if a.sondear is not None:
        sondear([n for n in a.sondear.split(",") if n], a.slug)
    if a.sitio_anterior:
        sitio_anterior(a.slug, a.sitio_anterior, [p for p in a.buscar_js.split(",") if p])
    if a.secciones:
        carpetas(a.assets or a.slug, a.modulo or a.slug, [s for s in a.secciones.split(",") if s])
    crear_plan(a, tabla)
    print("\nSiguiente: mira cada captura (y su copia ampliada), rellena el plan con el skill `plan-de-vista`.")


if __name__ == "__main__":
    main()
