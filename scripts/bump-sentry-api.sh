#!/bin/sh
# Pin @sentry/api, which the API reference is built from, to its newest npm
# release, then open and merge a PR for it.
#
# Environment:
#   GITHUB_TOKEN       A token that can push branches and merge PRs. A GitHub
#                      App token, unlike github.token, also starts CI on the
#                      new PR.
#   GITHUB_EVENT_NAME  Set by GitHub Actions. getsentry/sentry dispatches this
#                      workflow right after it publishes a release, and npm can
#                      take a few minutes to serve it, so a dispatched run
#                      waits for a new version before it gives up.
set -eu

package=@sentry/api
# A dispatched run checks npm up to this many times, this many seconds apart.
dispatch_attempts=20
dispatch_delay=30

latest_version() {
  version=$(timeout 60 npm view "$package" version) || return 1
  case $version in
    '' | *[!0-9.]*)
      echo "::error::Expected a release version of $package from npm, got: $version" >&2
      return 1
      ;;
  esac
  printf '%s\n' "$version"
}

current=$(node -p 'require("./package.json").dependencies[process.argv[1]]' "$package")
attempts=1
if [ "${GITHUB_EVENT_NAME:-}" = workflow_dispatch ]; then
  attempts=$dispatch_attempts
fi
attempt=1
while :; do
  latest=$(latest_version)
  if [ "$current" != "$latest" ]; then
    break
  fi
  if [ "$attempt" -ge "$attempts" ]; then
    echo "$package is already $latest, skipping."
    exit 0
  fi
  echo "npm still has $package $latest; checking again in ${dispatch_delay}s ($attempt of $attempts)."
  attempt=$((attempt + 1))
  sleep "$dispatch_delay"
done
echo "Bumping $package from $current to $latest"

timeout 600 pnpm add --save-exact --lockfile-only "$package@$latest"

git config user.email "271575301+sentry-api-schema-updater[bot]@users.noreply.github.com"
git config user.name "sentry-api-schema-updater[bot]"

# A run that stopped before the merge leaves this branch, and maybe its PR,
# behind. Overwrite the branch and reuse an open PR so the next run finishes.
branch="bot/bump-sentry-api-to-$latest"
git checkout -B "$branch"
git add package.json pnpm-lock.yaml
git commit -m "Bump $package to $latest"
timeout 120 git push --force --set-upstream origin "$branch"

open_prs=$(timeout 60 gh pr list --head "$branch" --state open --json number --jq length)
if [ "$open_prs" = 0 ]; then
  timeout 60 gh pr create --fill --head "$branch"
fi
timeout 120 gh pr merge "$branch" --squash --admin -d
