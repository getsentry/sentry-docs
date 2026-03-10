---
name: pr-template
description: Update .github/pull_request_template.md in a Sentry SDK repository to match the canonical template. Use when asked to "update pr template", "sync pr template", "standardize pr template", or when rolling out the canonical template across SDK repos.
---

# PR Template Updater

Updates `.github/pull_request_template.md` in a Sentry SDK repository using two sources of truth:

- **[PR Template docs](https://develop.sentry.dev/sdk/getting-started/templates/pr-template/)** — defines the canonical template content
- **[`sentry-skills:create-pr`](https://github.com/getsentry/skills/blob/main/plugins/sentry-skills/skills/create-pr/SKILL.md)** — defines how PRs are written and what structure the template must support

**Requires**: GitHub CLI (`gh`) authenticated and available, with push access to the target repository.

## Step 1: Read the sources of truth

Fetch the canonical template and the pr-writer skill:

```bash
# Canonical template (read the Template section)
curl -s https://develop.sentry.dev/sdk/getting-started/templates/pr-template.md

# PR writer skill
curl -s https://raw.githubusercontent.com/getsentry/skills/main/plugins/sentry-skills/skills/create-pr/SKILL.md
```

The canonical template content is:

```markdown
### Description

<!-- Brief description of what the PR does.
Why these changes are being made — the motivation.
Alternative approaches considered, if any.
Any additional context reviewers need. -->

### Issues

<!--
* Fixes #1234
* Refs LINEAR-ABC-123
-->
```

Linear magic words for the Issues section:

- **Closing**: `close`, `closes`, `closed`, `closing`, `fix`, `fixes`, `fixed`, `fixing`, `resolve`, `resolves`, `resolved`, `resolving`, `complete`, `completes`, `completed`, `completing`
- **Non-closing**: `ref`, `refs`, `references`, `part of`, `related to`, `contributes to`, `toward`, `towards`

## Step 2: Read the existing template

```bash
cat .github/pull_request_template.md 2>/dev/null \
  || cat .github/PULL_REQUEST_TEMPLATE.md 2>/dev/null \
  || echo "NO TEMPLATE"
```

Note any repo-specific content that must be preserved:

- **`sentry-cli`**: Legal boilerplate clause for external contributors — keep it.
- **`sentry-go`**: `### Changelog Entry` section used by Craft release tooling — keep it.
- Any other non-standard section: flag it before removing.

## Step 3: Write the updated template

For most repositories, the new content is the canonical template verbatim. For repositories with preserved additions, append them after the `### Issues` block.

Example for `sentry-cli`:

```markdown
### Description

<!-- Brief description of what the PR does.
Why these changes are being made — the motivation.
Alternative approaches considered, if any.
Any additional context reviewers need. -->

### Issues

<!--
* Fixes #1234
* Refs LINEAR-ABC-123
-->

### Legal Boilerplate

Look, I get it. The entity doing business as "Sentry" was incorporated in the State of Delaware in 2015 as Functional Software, Inc. and is gonna need some rights from me in order to utilize my contributions in this here PR. So here's the deal: I retain all rights, title and interest in and to my contributions, and by keeping this boilerplate intact I confirm that Sentry can use, modify, copy, and redistribute my contributions, under Sentry's choice of terms.
```

## Step 4: Create a branch and commit

```bash
git checkout -b <your-username>/meta/standardize-pr-template

git add .github/pull_request_template.md
git commit -m "meta: Standardize PR template

Align .github/pull_request_template.md with the canonical Sentry SDK
template at https://develop.sentry.dev/sdk/getting-started/templates/pr-template/.

Removes checklist sections and 'How did you test it?' prompts that
contradict the code submission standards."
```

## Step 5: Open a draft PR

```bash
gh pr create --draft \
  --title "meta: Standardize PR template" \
  --body "$(cat <<'EOF'
### Description

Aligns `.github/pull_request_template.md` with the canonical Sentry SDK template.

Removes sections that contradict the [code submission standards](https://develop.sentry.dev/sdk/getting-started/standards/code-submission/): checklist checkboxes, 'How did you test it?' prompts, and type-of-change radio buttons.

### Issues

* Refs https://develop.sentry.dev/sdk/getting-started/templates/pr-template/

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

## Batch Rollout

To update multiple repos at once, run this skill in parallel agents — one per repository. Target repositories where the current template conflicts with the standards:

| Repo | Issue |
|------|-------|
| `getsentry/sentry-java` | "How did you test it?" + checklist |
| `getsentry/sentry-cocoa` | "How did you test it?" + checklist |
| `getsentry/sentry-dart` | "How did you test it?" + checklist |
| `getsentry/sentry-kotlin-multiplatform` | "How did you test it?" + checklist |
| `getsentry/sentry-react-native` | "How did you test it?" + checklist + type-of-change |
| `getsentry/sentry-javascript` | Checkbox list |
| `getsentry/sentry-ruby` | Prose instruction list |
| `getsentry/sentry-dotnet` | No template exists — create it |

Repositories `sentry-python`, `sentry-symfony`, `sentry-rust`, `sentry-php`, `sentry-laravel`, and `sentry-elixir` already match the canonical template and need no changes.

## References

- [PR Template](https://develop.sentry.dev/sdk/getting-started/templates/pr-template/)
- [Code Submission Standards](https://develop.sentry.dev/sdk/getting-started/standards/code-submission/)
- [PR Writer Skill](https://github.com/getsentry/skills/blob/main/plugins/sentry-skills/skills/create-pr/SKILL.md)
