#!/usr/bin/env python3
"""Empareja cada TEXTO de un marco de Figma con su elemento en la página real y
compara lo que un render por píxeles no explica: tamaño de fuente, interlineado,
número de líneas, posición horizontal y cuánto se corre hacia abajo.

Por qué texto y no píxeles: cuando el diseño mobile y la maqueta divergen (otra
composición, otra tarjeta) la diferencia por píxeles sale alta en todas partes y
no dice nada. Los textos sí: "h2 debe ser 36 px y es 28", "esto va en 2 líneas y
está en 1", "el bloque está 40 px más arriba".

Uso:
  comparar_textos_figma.py --url http://localhost:3100/servicios/financiacion \\
      --ancho 393 --figma textos.json [--offset-y 16] [--selector main]

  --figma     JSON con una lista de {t, x, y, w, h, fs, lh, al} (px del marco de
              Figma). Sale de `figma_volcado.js` corrido con `use_figma` (solo
              lectura). También vale {"textos": [...]}.
  --offset-y  px que el marco de Figma empieza más abajo que la página (el navbar
              de Figma mide 96 y el de la página 80: --offset-y 16). Sin él, la
              "deriva" arranca corrida.
  --selector  dónde buscar los textos en la página (por defecto `main`).
  --json      guarda además el resultado en un archivo.

Lee la salida así:
  fs   tamaño de fuente Figma/página          ln  líneas Figma/página
  x    borde izquierdo (o centro si el texto va centrado) Figma/página
  w    ancho de la caja Figma/página
  dy   deriva vertical acumulada: (y de la página + offset) - y de Figma. Lo que
       importa es el SALTO entre dos filas seguidas: ahí una sección quedó más
       alta o más baja que en el diseño.

Los textos de Figma sin pareja en la página salen como "sin par": o el copy
cambió, o el bloque no existe en mobile.
"""

import argparse
import json
import os
import sys
import time

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "nueva-vista", "scripts"))
from cdp import Browser  # noqa: E402

