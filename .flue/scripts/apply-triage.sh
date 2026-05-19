#!/usr/bin/env bash
set -euo pipefail

# Applies triage results to GitHub and Linear.
# All writes are idempotent — safe to re-run.
#
# Required env: GH_TOKEN, ISSUE_NUMBER
# Optional env: LINEAR_API_KEY (skips Linear if unset)
# Input: triage JSON on stdin or as $1 file path

REPO="getsentry/sentry-docs"
TRIAGE_MARKER="<!-- flue-triage -->"

# --- Read triage JSON ---
if [ -n "${1:-}" ] && [ -f "$1" ]; then
  TRIAGE_JSON=$(cat "$1")
else
  TRIAGE_JSON=$(cat)
fi

CLASSIFICATION=$(echo "$TRIAGE_JSON" | jq -r '.classification // empty')
PRIORITY=$(echo "$TRIAGE_JSON" | jq -r '.priority // empty')
TEAM=$(echo "$TRIAGE_JSON" | jq -r '.team // empty')
LINEAR_LABEL=$(echo "$TRIAGE_JSON" | jq -r '.linearLabel // empty')
TRIAGE_REPORT=$(echo "$TRIAGE_JSON" | jq -r '.triageReport // empty')
FLAGGED=$(echo "$TRIAGE_JSON" | jq -r '.flagged // false')

if [ -z "$CLASSIFICATION" ] || [ -z "$TRIAGE_REPORT" ]; then
  echo "ERROR: Invalid triage JSON — missing classification or triageReport"
  exit 1
fi

echo "=== Triage: #${ISSUE_NUMBER} ==="
echo "Classification: $CLASSIFICATION"
echo "Priority: $PRIORITY"
echo "Flagged: $FLAGGED"

# --- Idempotency check: look for existing triage marker ---
EXISTING=$(gh api "repos/${REPO}/issues/${ISSUE_NUMBER}/comments" \
  --jq "[.[] | select(.body | contains(\"${TRIAGE_MARKER}\"))] | length" 2>/dev/null || echo "0")

if [ "$EXISTING" != "0" ]; then
  echo "SKIP: Triage comment already exists on #${ISSUE_NUMBER}"
  exit 0
fi

# --- Apply GitHub labels (for issues missing template labels) ---
CURRENT_LABELS=$(gh api "repos/${REPO}/issues/${ISSUE_NUMBER}" --jq '[.labels[].name] | join(",")' 2>/dev/null || echo "")

add_label_if_missing() {
  local label="$1"
  if [ -n "$label" ] && ! echo "$CURRENT_LABELS" | grep -qF "$label"; then
    echo "Adding GitHub label: $label"
    gh api "repos/${REPO}/issues/${ISSUE_NUMBER}/labels" \
      --method POST --input - <<EOF 2>/dev/null || echo "WARN: Failed to add label: $label"
{"labels":["$label"]}
EOF
  fi
}

if [ -n "$TEAM" ]; then
  add_label_if_missing "$TEAM"
fi

# --- Try Linear update ---
LINEAR_OK=false

