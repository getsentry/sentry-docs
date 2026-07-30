import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

import {extractDocsLinks, resolveDocsPath, routeExists} from './doc-link-contract.mjs';

function fixture() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'doc-link-contract-'));
  fs.mkdirSync(path.join(root, 'docs', 'new'), {recursive: true});
  fs.writeFileSync(path.join(root, 'docs', 'new', 'index.mdx'), '---\ntitle: New\n---\n');
  fs.mkdirSync(path.join(root, 'docs', 'platforms', 'javascript', 'common'), {
    recursive: true,
  });
  fs.writeFileSync(
    path.join(root, 'docs', 'platforms', 'javascript', 'config.yml'),
    'title: JavaScript\n'
  );
  fs.writeFileSync(
    path.join(root, 'docs', 'platforms', 'javascript', 'common', 'index.mdx'),
    '---\ntitle: JavaScript\n---\n'
  );
  fs.writeFileSync(
    path.join(root, 'redirects.js'),
    `module.exports = {userDocsRedirects: [
      {source: '/old/:path*', destination: '/new/:path*'},
      {source: '/broken/:path*', destination: '/missing/:path*'},
    ]};\n`
  );
  fs.writeFileSync(
    path.join(root, 'middleware.ts'),
    'const USER_DOCS_REDIRECTS: Redirect[] = [];\n'
  );
  return root;
}

test('resolves parameterized redirects to an existing page', () => {
  const root = fixture();
  try {
    assert.deepEqual(resolveDocsPath(root, '/old/'), {
      chain: ['/old/', '/new/'],
      finalPath: '/new/',
      status: 'valid',
    });
  } finally {
    fs.rmSync(root, {recursive: true, force: true});
  }
});

test('reports a redirect whose final route is missing', () => {
  const root = fixture();
  try {
    assert.equal(resolveDocsPath(root, '/broken/child/').status, 'missing');
  } finally {
    fs.rmSync(root, {recursive: true, force: true});
  }
});

test('recognizes generated platform roots', () => {
  const root = fixture();
  try {
    assert.equal(routeExists(root, '/platforms/javascript/'), true);
  } finally {
    fs.rmSync(root, {recursive: true, force: true});
  }
});

test('extracts literal docs links and ignores templates', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'doc-link-consumer-'));
  try {
    fs.writeFileSync(
      path.join(root, 'links.ts'),
      [
        'const valid = "https://docs.sentry.io/product/issues/";',
        'const template = `https://docs.sentry.io/${path}`;',
        'const next = "https://docs.sentry.io/_next/:path*";',
      ].join('\n')
    );
    assert.deepEqual(
      extractDocsLinks(root).map(link => link.pathname),
      ['/product/issues/']
    );
  } finally {
    fs.rmSync(root, {recursive: true, force: true});
  }
});
