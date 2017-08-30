#!/usr/bin/env sh

run_client() {
  COMMAND=$1

  case "$COMMAND" in
    build)
      (cd ./src/client && npm run --silent build)
      ;;

    clean)
      (cd ./src/client && npm run --silent clean)
      ;;

    install)
      (cd ./src/client && npm install)
      ;;

    release)
      (cd ./src/client && npm run --silent release)
      ;;

    start)
      (cd ./src/client && npm run --silent start)
      ;;

    watch)
      (cd ./src/client && npm run --silent watch)
      ;;

    *)
      echo "Usage:"
      echo "  $(basename "$0") client build"
      echo "  $(basename "$0") client clean"
      echo "  $(basename "$0") client install"
      echo "  $(basename "$0") client release"
      echo "  $(basename "$0") client start"
      echo "  $(basename "$0") client watch"
      exit 1
  esac
}

run_server() {
  COMMAND=$1

  case "$COMMAND" in
    build)
      (cd ./src/server && npm run --silent build)
      ;;

    clean)
      (cd ./src/server && npm run --silent clean)
      ;;

    config)
      shift 1
      (cd ./src/server && npm run --silent config "$@")
      ;;

    install)
      (cd ./src/server && npm install)
      ;;

    start)
      (cd ./src/server && npm run --silent start)
      ;;

    watch)
      (cd ./src/server && npm run --silent watch)
      ;;

    *)
      echo "Usage:"
      echo "  $(basename "$0") server build"
      echo "  $(basename "$0") server clean"
      echo "  $(basename "$0") server config"
      echo "  $(basename "$0") server install"
      echo "  $(basename "$0") server start"
      echo "  $(basename "$0") server watch"
      exit 1
  esac
}

MODULE=$1

case "$MODULE" in
  client)
    shift 1
    run_client "$@"
    ;;

  server)
    shift 1
    run_server "$@"
    ;;

  *)
    echo "Usage:"
    echo "  $(basename "$0") client <command>"
    echo "  $(basename "$0") server <command>"
    exit 1
esac
