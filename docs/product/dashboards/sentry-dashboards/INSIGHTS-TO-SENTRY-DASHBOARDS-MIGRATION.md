# Insights → Sentry Dashboards migration

This document tracks link updates, product naming changes, and redirects when migrating from **Insights** to **Sentry dashboards** (`/product/dashboards/sentry-dashboards/`).

## Decisions

- **Path:** Use `sentry-dashboards` (plural). Base path: `/product/dashboards/sentry-dashboards/`.
- **Images:** Migrate the associated `img` folder with each moved doc as needed.
- **Performance Overhead:** Page is deleted; merge useful content into Sentry dashboards index or a short note. Add redirect so `/product/insights/performance-overhead/` → `/product/dashboards/sentry-dashboards/`. Update all links that point to it.
- **Product naming:** Where the product is called "Insights," change to "Sentry dashboards" (or "Sentry Dashboards" as appropriate). Update both links and prose.

---

## Path mapping (old → new)

Use this when updating links and when adding redirects (e.g. in `redirects.js` and `src/middleware.ts`).

| Old path | New path |
|---------|----------|
| `/product/insights/` | `/product/dashboards/sentry-dashboards/` |
| `/product/insights/overview/` | `/product/dashboards/sentry-dashboards/` (merged into index) |
| `/product/insights/overview/transaction-summary/` | `/product/dashboards/sentry-dashboards/transaction-summary/` |
| `/product/insights/overview/metrics/` | `/product/dashboards/sentry-dashboards/transaction-summary/#metrics-in-this-view` (performance-metrics page retired; content in Transaction Summary) |
| `/product/insights/overview/filters-display/` | `/product/dashboards/sentry-dashboards/` (page deleted; redirect to index) |
| `/product/insights/overview/filters-display/widgets/` | `/product/dashboards/sentry-dashboards/` (page deleted; redirect to index) |
| `/product/insights/getting-started/` | `/product/dashboards/sentry-dashboards/` (Set Up section merged into index; no separate getting-started page) |
| `/product/insights/performance-overhead/` | `/product/dashboards/sentry-dashboards/` (page deleted; redirect) |
| `/product/insights/frontend/` | `/product/dashboards/sentry-dashboards/frontend/` |
| `/product/insights/frontend/web-vitals/` | `/product/dashboards/sentry-dashboards/frontend/web-vitals/` |
| `/product/insights/frontend/web-vitals/web-vitals-concepts/` | `/product/dashboards/sentry-dashboards/frontend/web-vitals/web-vitals-concepts/` |
| `/product/insights/frontend/network-requests/` | `/product/dashboards/sentry-dashboards/outbound-api-requests/` |
| `/product/insights/frontend/assets/` | `/product/dashboards/sentry-dashboards/frontend/assets/` |
| `/product/insights/frontend/session-health/` | `/product/dashboards/sentry-dashboards/frontend/session-health/` |
| `/product/insights/backend/` | `/product/dashboards/sentry-dashboards/backend/` |
| `/product/insights/backend/queries/` | `/product/dashboards/sentry-dashboards/backend/queries/` |
| `/product/insights/backend/requests/` | `/product/dashboards/sentry-dashboards/outbound-api-requests/` |
| `/product/insights/backend/queue-monitoring/` | `/product/dashboards/sentry-dashboards/backend/queues/` |
| `/product/insights/backend/queue-monitoring/queues-page/` | `/product/dashboards/sentry-dashboards/backend/queues/` |
| `/product/insights/backend/caches/` | `/product/dashboards/sentry-dashboards/backend/caches/` |
| `/product/insights/backend/caches/cache-page/` | `/product/dashboards/sentry-dashboards/backend/caches/` |
| `/product/insights/mobile/` | `/product/dashboards/sentry-dashboards/mobile/` |
| `/product/insights/mobile/mobile-vitals/` | `/product/dashboards/sentry-dashboards/mobile/mobile-vitals/` |
| `/product/insights/mobile/mobile-vitals/app-starts/` | `/product/dashboards/sentry-dashboards/mobile/mobile-vitals/app-starts/` |
| `/product/insights/mobile/mobile-vitals/screen-loads/` | `/product/dashboards/sentry-dashboards/mobile/mobile-vitals/screen-loads/` |
| `/product/insights/mobile/network-requests/` | `/product/dashboards/sentry-dashboards/outbound-api-requests/` |
| `/product/insights/mobile/session-health/` | `/product/dashboards/sentry-dashboards/mobile/session-health/` |
| `/product/insights/web-vitals/` (no "frontend") | `/product/dashboards/sentry-dashboards/frontend/web-vitals/` |
| `/product/insights/queries` (widgets.mdx used this) | `/product/dashboards/sentry-dashboards/backend/queries/` |
| `/product/insights/requests` | `/product/dashboards/sentry-dashboards/outbound-api-requests/` |
| `/product/insights/caches/` | `/product/dashboards/sentry-dashboards/backend/caches/` |

