---
name: contributing-md
description: >
  Generate or update CONTRIBUTING.md for Sentry SDK repositories.
  Use when asked to "create contributing.md", "update contributing.md",
  "contributing guide", or "align contributing.md with standard".
---

# Contributing.md Skill

Generate or update `CONTRIBUTING.md` for a Sentry SDK repository, following the
[standard template](https://develop.sentry.dev/sdk/getting-started/templates/contributing-md-template/).

## Steps

### 1. Read the template

Fetch the canonical template from develop.sentry.dev:

```
https://develop.sentry.dev/sdk/getting-started/templates/contributing-md-template/
```

### 2. Inspect the repository

Read these files to understand the repo's ecosystem and conventions:

- `CONTRIBUTING.md` — existing file, if any (preserve SDK-specific sections)
- `README.md` — setup instructions, language runtime, project overview
- `package.json` / `pyproject.toml` / `build.gradle` / `Package.swift` / `*.csproj` — package manager and scripts
- `.github/workflows/*.yml` — CI steps reveal actual test/lint/build commands
- `tox.ini` / `Makefile` / `Taskfile.yml` — common command wrappers
- `CHANGELOG.md` — determine format (Keep a Changelog, craft, etc.)

### 3. Detect the ecosystem

| Indicator | Ecosystem |
|-----------|-----------|
| `package.json` | JavaScript / TypeScript |
| `pyproject.toml` / `setup.py` / `tox.ini` | Python |
| `build.gradle` | Java / Android |
| `Package.swift` | Swift / Cocoa |
| `*.csproj` / `*.sln` | .NET |
| `go.mod` | Go |
| `Podfile` / `.xcodeproj` | React Native (native deps) |

### 4. Fill placeholders

Replace every `[placeholder]` in the template with real values:

| Placeholder | Source |
|-------------|--------|
| `[SDK name]` | Repo name / README heading |
| `[install command]` | package.json scripts, Makefile, README |
| `[full test command]` | CI workflow or README |
| `[single test command]` | CI workflow or README |
| `[lint command]` | CI workflow, package.json, tox |
| `[format command]` | CI workflow, package.json, tox |
| `[SDK-specific setup steps]` | README, contributing notes |
| `[language]` | Discord channel suffix (e.g. `python`, `javascript`) |

Add ecosystem-specific sections as needed:

- **Python:** tox environments, required Python versions, virtualenv setup
- **JavaScript:** Node version manager (Volta/nvm), monorepo structure, yarn/pnpm/npm
- **Java/Android:** Gradle tasks, min SDK, emulator/device testing
- **Swift/Cocoa:** Xcode version, simulator setup, `xcodebuild` invocations
- **React Native:** native dep setup (sentry-cocoa, sentry-java), `pod install`
- **Go:** `go test ./...` patterns, race detector flag

### 5. Preserve SDK-specific content

If an existing `CONTRIBUTING.md` contains sections **not** covered by the standard template
(e.g. integration test setup, monorepo package layout, platform support matrix), keep them.
Insert them under a clearly labelled heading after the standard sections.

### 6. Flag non-standard content

If the existing file contains content that **contradicts** develop.sentry.dev standards,
add a `<!-- TODO: review against standard: [url] -->` comment inline rather than silently
removing it. Let the human decide.

### 7. Write the file

Target **100–200 lines**. If the file would exceed 200 lines, move verbose steps (e.g.
full native-dep setup) into a linked doc (e.g. `docs/contributing/setup.md`) and
reference it from CONTRIBUTING.md.

### 8. Verify

- Run `[lint command]` to confirm no markdown lint errors.
- Confirm all links to develop.sentry.dev paths resolve (check against known playbook paths).

## Quality Checklist

- [ ] All `[placeholder]` values replaced with real content
- [ ] Commands verified against CI config or README
- [ ] Existing SDK-specific sections preserved
- [ ] Non-standard content flagged with TODO comments
- [ ] LOGAF scale table included in Code Review section
- [ ] AI attribution note present
- [ ] File is 100–200 lines
- [ ] Links point to develop.sentry.dev, not to internal Notion/Linear
