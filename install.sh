#!/bin/sh
ABSOLUTE_PATH="$( cd -- "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"
cd ${ABSOLUTE_PATH}
printf "\tInstalling 'somhunter-ui'...\n"

npx browserslist@latest --update-db > /dev/null
npm install > /dev/null
npx ember build > /dev/null

printf "\tDone installing 'somhunter-ui'...\n"
