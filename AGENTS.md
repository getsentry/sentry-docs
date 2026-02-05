# Agent Instructions

## Package Manager
Use **yarn**: `yarn install`, `yarn dev`, `yarn build`, `yarn test`

## Commit Attribution
AI commits MUST include:
```
Co-Authored-By: Claude <noreply@anthropic.com>
```

## Development
- `yarn dev` - Start dev server with Sentry sidecar
- `yarn dev:minimal` - Start dev server without sidecar
- `yarn build` - Production build
- `yarn test` - Run tests with vitest
- `yarn lint` - Run all linters
- `yarn lint:fix` - Auto-fix lint issues

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
Run `yarn test` for vitest. Tests live alongside source files or in `__tests__` directories.

## CLI Commands
| Command | Description |
|---------|-------------|
| `make develop` | Initial setup |
| `make test` | Run tests |
| `yarn lint:ts` | TypeScript check |
| `yarn lint:eslint` | ESLint check |
| `yarn lint:prettier` | Prettier check |

## Documentation Writing Style

When writing or editing documentation content in `docs/`:

### Tone & Voice
- **Supportive Peer:** Write like a developer talking to another developer. Use "we" to include both author and reader.
- **Direct & Honest:** Avoid corporate fluff ("best-in-class", "leverage", "synergy"). If something is a workaround, call it that.
- **Inclusive:** Use gender-neutral language. Use "they/them" for the reader.

### Stylistic Rules
- **American English:** Use U.S. spelling (color, organize, center).
- **Scannability:** Short paragraphs (2-3 sentences max). Use bullet points for lists.
- **Active Voice:** "Sentry groups similar errors" not "Similar errors are grouped by Sentry."
- **Headings:** Use Title Case for all heading levels. Never stack headlines without body text between them.

### Formatting
- **Code First:** Show code examples, then explain them.
- **Bold for Emphasis:** Use **bold** for UI elements and key actions.
- **UI References:** Click **Save Changes**, go to **Settings > Projects**.

### Word Choice
- Use "blocklist/allowlist" not "blacklist/whitelist"
- Use "master/secondary", "primary/secondary" not "master/slave"
- Use "to" not "in order to"
- Use "use" not "utilize"
- Verb forms: "set up" (verb) vs "setup" (noun), "log in" vs "login"

For the complete style guide, see: https://docs.sentry.io/contributing/approach/style-guide/

## Developer Documentation (develop-docs/)

When writing requirements in `develop-docs/`:

1. **Use RFC 2119 Keywords**: Use "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD", "SHOULD NOT", "RECOMMENDED", "MAY", and "OPTIONAL" as defined in [RFC 2119](https://www.ietf.org/rfc/rfc2119.txt). These keywords **MUST** be written in uppercase and bold, for example: **MUST**, **SHOULD**, **MAY**.

2. **Add RFC 2119 Alert**: When creating a new file with requirements, or adding requirements to an existing file, ensure the file has an Alert at the top (after frontmatter) to clarify RFC 2119 usage. If missing, add:
   ```mdx
   <Alert>
     This document uses key words such as "MUST", "SHOULD", and "MAY" as defined in [RFC 2119](https://www.ietf.org/rfc/rfc2119.txt) to indicate requirement levels.
   </Alert>
   ```
