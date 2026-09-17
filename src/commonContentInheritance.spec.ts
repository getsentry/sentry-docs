import {mkdir, mkdtemp, rm, writeFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';

import {afterAll, beforeAll, describe, expect, test} from 'vitest';

import {getDocsFrontMatterFromDirectory} from './frontmatter';
import {getAllFilesFrontMatter, getSourcePathsBySlug} from './mdx';

let fixtureRoot: string;
let docsPath: string;

const frontmatter = (title: string, config = '') => `---
title: ${title}
${config}---

Test content.
`;

beforeAll(async () => {
  fixtureRoot = await mkdtemp(path.join(tmpdir(), 'sentry-docs-inheritance-'));
  docsPath = path.join(fixtureRoot, 'docs');

  const platformPath = path.join(docsPath, 'platforms', 'test');
  const commonPath = path.join(platformPath, 'common');
  const guidesPath = path.join(platformPath, 'guides');
  const guideNames = ['index-opt-out', 'config-opt-out', 'default', 'override'];

  await Promise.all([
    mkdir(commonPath, {recursive: true}),
    ...guideNames.map(guideName =>
      mkdir(path.join(guidesPath, guideName), {recursive: true})
    ),
  ]);

  await Promise.all([
    writeFile(path.join(commonPath, 'index.mdx'), frontmatter('Common index')),
    writeFile(
      path.join(commonPath, 'index__v1.0.0.mdx'),
      frontmatter('Versioned common index')
    ),
    writeFile(path.join(commonPath, 'common-only.mdx'), frontmatter('Common only')),
    writeFile(
      path.join(guidesPath, 'index-opt-out', 'index.mdx'),
      frontmatter('Index opt-out', 'inheritCommonContent: false\n')
    ),
    writeFile(
      path.join(guidesPath, 'index-opt-out', 'own-page.mdx'),
      frontmatter('Index opt-out own page')
    ),
    writeFile(
      path.join(guidesPath, 'config-opt-out', 'index.mdx'),
      frontmatter('Config opt-out')
    ),
    writeFile(
      path.join(guidesPath, 'config-opt-out', 'config.yml'),
      'inheritCommonContent: false\n'
    ),
    writeFile(
      path.join(guidesPath, 'config-opt-out', 'own-page.mdx'),
      frontmatter('Config opt-out own page')
    ),
    writeFile(path.join(guidesPath, 'default', 'index.mdx'), frontmatter('Default')),
    writeFile(
      path.join(guidesPath, 'override', 'index.mdx'),
      frontmatter('Override', 'inheritCommonContent: false\n')
    ),
    writeFile(
      path.join(guidesPath, 'override', 'config.yml'),
      'inheritCommonContent: true\n'
    ),
  ]);
});

afterAll(async () => {
  await rm(fixtureRoot, {recursive: true, force: true});
});

describe.each([
  ['doctree collector', getDocsFrontMatterFromDirectory],
  ['search collector', getAllFilesFrontMatter],
])('common content inheritance in the %s', (_, collectFrontmatter) => {
  test('keeps guide-owned pages and omits common pages for both opt-out locations', async () => {
    const slugs = new Set(
      (await collectFrontmatter(docsPath)).map(({slug}) => slug.replace(/\/index$/, ''))
    );

    expect(slugs.has('platforms/test/guides/index-opt-out')).toBe(true);
    expect(slugs.has('platforms/test/guides/index-opt-out/own-page')).toBe(true);
    expect(slugs.has('platforms/test/guides/index-opt-out/common-only')).toBe(false);

    expect(slugs.has('platforms/test/guides/config-opt-out')).toBe(true);
    expect(slugs.has('platforms/test/guides/config-opt-out/own-page')).toBe(true);
    expect(slugs.has('platforms/test/guides/config-opt-out/common-only')).toBe(false);
  });

  test('preserves default inheritance and config.yml precedence', async () => {
    const slugs = new Set(
      (await collectFrontmatter(docsPath)).map(({slug}) => slug.replace(/\/index$/, ''))
    );

    expect(slugs.has('platforms/test/guides/default/common-only')).toBe(true);
    expect(slugs.has('platforms/test/guides/override/common-only')).toBe(true);
  });
});

describe('getSourcePathsBySlug', () => {
  test('resolves a common page for a default guide', async () => {
    const sourcePaths = await getSourcePathsBySlug(
      'docs/platforms/test/guides/default/common-only',
      fixtureRoot
    );

    expect(sourcePaths).toContain(
      path.join(docsPath, 'platforms', 'test', 'common', 'common-only.mdx')
    );
  });

  test.each(['index-opt-out', 'config-opt-out'])(
    'does not resolve a common page for the %s guide',
    async guideName => {
      const sourcePaths = await getSourcePathsBySlug(
        `docs/platforms/test/guides/${guideName}/common-only`,
        fixtureRoot
      );
      const commonPath = path.join(docsPath, 'platforms', 'test', 'common');

      expect(
        sourcePaths.some(sourcePath => sourcePath.startsWith(commonPath + path.sep))
      ).toBe(false);
    }
  );

  test('does not bypass the opt-out for a versioned guide root', async () => {
    const inheritedPaths = await getSourcePathsBySlug(
      'docs/platforms/test/guides/default__v1.0.0',
      fixtureRoot
    );
    const optedOutPaths = await getSourcePathsBySlug(
      'docs/platforms/test/guides/index-opt-out__v1.0.0',
      fixtureRoot
    );
    const versionedCommonPath = path.join(
      docsPath,
      'platforms',
      'test',
      'common',
      'index__v1.0.0.mdx'
    );

    expect(inheritedPaths).toContain(versionedCommonPath);
    expect(
      optedOutPaths.some(sourcePath =>
        sourcePath.startsWith(path.dirname(versionedCommonPath) + path.sep)
      )
    ).toBe(false);
  });
});
