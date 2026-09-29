#!/usr/bin/env python3
"""Barrido responsive automático: recorre las rutas del sitio a varios anchos de
viewport REAL (también 320 y 393) y busca lo que se rompe sin necesitar Figma.

Qué revisa en cada (ruta, ancho):
  · scroll horizontal y los elementos que lo causan (ERROR si hay scroll real;
    AVISO si la página lo esconde con overflow-x: clip)
  · texto por debajo de 12 px
  · zonas táctiles (a, button, input, summary…) de menos de 44 px en mobile
    (menos de 24 px = ERROR: no cumple WCAG 2.2 AA 2.5.8)
  · imágenes: sin cargar, deformadas (object-fit fill con otra proporción),
    ampliadas por encima de su tamaño natural (borrosas) y mucho más pesadas de
    lo que se ven
  · textos que se PISAN entre sí (cajas de texto que se solapan)
  · texto cortado por un overflow hidden
  · margen lateral del texto: pegado al borde en mobile, descentrado en pantalla
    ancha (el contenido debe quedar centrado, guía §4.2)
  · sin <meta viewport>

Uso (con la copia aislada levantada, `nueva-vista/scripts/copia_aislada.sh start`):
  barrido_responsive.py [--base http://localhost:3100] [RUTA ...]
        [--anchos 320,393,768,1024,1440,1900 | --completo] [--json salida.json]

Sin rutas, las deduce de `src/app/**/page.tsx`. Con --completo suma 360, 430, 600,
1279 y 1280 (los bordes del breakpoint `xl` de Tailwind: 1280).

Sale con código 1 si hay algún ERROR. No escribe nada en el proyecto.
"""

import argparse
import glob
import json
import os
import subprocess
import sys
import time
from collections import defaultdict

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "nueva-vista", "scripts"))
from cdp import Browser  # noqa: E402

