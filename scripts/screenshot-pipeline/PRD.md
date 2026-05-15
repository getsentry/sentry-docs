# PRD: Automated Documentation Screenshot Pipeline

**Team:** Sentry Documentation
**Status:** Draft
**Last updated:** 2026-03-24

---

## 1. Problem Statement

The Sentry docs contain thousands of pages with stale screenshots and Arcade embeds left over from a major UI refresh. Manually auditing and replacing these is prohibitively time-consuming. The docs team needs an automated pipeline that replaces screenshots where confidence is high, creates Linear issues for everything requiring human judgment, and keeps screenshots current on an ongoing basis.

## 2. Goals

1. **Eliminate stale screenshots** — automatically detect and replace screenshots of deterministic UI pages where the diff confidence is high.
2. **Triage the rest** — automatically create Linear issues for low-confidence diffs, annotated images, Arcade embeds, and auth-complex pages so nothing falls through the cracks.
3. **Prevent future staleness** — run the pipeline on a schedule (and on deploy triggers) so screenshots stay current without manual effort.
4. **Empower writers** — provide a single local command that lets any writer regenerate a screenshot without engineering help.

## 3. Non-Goals

- Re-recording Arcade interactive walkthroughs (detection is in scope; re-recording is manual).
- Auto-regenerating annotated screenshots (callouts, arrows, highlights). These will be ticketed.
- Building a visual review dashboard (e.g. Percy). This is deferred unless review workflow demands it.

## 4. Success Metrics

| Metric | Target |
|--------|--------|
| Stale screenshots auto-replaced (POC set) | >= 70% of deterministic, non-annotated screenshots |
| Linear issues created for remaining items | 100% of items that don't meet auto-replace criteria |
| Time from UI deploy to screenshot update (steady state) | < 24 hours |
| Manual effort per screenshot refresh cycle | Near zero for auto-replaced; ticket-driven for the rest |

## 5. User Stories

- **As a docs writer**, I want stale screenshots replaced automatically so I don't have to manually re-capture UI screens after every product update.
- **As a docs writer**, I want a Linear issue created for any screenshot that needs human judgment so I have a clear worklist.
- **As a docs writer**, I want to run a single command locally to regenerate any screenshot so I'm not blocked on engineering.
- **As a docs team lead**, I want the pipeline to run on a schedule so screenshots never go stale again.
- **As a docs team lead**, I want visibility into what was auto-replaced vs. ticketed so I can plan review and manual work.

## 6. Classification Logic

Each stale asset is classified into one of five buckets:

| Scenario | Action |
|----------|--------|
| Deterministic UI page, clean diff | Auto-replace screenshot, commit |
| Significant diff but page has dynamic content | Linear issue -- needs human review |
| Screenshot has annotations, arrows, or callouts | Linear issue -- needs manual redo |
| Arcade embed | Linear issue -- needs re-recording |
| Auth-complex or state-dependent page | Linear issue -- needs scripting work first |

## 7. Known Limitations & Risks

- **Annotated screenshots** — Playwright captures raw UI, not overlaid annotations. These must be redone manually.
- **Arcade embeds** — No automation can re-record interactive walkthroughs. Detection is automatic; re-recording is not.
- **Confidence scoring** — Pixel diff tells you something changed, not whether the new screenshot is correct. Plan for a lightweight human review pass on auto-replaced images before publishing.
- **Auth flows** — Session management in capture scripts requires real engineering effort. Budget accordingly.

## 8. Rollout Plan

### Phase 1: Proof of Concept

- **Week 1:** Playwright script crawls 20-30 representative doc pages, captures fresh screenshots, diffs against existing images. Validate auth flows and capture quality.
- **Week 2:** Wire up Linear issue creation for non-auto-replaceable items. Connect capture scripts to a GitHub Actions workflow.

### Phase 2: Full Pipeline (post-POC)

- Expand crawl to full docs inventory.
- Tune diff thresholds and classification heuristics.
- Enable scheduled and deploy-triggered runs.
- Add local CLI command for writers.
- Conduct human review pass on first full auto-replace batch.

### Phase 3: Steady State

- Pipeline runs on schedule and on deploy triggers.
- New screenshots are captured automatically; edge cases are ticketed.
- Optional: evaluate Percy or similar visual review dashboard if review workflow warrants it.

## 9. Dependencies

- Access to a Sentry staging/demo environment with representative data for captures.
- Sentry auth credentials (service account or token) for Playwright session management.
- Linear API access (via MCP or API token) for automated issue creation.
- GitHub Actions runner with Playwright browser dependencies.

---

## Decisions & Clarifications (POC)

| Item | Decision |
|------|----------|
| UI_REFRESH_CUTOFF | June 2025 (configurable) |
| Staging Environment | Use personal credentials for POC |
| Linear Team | DOCS team, label `Playwright` |
| POC Pages | `/product/insights/` section |
| Image Directories | `docs/*/img/` and `includes/*/images/` |
| Annotated Screenshots | Rare; manual override in config |
| Arcade Focus | Pre-June 2025 embeds prioritized |
| PR Reviewers | `getsentry/docs`, `getsentry/product-owners-docs` |
| Local CLI Auth | Deferred to post-POC |
| Image Optimization | Yes - optimize before commit |
