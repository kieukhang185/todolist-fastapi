#!/bin/bash

function show_help() {
    echo "=========================================================="
    echo "|      Docker Compose Management Menu                     |"
    echo "=========================================================="
    echo "|  auto app up - Starts containers in detached mode.      |"
    echo "|  auto app down - Stops and removes containers.          |"
    echo "|  auto app restart - Restarts containers.                |"
    echo "|  auto app logs - Displays real-time logs.               |"
    echo "|  auto app reup - Rebuilds images and starts containers.|"
    echo "|  auto app rebuild - Rebuilds images only                |"
    echo "==========================================================="
}
cmd=""
DRY_RUN=true
choice=$1

run_cmd(){
    cmd=$1
    [[ $cmd == "" ]] && eval echo "cmd could not empty!" && exit 1
    [[ ${DRY_RUN} != "true" ]] && eval ${cmd} || echo "Excution: ${cmd}"
}

case $choice in
    up)
        cmd="docker compose up -d"
        run_cmd ${cmd}
        ;;
    down)
        cmd="docker compose down"
        run_cmd ${cmd}
        ;;
    restart)
        cmd="docker compose down && docker-compose up -d"
        run_cmd ${cmd}
        ;;
    logs)
        cmd="docker compose logs -f"
        run_cmd ${cmd}
        ;;
    reup)
        cmd="docker compose down && docker-compose build && docker-compose up -d"
        run_cmd ${cmd}
        ;;
    rebuild)
        cmd="docker compose build --no-cache"
        run_cmd ${cmd}
        ;;
    help)
        show_help
        exit 0
        ;;
    *)
        exit 1
        ;;
esac
