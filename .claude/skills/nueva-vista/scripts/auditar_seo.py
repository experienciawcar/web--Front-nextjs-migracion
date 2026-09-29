#!/usr/bin/env python3
"""Audita el SEO técnico de una o varias páginas del sitio servido (solo GET,
sin dependencias). Lee el HTML que recibe un rastreador, no el código.

Por cada página comprueba:
  ERROR (siempre falla): HTTP 200, `lang`, viewport, `<title>` y descripción,
    título y descripción ÚNICOS entre las páginas auditadas, exactamente un
    `<h1>`, sin saltos de nivel (h1 → h3), todo `<img>` con atributo `alt`,
    `<a>` sin `href`, `noindex` accidental, JSON-LD que no sea JSON válido o
    lleve `<` sin escapar, `og:image` relativa.
  AVISO (revisar): título fuera de 25-60 caracteres, descripción fuera de
    70-160, menos de 200 palabras en `<main>`, palabras pegadas en un encabezado
    (un `<span class="block">` sin espacio: el HTML queda "segurode"), más de
    3 `preload` de imagen (compiten con la foto del LCP), `alt` muy largo o
    genérico.
  PENDIENTE (lo del sitio que puede no existir aún; con `--estricto` falla):
    `canonical`, Open Graph (title, description, image, url), `twitter:card`,
    JSON-LD y enlaces internos que dan 404.

Con `--sitio` comprueba además lo que es de todo el sitio: `robots.txt` (con
`Sitemap:`), `sitemap.xml` (URLs absolutas, todas 200 y con todas las páginas
auditadas), la página 404 propia (no la de Next en inglés) y que una ruta
inventada dé 404 con `noindex`.

Sin rutas, las descubre en `src/app/**/page.tsx` (salta las dinámicas).

Uso (contra una copia aislada, ver `copia_aislada.sh`):
    python3 auditar_seo.py --base http://localhost:3100 /taller /contacto
    python3 auditar_seo.py --base http://localhost:3100 --sitio          # todo
    python3 auditar_seo.py --base http://localhost:3100 --estricto /taller

Sale con código 1 si hay algún ERROR (o PENDIENTE con `--estricto`).
"""

import argparse
import json
import os
import re
import subprocess
import sys
import urllib.error
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET
from html.parser import HTMLParser

UA = "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)"
GENERICOS = {"imagen", "foto", "image", "photo", "img", "picture", "logo"}


def pedir(url):
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept-Encoding": "identity"})
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            return r.status, dict(r.headers), r.read().decode("utf8", "replace")
    except urllib.error.HTTPError as e:
        return e.code, dict(e.headers), e.read().decode("utf8", "replace")
    except Exception as e:  # noqa: BLE001 - se informa como código 0
        return 0, {}, str(e)


