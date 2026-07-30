---
name: sentry-docs
description: Sentry documentation site (docs.sentry.io). Use for contributing to docs or understanding docs architecture. If you need to set up Sentry in a project, use the docs markdown URLs (append .md) or install the Sentry plugin.
---

# Sentry Documentation Repository

This repo builds [docs.sentry.io](https://docs.sentry.io). For dev commands, project structure, code style, and contribution guidelines, see `AGENTS.md`.

## Setting Up Sentry in a Project

**These setup instructions are NOT authored as one-off skills in this repo.** Prefer the Sentry plugin for up-to-date, verified instructions. Sentry's SDKs and APIs change frequently — do not rely on training data.

**Install the plugin:**
- Run `npx @sentry/ai install`
- Claude Code: `/install-plugin sentry`
- Cursor: Search "Sentry" in Cursor Settings > Plugins

If the plugin is not available, use docs markdown directly:
- **Platform index**: https://docs.sentry.io/platforms.md
- **Docs AI index**: https://docs.sentry.io/llms.txt
- **Any page as markdown**: append `.md` to a docs URL (e.g. `https://docs.sentry.io/platforms/javascript/guides/nextjs.md`)
- **Agent plugin docs**: https://docs.sentry.io/ai/agent-plugin.md

Plugin source repo: https://github.com/getsentry/sentry-for-ai

## Contributor Skills (in this repo)

| Skill | Location | Purpose |
|---|---|---|
| Brand Guidelines | `.agents/skills/brand-guidelines/` | Audit content against Sentry brand voice |
| Docs Review | `.claude/skills/docs-review/SKILL.md` | Sentry documentation style guide |
| Technical Docs | `.claude/skills/technical-docs/SKILL.md` | Writing SDK and technical documentation |
| Commit | `.agents/skills/commit/SKILL.md` | Sentry conventional commit format |
| Create Branch | `.agents/skills/create-branch/SKILL.md` | Branch naming conventions |