if [ -n "${LINEAR_API_KEY:-}" ]; then
  echo "Looking for Linear ticket..."

  LINEAR_RESULT=$(curl -s -X POST https://api.linear.app/graphql \
    -H "Authorization: ${LINEAR_API_KEY}" \
    -H "Content-Type: application/json" \
    -d "{
      \"query\": \"query(\$filter: IssueFilter) { issues(filter: \$filter, first: 1) { nodes { id identifier labels { nodes { id } } comments { nodes { body } } } } }\",
      \"variables\": {
        \"filter\": {
          \"team\": {\"key\": {\"eq\": \"DOCS\"}},
          \"attachments\": {\"url\": {\"contains\": \"sentry-docs/issues/${ISSUE_NUMBER}\"}}
        }
      }
    }" 2>/dev/null)

  LINEAR_ID=$(echo "$LINEAR_RESULT" | jq -r '.data.issues.nodes[0].id // empty')
  LINEAR_IDENT=$(echo "$LINEAR_RESULT" | jq -r '.data.issues.nodes[0].identifier // empty')

  if [ -n "$LINEAR_ID" ]; then
    echo "Found: $LINEAR_IDENT"

    # Check if triage comment already exists on Linear
    LINEAR_HAS_TRIAGE=$(echo "$LINEAR_RESULT" | jq '[.data.issues.nodes[0].comments.nodes[] | select(.body | contains("Auto-triage report"))] | length')

    if [ "$LINEAR_HAS_TRIAGE" != "0" ]; then
      echo "SKIP: Triage comment already exists on $LINEAR_IDENT"
      LINEAR_OK=true
    else
      # Map priority
      case "$PRIORITY" in
        urgent) PRIORITY_NUM=1 ;;
        high)   PRIORITY_NUM=2 ;;
        medium) PRIORITY_NUM=3 ;;
        low)    PRIORITY_NUM=4 ;;
        *)      PRIORITY_NUM=3 ;;
      esac

      # Map linear label ID
      if [ "$LINEAR_LABEL" = "Docs Platform" ]; then
        LABEL_ID="3c20b421-3f10-46f1-b8c5-0186d18646fc"
      else
        LABEL_ID="3f843dec-1c10-4a4c-a475-550684d26258"
      fi

      # Check if label already exists
      HAS_LABEL=$(echo "$LINEAR_RESULT" | jq --arg lid "$LABEL_ID" '[.data.issues.nodes[0].labels.nodes[] | select(.id == $lid)] | length')

      # Update priority
      curl -s -X POST https://api.linear.app/graphql \
        -H "Authorization: ${LINEAR_API_KEY}" \
        -H "Content-Type: application/json" \
        -d "{
          \"query\": \"mutation(\$id: String!, \$input: IssueUpdateInput!) { issueUpdate(id: \$id, input: \$input) { success } }\",
          \"variables\": {\"id\": \"${LINEAR_ID}\", \"input\": {\"priority\": ${PRIORITY_NUM}}}
        }" > /dev/null 2>&1 && echo "Set priority: $PRIORITY" || echo "WARN: Failed to set priority"

      # Add label if missing
      if [ "$HAS_LABEL" = "0" ]; then
        curl -s -X POST https://api.linear.app/graphql \
          -H "Authorization: ${LINEAR_API_KEY}" \
          -H "Content-Type: application/json" \
          -d "{
            \"query\": \"mutation(\$id: String!, \$labelId: String!) { issueAddLabel(id: \$id, labelId: \$labelId) { success } }\",
            \"variables\": {\"id\": \"${LINEAR_ID}\", \"labelId\": \"${LABEL_ID}\"}
          }" > /dev/null 2>&1 && echo "Added label: $LINEAR_LABEL" || echo "WARN: Failed to add label"
      fi

      # Post triage comment
      ESCAPED_REPORT=$(echo "$TRIAGE_REPORT" | jq -Rs '.')
      curl -s -X POST https://api.linear.app/graphql \
        -H "Authorization: ${LINEAR_API_KEY}" \
        -H "Content-Type: application/json" \
        -d "{
          \"query\": \"mutation(\$input: CommentCreateInput!) { commentCreate(input: \$input) { success } }\",
          \"variables\": {\"input\": {\"issueId\": \"${LINEAR_ID}\", \"body\": $(echo "🤖 **Auto-triage report**\n\n${TRIAGE_REPORT}" | jq -Rs '.')}}
        }" > /dev/null 2>&1 && { echo "Posted triage to $LINEAR_IDENT"; LINEAR_OK=true; } || echo "WARN: Failed to post comment"
    fi
  else
    echo "Linear ticket not found yet (sync may be pending)"
  fi
fi

# --- Fallback: post to GitHub if Linear didn't work ---
if [ "$LINEAR_OK" = false ]; then
  echo "Posting triage to GitHub #${ISSUE_NUMBER} (Linear unavailable)"
  COMMENT_BODY="${TRIAGE_MARKER}
🤖 **Auto-triage report**

${TRIAGE_REPORT}

---
*Priority: ${PRIORITY} | Classification: ${CLASSIFICATION}*"

  gh api "repos/${REPO}/issues/${ISSUE_NUMBER}/comments" \
    --method POST \
    --field body="$COMMENT_BODY" > /dev/null 2>&1 && echo "Posted triage to GitHub" || echo "ERROR: Failed to post to GitHub"
fi

echo "=== Done ==="