JS = r"""
(() => {
  const vw = innerWidth;
  const q = (s, r = document) => [...r.querySelectorAll(s)];
  const corto = el => {
    let s = el.tagName.toLowerCase();
    if (el.id) return s + '#' + el.id;
    const c = [...el.classList].filter(x => !/^(reveal|is-|group|peer)/.test(x) && !x.includes(':') && !x.includes('[')).slice(0, 2);
    return c.length ? s + '.' + c.join('.').slice(0, 36) : s;
  };
  const seccion = el => {
    const s = el.closest('section,header,footer,nav');
    if (!s) return 'body';
    const id = s.getAttribute('aria-labelledby') || s.id || s.getAttribute('aria-label');
    return s.tagName.toLowerCase() + (id ? '#' + id.slice(0, 26) : '');
  };
  const txt = el => (el.innerText || el.value || el.getAttribute('aria-label') || '').replace(/\s+/g, ' ').trim().slice(0, 34);
  const enFixed = el => { for (let p = el; p && p !== document.documentElement; p = p.parentElement) if (getComputedStyle(p).position === 'fixed') return true; return false; };
  // ¿Lo recorta un ancestro con overflow ≠ visible (acordeón cerrado, carrusel)? Devuelve la fracción visible del rect.
  const fraccionVisible = (el, rc) => {
    const r = rc || el.getBoundingClientRect();
    let l = r.left, t = r.top, rr = r.right, b = r.bottom;
    for (let p = el.parentElement; p && p !== document.documentElement; p = p.parentElement) {
      const cs = getComputedStyle(p);
      if (cs.overflowX === 'visible' && cs.overflowY === 'visible') continue;
      const c = p.getBoundingClientRect();
      if (cs.overflowX !== 'visible') { l = Math.max(l, c.left); rr = Math.min(rr, c.right); }
      if (cs.overflowY !== 'visible') { t = Math.max(t, c.top); b = Math.min(b, c.bottom); }
    }
    const area = (r.right - r.left) * (r.bottom - r.top);
    return area > 0 ? Math.max(0, rr - l) * Math.max(0, b - t) / area : 0;
  };
  // Trampa de este Chrome headless (153): un <details> SIN el atributo `open`
  // sigue reportando `display:block` y layout completo en su contenido (en un
  // Chrome de verdad ese contenido no se ve). Sin este chequeo, cualquier
  // acordeón cerrado (FAQ, "Términos y condiciones" del footer) sale como si
  // estuviera abierto y de ahí salen solapes y desbordes que no existen.
  const enDetailsCerrado = el => { const d = el.closest('details'); return d && !d.open; };
  const visible = el => {
    if (enDetailsCerrado(el)) return false;
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden') return false;
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0 && fraccionVisible(el) > 0.02;
  };
  const F = [];
  const add = (sev, tipo, el, detalle) => F.push({ sev, tipo, donde: seccion(el) + ' › ' + corto(el), txt: txt(el), detalle });

  const docW = document.documentElement.scrollWidth;
  const overflowX = docW - vw;

  // --- 1. Desborde horizontal --------------------------------------------
  const recorta = el => {  // ¿algún ancestro con overflow ≠ visible que sí cabe en la ventana?
    for (let p = el.parentElement; p && p !== document.documentElement; p = p.parentElement) {
      const cs = getComputedStyle(p);
      if (cs.overflowX !== 'visible' && p.getBoundingClientRect().right <= vw + 1) return true;
    }
    return false;
  };
  const fuera = [];
  for (const el of q('body *')) {
    const cs = getComputedStyle(el);
    if (enFixed(el) || !visible(el)) continue;
    const r = el.getBoundingClientRect();
    if ((r.right > vw + 1 || r.left < -1) && !recorta(el)) fuera.push({ el, dx: Math.max(r.right - vw, -r.left) });
  }
  // Solo el elemento más externo de cada cadena (no sus hijos).
  const raices = fuera.filter(a => !fuera.some(b => b.el !== a.el && b.el.contains(a.el)));
  raices.sort((a, b) => b.dx - a.dx).slice(0, 6).forEach(f =>
    add(overflowX > 0 ? 'ERROR' : 'AVISO', 'desborde-x', f.el,
      `se sale ${Math.round(f.dx)}px de la ventana` + (overflowX > 0 ? '' : ' (escondido por overflow-x)')));

  // --- 2. Texto ---------------------------------------------------------
  const hojas = [];
  const rg = document.createRange();
  for (const el of q('body *')) {
    const nodos = [...el.childNodes].filter(n => n.nodeType === 3 && n.textContent.trim());
    if (!nodos.length || !visible(el)) continue;
    const cs = getComputedStyle(el);
    if (parseFloat(cs.opacity) < 0.05 || ['SCRIPT', 'STYLE', 'NOSCRIPT'].includes(el.tagName)) continue;
    let l = 1e9, t = 1e9, r = -1e9, b = -1e9;
    const lineas = [];
    for (const n of nodos) {
      rg.selectNodeContents(n);
      for (const rc of rg.getClientRects()) {
        if (rc.width < 1 || rc.height < 1) continue;
        if (fraccionVisible(el, rc) < 0.05) continue;  // línea recortada (acordeón cerrado)
        lineas.push({ l: rc.left, r: rc.right, t: rc.top + scrollY, b: rc.bottom + scrollY });
        l = Math.min(l, rc.left); r = Math.max(r, rc.right); t = Math.min(t, rc.top); b = Math.max(b, rc.bottom);
      }
    }
    if (l > r) continue;
    hojas.push({ el, lineas, l, r, t: t + scrollY, b: b + scrollY, fs: parseFloat(cs.fontSize), dentro: l >= -1 && r <= vw + 1, fijo: enFixed(el) });
  }
  const vistos = new Set();
  for (const h of hojas) {
    if (h.fs < 12) {
      const k = corto(h.el) + h.fs;
      if (!vistos.has(k)) { vistos.add(k); add('AVISO', 'texto-pequeno', h.el, `${h.fs}px`); }
    }
  }

  // --- 3. Textos que se pisan (línea contra línea: un texto en línea partido no cuenta) ---
  const pisados = new Set();
  for (let i = 0; i < hojas.length; i++) {
    for (let j = i + 1; j < hojas.length; j++) {
      const a = hojas[i], b = hojas[j];
      if (a.fijo || b.fijo || a.el.contains(b.el) || b.el.contains(a.el)) continue;
      let hit = null;
      for (const x of a.lineas) {
        for (const y of b.lineas) {
          const w = Math.min(x.r, y.r) - Math.max(x.l, y.l), h = Math.min(x.b, y.b) - Math.max(x.t, y.t);
          if (w < 4 || h < 4) continue;
          const menor = Math.min((x.r - x.l) * (x.b - x.t), (y.r - y.l) * (y.b - y.t));
          if (w * h >= 0.3 * menor) { hit = { w, h }; break; }
        }
        if (hit) break;
      }
      if (!hit) continue;
      const k = corto(a.el) + '|' + corto(b.el);
      if (pisados.has(k)) continue;
      pisados.add(k);
      add('ERROR', 'texto-pisado', a.el, `se solapa con «${txt(b.el)}» (${corto(b.el)}) en ${Math.round(hit.w)}×${Math.round(hit.h)}px`);
    }
  }

  // --- 4. Zonas táctiles (mobile) ---
  if (vw <= 820) {
    const vistosT = new Set();
    for (const el of q('a[href],button,input:not([type=hidden]),select,textarea,summary,[role=button],label:has(input)')) {
      if (!visible(el)) continue;
      const cs = getComputedStyle(el);
      if (cs.display === 'inline' && el.tagName === 'A') continue;  // enlace dentro de un párrafo
      const r = el.getBoundingClientRect();
      if (el.tagName === 'INPUT' && r.width <= 2 && r.height <= 2) continue;  // radio oculto: manda su <label>
      const m = Math.min(r.width, r.height);
      const k = corto(el) + Math.round(r.width) + 'x' + Math.round(r.height);
      if (m < 44 && !vistosT.has(k)) {
        vistosT.add(k);
        add(m < 24 ? 'AVISO' : 'MEJORA', 'zona-tactil', el, `${Math.round(r.width)}×${Math.round(r.height)}px (cómodo: 44)`);
      }
    }
  }

  // --- 5. Imágenes ---------------------------------------------------------------
  for (const im of q('img')) {
    if (!visible(im)) continue;
    const r = im.getBoundingClientRect();
    if (r.left >= vw || r.right <= 0) continue;  // fuera de la ventana (carrusel): el navegador aún no la pide
    const nw = im.naturalWidth, nh = im.naturalHeight;
    const src = (im.currentSrc || im.src || '');
    const svg = /\.svg(\?|$)/.test(src) || src.startsWith('data:image/svg');
    if (!im.complete || nw === 0) { add('ERROR', 'imagen-sin-cargar', im, src.slice(-60)); continue; }
    if (svg) continue;
    const cs = getComputedStyle(im);
    if (cs.objectFit === 'fill' && r.width > 20 && r.height > 20 && nh) {
      const d = Math.abs(r.width / r.height - nw / nh) / (nw / nh);
      if (d > 0.03) add('AVISO', 'imagen-deformada', im, `proporción ${(r.width / r.height).toFixed(2)} contra ${(nw / nh).toFixed(2)} (${Math.round(d * 100)}%)`);
    }
    if (r.width > nw * 1.05) add('AVISO', 'imagen-ampliada', im, `se ve a ${Math.round(r.width)}px y el archivo trae ${nw}px`);
    if (nw > r.width * 3 && nw > 800) add('AVISO', 'imagen-pesada', im, `se ve a ${Math.round(r.width)}px y carga ${nw}px (revisa \`sizes\`)`);
  }

  // --- 6. Texto cortado verticalmente por un overflow hidden (parcialmente: entre 5 % y 95 % visible) ---
  const vistosC = new Set();
  for (const h of hojas) {
    for (const ln of h.lineas) {
      const rc = { left: ln.l, right: ln.r, top: ln.t - scrollY, bottom: ln.b - scrollY, width: ln.r - ln.l, height: ln.b - ln.t };
      const f = fraccionVisible(h.el, rc);
      if (f > 0.05 && f < 0.95) {
        const k = corto(h.el);
        if (!vistosC.has(k)) {
          // Un carrusel recorta de costado a propósito; aquí solo cuenta si el recorte es de arriba/abajo.
          let p = h.el, vert = false;
          for (p = h.el.parentElement; p && p !== document.documentElement; p = p.parentElement) {
            const cs = getComputedStyle(p);
            if (cs.overflowY !== 'visible') { const c = p.getBoundingClientRect(); if (rc.top < c.top - 1 || rc.bottom > c.bottom + 1) vert = true; }
          }
          if (vert) { vistosC.add(k); add('AVISO', 'texto-cortado', h.el, `se ve el ${Math.round(f * 100)} % de una línea`); }
        }
      }
    }
  }

  // --- 7. Márgenes laterales y centrado ---------------------------------------------
  const en = hojas.filter(h => h.dentro && !h.fijo && !h.el.closest('header,nav'));
  const gizq = en.length ? Math.min(...en.map(h => h.l)) : null;
  const gder = en.length ? vw - Math.max(...en.map(h => h.r)) : null;
  if (gizq !== null) {
    if (vw <= 600 && Math.min(gizq, gder) < 12) F.push({ sev: 'AVISO', tipo: 'pegado-al-borde', donde: 'página', txt: '', detalle: `margen lateral mínimo del texto ${Math.round(Math.min(gizq, gder))}px` });
    if (vw >= 1500 && Math.abs(gizq - gder) > 24) F.push({ sev: 'AVISO', tipo: 'descentrado', donde: 'página', txt: '', detalle: `margen izquierdo ${Math.round(gizq)}px, derecho ${Math.round(gder)}px` });
  }

  if (!document.querySelector('meta[name=viewport]')) F.push({ sev: 'ERROR', tipo: 'sin-viewport', donde: 'head', txt: '', detalle: 'falta <meta name=viewport>' });

  const tam = s => { const e = document.querySelector(s); return e && visible(e) ? Math.round(parseFloat(getComputedStyle(e).fontSize)) : null; };
  return JSON.stringify({
    overflowX, alto: document.documentElement.scrollHeight, gizq: gizq === null ? null : Math.round(gizq), gder: gder === null ? null : Math.round(gder),
    h1: tam('main h1'), h2: tam('main h2'), findings: F,
  });
})()
"""


