---
name: sdk-docs
description: Generate user-facing SDK documentation for docs.sentry.io using MDX format. Use when writing integration docs, configuration options, SDK features, or instrumentation guides after implementation. Analyzes SDK PRs from sentry-python, sentry-javascript, sentry-ruby, etc., finds similar documentation patterns, and follows Sentry's customer documentation standards with proper MDX components like Alert, Note, SdkOption, and PlatformContent.
model: sonnet
allowed-tools: Read Grep Glob Bash Write Edit Skill
compatibility: Requires gh CLI (GitHub CLI) with authentication configured for fetching PR details from SDK repositories. Uses the sentry-skills:create-pr skill for creating pull requests following Sentry conventions.
---

# Sentry SDK Documentation Generator

Generate user-facing documentation for docs.sentry.io showing users HOW TO USE implemented SDK features.

**Default Workflow:** Fully automated - auto-stashes uncommitted changes, switches to main branch, creates a new branch, generates documentation files, auto-commits with proper attribution, and creates a PR via `sentry-skills:create-pr`. User intervention only needed for genuine decision points.

**When to Use:** AFTER feature implementation for new SDK configuration options, framework/library integrations, SDK features/capabilities, or automatic instrumentation. **Not for:** Developer/maintainer docs.

## SDK to Repository Mapping

**Critical:** Use correct repository names for gh CLI commands:

- `python` → `getsentry/sentry-python`
- `javascript` → `getsentry/sentry-javascript`
- `ruby` → `getsentry/sentry-ruby`
- `php` → `getsentry/sentry-php`
- `go` → `getsentry/sentry-go`
- `java` → `getsentry/sentry-java`
- `dotnet` / `csharp` → `getsentry/sentry-dotnet`
- `rust` → `getsentry/sentry-rust`
- `android` → `getsentry/sentry-java`
- `apple` / `ios` / `swift` → `getsentry/sentry-cocoa`
- `react-native` → `getsentry/sentry-react-native`
- `flutter` / `dart` → `getsentry/sentry-dart`
- `unity` → `getsentry/sentry-unity`
- `unreal` → `getsentry/sentry-unreal`
- `native` / `c` / `cpp` → `getsentry/sentry-native`
- `elixir` → `getsentry/sentry-elixir`
- `perl` → `getsentry/sentry-perl`
- `clojure` → `getsentry/sentry-clj`
- `kotlin` → `getsentry/sentry-kotlin-multiplatform`

**Docs paths:** Use lowercase SDK names (e.g., `docs/platforms/python/`, `docs/platforms/javascript/node/`)

## Instructions

### Step 0: Prepare Git Branch

**Automatically prepare clean branch:**
1. Check status: `git branch --show-current && git status --short`
2. Auto-stash uncommitted changes: `git stash push -m "Auto-stash before sdk-docs"` (inform user, can restore with `git stash pop`)
3. Auto-switch to main: Detect with `git remote show origin | grep "HEAD branch" | cut -d' ' -f5`, then checkout
4. Auto-generate branch name: `docs/<sdk>/<feature-name>` (e.g., `docs/python/fastapi-integration`)
5. Create branch: `git checkout -b <branch-name>`

**Ask user only if:** Branch already exists (use existing, rename, or delete/recreate)

### Step 1: Gather Context

Handle three scenarios:

**A) User provides PR URL:**
1. Extract repo, PR number, SDK from URL
2. Fetch PR: `gh pr view <PR_NUM> --repo <REPO> --json title,body,files,state`
3. **Auto-detect doc type** from PR changes:
   - Files matching `*integration*.py|rb|js|go` → **integration**
   - Changes to `*client*|*init*|*config*` with new params → **configuration_option**
   - New span/trace/instrumentation code → **feature**
   - If unclear, default to **feature** and inform user

**B) User describes feature:**
1. Ask: SDK, feature name, doc type
2. Search for related PRs: `gh search prs --repo <MAPPED_REPO> --match title "<FEATURE>" --limit 5`

**C) Updating existing docs:**
1. Ask what needs updating
2. Use Glob/Grep to find existing docs in `docs/platforms/{SDK}/`
3. Read existing doc and generate targeted modifications

### Step 2: Extract Implementation Details

**Detect documentation context from PR title/description:**
- **Troubleshooting keywords:** "crash", "fix", "prevent", "workaround", "error", "bug" → Use concise, problem-focused format
- **Feature keywords:** "feat", "add", "support", "integrate", "new" → Use comprehensive, structured format

**Extract from PR:**
- Config options and code examples from changed files (`gh api repos/{REPO}/pulls/{PR_NUM}/files`)
- Dependencies from package files (package.json, requirements.txt, etc.)
- Version requirements (PR milestone/labels)
- Beta status (look for "beta"/"experimental" in PR title/labels/description)
- For troubleshooting: Extract specific problem/error being fixed

**Without PR:** Ask user for implementation details, dependencies, target SDK version, beta status, and special considerations.

### Step 3: Find Similar Documentation

**Check for existing docs first:**
1. Search for existing docs PR: `gh search prs --repo getsentry/sentry-docs --match body "{PR_NUM}" --limit 3`
2. Check if docs exist: Use Glob to search `docs/platforms/{sdk}/**/*{feature-name}*.mdx`
3. If found, ask user to update existing docs or create new ones

