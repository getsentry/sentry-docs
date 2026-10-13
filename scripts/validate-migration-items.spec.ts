import {spawnSync} from 'child_process';
import {
  copyFileSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from 'fs';
import {tmpdir} from 'os';
import path from 'path';
import {pathToFileURL} from 'url';
import {afterEach, beforeEach, describe, expect, it} from 'vitest';

import {loadItems} from './validate-migration-items.mjs';

describe('migration collections', () => {
  it.each(['javascript-v11', 'flutter-v10'])('validates %s', collection => {
    const {items, errors} = loadItems(process.cwd(), collection);
    expect(items.length).toBeGreaterThan(0);
    expect(errors).toEqual([]);
  });

  it('includes every Flutter checklist item exactly once in the full guide', () => {
    const {items} = loadItems(process.cwd(), 'flutter-v10');
    const guide = readFileSync(
      'docs/platforms/dart/guides/flutter/migration/v9-to-v10/index.mdx',
      'utf8'
    );
    const included = [...guide.matchAll(/name="migration\/flutter-v10\/([^"]+)"/g)]
      .map(match => match[1])
      .sort();
    expect(included).toEqual(items.map(item => item.file.replace(/\.mdx$/, '')).sort());
  });
});

describe('migration item validator CLI', () => {
  let root: string;

  beforeEach(() => {
    root = mkdtempSync(path.join(tmpdir(), 'migration validator #'));
    mkdirSync(path.join(root, 'scripts'));
    mkdirSync(path.join(root, 'includes/migration/javascript-v11'), {recursive: true});
    mkdirSync(path.join(root, 'docs/platforms/javascript/guides'), {recursive: true});
    copyFileSync(
      'scripts/validate-migration-items.mjs',
      path.join(root, 'scripts/validate-migration-items.mjs')
    );
    symlinkSync(path.resolve('node_modules'), path.join(root, 'node_modules'), 'dir');
    copyFileSync(
      'includes/migration/javascript-v11/node-version.mdx',
      path.join(root, 'includes/migration/javascript-v11/node-version.mdx')
    );
  });

  afterEach(() => {
    rmSync(root, {recursive: true, force: true});
  });

  function runValidator() {
    return spawnSync(process.execPath, ['scripts/validate-migration-items.mjs'], {
      cwd: root,
      encoding: 'utf8',
    });
  }

  it('runs from a relative path in a directory with URL-sensitive characters', () => {
    const result = runValidator();
    expect(result.status).toBe(0);
    expect(result.stdout).toContain('1 migration items');
    expect(result.stdout).toContain('All items valid.');
  });

  it('exits unsuccessfully when an item is invalid', () => {
    writeFileSync(
      path.join(root, 'includes/migration/javascript-v11/node-version.mdx'),
      '---\nid: wrong-id\n---\n\nA migration item.\n'
    );
    const result = runValidator();
    expect(result.status).toBe(1);
    expect(result.stdout).toContain('id "wrong-id" does not match filename');
  });

  it('does not run the CLI when imported', () => {
    const url = pathToFileURL(path.join(root, 'scripts/validate-migration-items.mjs'));
    const result = spawnSync(
      process.execPath,
      ['--input-type=module', '-e', `await import(${JSON.stringify(url.href)});`],
      {cwd: root, encoding: 'utf8'}
    );
    expect(result.status).toBe(0);
    expect(result.stdout).toBe('');
  });
});