**AI:** Leave under `docs/ai/`. No URL changes for AI monitoring docs. Links that pointed to `/product/insights/ai/*` should be updated to the current `docs/ai` URLs (e.g. `/ai/monitoring/agents/`, `/ai/monitoring/mcp/`).

---

## Files to update (links) — outside `docs/product/insights/`

Update these files to use the new paths from the table above. Replace any `/product/insights/...` with the corresponding `/product/dashboards/sentry-dashboards/...` (or merged path).

### Product docs

- `docs/product/alerts/alert-types.mdx` — metrics, latency, Apdex, failure rate, throughput
- `docs/product/alerts/index.mdx` — metrics, latency, failure rate
- `docs/product/dashboards/widget-library/index.mdx` — Apdex
- `docs/product/issues/issue-details/performance-issues/index.mdx` — Insights and Tracing
- `docs/product/issues/issue-details/performance-issues/web-vitals/index.mdx` — Web Vitals, opportunity
- `docs/product/issues/issue-details/performance-issues/endpoint-regressions/index.mdx` — Span Summary / transaction-summary
- `docs/product/projects/project-details/index.mdx` — Apdex, failure rate, TPM
- `docs/product/releases/release-details.mdx` — Failure Rate
- `docs/product/explore/discover-queries/query-builder/query-equations.mdx` — Apdex
- `docs/product/explore/profiling/mobile-app-profiling/metrics.mdx` — Mobile Vitals
- `docs/product/sentry-basics/integrate-frontend/configure-scms.mdx` — Insights
- `docs/product/sentry-basics/performance-monitoring.mdx` — (if it links to insights; verify)
- `docs/product/crons/alerts-backend-insights-migration.mdx` — "Insights > Backend" (naming)
- `docs/product/pricing/legacy-pricing.mdx` — Insights features
- `docs/product/dotnet/common/enriching-events/transaction-name/index.mdx` — Insights product (naming + link)

### Concepts

- `docs/concepts/key-terms/key-terms.mdx` — Insights Overview, performance monitoring
- `docs/concepts/key-terms/tracing/index.mdx` — Insights page, caching issues, Learn more Insights
- `docs/concepts/key-terms/tracing/distributed-tracing.mdx` — metrics
- `docs/concepts/search/searchable-properties/issues.mdx` — transactions, transaction-summary
- `docs/concepts/search/searchable-properties/events.mdx` — Apdex, User Misery

### Platforms (tracing / overview)

