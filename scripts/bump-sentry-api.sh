#!/bin/sh
# Pin @sentry/api, which the API reference is built from, to its newest npm
# release, then open and merge a PR for it.
#
# Environment:
#   GITHUB_TOKEN  A token that can push branches and merge PRs. A GitHub App
#                 token, unlike github.token, also starts CI on the new PR.
set -eu

package=@sentry/api

latest=$(timeout 60 npm view "$package" version)
case $latest in
  '' | *[!0-9.]*)
    echo "::error::Expected a release version of $package from npm, got: $latest"
    exit 1
    ;;
esac

current=$(node -p 'require("./package.json").dependencies[process.argv[1]]' "$package")
if [ "$current" = "$latest" ]; then
  echo "$package is already $latest, skipping."
  exit 0
fi
echo "Bumping $package from $current to $latest"

timeout 600 pnpm add --save-exact --lockfile-only "$package@$latest"

git config user.email "271575301+sentry-api-schema-updater[bot]@users.noreply.github.com"
git config user.name "sentry-api-schema-updater[bot]"

branch="bot/bump-sentry-api-to-$latest"
git checkout -b "$branch"
git add package.json pnpm-lock.yaml
git commit -m "Bump $package to $latest"
git push --set-upstream origin "$branch"

gh pr create --fill
gh pr merge --squash --admin -d
