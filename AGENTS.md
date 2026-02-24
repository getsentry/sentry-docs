# Agent Instructions

## Package Manager

Use **pnpm**: `pnpm install`, `pnpm dev`, `pnpm build`, `pnpm test`

## Commit Attribution

AI commits MUST include:

```
Co-Authored-By: Claude <noreply@anthropic.com>
```

## Development

- `pnpm dev` - Start dev server with Sentry sidecar
- `pnpm dev:minimal` - Start dev server without sidecar
- `pnpm build` - Production build
- `pnpm test` - Run tests with vitest
- `pnpm lint` - Run all linters
- `pnpm lint:fix` - Auto-fix lint issues

## Tech Stack

- Next.js 15 with App Router
- React 19
- TypeScript
- Tailwind CSS
- MDX for documentation content
- Sentry SDK (`@sentry/nextjs`)

## Project Structure

- `app/` - Next.js app router pages and layouts
- `src/` - Source code (components, utilities)
- `docs/` - MDX documentation content
- `develop-docs/` - Developer documentation (submodule)
- `includes/` - Reusable MDX includes
- `platform-includes/` - Platform-specific MDX content
- `public/` - Static assets

## Code Style

- ESLint + Prettier enforced via pre-commit hooks
- Use TypeScript strict mode
- Follow existing patterns in codebase

## Testing

Run `pnpm test` for vitest. Tests live alongside source files or in `__tests__` directories.

## CLI Commands

| Command              | Description      |
| -------------------- | ---------------- |
| `make develop`       | Initial setup    |
| `make test`          | Run tests        |
| `pnpm lint:ts`       | TypeScript check |
| `pnpm lint:eslint`   | ESLint check     |
| `pnpm lint:prettier` | Prettier check   |

## Developer Documentation (develop-docs/)

When writing requirements in `develop-docs/`:

1. **Use RFC 2119 Keywords**: Use "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD", "SHOULD NOT", "RECOMMENDED", "MAY", and "OPTIONAL" as defined in [RFC 2119](https://www.ietf.org/rfc/rfc2119.txt). These keywords **MUST** be written in uppercase and bold, for example: **MUST**, **SHOULD**, **MAY**.

2. **Add RFC 2119 Alert**: When creating a new file with requirements, or adding requirements to an existing file, ensure the file has an Alert at the top (after frontmatter) to clarify RFC 2119 usage. If missing, add:
   ```mdx
   <Alert>
     This document uses key words such as "MUST", "SHOULD", and "MAY" as defined
     in [RFC 2119](https://www.ietf.org/rfc/rfc2119.txt) to indicate requirement
     levels.
   </Alert>
   ```

## Content Authoring

- **ALWAYS** run `/brand-guidelines` to audit any user-facing content before committing. See `.agents/skills/brand-guidelines/SKILL.md`
- Use `docs-review` skill for Sentry style and voice review. See `.claude/skills/docs-review/SKILL.md`
- Use `technical-docs` skill when writing or reviewing SDK documentation. See `.claude/skills/technical-docs/SKILL.md`

## LLM-Friendly MD Exports

- Every page at `docs.sentry.io/<path>` has a `.md` export at `docs.sentry.io/<path>.md`
- `scripts/generate-md-exports.mjs` generates these as a post-build step
- Frontmatter metadata (title, description, URL) is emitted as a YAML frontmatter block in MD exports — pages missing descriptions lose LLM relevance signal
- MDX override templates live in `md-overrides/`
- Architecture spec: `specs/llm-friendly-docs.md`

## Plan Mode

- Make the plan extremely concise. Sacrifice grammar for the sake of concision.
- At the end of each plan, give me a list of unresolved questions to answer, if any.

## Pull Request generation

Use .github/PULL_REQUEST_TEMPLATE.md and add Co-Authored-By: Claude