- `docs/platforms/android/tracing/index.mdx` — tracing/overview
- `docs/platforms/android/overhead/index.mdx` — **performance-overhead** → sentry-dashboards
- `docs/platforms/android/enriching-events/transaction-name/index.mdx` — Insights product
- `docs/platforms/apple/common/overhead/index.mdx` — **performance-overhead** → sentry-dashboards
- `docs/platforms/apple/common/features/index.mdx` — Tracing, Mobile Vitals
- `docs/platforms/apple/common/tracing/instrumentation/automatic-instrumentation.mdx` — Mobile Vitals (×2)
- `docs/platforms/apple/common/tracing/instrumentation/swiftui-instrumentation.mdx` — Mobile Vitals TTID/TTFD
- `docs/platforms/apple/common/tracing/instrumentation/performance-metrics.mdx` — custom performance measurements
- `docs/platforms/apple/guides/visionos/features/index.mdx` — Frame rate / mobile-vitals
- `docs/platforms/apple/guides/tvos/features/index.mdx` — Frame rate
- `docs/platforms/apple/guides/macos/features/index.mdx` — Frame rate
- `docs/platforms/dart/common/features/index.mdx` — Tracing/overview
- `docs/platforms/dart/common/tracing/instrumentation/performance-metrics.mdx` — custom performance measurements
- `docs/platforms/dart/common/overhead/index.mdx` — **performance-overhead** → sentry-dashboards
- `docs/platforms/dart/guides/flutter/tracing/index.mdx` — tracing/overview
- `docs/platforms/dart/guides/flutter/tracing/instrumentation/performance-metrics.mdx` — (if present; verify)
- `docs/platforms/dart/guides/flutter/overhead/index.mdx` — **performance-overhead** → sentry-dashboards
- `docs/platforms/dotnet/common/tracing/index.mdx` — tracing/overview
- `docs/platforms/dotnet/common/enriching-events/transaction-name/index.mdx` — Insights product
- `docs/platforms/javascript/common/configuration/integrations/browsertracing.mdx` — tracing/overview
- `docs/platforms/javascript/common/tracing/instrumentation/automatic-instrumentation.mdx` — Mobile Vitals, Web Vitals
- `docs/platforms/powershell/tracing/instrumentation/performance-metrics.mdx` — custom performance measurements
- `docs/platforms/react-native/tracing/instrumentation/performance-metrics.mdx` — custom performance measurements
- `docs/platforms/react-native/tracing/instrumentation/time-to-display.mdx` — Mobile Vitals TTID/TTFD
- `docs/platforms/react-native/tracing/instrumentation/automatic-instrumentation.mdx` — Mobile Vitals, Web Vitals
- `docs/platforms/react-native/overhead/index.mdx` — **performance-overhead** → sentry-dashboards
- `docs/platforms/react-native/enriching-events/transaction-name/index.mdx` — Insights product
- `docs/platforms/ruby/common/migration.mdx` — tracing/overview
- `docs/platforms/rust/common/tracing/index.mdx` — Insights
- `docs/platforms/unity/tracing/index.mdx` — tracing/overview
- `docs/platforms/unity/tracing/instrumentation/performance-metrics.mdx` — custom performance measurements
- `docs/platforms/unreal/tracing/index.mdx` — tracing/overview

### Guides & other

- `docs/guides/custom-spans.mdx` — Sentry Agent Monitoring (`/product/insights/ai/agents/`) → use `/ai/monitoring/agents/` (or current AI doc URL)
- `docs/contributing/approach/sdk-docs/write-getting-started.mdx` — points to insights getting-started; update path to sentry-dashboards getting-started (or index)

### Develop-docs (optional)

- `develop-docs/backend/application-domains/transaction-clustering/index.mdx` — Insights product, metrics
- `develop-docs/sdk/telemetry/traces/opentelemetry.mdx` — performance monitoring product

### Middleware and redirects

- **`src/middleware.ts`:**  
  - Change every `to: '/product/insights/...'` to the new destination (see path mapping).  
  - `to: '/product/insights/performance-overhead/'` → `to: '/product/dashboards/sentry-dashboards/'`.  
  - `to: '/product/insights/retention-priorities/'` → `to: '/organization/dynamic-sampling/'`.  
  - Remove or replace redirect to `/product/insights/overview/trends/` (e.g. send `/product/performance/trends/` to `/product/dashboards/sentry-dashboards/`).
- **`redirects.js`:** Add redirects for all old `/product/insights/*` URLs to the new sentry-dashboards paths. `redirects.js` already has `product/insights/retention-priorities/` → `organization/dynamic-sampling/`; add the rest of the insights → sentry-dashboards mappings.

