#!/usr/bin/env sh

COMMAND=$1

case "$COMMAND" in
  build)
    (cd ./src && npm run --silent build)
    ;;

  clean)
    (cd ./src && npm run --silent clean)
    ;;

  config)
    "${EDITOR:-vi}" ${NAUTILUS_WEB_CONFIG:-./config/app.json}
    ;;

  install)
    (cd ./src && npm install)
    ;;

  release)
    (cd ./src && npm run --silent release)
    ;;

  start)
    (cd ./src && npm run --silent start)
    ;;

  watch)
    (cd ./src && npm run --silent watch)
    ;;

  *)
    echo "Usage:"
    echo "  $(basename "$0") build"
    echo "  $(basename "$0") clean"
    echo "  $(basename "$0") config"
    echo "  $(basename "$0") install"
    echo "  $(basename "$0") release"
    echo "  $(basename "$0") start"
    echo "  $(basename "$0") watch"
    exit 1
esac
