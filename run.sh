#!/usr/bin/env sh

COMMAND=$1

case "$COMMAND" in
  config)
    "${EDITOR:-vi}" ${NAUTILUS_WEB_CONFIG:-./config/app.json}
    ;;

  install)
    (cd ./src && npm install)
    ;;

  build)
    if [ "$2" == "server" ]; then
      (cd ./src && npm run build:server)
    elif [ "$2" == "client" ]; then
      (cd ./src && npm run build:client)
    else
      (cd ./src && npm run build)
    fi
    ;;

  clean)
    if [ "$2" == "server" ]; then
      (cd ./src && npm run clean:server)
    elif [ "$2" == "client" ]; then
      (cd ./src && npm run clean:client)
    else
      (cd ./src && npm run clean)
    fi
    ;;

  start)
    if [ "$2" == "server" ]; then
      (cd ./src && npm run start:server)
    else
      (cd ./src && npm run start)
    fi
    ;;

  watch)
    if [ "$2" == "server" ]; then
      (cd ./src && npm run watch:server)
    elif [ "$2" == "client" ]; then
      (cd ./src && npm run watch:client)
    else
      (cd ./src && npm run watch)
    fi
    ;;

  *)
    echo "Usage:"
    echo "  $(basename "$0") config"
    echo "  $(basename "$0") install"
    echo "  $(basename "$0") build [server|client]"
    echo "  $(basename "$0") clean [server|client]"
    echo "  $(basename "$0") start [server]"
    echo "  $(basename "$0") watch [server|client]"
    exit 1
esac
