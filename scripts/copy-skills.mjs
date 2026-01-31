// Copies skill files from .claude/skills/ to public/.well-known/skills/
// Run as part of build to work around Vercel not supporting symlinks
import {cpSync, mkdirSync} from 'fs';
import {dirname, join} from 'path';
import {fileURLToPath} from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const skills = [
  {
    from: '.claude/skills/sentry-docs/SKILL.md',
    to: 'public/.well-known/skills/sentry-docs/SKILL.md',
  },
  {
    from: '.claude/skills/sentry-docs/data-model.md',
    to: 'public/.well-known/skills/sentry-docs/data-model.md',
  },
  {
    from: '.claude/skills/sentry-docs/platforms.md',
    to: 'public/.well-known/skills/sentry-docs/platforms.md',
  },
  {
    from: '.claude/skills/technical-docs/SKILL.md',
    to: 'public/.well-known/skills/technical-docs/SKILL.md',
  },
  {
    from: '.claude/skills/docs-review/SKILL.md',
    to: 'public/.well-known/skills/docs-review/SKILL.md',
  },
];

for (const {from, to} of skills) {
  const dest = join(root, to);
  mkdirSync(dirname(dest), {recursive: true});
  cpSync(join(root, from), dest);
}

console.log('✅ Copied skill files to public/.well-known/skills/');
