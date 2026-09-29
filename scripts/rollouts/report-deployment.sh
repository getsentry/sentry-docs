#!/usr/bin/env bash
# Reports a deployment to Cursor Rollouts (Factory Deployments API).
#
# Usage: report-deployment.sh bootstrap|start|finish
#
# Environment:
#   CURSOR_API_KEY          Cursor API key for a team member (no-op when unset)
#   CHANGE_MONITOR_ENV      environment slug, e.g. production
#   CHANGE_MONITOR_SERVICE  service slug, e.g. sentry-docs
#   DEPLOY_SOURCE_URI       e.g. https://github.com/getsentry/sentry-docs
#   DEPLOY_VERSION          commit SHA that was shipped
#   DEPLOY_ACTOR            stable id for this ship, reused across retries
#   DEPLOYMENT_NAME         (finish) name returned by start
#   DEPLOY_OUTCOME          (finish) succeeded | failed | aborted
#   DEPLOY_FAILURE_MESSAGE  (finish, optional) reason for a failed ship
#
# A reporting problem must never fail a deploy, so every path exits 0.

set -uo pipefail

API="https://api.cursor.com/factory.v1.DeploymentsService"

log() { echo "rollouts: $*" >&2; }

if [ -z "${CURSOR_API_KEY:-}" ]; then
  log "CURSOR_API_KEY is not set; skipping."
  exit 0
fi

token() {
  curl -sS --fail-with-body --max-time 20 -X POST \
    https://api2.cursor.sh/auth/exchange_user_api_key \
    -H "Authorization: Bearer ${CURSOR_API_KEY}" \
    -H "Content-Type: application/json" \
    -d '{}' | jq -r '.accessToken // empty'
}

TOKEN="$(token)"
if [ -z "$TOKEN" ]; then
  log "could not exchange CURSOR_API_KEY for a token; skipping."
  exit 0
fi

# call METHOD BODY -> prints response body; returns 0 on 2xx or 409.
call() {
  local out code
  out="$(mktemp)"
  code="$(curl -sS --max-time 20 -o "$out" -w '%{http_code}' -X POST "${API}/$1" \
    -H "Authorization: Bearer ${TOKEN}" \
    -H "Content-Type: application/json" \
    -H "Connect-Protocol-Version: 1" \
    -d "$2")"
  cat "$out"
  rm -f "$out"
  case "$code" in
    2??|409) return 0 ;;
    *) log "$1 returned HTTP ${code}"; return 1 ;;
  esac
}

bootstrap() {
  call CreateEnvironment "$(jq -nc --arg e "$CHANGE_MONITOR_ENV" \
    '{environmentId: $e, environment: {displayName: $e}}')" >/dev/null
  call CreateService "$(jq -nc --arg s "$CHANGE_MONITOR_SERVICE" \
    '{serviceId: $s, service: {displayName: $s}}')" >/dev/null
}

# Prints the deployment this actor already opened for this ship, if any, as JSON.
existing() {
  local filter
  filter="environment = \"environments/${CHANGE_MONITOR_ENV}\" AND deploy_version = \"${DEPLOY_VERSION}\" AND service = \"services/${CHANGE_MONITOR_SERVICE}\""
  call ListDeployments "$(jq -nc --arg uri "$DEPLOY_SOURCE_URI" --arg f "$filter" \
    '{deploySourceUri: $uri, filter: $f, pageSize: 100, readMask: "events"}')" |
    jq -c --arg actor "$DEPLOY_ACTOR" \
      '[.deployments[]? | select(any(.events[]?; .actor == $actor))][0] // empty'
}

start() {
  local found name=""
  found="$(existing)"
  if [ -n "$found" ]; then
    name="$(jq -r '.name // empty' <<<"$found")"
  fi
  if [ -z "$name" ]; then
    name="$(call CreateDeployment "$(jq -nc \
      --arg uri "$DEPLOY_SOURCE_URI" \
      --arg env "environments/${CHANGE_MONITOR_ENV}" \
      --arg svc "services/${CHANGE_MONITOR_SERVICE}" \
      --arg sha "$DEPLOY_VERSION" \
      --arg actor "$DEPLOY_ACTOR" \
      '{deployment: {deploySourceUri: $uri, environment: $env, deployVersion: $sha, service: $svc},
        event: {started: {}, actor: $actor}}')" | jq -r '.deployment.name // empty')"
  fi
  if [ -z "$name" ]; then
    log "could not open a deployment."
    return 0
  fi
  log "deployment ${name}"
  echo "$name"
}

finish() {
  local name="${DEPLOYMENT_NAME:-}" found event
  if [ -z "$name" ]; then
    log "no DEPLOYMENT_NAME; nothing to finish."
    return 0
  fi
  found="$(existing)"
  if [ -n "$found" ] && jq -e --arg actor "$DEPLOY_ACTOR" \
    'any(.events[]?; .actor == $actor and (has("completed") or has("aborted")))' \
    <<<"$found" >/dev/null; then
    log "${name} is already closed by this reporter."
    return 0
  fi
  case "${DEPLOY_OUTCOME:-}" in
    succeeded) event='{completed: {succeeded: {}}}' ;;
    failed) event='{completed: {failed: {message: $msg}}}' ;;
    aborted) event='{aborted: {}}' ;;
    *) log "unknown DEPLOY_OUTCOME '${DEPLOY_OUTCOME:-}'"; return 0 ;;
  esac
  call AppendDeploymentEvent "$(jq -nc \
    --arg name "$name" \
    --arg actor "$DEPLOY_ACTOR" \
    --arg msg "${DEPLOY_FAILURE_MESSAGE:-deploy failed}" \
    "{name: \$name, event: (${event} + {actor: \$actor})}")" >/dev/null
  log "reported ${DEPLOY_OUTCOME} for ${name}"
}

case "${1:-}" in
  bootstrap) bootstrap ;;
  start) start ;;
  finish) finish ;;
  *) log "usage: $0 bootstrap|start|finish" ;;
esac
exit 0
