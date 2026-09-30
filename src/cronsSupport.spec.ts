import {readFileSync} from 'node:fs';

import {describe, expect, test} from 'vitest';

import {readGuideConfig} from './guideConfig';
import {getGuideSupportKeys, isPlatformSupported} from './platformSupport';

const source = readFileSync('docs/platforms/javascript/common/crons/index.mdx', 'utf8');
const sections = [
  ...source.matchAll(/<PlatformSection (supported|notSupported)=\{(\[[^\]]*\])\}>/g),
];

function parseKeys(value: string): string[] {
  return JSON.parse(value.replace(/'/g, '"'));
}

const [sdkSection, httpSection] = sections.map(([, prop, value]) => ({
  [prop]: parseKeys(value),
}));

async function renderedSections(guide: string) {
  const config = await readGuideConfig(`docs/platforms/javascript/guides/${guide}`);
  const keys = getGuideSupportKeys('javascript', guide, new Map([[guide, config]]));
  return {
    sdk: isPlatformSupported(keys, sdkSection),
    http: isPlatformSupported(keys, httpSection),
  };
}

describe('crons setup sections', () => {
  test('has complementary SDK and HTTP sections', () => {
    expect(sections).toHaveLength(2);
    expect(sdkSection.supported).toEqual(httpSection.notSupported);
  });

  test.each([
    'bun',
    'deno',
    'cloudflare',
    'node',
    'express',
    'aws-lambda',
    'nestjs',
    'azure-functions',
    'nextjs',
    'sveltekit',
    'remix',
    'astro',
    'tanstackstart-react',
  ])('shows SDK setup for %s', async guide => {
    expect(await renderedSections(guide)).toEqual({sdk: true, http: false});
  });

  test.each(['nuxt', 'react-router', 'solidstart', 'effect'])(
    'keeps HTTP check-in setup for %s',
    async guide => {
      expect(await renderedSections(guide)).toEqual({sdk: false, http: true});
    }
  );
});
