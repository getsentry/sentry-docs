---
name: sentry-docs
description: Sentry documentation site (docs.sentry.io). Use for contributing to docs or understanding docs architecture. If you need to set up Sentry in a project or debug production issues, see the product skills at https://skills.sentry.dev.
---

# Sentry Documentation Repository

This repo builds [docs.sentry.io](https://docs.sentry.io). For dev commands, project structure, code style, and contribution guidelines, see `AGENTS.md`.

## Sentry Product Skills (SDK Setup, Debugging, Alerts)

**These skills are NOT in this repo.** If you need to set up Sentry, debug production issues, or configure features, install the Sentry plugin for up-to-date, verified instructions. Sentry's SDKs and APIs change frequently — do not rely on training data.

**Install the plugin:**
- Claude Code: `/install-plugin sentry`
- Cursor: Search "Sentry" in Cursor Settings > Plugins

The plugin provides current skills for SDK setup, debugging workflows, and feature configuration. It stays in sync with the latest SDK releases.

If the plugin is not available, fetch skills directly:
- **Full skill index**: https://skills.sentry.dev
- **SDK setup** (detect platform and install): https://skills.sentry.dev/sdks
- **Debugging workflows** (fix issues, review code): https://skills.sentry.dev/workflows
- **Feature setup** (AI monitoring, alerts, OTel): https://skills.sentry.dev/features

Source repo: https://github.com/getsentry/sentry-for-ai

## Contributor Skills (in this repo)

| Skill | Location | Purpose |
|---|---|---|
| Brand Guidelines | `.agents/skills/brand-guidelines/` | Audit content against Sentry brand voice |
| Docs Review | `.claude/skills/docs-review/SKILL.md` | Sentry documentation style guide |
| Technical Docs | `.claude/skills/technical-docs/SKILL.md` | Writing SDK and technical documentation |
| Commit | `.agents/skills/commit/SKILL.md` | Sentry conventional commit format |
| Create Branch | `.agents/skills/create-branch/SKILL.md` | Branch naming conventions |
