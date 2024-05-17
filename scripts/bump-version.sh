#!/bin/bash

# This script is part of the monthly CalVer release:
#
#   https://github.com/getsentry/sentry-docs/blob/master/.github/workflows/release.yml#L24
#   https://github.com/getsentry/action-prepare-release/blob/main/action.yml
#   https://github.com/getsentry/craft#pre-release-command

set -eu

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd $SCRIPT_DIR/..

sed -i -e "s/\(Change Date:\s*\)[-0-9]\+\$/\\1$(date +'%Y-%m-%d' -d '3 years')/" LICENSE
