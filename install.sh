#!/bin/sh
ABSOLUTE_PATH="$( cd -- "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"
cd ${ABSOLUTE_PATH}
printf "\tInstalling 'somhunter-ui'...\n"

npm install
#npm install -g ember-cli

printf "\tDone installing 'somhunter-ui'...\n"
