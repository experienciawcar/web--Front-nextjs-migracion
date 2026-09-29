#!/usr/bin/env python3
"""Mide textos con la fuente REAL de la página (Urbanist), dentro de su propio DOM.

Sirve para deducir el tamaño, el peso y el ancho de columna de un texto que solo
se ve en una captura (guía §12.4): mide el ancho natural de una línea a varios
tamaños y lo compara con el que se leyó en la captura. También da dónde cae la
línea base dentro de una línea de un alto dado, para colocar un texto por su línea
base y no por su borde.

Dos reglas aprendidas (costaron un rato):
- Mide DENTRO de un elemento de la página (aquí, `main`): un `<span>` colgado del
  `body` dio 9 % de más en 13 px.
- Compara el ancho de TINTA (el segundo número), no el de la caja: la captura solo
  ve los píxeles pintados. La caja es la que hay que dar a `w-[…]`.

Uso:
  medir_texto.py URL --items '[["Cuida tu carro", 700, "normal", [50, 52, 54]],
                               ["Taller", 500, "italic", [52]]]'
  medir_texto.py URL --baseline 52,60,700 --baseline 16,24,500

  --items      JSON: lista de [texto, peso, estilo, [tamaños en px]]. Imprime, por
               cada tamaño: [tamaño, ancho de la caja, ancho de la tinta].
  --baseline   TAMAÑO,ALTO_DE_LÍNEA,PESO (se puede repetir): imprime la distancia
               del borde superior de la línea a la línea base (`baselineFromTop`)
               y la altura de tinta de una ascendente (`ascentInk`).
  --selector   dónde colgar los elementos de medida (por defecto `main`).

Para decidir el ancho de una columna de texto: mide cada renglón de la captura y
la palabra que sigue (con un espacio delante). La columna W cumple: cada renglón
<= W, y renglón + " palabra siguiente" > W.

Requiere el servidor de la copia aislada en marcha (`copia_aislada.sh start`).
"""

import argparse
import json
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from cdp import Browser  # noqa: E402


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("url")
    ap.add_argument("--items", default="[]")
    ap.add_argument("--baseline", action="append", default=[])
    ap.add_argument("--selector", default="main")
    a = ap.parse_args()

    items = json.loads(a.items)
    js_items = """
    (async () => {
      await document.fonts.ready;
      const host = document.querySelector(%s);
      const out = [];
      for (const [text, fw, fst, sizes] of %s) {
        const row = [text.slice(0, 40), fw, fst];
        for (const s of sizes) {
          const el = document.createElement('span');
          el.style.cssText = `position:absolute;visibility:hidden;white-space:nowrap;font-weight:${fw};font-size:${s}px;font-style:${fst}`;
          el.textContent = text; host.appendChild(el);
          const c = document.createElement('canvas').getContext('2d');
          c.font = `${fst} ${fw} ${s}px ${getComputedStyle(el).fontFamily}`;
          const m = c.measureText(text);
          row.push([s, +el.getBoundingClientRect().width.toFixed(1), +(m.actualBoundingBoxLeft + m.actualBoundingBoxRight).toFixed(1)]);
          el.remove();
        }
        out.push(row);
      }
      return JSON.stringify(out);
    })()
    """ % (json.dumps(a.selector), json.dumps(items))

    js_base = """
    (async () => {
      await document.fonts.ready;
      const host = document.querySelector(%s);
      const d = document.createElement('div');
      d.style.cssText = `position:absolute;left:0;top:0;font-family:var(--font-urbanist);font-size:${%s}px;line-height:${%s}px;font-weight:${%s};width:800px`;
      d.innerHTML = '<span>Cuida</span><span id="wcar-b" style="display:inline-block;width:0;height:0"></span>';
      host.appendChild(d);
      const top = d.getBoundingClientRect().top;
      const base = document.getElementById('wcar-b').getBoundingClientRect().bottom - top;
      const c = document.createElement('canvas').getContext('2d');
      c.font = `${%s} ${%s}px ${getComputedStyle(d).fontFamily}`;
      const m = c.measureText('Cuidad');
      d.remove();
      return JSON.stringify({baselineFromTop: +base.toFixed(2), ascentInk: +m.actualBoundingBoxAscent.toFixed(2)});
    })()
    """

    with Browser() as page:
        page.viewport(1440)
        page.goto(a.url)
        if items:
            for row in json.loads(page.js(js_items)):
                print(row)
        for spec in a.baseline:
            size, lh, weight = spec.split(",")
            js = js_base % (json.dumps(a.selector), size, lh, weight, weight, size)
            print(f"{size}px / {lh}px / peso {weight}:", page.js(js))


if __name__ == "__main__":
    main()
