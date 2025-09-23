#!/usr/bin/env bash
set -euo pipefail

echo ">>> summarize.sh starting"

# ---- Basic checks ----
if ! command -v jq >/dev/null 2>&1; then
  echo "❌ Error: jq is required but not installed."
  exit 1
fi
if ! command -v curl >/dev/null 2>&1; then
  echo "❌ Error: curl is required but not installed."
  exit 1
fi
if [[ -z "${OPENAI_API_KEY:-}" ]]; then
  echo "❌ Error: OPENAI_API_KEY is not set. Run:"
  echo "   export OPENAI_API_KEY=sk-proj-..."
  exit 1
fi

echo ">>> OPENAI_API_KEY appears set (prefix shown): ${OPENAI_API_KEY:0:8}... (masked)"

# ---- Example PR list for local testing (commented out, un-comment to test locally) ----
: <<'EXAMPLE_PR_LIST'
PR_NOTES=$(cat <<'EOF'
### Details

- docs(js): Add min `next` version for Turbopack support ([#15009](https://github.com/getsentry/sentry-docs/pull/15009)) by @chargome
- docs(js): Update turbopack support notes ([#15008](https://github.com/getsentry/sentry-docs/pull/15008)) by @chargome
- Unreal Engine: Add notice about loading custom callback handler classes ([#15004](https://github.com/getsentry/sentry-docs/pull/15004)) by @tustanivsky
- feat(components): Add StepConnector component ([#15003](https://github.com/getsentry/sentry-docs/pull/15003)) by @codyde
- feat(components): Add ContentSeparator component ([#15002](https://github.com/getsentry/sentry-docs/pull/15002)) by @codyde
EOF
)
EXAMPLE_PR_LIST

# ---- Placeholder for live PR notes (to be filled with actual merged PRs) ----
PR_NOTES=$(cat <<'EOF'
# TODO: Replace this block with actual merged PR list from GitHub
# For example, using `gh pr list --state merged --base main --json title,number,author`
EOF
)

# ---- Build JSON payload safely with jq ----
PAYLOAD=$(jq -n \
  --arg model "gpt-4o-mini" \
  --arg system "You are a release notes generator for documentation updates. Summarize PR titles into concise, grouped markdown bullets." \
  --arg user "Summarize these changes:\n$PR_NOTES" \
  '{
    model: $model,
    messages: [
      { role: "system", content: $system },
      { role: "user", content: $user }
    ]
  }')

# ---- Call OpenAI API and capture status+body ----
echo ">>> Sending request to OpenAI API..."
RAW=$(curl -s -w "\n%{http_code}" https://api.openai.com/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d "$PAYLOAD")

HTTP_BODY=$(printf "%s\n" "$RAW" | sed '$d')
HTTP_STATUS=$(printf "%s\n" "$RAW" | tail -n1)

echo ">>> HTTP status: $HTTP_STATUS"
echo "$HTTP_BODY" > response.json
echo ">>> Raw response saved to response.json"

# ---- Check for errors ----
if [[ "$HTTP_STATUS" -ne 200 ]]; then
  echo "### Summary"
  echo "_(Error: OpenAI API request failed — see response.json for details)_"
  jq . response.json || true
  exit 1
fi

# ---- Extract assistant reply ----
SUMMARY=$(echo "$HTTP_BODY" | jq -r '
  .choices[0].message.content
  // .choices[0].message["content"]
  // .choices[0].text
  // empty
')

echo "### Summary"
if [[ -n "$SUMMARY" ]]; then
  echo "$SUMMARY"
else
  echo "_(No summary found in response — see response.json)_"
fi
