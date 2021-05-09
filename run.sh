#!/bin/bash

ABSOLUTE_PATH="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/"
cd $ABSOLUTE_PATH # CD to script dir

echo "Running 'somhunter-ui'..."
ember serve