#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
cd ..
gh repo clone https://github.com/getsentry/security-as-code /tmp/security-as-code
sha=$(git -C /tmp/security-as-code rev-parse @)
pip3 install pyyaml==6.0
./bin/react-to-product-owners-yml-changes.py /tmp/security-as-code/rbac/lib/product-owners.yml
branch="getsantry/update-product-area-labels-${sha:0:8}"
message="Sync with product-owners.yml in security-as-code@${sha:0:8}"
git config user.email "getsantry[bot]@users.noreply.github.com"
git config user.name "getsantry[bot]"
git checkout -b "$branch"
git add .github/labels.yml
git commit -n -m "$message" || exit 0
git push --set-upstream origin "$branch"
gh pr create --title "meta(routing) $message" --body="Syncing with [``product-owners.yml``](https://github.com/getsentry/security-as-code/blob/$sha/rbac/lib/product-owners.yml) ([docs](https://www.notion.so/473791bae5bf43399d46093050b77bf0))."