def rutas_del_proyecto():
    """Deduce las rutas de src/app/**/page.tsx (la raíz del repo por git)."""
    raiz = subprocess.run(["git", "rev-parse", "--show-toplevel"], capture_output=True, text=True).stdout.strip()
    out = []
    for f in sorted(glob.glob(os.path.join(raiz, "src/app/**/page.tsx"), recursive=True)):
        rel = os.path.relpath(os.path.dirname(f), os.path.join(raiz, "src/app"))
        if "[" in rel:  # rutas dinámicas: hay que dar un ejemplo a mano
            continue
        out.append("/" if rel == "." else "/" + rel)
    return out


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("rutas", nargs="*")
    ap.add_argument("--base", default="http://localhost:3100")
    ap.add_argument("--anchos", default="320,393,768,1024,1440,1900")
    ap.add_argument("--completo", action="store_true")
    ap.add_argument("--json")
    ap.add_argument("--puerto", type=int, default=9342)
    a = ap.parse_args()

    anchos = sorted({int(x) for x in a.anchos.split(",")} | ({360, 430, 600, 1279, 1280} if a.completo else set()))
    rutas = a.rutas or rutas_del_proyecto()
    resultado = {}

    with Browser(port=a.puerto) as page:
        for ruta in rutas:
            resultado[ruta] = {}
            for w in anchos:
                page.viewport(w, 900)
                page.goto(a.base + ruta)
                alto = page.js("document.documentElement.scrollHeight")
                y = 0
                while y < alto:  # activa las imágenes perezosas y el `reveal`
                    page.js(f"window.scrollTo(0,{y})")
                    time.sleep(0.2)
                    y += 800
                page.js("window.scrollTo(0,0)")
                time.sleep(0.8)
                for _ in range(16):  # hasta 8 s a que carguen las imágenes de la ventana
                    pendientes = page.js(
                        "[...document.images].filter(i=>{const r=i.getBoundingClientRect();return r.width>0&&r.left<innerWidth&&r.right>0&&!i.complete}).length"
                    )
                    if not pendientes:
                        break
                    time.sleep(0.5)
                resultado[ruta][w] = json.loads(page.js(JS))
            print(f"… {ruta}", file=sys.stderr)

    hay_error = False
    for ruta, por_ancho in resultado.items():
        print(f"\n## {ruta}\n")
        print("| ancho | overflow-x | alto | margen izq/der | h1 | h2 | errores | avisos | mejoras |")
        print("|---:|---:|---:|---:|---:|---:|---:|---:|---:|")
        for w, r in por_ancho.items():
            e = sum(f["sev"] == "ERROR" for f in r["findings"])
            av = sum(f["sev"] == "AVISO" for f in r["findings"])
            me = sum(f["sev"] == "MEJORA" for f in r["findings"])
            hay_error |= e > 0
            mg = f"{r['gizq']}/{r['gder']}" if r["gizq"] is not None else "-"
            print(f"| {w} | {r['overflowX']} | {r['alto']} | {mg} | {r['h1'] or '-'} | {r['h2'] or '-'} | {e} | {av} | {me} |")
        # Hallazgos agrupados: el mismo problema en varios anchos se lista una vez.
        grupos = defaultdict(list)
        for w, r in por_ancho.items():
            for f in r["findings"]:
                grupos[(f["sev"], f["tipo"], f["donde"], f["txt"])].append((w, f["detalle"]))
        if grupos:
            print()
        orden = {"ERROR": 0, "AVISO": 1, "MEJORA": 2}
        for (sev, tipo, donde, txt), lst in sorted(grupos.items(), key=lambda kv: (orden[kv[0][0]], kv[0][1], kv[0][2])):
            ws = ",".join(str(w) for w in dict.fromkeys(w for w, _ in lst))
            det = lst[0][1]
            print(f"- **{sev}** `{tipo}` · {donde}" + (f" «{txt}»" if txt else "") + f" · {det} · anchos: {ws}")

    if a.json:
        json.dump(resultado, open(a.json, "w"), ensure_ascii=False, indent=1)
    sys.exit(1 if hay_error else 0)


if __name__ == "__main__":
    main()
