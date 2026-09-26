"""Cliente mínimo del protocolo de depuración de Chrome (CDP), solo con la
biblioteca estándar de Python.

Por qué existe: Playwright no arranca dentro del sandbox de Claude Code y
Chrome headless con `--window-size` no baja de ~500px, así que no sirve para
comprobar mobile. Con CDP se fija un viewport real (`setDeviceMetricsOverride`),
se ejecuta JavaScript en la página (`Runtime.evaluate`), se mueve el mouse
(`Input.dispatchMouseEvent`) y se captura una región (`Page.captureScreenshot`).

Uso:

    from cdp import Browser
    with Browser() as page:
        page.viewport(393)
        page.goto("http://localhost:3100/about-us")
        print(page.js("document.title"))
        page.shot("/tmp/seccion.png", x=0, y=4000, w=393, h=900)

Chrome se toma de la variable CHROME (por defecto, el de macOS).
"""

import base64
import json
import os
import shutil
import socket
import struct
import subprocess
import tempfile
import time
import urllib.request

CHROME = os.environ.get("CHROME", "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome")


class CDP:
    """Una pestaña de Chrome controlada por WebSocket, escrito a mano."""

    def __init__(self, port):
        req = urllib.request.Request(f"http://127.0.0.1:{port}/json/new?about:blank", method="PUT")
        with urllib.request.urlopen(req) as r:
            target = json.load(r)
        self.sock = socket.create_connection(("127.0.0.1", port), timeout=60)
        key = base64.b64encode(os.urandom(16)).decode()
        path = target["webSocketDebuggerUrl"].split(str(port), 1)[1]
        self.sock.sendall(
            (
                f"GET {path} HTTP/1.1\r\nHost: 127.0.0.1:{port}\r\nUpgrade: websocket\r\n"
                f"Connection: Upgrade\r\nSec-WebSocket-Key: {key}\r\nSec-WebSocket-Version: 13\r\n\r\n"
            ).encode()
        )
        buf = b""
        while b"\r\n\r\n" not in buf:
            buf += self.sock.recv(4096)
        self._rest = buf.split(b"\r\n\r\n", 1)[1]
        self._n = 0

    # --- WebSocket ---------------------------------------------------------
    def _read(self, k):
        while len(self._rest) < k:
            chunk = self.sock.recv(1 << 20)
            if not chunk:
                raise EOFError("Chrome cerró la conexión")
            self._rest += chunk
        out, self._rest = self._rest[:k], self._rest[k:]
        return out

    def _frame(self):
        msg = b""
        while True:
            b1, b2 = self._read(2)
            fin, opcode, length = b1 >> 7, b1 & 15, b2 & 127
            if length == 126:
                length = struct.unpack(">H", self._read(2))[0]
            elif length == 127:
                length = struct.unpack(">Q", self._read(8))[0]
            msg += self._read(length)
            if fin:
                return opcode, msg

    def call(self, method, **params):
        self._n += 1
        ident = self._n
        data = json.dumps({"id": ident, "method": method, "params": params}).encode()
        mask, n = os.urandom(4), len(data)
        if n < 126:
            head = bytes([0x81, 0x80 | n])
        elif n < 65536:
            head = bytes([0x81, 0x80 | 126]) + struct.pack(">H", n)
        else:
            head = bytes([0x81, 0x80 | 127]) + struct.pack(">Q", n)
        self.sock.sendall(head + mask + bytes(b ^ mask[i % 4] for i, b in enumerate(data)))
        while True:
            opcode, msg = self._frame()
            if opcode == 1:
                reply = json.loads(msg)
                if reply.get("id") == ident:
                    if "error" in reply:
                        raise RuntimeError(reply["error"])
                    return reply["result"]

    # --- Atajos ------------------------------------------------------------
    def viewport(self, width, height=1000, scale=1):
        """Viewport real. Por debajo de 500px sí funciona (a diferencia de --window-size)."""
        self.call(
            "Emulation.setDeviceMetricsOverride",
            width=width, height=height, deviceScaleFactor=scale, mobile=width < 500,
        )

    def goto(self, url, esperar_selector=None, tiempo=20):
        """Navega y espera a `load` (y, si se pide, a que exista un selector)."""
        self.call("Page.navigate", url=url)
        fin = time.time() + tiempo
        while time.time() < fin:
            time.sleep(0.4)
            if self.js("document.readyState") == "complete" and (
                esperar_selector is None or self.js(f"!!document.querySelector({json.dumps(esperar_selector)})")
            ):
                break
        time.sleep(0.8)

    def js(self, expresion):
        """Evalúa JavaScript y devuelve el valor (usa JSON.stringify para objetos)."""
        r = self.call("Runtime.evaluate", expression=expresion, returnByValue=True, awaitPromise=True)
        if "exceptionDetails" in r:
            raise RuntimeError(r["exceptionDetails"].get("exception", {}).get("description", r["exceptionDetails"]))
        return r["result"].get("value")

    def mouse(self, x, y):
        """Mueve el mouse de verdad (dispara :hover)."""
        self.call("Input.dispatchMouseEvent", type="mouseMoved", x=x, y=y)

    def shot(self, ruta, x, y, w, h, escala=1):
        """Captura una región de la PÁGINA (coordenadas de documento, no de ventana)."""
        r = self.call(
            "Page.captureScreenshot", format="png", captureBeyondViewport=True,
            clip={"x": x, "y": y, "width": w, "height": h, "scale": escala},
        )
        with open(ruta, "wb") as f:
            f.write(base64.b64decode(r["data"]))


class Browser:
    """Chrome headless con perfil temporal; se cierra y se borra al salir."""

    def __init__(self, port=9333):
        self.port = port

    def __enter__(self):
        self._perfil = tempfile.mkdtemp(prefix="cdp-")
        self._proc = subprocess.Popen(
            [CHROME, "--headless=new", "--disable-gpu", "--hide-scrollbars",
             f"--remote-debugging-port={self.port}", f"--user-data-dir={self._perfil}", "about:blank"],
            stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
        )
        for _ in range(60):
            try:
                urllib.request.urlopen(f"http://127.0.0.1:{self.port}/json/version", timeout=1)
                return CDP(self.port)
            except Exception:
                time.sleep(0.25)
        self.__exit__()
        raise RuntimeError(f"Chrome no arrancó (CHROME={CHROME})")

    def __exit__(self, *_):
        self._proc.terminate()
        try:
            self._proc.wait(timeout=5)
        except subprocess.TimeoutExpired:
            self._proc.kill()
        shutil.rmtree(self._perfil, ignore_errors=True)
