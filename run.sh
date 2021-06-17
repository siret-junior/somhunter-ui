#!/bin/bash

ABSOLUTE_PATH="$( cd -- "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"
cd $ABSOLUTE_PATH # CD to script dir

echo "Running 'somhunter-ui'..."
#npx ember serve
#serve -p 9000 ./dist
http-server-spa-with-auth ./dist index.html 9000 x som hunter
