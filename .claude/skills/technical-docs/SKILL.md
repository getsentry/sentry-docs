---
name: technical-docs
description: Write and review technical documentation for Sentry SDK docs. Use when creating, editing, or reviewing documentation pages, especially MDX files in docs/platforms/.
---

# Technical Documentation Writing

## Core Principles

### 1. Lead with "Why", Then "How"

Every section must answer: **Why would a developer need this?**

Bad:
```
## Server Actions
Use `captureException` in Server Actions to report errors.
```

Good:
```
## Server Actions
Server Actions that return error states to the client catch errors before Sentry sees them.
Report these manually so you don't lose visibility.
```

### 2. Structure by User Intent, Not API Surface

Organize around what developers are trying to do, not around API methods.

Bad structure (API-centric):
- captureException
- captureMessage
- withScope

Good structure (intent-centric):
- Errors that need manual capture (and why)
- Adding context to errors
- Troubleshooting missing errors

### 3. Avoid Redundant Examples

If the same pattern appears in multiple sections, consolidate it.

**Ask yourself:** "Am I showing the same code pattern again? If yes, reference the earlier example instead."

Bad:
```
## Error Boundaries
Sentry.captureException(error);

## Server Actions
Sentry.captureException(error);

## API Routes
Sentry.captureException(error);
```

Good:
```
## Where Manual Capture is Needed

These Next.js patterns catch errors before Sentry sees them:
- Error boundaries (error.tsx files)
- Server Actions returning error states
- API routes with custom error responses

[Single example with explanation of the pattern]
```

### 4. Be Precise About When/Why

Don't just show code. Explain the specific condition that requires this approach.

Bad:
```
Add captureException to report these errors.
```

Good:
```
Next.js error boundaries intercept errors before they bubble up to Sentry's global handler.
Without manual capture here, these errors silently disappear from your Sentry dashboard.
```

### 5. Concise for Humans, Complete for Context

Write clearly and concisely. Long pages with repeated patterns lose readers.

- Keep explanatory text short and direct
- One code example per concept (not per location)
- Use TL;DR summaries for long sections
- Prefer bullet points over prose for lists

### 6. Best Practices as Guidance, Not Repetition

Best practices should add new information, not repeat earlier examples.

Bad best practice:
```
## Best Practices
### Use captureException in Error Boundaries
[same code shown earlier]
```

Good best practice:
```
## Quick Reference
- Error boundaries: Required for visibility (errors intercepted by Next.js)
- Server errors: Automatic unless you return custom responses
- Client errors: Automatic for unhandled exceptions
```

## Sentry Docs Specific Patterns

### SplitLayout Usage

Use `<SplitLayout>` for side-by-side text/code when:
- The code directly illustrates the text
- Both are needed to understand the concept

Don't use when:
- Showing a directory structure (use plain code block)
- The text is just "here's an example" (just show the code)

### PlatformLink Usage

Link to related docs rather than repeating content:
```
For automatic tracing, see <PlatformLink to="/configuration/apis/">API Reference</PlatformLink>.
```

### Code Block Meta Flags

Always include filename when showing file-specific code:
```tsx {filename:app/error.tsx}
```

Consecutive fenced code blocks are automatically grouped into tabbed code snippets.
Each tab can have a title and filename:

~~~
```swift {tabTitle:Swift}
SentrySDK.capture(error: error)
```

```objc {tabTitle:Objective-C}
[SentrySDK captureError:error];
```
~~~

#### Markdown Export and `{mdExpandTabs}`

The `.md` export (mainly used by LLMs via the "Copy page" button) **collapses tab groups
by default**: only the first tab is included, with a note listing the other tabs
(e.g. *Other available variations of the above snippet: yarn, pnpm*). This keeps context lean when tabs show
trivial variations an LLM can infer on its own.

Add `{mdExpandTabs}` to the first code fence in a group when the tabs contain code an LLM
**cannot reliably derive** from seeing just one tab. This is rare — most times, adding only
one tab to the produced `.md` is enough.

**Primary test:** Would an LLM reading only the first tab produce a correct and complete implementation for the other tabs? If yes → collapse. If it'd miss something (an absent integration, a required import, a structurally different API) → expand.

**Expand** — structural or content differences the LLM cannot infer:
- Different runtimes or environments that require distinct setup flows (e.g. edge vs serverless vs traditional server)
- Different API wrappers for the same conceptual operation (e.g. async vs sync handlers, different cloud function signatures)
- Tabs that represent mutually exclusive approaches a developer must consciously choose between
- When the choice has meaningful implications and the alternative approach wouldn't be obvious from the first tab alone (e.g., global vs. per-instance hooks, scoped vs. unscoped tracking)
- Library or framework versions with incompatible imports or APIs
- Deployment context splits (client/server, frontend/backend) where each context includes or omits entire integrations — not just the same code with a different import
- Different platform targets (mobile/web/desktop) that require distinct SDKs or build steps
- Different installation paradigms with fundamentally different integration patterns (e.g. package import vs CDN script tag vs loader callback)
- SDK major version migrations where the API has changed

**Collapse** (default) — an LLM can figure it out from one tab:
- Package manager alternatives (e.g. npm/yarn/pnpm, pip/uv) — same concept, different tool name
- Module format variants (e.g. ESM/CommonJS) — same API, different import syntax
- Configuration file format alternatives (e.g. JSON/TOML, YAML/properties) — same keys, different syntax
- Same-platform language pairs where translation is mechanical (e.g. Java/Kotlin, Swift/Objective-C). Expand only if the tabs use APIs that differ structurally between the languages, not just syntactically.
- Import path variants where only the package scope or sub-path changes but the API is identical
- Build tool alternatives where only dependency declaration syntax differs (e.g. Gradle/Maven)

~~~
// EXPAND: different installation paradigms — an LLM reading only the NPM tab
// cannot derive the CDN tab (different file, different callback, no import)
```javascript {tabTitle:NPM} {mdExpandTabs}
import * as Sentry from "@sentry/browser";

Sentry.init({ dsn: "..." });
```
```html {tabTitle:CDN}
<script src="https://browser.sentry-cdn.com/x.y.z/bundle.min.js"></script>
<script>
  Sentry.onLoad(function () {
    Sentry.init({ dsn: "..." });
  });
</script>
```

// COLLAPSE: same-platform language pair, translation is mechanical — no {mdExpandTabs}
```swift {tabTitle:Swift}
SentrySDK.start { options in
    options.dsn = "..."
    options.tracesSampleRate = 1.0
}
```
```objc {tabTitle:Objective-C}
[SentrySDK startWithConfigureOptions:^(SentryOptions *options) {
    options.dsn = @"...";
    options.tracesSampleRate = @1.0;
}];
```
~~~

## Review Checklist

When reviewing documentation:

- [ ] Does each section explain WHY before HOW?
- [ ] Is the same code pattern shown multiple times? (consolidate if yes)
- [ ] Would a developer know WHEN to use this approach?
- [ ] Can any section be shortened without losing meaning?
- [ ] Are best practices adding new info or just repeating?
