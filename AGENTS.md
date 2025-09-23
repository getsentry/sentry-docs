# Repository Guidelines

## Project Structure & Module Organization
The Next.js app surface lives in `app/` (App Router) and `src/pages/` for legacy routes, while shared UI and logic sit under `src/components/`, `src/hooks/`, and `src/utils.ts`. Long-form documentation content is authored in `docs/` and `develop-docs/`, with reusable includes in `includes/` and `platform-includes/`. Static assets such as images and favicons belong in `public/`, and build-time helpers or data generators reside in `scripts/` and `src/data/`. Use existing directory patterns when adding new content or features to keep navigation predictable.

## Build, Test & Local Development
Install dependencies with `make develop` (or `yarn` if Volta is already bootstrapped). Run `yarn dev` to serve end-user docs and `yarn dev:developer-docs` when working on developer.sentry content. Confirm production output through `yarn build` and the generated preview with `yarn start`. Quality checks rely on `yarn lint`, while `yarn lint:fix` applies Prettier and ESLint autofixes in one pass.

## Coding Style & Naming Conventions
This repo is TypeScript-first and formats code via Prettier (see `prettier.config.js`) and ESLint (`eslint-config-sentry-docs`). Indent with two spaces, prefer `const`, and author React components as `PascalCase` in dedicated files within `src/components/`. Utility modules and hooks remain `camelCase` (`useTopicNav.tsx`, `docTree.ts`), and MD/MDX files should mirror URL slugs (`docs/platforms/javascript/index.mdx`). Run `yarn lint` before pushing to catch style drift early.

## Testing Guidelines
Unit and integration coverage uses Vitest; colocated specs follow the `*.spec.ts[x]` pattern (for example `src/docTree.spec.ts`). Execute `yarn test` for watch mode during development and `yarn test:ci` for deterministic runs. When adding new rendering or parser behavior, include regression tests beside the affected module to protect the ingest pipeline.

## Commit & Pull Request Workflow
Adopt the prevailing conventional style: `<area>(<scope>): summary (#issue)`, e.g., `docs(godot): Mark screenshot option as experimental (#14988)`. Keep commits focused, describing both the change and reason. Pull requests should link to any tracked issue, summarize user-facing impact, and attach screenshots or local URLs when modifying published docs. Ensure the Netlify/Vercel preview renders correctly before requesting review, and call out redirect or search index updates in the PR body.

## Environment & Configuration Tips
Volta pins Node 22.16.0 and Yarn 1.22.22 (`package.json` > `volta`). Duplicate `.env.example` to `.env.development` to unlock local search and integrations, and rerun `yarn enforce-redirects` whenever adjusting `redirects.js`. Large search updates may require re-running `node scripts/generate-md-exports.mjs` so heatmaps and Algolia exports stay in sync.
