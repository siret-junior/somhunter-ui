#!/bin/sh
ABSOLUTE_PATH="$( cd -- "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"
cd ${ABSOLUTE_PATH}
printf "\tInstalling 'somhunter-ui'...\n"

npx browserslist@latest --update-db > /dev/null
npm install --loglevel=error > /dev/null
2>/dev/null 1>/dev/null npx ember build

printf "\tDone installing 'somhunter-ui'...\n"