**Find templates based on doc type:**
- **Integration:** `docs/platforms/{SDK}/integrations/**/*.mdx` (Ruby uses `guides/` instead)
- **Configuration:** `docs/platforms/{SDK}/**/options.mdx`
- **Feature/Guide:** Use Grep for related keywords in `docs/platforms/{SDK}/`

**Read 1-2 similar docs** to understand structure, MDX component usage, and style. Prioritize same SDK examples.

### Step 4: Generate Documentation

**Code Example Requirements:**
- Every code example MUST start with: "This example shows how to [specific action]."
- Help users quickly identify relevant examples
- Use descriptive headers for multiple examples

**Two formats based on context:**

**Tone Guidelines:**
- Be accessible: Explain clearly without jargon
- Avoid alarmist language: "prevents traces from other organizations" not "protects against DOS attacks"
- Be direct: "Set this option" not "You might want to set this option"
- Use active voice: "The SDK captures errors" not "Errors are captured"

**Output Length Calibration:**
- **Simple config option:** Be concise - no subsections, 1 example, brief explanation
- **Multi-option/feature:** Be focused - minimal subsections, 1-2 examples, clear explanations
- **Major feature/integration:** Be comprehensive - organized subsections, multiple examples as needed
- After drafting, review and reduce length by 20-30% while maintaining completeness

#### A) Troubleshooting (for fixes/crashes/errors)

**Structure:**
```markdown
## Troubleshooting

### [Descriptive Problem Title]

_Supported in [SDK name] version X.Y.Z and later_

[1-2 sentence problem description: What breaks/crashes/fails and why]

[1-2 sentence solution: How to fix/prevent/workaround]

**Example:**

\```[language]
[Concise code example showing the fix]
\```
```

**Style:** Lead with the problem, be concise, single paragraphs, add to existing troubleshooting section or create new one.

#### B) Feature/Configuration (for new features/options)

**Standard Integration Pattern:**
- **Frontmatter:** title + description (80-160 chars)
- **Beta/Experimental alert** (if applicable): `<Alert level="info|warning" title="Beta|Experimental">...</Alert>`
- **Overview:** What it does, what gets captured
- **Install:** Package/dependency requirements
- **Configure:** Code example with `___PUBLIC_DSN___` placeholder, include `traces_sample_rate` for performance
- **Verify:** Where to see in Sentry UI (Issues, Performance > Traces, Profiling, Replays, Crons)
- **Behavior:** Data captured, PII considerations, trace propagation, automatic instrumentation
- **Options:** Integration-specific config with `<SdkOption>` components
- **Supported Versions:** Minimum SDK version

**Configuration Options Pattern (add to options.mdx):**
```mdx
<SdkOption name="option_name" type="Type" defaultValue="value">

Brief description. Why use this?

\```language
sentry_sdk.init(dsn="___PUBLIC_DSN___", option_name=value)
\```

<Note>Available in SDK version X.Y.Z+.</Note>
</SdkOption>
```

**Common MDX components:** `<Alert>`, `<Note>`, `<SdkOption>`, `<PlatformContent>`, `<OnboardingOptionButtons>`

### Step 5: Save, Commit, and Create PR

**Automatically execute the following:**

1. **Generate and validate documentation:**
   - Ensure code examples use `___PUBLIC_DSN___`, proper language identifiers, correct Sentry terminology
   - Match structure and style from similar docs found in Step 3
   - Include version requirements, PII considerations where relevant

2. **Save files:**
   - Write new files or edit existing:
     - Troubleshooting: Add to existing page's "Troubleshooting" section
     - Integrations: `docs/platforms/{sdk}/integrations/{name}/index.mdx` (Ruby uses `guides/`)
     - Configuration: Add `<SdkOption>` to `docs/platforms/{sdk}/configuration/options.mdx`
     - Features: `docs/platforms/{sdk}/{category}/{feature}.mdx`
   - Set sidebar navigation in MDX frontmatter if creating new page: `sidebar_order` (number), `sidebar_title` (optional), `sidebar_section` (optional)
   - Run `yarn lint:fix` to auto-fix formatting

3. **Commit changes:**
   ```bash
   git add docs/
   git commit -m "docs(<sdk>): Add <feature> documentation

   Add documentation for <feature> integration/option/guide.

   Key sections:
   - [List main sections]

   Based on PR: <link-to-sdk-pr>

   Co-Authored-By: Claude <noreply@anthropic.com>"
   ```

4. **Create PR:**
   - Invoke `sentry-skills:create-pr` skill to push and create PR
   - Inform user of PR URL and live docs URL: `https://docs.sentry.io/platforms/{sdk}/{path}/`

**Error handling:** PR not accessible? Suggest `gh auth login`. No similar docs? Adapt from other SDKs. Docs exist? Ask to update or create new. Linter fails? Show errors and ask for guidance.

**Flexibility:** User can request manual review before PR, add more docs to branch, or adjust workflow as needed.

## References

- [Sentry Docs Repo](https://github.com/getsentry/sentry-docs)
- [Example Integration](https://github.com/getsentry/sentry-docs/blob/master/docs/platforms/python/integrations/pydantic-ai/index.mdx)
