#!/usr/bin/env bash
# Construye y sirve una COPIA del proyecto, para probar sin tocar la carpeta real.
#
# Por qué: en este repo trabajan a la vez varias sesiones y el propio usuario
# (`next dev`). Todos comparten `.next`; un `next build` en la carpeta real pisa
# el que otro servidor está sirviendo, el CSS responde 500 y la página sale sin
# estilos (costó una hora creer que era un bug del componente). En la copia no
# pasa, y tampoco se mata ningún proceso ajeno.
#
# Uso (desde cualquier carpeta del repo):
#   copia_aislada.sh start   # copia, compila y sirve en http://localhost:3100
#   copia_aislada.sh stop    # apaga SOLO ese servidor y borra la copia
#
# Variables: WCAR_PUERTO (3100) y WCAR_COPIA (carpeta de la copia).
set -euo pipefail

RAIZ="$(git rev-parse --show-toplevel)"
PUERTO="${WCAR_PUERTO:-3100}"
COPIA="${WCAR_COPIA:-${TMPDIR:-/tmp}/wcar-copia}"

apagar() {
  # Solo el proceso que escucha en NUESTRO puerto.
  lsof -ti ":$PUERTO" 2>/dev/null | xargs kill 2>/dev/null || true
}

case "${1:-start}" in
  stop)
    apagar
    rm -rf "$COPIA"
    echo "servidor del puerto $PUERTO apagado y copia borrada"
    ;;
  start)
    echo "Procesos de Next que NO son míos (no se tocan):"
    ps aux | grep -E "next (dev|start)|next-server" | grep -v grep | grep -v "$COPIA" | awk '{print "  ", $2, $11, $12}' || true

    apagar
    rm -rf "$COPIA" && mkdir -p "$COPIA"
    (cd "$RAIZ" && tar --exclude=./node_modules --exclude=./.next --exclude=./.git -cf - .) | tar -xf - -C "$COPIA"
    # `cp -c` clona en APFS (macOS): instantáneo y sin gastar disco. Si no existe, copia normal.
    cp -Rc "$RAIZ/node_modules" "$COPIA/node_modules" 2>/dev/null || cp -R "$RAIZ/node_modules" "$COPIA/node_modules"

    cd "$COPIA"
    npx next build
    nohup npx next start -p "$PUERTO" > "$COPIA/server.log" 2>&1 &
    sleep 4

    # La trampa del `.next` compartido se ve aquí: el HTML responde 200 pero el CSS no.
    html=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:$PUERTO/")
    css_url=$(curl -s "http://localhost:$PUERTO/" | grep -o '/_next/static/[^"]*\.css' | head -1)
    css=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:$PUERTO$css_url")
    echo "HTML $html · CSS $css ($css_url)"
    [ "$html" = "200" ] && [ "$css" = "200" ] || { echo "ERROR: el servidor no sirve bien; mira $COPIA/server.log"; exit 1; }
    echo "Listo: http://localhost:$PUERTO   (al terminar: copia_aislada.sh stop)"
    ;;
  *)
    echo "Uso: $0 start|stop"; exit 2 ;;
esac
