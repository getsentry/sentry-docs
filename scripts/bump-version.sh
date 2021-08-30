#!/bin/bash
set -eu

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd $SCRIPT_DIR/..

sed -i -e "s/\(Change Date:\s*\)[-0-9]\+\$/\\1$(date +'%Y-%m-%d' -d '3 years')/" LICENSE
