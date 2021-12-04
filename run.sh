#!/bin/bash

ABSOLUTE_PATH="$( cd -- "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"
cd $ABSOLUTE_PATH # CD to script dir

echo "Running 'somhunter-ui'..."
#npx ember serve       #<< DEV

#npx ember build      #<< PRODUCTION
npx serve -p 8080 ./dist #<< PRODUCTION

#http-server-spa-with-auth ./dist index.html 8080 x som hunter
