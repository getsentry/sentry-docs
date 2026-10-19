---
name: writing-sdk-specs
description: Write, edit, or review SDK specs. Use when changing or reviewing any page under develop-docs/sdk/ that has spec_id frontmatter (except process specs with spec_kind: process), or when creating a new SDK spec.
---

# Writing SDK Specs

The rules live in [`develop-docs/sdk/getting-started/standards/writing-specs.mdx`](../../../develop-docs/sdk/getting-started/standards/writing-specs.mdx). That page is the source of truth. This skill only says when and how to apply it.

## Steps

1. **Read the guidelines.** Read `writing-specs.mdx` in full before changing a spec. Don't work from memory or from this file.
2. **Check what kind of spec it is.** If its frontmatter has `spec_kind: process` (playbooks and engineering standards), the guidelines don't apply: skip the remaining steps. Otherwise, the spec is legacy if its frontmatter has no `spec_guidelines` field.
3. **Write to the guidelines.**
   - **New spec:** follow the guidelines for the whole page and set `spec_guidelines: writing-specs@<major.minor>` to the current version of `writing-specs.mdx`.
   - **Legacy spec:** make every requirement you add or change follow the guidelines. Leave the rest of the page as it is unless the user asks you to migrate it. Don't add `spec_guidelines` unless the whole page now conforms.
4. **Check your own work.** Re-read every requirement you added or changed against `writing-specs.mdx`, and fix any violations before you finish.
5. **Report existing violations.** List violations you noticed in content you didn't change, but don't fix them unless the user asks. Give the section and quote the text.

## What to Report

When you finish, briefly report:

- Which guidelines version you followed.
- Whether the page is legacy or conforming, and whether you set `spec_guidelines`.
- Any pre-existing violations you found (or "none found").
- For a migration: every requirement you added, removed, or whose level or meaning changed, so a reviewer can check each one.