---

## Product naming (Insights → Sentry dashboards)

Where the **product** is named "Insights," change to "Sentry dashboards" (or "Sentry Dashboards" where appropriate). Examples:

- "Insights" (standalone) → "Sentry dashboards"
- "Insights tab" → "Sentry Dashboards tab" or "dashboards"
- "Insights Overview" → "Sentry Dashboards" or "Sentry dashboards overview" (depending on context after merge)
- "Insights and Tracing" → "Sentry dashboards and Tracing" or "Sentry Dashboards and tracing"
- "Insight Domain" → "Sentry dashboards domain" or rephrase
- "Insights for Mobile Vitals" → "Sentry dashboards for Mobile Vitals" or "Mobile Vitals in Sentry Dashboards"
- "[Insights](/product/insights/)" → "[Sentry dashboards](/product/dashboards/sentry-dashboards/)"

**Files to review for naming (in addition to link updates above):**

- `docs/product/insights/*` (content that moves into sentry-dashboards): replace "Insights" with "Sentry dashboards" in titles, descriptions, and body.
- `docs/product/sentry-basics/performance-monitoring.mdx` — "Insights" pages
- `docs/product/issues/issue-details/performance-issues/index.mdx` — "Insights and Tracing"
- `docs/product/crons/alerts-backend-insights-migration.mdx` — "Insights > Backend"
- `docs/concepts/key-terms/key-terms.mdx` — "Insights Overview"
- `docs/concepts/key-terms/tracing/index.mdx` — "Insights" page, "Sentry's Insights"
- `docs/platforms/dotnet/common/enriching-events/transaction-name/index.mdx` — "Insights product"
- `docs/platforms/react-native/enriching-events/transaction-name/index.mdx` — "Insights product"
- `docs/platforms/android/enriching-events/transaction-name/index.mdx` — "Insights product"
- `docs/product/pricing/legacy-pricing.mdx` — "Insights features"

---

## Performance Overhead

- **Page:** `docs/product/insights/performance-overhead.mdx` is deleted; content merged or summarized in Sentry dashboards index.
- **Redirect:** Add (in `redirects.js` or middleware):  
  `/product/insights/performance-overhead/` → `/product/dashboards/sentry-dashboards/`
- **Links to update (→ `/product/dashboards/sentry-dashboards/`):**
  - `docs/platforms/android/overhead/index.mdx`
  - `docs/platforms/apple/common/overhead/index.mdx`
  - `docs/platforms/dart/common/overhead/index.mdx`
  - `docs/platforms/dart/guides/flutter/overhead/index.mdx`
  - `docs/platforms/react-native/overhead/index.mdx`
- **Middleware:** Update rule that sends old performance-overhead URL to insights; point to sentry-dashboards instead.

---

## Summary checklist

- [ ] Move/merge all content from `docs/product/insights/` to `docs/product/dashboards/sentry-dashboards/` per migration plan (including single `queues.mdx`, merged outbound-api-requests, etc.).
- [ ] Migrate `img` folders with each moved doc; fix image paths in MDX.
- [ ] Update every link in the "Files to update" list to use new paths (path mapping table).
- [ ] Replace product name "Insights" with "Sentry dashboards" in moved content and in the "Product naming" files.
- [ ] Add redirects for all old `/product/insights/*` URLs to new sentry-dashboards URLs (redirects.js and/or middleware).
- [ ] Performance overhead: redirect + update 5 platform overhead docs.
- [ ] Middleware: retention-priorities → `/organization/dynamic-sampling/`; trends → remove or send to sentry-dashboards.
- [ ] Fix widgets.mdx Queries link: `/product/insights/queries` → `/product/dashboards/sentry-dashboards/backend/queries/` (in migrated/salvaged content).
- [ ] AI: ensure any remaining `/product/insights/ai/*` links point to current `docs/ai` URLs (e.g. `/ai/monitoring/agents/`).
