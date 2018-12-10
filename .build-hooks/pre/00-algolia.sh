#!/bin/bash

set -e

#expected_branch=master
expected_branch=algolia

if [ "$BRANCH_NAME" != "$expected_branch" ] ; then
  echo "!! Skipping Algolia, because not $expected_branch branch: $BRANCH_NAME"
  exit 0
fi

api_key=$(echo "$BUILD_CONF" | jq -r '.algolia_api_key')

if [ "$api_key" = '' ]; then
  echo "Missing \"algolia_api_key\" in BUILD_CONF"
  exit 1
fi
