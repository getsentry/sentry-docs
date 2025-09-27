#!/usr/bin/env bash
set -euo pipefail

echo ">>> summarize.sh starting"

# --- Safety check for OpenAI API key ---
if [[ -z "${OPENAI_API_KEY:-}" ]]; then
  echo "ERROR: OPENAI_API_KEY is not set."
  exit 1
fi
echo ">>> OPENAI_API_KEY appears set (prefix shown): ${OPENAI_API_KEY:0:10}... (masked)"

# --- Local testing toggle ---
# Set USE_STATIC_EXAMPLE=1 to force the fallback example list
USE_STATIC_EXAMPLE="${USE_STATIC_EXAMPLE:-0}"

PR_NOTES=""
if [[ "$USE_STATIC_EXAMPLE" -eq 1 ]]; then
  echo ">>> Using static example PR list for testing"
  PR_NOTES=$(cat <<'EOF'
### Details

- docs(js): Add min `next` version for Turbopack support ([#15009](https://github.com/getsentry/sentry-docs/pull/15009)) by @chargome
- docs(js): Update turbopack support notes ([#15008](https://github.com/getsentry/sentry-docs/pull/15008)) by @chargome
- Unreal Engine: Add notice about loading custom callback handler classes ([#15004](https://github.com/getsentry/sentry-docs/pull/15004)) by @tustanivsky
- feat(components): Add StepConnector component ([#15003](https://github.com/getsentry/sentry-docs/pull/15003)) by @codyde
- feat(components): Add ContentSeparator component ([#15002](https://github.com/getsentry/sentry-docs/pull/15002)) by @codyde
EOF
)
else
  echo ">>> Fetching live merged PRs from master (production data)"
  PR_NOTES=$(gh pr list --repo getsentry/sentry-docs --state merged --base master --limit 10 --json number,title,author \
    | jq -r '.[] | "- " + .title + " ([#\(.number)](https://github.com/getsentry/sentry-docs/pull/\(.number))) by @" + .author.login')
fi

# --- Fallback to static example if nothing is returned ---
if [[ -z "$PR_NOTES" ]]; then
  echo ">>> No PRs returned; using static example list"
  PR_NOTES=$(cat <<'EOF'
### Details

- docs(js): Add min `next` version for Turbopack support ([#15009](https://github.com/getsentry/sentry-docs/pull/15009)) by @chargome
- docs(js): Update turbopack support notes ([#15008](https://github.com/getsentry/sentry-docs/pull/15008)) by @chargome
- Unreal Engine: Add notice about loading custom callback handler classes ([#15004](https://github.com/getsentry/sentry-docs/pull/15004)) by @tustanivsky
- feat(components): Add StepConnector component ([#15003](https://github.com/getsentry/sentry-docs/pull/15003)) by @codyde
- feat(components): Add ContentSeparator component ([#15002](https://github.com/getsentry/sentry-docs/pull/15002)) by @codyde
EOF
)
fi

# --- Build JSON payload safely using jq ---
JSON_PAYLOAD=$(jq -n --arg notes "$PR_NOTES" '{
  model: "gpt-4o-mini",
  messages: [
    {role: "system", content: "You are a release note generator for documentation updates. Output concise markdown bullet points."},
    {role: "user", content: ("Summarize these changes:\n" + $notes)}
  ]
}')

echo ">>> Sending request to OpenAI API..."
RESPONSE=$(curl -s -X POST https://api.openai.com/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d "$JSON_PAYLOAD")

# Save raw response for debugging
echo ">>> Raw response saved to response.json"
echo "$RESPONSE" > response.json

# --- Extract summary ---
SUMMARY=$(echo "$RESPONSE" | jq -r '.choices[0].message.content')

echo "### Summary"
echo "$SUMMARY"