class Pagina(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.lang = None
        self.title = ""
        self._en_title = False
        self.metas, self.links, self.imgs, self.enlaces = [], [], [], []
        self.encabezados = []  # (nivel, texto)
        self.ld = []  # contenido de cada <script type="application/ld+json">
        self._enc = None
        self._buf = ""
        self._en_ld = False
        self._ld_buf = ""
        self._ignorar = 0
        self._en_main = 0
        self.palabras_main = 0
        self.en_enlace_main = []

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == "html":
            self.lang = a.get("lang")
        elif tag == "title":
            self._en_title = True
        elif tag == "meta":
            self.metas.append(a)
        elif tag == "link":
            self.links.append(a)
        elif tag == "img":
            self.imgs.append(a)
        elif tag == "a":
            self.enlaces.append((a, bool(self._en_main)))
        elif tag == "main":
            self._en_main += 1
        elif tag == "script":
            if a.get("type") == "application/ld+json":
                self._en_ld, self._ld_buf = True, ""
            else:
                self._ignorar += 1
        elif tag == "style":
            self._ignorar += 1
        elif re.fullmatch(r"h[1-6]", tag):
            self._enc, self._buf = int(tag[1]), ""

    def handle_endtag(self, tag):
        if tag == "title":
            self._en_title = False
        elif tag == "main":
            self._en_main = max(0, self._en_main - 1)
        elif tag == "script":
            if self._en_ld:
                self.ld.append(self._ld_buf)
                self._en_ld = False
            else:
                self._ignorar = max(0, self._ignorar - 1)
        elif tag == "style":
            self._ignorar = max(0, self._ignorar - 1)
        elif self._enc and tag == f"h{self._enc}":
            self.encabezados.append((self._enc, re.sub(r"\s+", " ", self._buf).strip()))
            self._enc = None

    def handle_data(self, data):
        if self._en_title:
            self.title += data
        if self._en_ld:
            self._ld_buf += data
        if self._enc:
            self._buf += data
        if self._en_main and not self._ignorar:
            self.palabras_main += len(data.split())

    def meta(self, **kw):
        for m in self.metas:
            if all(m.get(k) == v for k, v in kw.items()):
                return m.get("content")
        return None


def palabras_pegadas(html):
    """Encabezados cuyo texto queda pegado en el HTML.

    Un `<span class="block">` parte el renglón en pantalla, pero en el HTML el
    texto de los dos lados queda sin espacio ("mas seguro" + "de colombia" →
    "segurode colombia") para quien lo lea sin CSS. El `<br/>` no cuenta: los
    buscadores lo leen como salto.
    """
    salida = []
    for m in re.finditer(r"<h([1-6])\b[^>]*>(.*?)</h\1>", html, re.S):
        pila, texto, pegado = [], "", False
        for trozo in re.split(r"(<[^>]+>)", m.group(2)):
            if not trozo:
                continue
            if not trozo.startswith("<"):
                if pegado_al_bloque(texto, trozo):
                    pegado = True
                texto += trozo
                continue
            if re.match(r"<span\b", trozo):
                es_bloque = bool(re.search(r"\bclass=\"[^\"]*\bblock\b", trozo))
                pila.append(es_bloque)
                if es_bloque:
                    texto += "\x00"  # marca de límite de bloque
            elif trozo.startswith("</span") and pila and pila.pop():
                texto += "\x00"
        if pegado:
            salida.append(f"h{m.group(1)}: «{re.sub(chr(0), '', texto)[:60]}»")
    return salida


def pegado_al_bloque(acumulado, nuevo):
    """¿El texto que llega quedaría pegado a lo anterior a través de un límite de bloque?"""
    if not acumulado.endswith("\x00"):
        return False
    previo = acumulado.rstrip("\x00")
    return bool(previo) and not previo[-1].isspace() and not nuevo[0].isspace()


class Informe:
    def __init__(self, estricto):
        self.estricto = estricto
        self.cuentas = {"ERROR": 0, "AVISO": 0, "PENDIENTE": 0}

    def linea(self, nivel, texto):
        if nivel == "OK":
            print(f"    ok         {texto}")
            return
        self.cuentas[nivel] += 1
        print(f"    {nivel:<10} {texto}")

    @property
    def falla(self):
        return self.cuentas["ERROR"] > 0 or (self.estricto and self.cuentas["PENDIENTE"] > 0)


def ruta_de(url):
    """`https://wcar.co/taller/` → `/taller` (la ruta, sin dominio ni barra final)."""
    return urllib.parse.urlparse(url).path.rstrip("/") or "/"


def descubrir_rutas():
    raiz = subprocess.run(["git", "rev-parse", "--show-toplevel"], capture_output=True, text=True).stdout.strip()
    app = os.path.join(raiz or ".", "src", "app")
    rutas = []
    for carpeta, _, archivos in os.walk(app):
        if "page.tsx" in archivos:
            ruta = "/" + os.path.relpath(carpeta, app).replace(os.sep, "/")
            ruta = "/" if ruta == "/." else ruta
            if "[" not in ruta:
                rutas.append(ruta)
    return sorted(rutas)


def auditar_pagina(base, ruta, inf, vistos):
    estado, cab, html = pedir(base + ruta)
    print(f"\n{ruta}   HTTP {estado}")
    if estado != 200:
        inf.linea("ERROR", f"responde {estado}")
        return
    p = Pagina()
    p.feed(html)

    # Lo básico del documento.
    if p.lang:
        inf.linea("OK", f"<html lang={p.lang!r}>")
    else:
        inf.linea("ERROR", "sin lang en <html>")
    if not p.meta(name="viewport"):
        inf.linea("ERROR", "sin meta viewport")
    robots = (p.meta(name="robots") or "").lower()
    if "noindex" in robots:
        inf.linea("ERROR", f"meta robots trae noindex ({robots})")

    # Título y descripción.
    titulo = re.sub(r"\s+", " ", p.title).strip()
    desc = (p.meta(name="description") or "").strip()
    if not titulo:
        inf.linea("ERROR", "sin <title>")
    else:
        if not 25 <= len(titulo) <= 60:
            inf.linea("AVISO", f"título de {len(titulo)} caracteres (ideal 25-60): «{titulo}»")
        else:
            inf.linea("OK", f"título ({len(titulo)}): {titulo}")
        if titulo in vistos["titulos"]:
            inf.linea("ERROR", f"título repetido con {vistos['titulos'][titulo]}")
        vistos["titulos"].setdefault(titulo, ruta)
    if not desc:
        inf.linea("ERROR", "sin meta description")
    else:
        if not 70 <= len(desc) <= 160:
            inf.linea("AVISO", f"descripción de {len(desc)} caracteres (ideal 70-160)")
        else:
            inf.linea("OK", f"descripción ({len(desc)})")
        if desc in vistos["descripciones"]:
            inf.linea("ERROR", f"descripción repetida con {vistos['descripciones'][desc]}")
        vistos["descripciones"].setdefault(desc, ruta)

    # Encabezados.
    h1 = [t for n, t in p.encabezados if n == 1]
    if len(h1) != 1:
        inf.linea("ERROR", f"{len(h1)} <h1> (debe haber exactamente uno)")
    else:
        inf.linea("OK", f"h1: {h1[0]}")
    previo = 0
    for nivel, texto in p.encabezados:
        if previo and nivel > previo + 1:
            inf.linea("ERROR", f"salto de h{previo} a h{nivel}: «{texto[:50]}»")
        previo = nivel
    for pegada in palabras_pegadas(html):
        inf.linea("AVISO", f"palabras pegadas en el HTML ({pegada}); pon un espacio real antes del <span class=\"block\">")

    # Texto de la página.
    if p.palabras_main < 200:
        inf.linea("AVISO", f"solo ~{p.palabras_main} palabras visibles en <main> (normal en una página de contacto)")
    else:
        inf.linea("OK", f"~{p.palabras_main} palabras en <main>")

    # Imágenes.
    sin_alt = [i for i in p.imgs if "alt" not in i]
    if sin_alt:
        inf.linea("ERROR", f"{len(sin_alt)} <img> sin atributo alt (p. ej. {(sin_alt[0].get('src') or '')[:60]})")
    largos = [i["alt"] for i in p.imgs if len(i.get("alt", "")) > 125]
    genericos = [i["alt"] for i in p.imgs if i.get("alt", "").strip().lower() in GENERICOS]
    if largos:
        inf.linea("AVISO", f"{len(largos)} alt de más de 125 caracteres")
    if genericos:
        inf.linea("AVISO", f"{len(genericos)} alt genéricos ({', '.join(sorted(set(genericos)))})")
    con_texto = sum(1 for i in p.imgs if i.get("alt"))
    decorativas = sum(1 for i in p.imgs if i.get("alt") == "")
    inf.linea("OK", f"{len(p.imgs)} <img>: {con_texto} con alt descriptivo, {decorativas} decorativas (alt vacío)")
    preloads = [l for l in p.links if l.get("rel") == "preload" and l.get("as") == "image"]
    if len(preloads) > 3:
        inf.linea("AVISO", f"{len(preloads)} <link rel=preload as=image>: compiten con la foto del LCP")

    # Enlaces.
    sin_href = [a for a, _ in p.enlaces if not a.get("href")]
    if sin_href:
        inf.linea("ERROR", f"{len(sin_href)} <a> sin href")
    for a, en_main in p.enlaces:
        href = a.get("href") or ""
        if href.startswith("/") and not href.startswith("//"):
            destino = href.split("#")[0].split("?")[0]
            vistos["enlaces"].setdefault(destino, set()).add(ruta)
            if en_main:
                vistos["enlaces_main"].setdefault(destino, set()).add(ruta)

    # Lo que suele ser del sitio entero.
    canonical = next((l.get("href") for l in p.links if l.get("rel") == "canonical"), None)
    if not canonical:
        inf.linea("PENDIENTE", "sin <link rel=canonical>")
    elif not canonical.startswith("http"):
        inf.linea("ERROR", f"canonical relativo: {canonical}")
    else:
        inf.linea("OK", f"canonical: {canonical}")
    og = {m.get("property"): m.get("content") for m in p.metas if (m.get("property") or "").startswith("og:")}
    faltan = [k for k in ("og:title", "og:description", "og:image", "og:url") if not og.get(k)]
    if faltan:
        inf.linea("PENDIENTE", f"Open Graph incompleto, faltan: {', '.join(faltan)}")
    else:
        inf.linea("OK", "Open Graph completo")
    if og.get("og:image") and not og["og:image"].startswith("http"):
        inf.linea("ERROR", f"og:image relativa: {og['og:image']}")
    if not p.meta(name="twitter:card"):
        inf.linea("PENDIENTE", "sin twitter:card")
    tipos = []
    for bruto in p.ld:
        try:
            dato = json.loads(bruto)
        except ValueError as e:
            inf.linea("ERROR", f"JSON-LD no es JSON válido ({e})")
            continue
        if "<" in bruto:
            inf.linea("ERROR", "JSON-LD con '<' sin escapar (usa .replace(/</g, '\\u003c'))")
        for nodo in dato if isinstance(dato, list) else dato.get("@graph", [dato]):
            if not isinstance(nodo, dict) or "@type" not in nodo or "@context" not in (dato if isinstance(dato, dict) else nodo):
                if isinstance(nodo, dict) and "@type" not in nodo:
                    inf.linea("ERROR", "JSON-LD sin @type")
                continue
            tipos.append(nodo["@type"] if isinstance(nodo["@type"], str) else "/".join(nodo["@type"]))
    if not p.ld:
        inf.linea("PENDIENTE", "sin datos estructurados (JSON-LD)")
    elif tipos:
        inf.linea("OK", f"JSON-LD: {', '.join(tipos)}")


def auditar_sitio(base, rutas, inf):
    print("\n== Sitio ==")
    estado, _, robots = pedir(base + "/robots.txt")
    if estado != 200:
        inf.linea("PENDIENTE", f"/robots.txt responde {estado}")
    else:
        inf.linea("OK", "/robots.txt")
        if not re.search(r"(?im)^sitemap:\s*https?://", robots):
            inf.linea("PENDIENTE", "robots.txt sin línea Sitemap: absoluta")
        if re.search(r"(?im)^disallow:\s*/\s*$", robots):
            inf.linea("ERROR", "robots.txt bloquea todo el sitio (Disallow: /)")

    estado, _, mapa = pedir(base + "/sitemap.xml")
    if estado != 200:
        inf.linea("PENDIENTE", f"/sitemap.xml responde {estado}")
    else:
        try:
            urls = [e.text.strip() for e in ET.fromstring(mapa).iter() if e.tag.endswith("}loc") and e.text]
        except ET.ParseError as e:
            inf.linea("ERROR", f"sitemap.xml no es XML válido ({e})")
            urls = []
        relativas = [u for u in urls if not u.startswith("http")]
        if relativas:
            inf.linea("ERROR", f"{len(relativas)} <loc> relativas en el sitemap")
        rutas_mapa = {ruta_de(u) for u in urls}
        fuera = [r for r in rutas if r not in rutas_mapa]
        if fuera:
            inf.linea("ERROR", f"páginas que existen y no están en el sitemap: {', '.join(fuera)}")
        else:
            inf.linea("OK", f"sitemap.xml con {len(urls)} URL y todas las páginas auditadas")
        # Las URLs del sitemap apuntan al dominio público; se comprueban por su ruta contra la base local.
        rotas = [ruta_de(u) for u in urls if pedir(base + ruta_de(u))[0] != 200]
        if rotas:
            inf.linea("ERROR", f"el sitemap lista URLs que no dan 200: {', '.join(rotas[:8])}")

    estado, _, html = pedir(base + "/una-ruta-que-no-existe-seo")
    titulo = re.search(r"<title>([^<]*)</title>", html)
    titulo = titulo.group(1) if titulo else ""
    if estado != 404:
        inf.linea("ERROR", f"una ruta inventada responde {estado} en vez de 404 (soft 404)")
    elif "noindex" not in html:
        inf.linea("ERROR", "la página 404 no lleva noindex")
    else:
        inf.linea("OK", "404 real con noindex")
    if "could not be found" in titulo.lower():
        inf.linea("PENDIENTE", "la 404 es la de Next en inglés: crea src/app/not-found.tsx en español, con enlaces")


def auditar_enlaces(base, vistos, inf):
    print("\n== Enlaces internos (de las páginas auditadas) ==")
    rotos = []
    for destino in sorted(vistos["enlaces"]):
        if pedir(base + destino)[0] != 200:
            rotos.append(destino)
    total = len(vistos["enlaces"])
    if not rotos:
        inf.linea("OK", f"{total} enlaces internos únicos, todos 200")
        return
    en_main = [d for d in rotos if d in vistos["enlaces_main"]]
    inf.linea("PENDIENTE", f"{len(rotos)} de {total} enlaces internos únicos dan 404 ({len(en_main)} de ellos desde <main>)")
    for d in rotos[:12]:
        donde = "main" if d in vistos["enlaces_main"] else "navbar/footer"
        print(f"               404  {d}   ({donde}, en {len(vistos['enlaces'][d])} páginas)")
    if len(rotos) > 12:
        print(f"               … y {len(rotos) - 12} más")


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("rutas", nargs="*", help="rutas a auditar; sin ellas, las de src/app")
    ap.add_argument("--base", required=True, help="p. ej. http://localhost:3100 (una copia aislada)")
    ap.add_argument("--sitio", action="store_true", help="comprueba también robots, sitemap y la 404")
    ap.add_argument("--estricto", action="store_true", help="los PENDIENTE también hacen fallar")
    a = ap.parse_args()

    base = a.base.rstrip("/")
    rutas = a.rutas or descubrir_rutas()
    inf = Informe(a.estricto)
    vistos = {"titulos": {}, "descripciones": {}, "enlaces": {}, "enlaces_main": {}}
    for ruta in rutas:
        auditar_pagina(base, ruta, inf, vistos)
    auditar_enlaces(base, vistos, inf)
    if a.sitio:
        auditar_sitio(base, rutas, inf)

    c = inf.cuentas
    print(f"\nRESUMEN  {c['ERROR']} errores · {c['AVISO']} avisos · {c['PENDIENTE']} pendientes del sitio"
          + ("  (modo estricto)" if a.estricto else ""))
    sys.exit(1 if inf.falla else 0)


if __name__ == "__main__":
    main()