JS = r"""
(figma, selector) => {
  const norm = s => (s || '').replace(/\s+/g, ' ').trim().toLowerCase();
  const root = document.querySelector(selector) || document.body;
  const els = [...root.querySelectorAll('*')].filter(e => {
    const r = e.getBoundingClientRect();
    return r.width > 0 && r.height > 0 && getComputedStyle(e).visibility !== 'hidden';
  });
  const propio = e => {
    if (e.tagName === 'INPUT') return norm(e.value || e.placeholder);
    if (e.tagName === 'SELECT') return norm([...e.selectedOptions].map(o => o.text).join(' '));
    return norm(e.innerText);
  };
  const texto = new Map(els.map(e => [e, propio(e)]));
  const out = [];
  let ultimoTop = -1e9;
  for (const f of figma) {
    const clave = norm(f.t).slice(0, 40);
    // Candidatos: empiezan por el texto; nos quedamos con el más profundo.
    let cand = els.filter(e => (texto.get(e) || '').startsWith(clave));
    if (!cand.length) cand = els.filter(e => (texto.get(e) || '').includes(clave) && clave.length >= 8);
    cand = cand.filter(e => !cand.some(o => o !== e && e.contains(o)));
    // Orden del documento, y el primero que no quede por encima del anterior.
    cand.sort((a, b) => (a.compareDocumentPosition(b) & 4 ? -1 : 1));
    const el = cand.find(e => e.getBoundingClientRect().top + scrollY >= ultimoTop - 8) || cand[0];
    if (!el) { out.push({ id: f.id, t: f.t, sinPar: true, fy: f.y }); continue; }
    const cs = getComputedStyle(el);
    const rect = el.getBoundingClientRect();
    // Cajas de línea del texto (unión): más fiel que la caja del bloque.
    const rg = document.createRange();
    rg.selectNodeContents(el);
    let l = 1e9, r = -1e9, t = 1e9, b = -1e9;
    for (const rc of rg.getClientRects()) {
      if (rc.width < 1 || rc.height < 1) continue;
      l = Math.min(l, rc.left); r = Math.max(r, rc.right); t = Math.min(t, rc.top); b = Math.max(b, rc.bottom);
    }
    const campo = l > r;
    if (campo) {  // input/select: el valor no tiene cajas de texto
      l = rect.left + parseFloat(cs.paddingLeft); r = rect.right - parseFloat(cs.paddingRight);
      t = rect.top; b = rect.bottom;
    }
    const inline = cs.display === 'inline';
    const top = (inline ? t : rect.top) + scrollY;
    const fs = parseFloat(cs.fontSize);
    const lhPx = cs.lineHeight === 'normal' ? fs * 1.2 : parseFloat(cs.lineHeight);
    const alto = inline ? (b - t) : rect.height;
    const lineas = campo ? 1 : Math.max(1, Math.round((b - t) / lhPx));
    ultimoTop = top;
    out.push({
      id: f.id, t: f.t, fy: f.y, top,
      fs, lh: Math.round(lhPx * 10) / 10, lineas,
      x: l, r, cx: (l + r) / 2, w: inline ? r - l : rect.width,
      align: cs.textAlign, peso: cs.fontWeight, fam: cs.fontFamily.split(',')[0].replace(/"/g, ''),
      tag: el.tagName.toLowerCase(), alto,
    });
  }
  return JSON.stringify(out);
}
"""


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--url", required=True)
    ap.add_argument("--ancho", type=int, required=True)
    ap.add_argument("--figma", required=True)
    ap.add_argument("--offset-y", type=float, default=0)
    ap.add_argument("--selector", default="main")
    ap.add_argument("--json")
    ap.add_argument("--puerto", type=int, default=9341)
    ap.add_argument("--umbral-y", type=float, default=6, help="salto de deriva que se marca (px)")
    a = ap.parse_args()

    figma = json.load(open(a.figma))
    if isinstance(figma, dict):
        figma = figma["textos"]
    figma = sorted(figma, key=lambda f: f["y"])

    with Browser(port=a.puerto) as page:
        page.viewport(a.ancho, 1000)
        page.goto(a.url)
        alto = page.js("document.documentElement.scrollHeight")
        y = 0
        while y < alto:  # las imágenes y los `reveal` se activan al acercarse
            page.js(f"window.scrollTo(0,{y})")
            time.sleep(0.25)
            y += 800
        page.js("window.scrollTo(0,0)")
        time.sleep(1.2)
        res = json.loads(page.js(f"({JS})({json.dumps(figma)}, {json.dumps(a.selector)})"))

    print(f"{a.url} @ {a.ancho}px   ({len(res)} textos de Figma)\n")
    print(f"{'y fig':>6} {'dy':>5} {'Δdy':>5}  {'fs':>9} {'ln':>5} {'x F/P':>13} {'w F/P':>11}  texto / aviso")
    prev_dy = None
    avisos_tot = 0
    for f, r in zip(figma, res):
        if r.get("sinPar"):
            print(f"{f['y']:6.0f} {'':>5} {'':>5}  {'':>9} {'':>5} {'':>13} {'':>11}  «{f['t'][:44]}»  ← SIN PAR en la página")
            avisos_tot += 1
            continue
        dy = r["top"] + a.offset_y - f["y"]
        salto = 0 if prev_dy is None else dy - prev_dy
        prev_dy = dy
        centrado = f.get("al") == "CENTER"
        xf = f["x"] + f["w"] / 2 if centrado else f["x"]
        xp = r["cx"] if centrado else r["x"]
        lin_f = round(f["h"] / f["lh"]) if isinstance(f.get("lh"), (int, float)) and f["lh"] else None
        av = []
        if abs(r["fs"] - f["fs"]) >= 1:
            av.append(f"fuente {r['fs']:g}→debe ser {f['fs']:g}")
        if lin_f and lin_f != r["lineas"]:
            av.append(f"{r['lineas']} líneas, el diseño {lin_f}")
        if abs(xp - xf) >= 4:
            av.append(f"{'centro' if centrado else 'x'} {xp - xf:+.0f}px")
        if abs(salto) >= a.umbral_y:
            av.append(f"SALTO vertical {salto:+.0f}px")
        avisos_tot += bool(av)
        lf = f"{lin_f}" if lin_f else "?"
        print(
            f"{f['y']:6.0f} {dy:+5.0f} {salto:+5.0f}  {r['fs']:>4g}/{f['fs']:<4g} {r['lineas']:>2}/{lf:<2} "
            f"{xp:6.0f}/{xf:<6.0f} {r['w']:5.0f}/{f['w']:<5.0f}  «{f['t'][:34]}»  {'; '.join(av)}"
        )
    print(f"\n{avisos_tot} de {len(res)} textos con alguna diferencia.")
    if a.json:
        json.dump(res, open(a.json, "w"), ensure_ascii=False, indent=1)


if __name__ == "__main__":
    main()
