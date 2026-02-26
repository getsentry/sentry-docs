# Agent Instructions

## Package Manager
Use **yarn**: `yarn install`, `yarn dev`, `yarn build`, `yarn test`

## Git Commits

When creating commits, follow this exact workflow:

1. **Check status**: Run `git status` and `git diff` to see changes
2. **Draft message**: Write commit message following conventional commits format
3. **⚠️ ADD CO-AUTHOR**: Append to commit body:
   ```
   Co-Authored-By: Cursor AI <cursor@cursor.sh>
   ```
4. **Stage files**: `git add` relevant files  
5. **Commit**: Run the commit command with message that includes Co-Authored-By

**Example commit command:**
```bash
git commit -m "$(cat <<'EOF'
feat: Add new feature

Description of changes.

Co-Authored-By: Cursor AI <cursor@cursor.sh>
EOF
)"
```

**IMPORTANT**: The Co-Authored-By line is REQUIRED in every AI-assisted commit. Do NOT skip step 3.

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

## Developer Documentation (develop-docs/)

When writing requirements in `develop-docs/`:

1. **Use RFC 2119 Keywords**: Use "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD", "SHOULD NOT", "RECOMMENDED", "MAY", and "OPTIONAL" as defined in [RFC 2119](https://www.ietf.org/rfc/rfc2119.txt). These keywords **MUST** be written in uppercase and bold, for example: **MUST**, **SHOULD**, **MAY**.

2. **Add RFC 2119 Alert**: When creating a new file with requirements, or adding requirements to an existing file, ensure the file has an Alert at the top (after frontmatter) to clarify RFC 2119 usage. If missing, add:
   ```mdx
   <Alert>
     This document uses key words such as "MUST", "SHOULD", and "MAY" as defined in [RFC 2119](https://www.ietf.org/rfc/rfc2119.txt) to indicate requirement levels.
   </Alert>
   ```

## Plan Mode

- Make the plan extremely concise. Sacrifice grammar for the sake of concision.
- At the end of each plan, give me a list of unresolved questions to answer, if any.

## Pull Request generation

Use .github/PULL_REQUEST_TEMPLATE.md and, if your AI tool provides a Co-Authored-By line, add it to the PR description.
