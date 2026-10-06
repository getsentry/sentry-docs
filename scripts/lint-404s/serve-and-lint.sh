#!/usr/bin/env bash
# Serve the current `.next` build on port 3000, run the 404 linter against it,
# then stop the server so the next build can reuse the port.
# Extra arguments are passed through to main.ts.
set -euo pipefail

port=3000

if lsof -t -i:"$port" >/dev/null; then
  echo "Port $port is already in use; refusing to lint a stale server" >&2
  exit 1
fi

# Start the server in its own process group so cleanup can stop `next start`
# and its children, not just the pnpm wrapper.
setsid pnpm start &
server_pid=$!

cleanup() {
  exit_code=$?
  trap - EXIT
  kill -- "-$server_pid" 2>/dev/null || true
  wait "$server_pid" 2>/dev/null || true
  # `next start` can outlive the pnpm wrapper while it closes the socket, so
  # give the process group time to exit before forcing it.
  for _ in {1..10}; do
    if ! kill -0 -- "-$server_pid" 2>/dev/null && ! lsof -t -i:"$port" >/dev/null; then
      exit "$exit_code"
    fi
    sleep 1
  done
  kill -KILL -- "-$server_pid" 2>/dev/null || true
  sleep 1
  if lsof -t -i:"$port" >/dev/null; then
    echo "Docs server still owns port $port after cleanup" >&2
    exit 1
  fi
  exit "$exit_code"
}
trap cleanup EXIT

for _ in {1..60}; do
  curl --silent --fail "http://localhost:$port/sitemap.xml" >/dev/null && break
  # Fail fast if the server exited instead of waiting out the loop.
  kill -0 "$server_pid"
  sleep 1
done
curl --silent --fail "http://localhost:$port/sitemap.xml" >/dev/null

npx tsx ./scripts/lint-404s/main.ts "$@"
