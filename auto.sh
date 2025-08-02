#!/bin/bash

export WORKSPACE=$(find "$HOME" -type d -name "todolist-fastapi" -print -quit)
# pushd ${WORKSPACE} > /dev/null || exit 1

get_current_system() {
    # Get the current system information ubuntu or debian or linux
    if [ -f /etc/os-release ]; then
        . /etc/os-release
        echo $NAME | awk -F ' ' '{print $1}'
    else
        exit 1
    fi
}

setup(){
    # Update and install necessary packages
    sudo apt-get update
    sudo apt-get install -y git curl npm

    # Install Docker if not already installed
    if ! command -v docker &> /dev/null; then
        echo "Docker not found, installing..."
        install_docker $(get_current_system)
    else
        echo "Docker is already installed."
    fi

    # pushd ${WORKSPACE} || exit 1
    # ln -sf $(pwd)/auto.sh $HOME/auto.sh
    # echo "alias auto=$HOME/auto.sh" >> $HOME/.bashrc
    # popd
}

install_docker() {

    system=$1
    if [[ "$system" != "Ubuntu" ]] && [[ "$system" != "Debian" ]]; then
        echo "This script is designed for Ubuntu or Debian systems."
        return 1
    fi

    # Add Docker's official GPG key:
    sudo apt-get install -y ca-certificates
    sudo install -m 0755 -d /etc/apt/keyrings
    sudo curl -fsSL https://download.docker.com/linux/${system,,}/gpg -o /etc/apt/keyrings/docker.asc
    sudo chmod a+r /etc/apt/keyrings/docker.asc

    # Add the repository to Apt sources:
    echo \
    "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/${system,,} \
    $(. /etc/os-release && echo "${CODENAME:-$VERSION_CODENAME}") stable" | \
    sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
    sudo apt-get update
    sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
    sudo chmod 666 /var/run/docker.sock
}