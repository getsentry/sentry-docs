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

### Code Block Filenames

Always include filename when showing file-specific code:
```tsx {filename:app/error.tsx}
```

## Review Checklist

When reviewing documentation:

- [ ] Does each section explain WHY before HOW?
- [ ] Is the same code pattern shown multiple times? (consolidate if yes)
- [ ] Would a developer know WHEN to use this approach?
- [ ] Can any section be shortened without losing meaning?
- [ ] Are best practices adding new info or just repeating?
