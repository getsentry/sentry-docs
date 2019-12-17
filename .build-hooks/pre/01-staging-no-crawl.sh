#!/bin/bash

set -e

expected_branch=master

[ "$BRANCH_NAME" == "$expected_branch" ] && exit 0;
echo "!! Setting robots nofollow,noindex , because not $expected_branch branch: $BRANCH_NAME"
export JEKYLL_STAGING=1
