---
name: writing-sdk-specs
description: Write, edit, or review SDK specs. Use when changing or reviewing any page under develop-docs/sdk/ that has spec_id frontmatter (except process specs with spec_kind: process), or when creating a new SDK spec.
---

# Writing SDK Specs

The rules live in [`develop-docs/sdk/getting-started/standards/writing-specs.mdx`](../../../develop-docs/sdk/getting-started/standards/writing-specs.mdx). That page is the source of truth. This skill only says when and how to apply it.

## Requests That Conflict With the Guidelines

The guidelines take priority over requests that would break them, because the person asking may not know them. Don't make the change. Explain which rule it breaks, link the relevant section of the rendered page (`https://develop.sentry.dev/sdk/getting-started/standards/writing-specs/#<heading-anchor>`, e.g. `#legacy-specs`), and suggest a change that conforms. If the user still wants it after that, make the change and list it in your report as a violation.

## Steps

1. **Read the guidelines.** Read `writing-specs.mdx` in full before changing a spec. Don't work from memory or from this file.
2. **Check what kind of spec it is.** If its frontmatter has `spec_kind: process` (playbooks and engineering standards), the guidelines don't apply: skip the remaining steps. Otherwise, the spec is legacy if its frontmatter has no `spec_guidelines` field.
3. **Write to the guidelines.**
   - **New spec:** follow the guidelines for the whole page and set `spec_guidelines: writing-specs@<major.minor>` to the current version of `writing-specs.mdx`.
   - **Legacy spec:** make every requirement you add or change follow the guidelines. Leave the rest of the page as it is unless the user asks you to migrate it (see [Migrating a Whole Spec](#migrating-a-whole-spec)). Don't add `spec_guidelines` unless the whole page now conforms.
4. **Check your own work.** Re-read every requirement you added or changed against `writing-specs.mdx`, and fix any violations before you finish.
5. **Report existing violations.** List violations you noticed in content you didn't change, but don't fix them unless the user asks. Give the section and quote the text.

## Migrating a Whole Spec

Follow "Migrating a legacy spec" in the guidelines. Before editing, list the open questions: ones whose answer would change a requirement's level or meaning and depends on facts about Sentry or SDKs that the guidelines and the spec don't settle. For example, whether a MUST passes the Section 6 test, or what observable intent a non-observable requirement serves.

Investigate each open question briefly, with a few targeted searches rather than a full audit:

- **Relay** (`getsentry/relay`): does it reject, drop, or reinterpret data that violates the requirement?
- **A few SDKs** (for example `sentry-python`, `sentry-javascript`, and one mobile SDK): do they implement it, and does any have a reason to deviate?

If the code settles a question, apply the answer and cite the evidence (file paths or links) in your report. Relay not checking something doesn't prove it's safe, since other parts of Sentry may still depend on it. SDKs agreeing is not a reason for a MUST. If you can't access the code, say so and treat the question as open.

Then ask the remaining questions in one batch, with what you found for each. Don't ask about anything the guidelines decide or give a default for: apply the default and flag it in your report.

## What to Report

When you finish, briefly report:

- Which guidelines version you followed.
- Whether the page is legacy or conforming, and whether you set `spec_guidelines`.
- Any pre-existing violations you found (or "none found").
- Any requested changes you pushed back on, and any violations you made because the user insisted.
- For a migration: every requirement you added, removed, or whose level or meaning changed, so a reviewer can check each one.
