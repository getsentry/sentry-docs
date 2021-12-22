#!/bin/bash
set -eu

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd $SCRIPT_DIR/..
SENTRY_API_SCHEMA_SHA="$(curl -sSL 'https://api.github.com/repos/getsentry/sentry-api-schema/commits/main' | awk 'BEGIN { RS=",|:{\n"; FS="\""; } $2 == "sha" { print $4 }')"

sed -i -e "s/\(Change Date:\s*\)[-0-9]\+\$/\\1$(date +'%Y-%m-%d' -d '3 years')/" LICENSE
sed -i -e 's|^const SENTRY_API_SCHEMA_SHA =.*$|const SENTRY_API_SCHEMA_SHA = "'$SENTRY_API_SCHEMA_SHA'"|g' src/gatsby/utils/resolveOpenAPI.ts
