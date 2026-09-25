import {readFileSync} from 'node:fs';

import matter from 'gray-matter';
import {describe, expect, test} from 'vitest';

import {readGuideConfig} from './guideConfig';
import {getGuideSupportKeys, isPlatformSupported} from './platformSupport';

const configurationPath = 'docs/platforms/javascript/common/configuration';
const eventLoopBlock = matter(
  readFileSync(`${configurationPath}/event-loop-block.mdx`, 'utf8')
).data;
const anr = matter(
  readFileSync(`${configurationPath}/integrations/anr.mdx`, 'utf8')
).data;

async function supportKeys(guide: string) {
  const config = await readGuideConfig(`docs/platforms/javascript/guides/${guide}`);
  return {
    keys: getGuideSupportKeys('javascript', guide, new Map([[guide, config]])),
    categories: config.categories,
  };
}

describe('event loop block detection page support', () => {
  test.each([
    'azure-functions',
    'electron',
    'nextjs',
    'nuxt',
    'solidstart',
    'sveltekit',
    'remix',
    'react-router',
    'astro',
    'tanstackstart-react',
  ])(
    'preserves the ANR documentation link for %s without a Node fallback',
    async guide => {
      const {keys, categories} = await supportKeys(guide);
      expect(keys).not.toContain('javascript.node');
      expect(isPlatformSupported(keys, anr, categories)).toBe(true);
      expect(isPlatformSupported(keys, eventLoopBlock, categories)).toBe(true);
    }
  );

  test.each([
    'node',
    'eve',
    'mastra',
    'aws-lambda',
    'express',
    'fastify',
    'gcp-functions',
    'hapi',
    'hono',
    'koa',
    'nestjs',
  ])('preserves Node-family coverage for %s', async guide => {
    const {keys, categories} = await supportKeys(guide);
    expect(isPlatformSupported(keys, eventLoopBlock, categories)).toBe(true);
  });

  test.each(['react', 'vue', 'bun', 'deno', 'cloudflare'])(
    'does not broaden coverage to %s',
    async guide => {
      const {keys, categories} = await supportKeys(guide);
      expect(isPlatformSupported(keys, eventLoopBlock, categories)).toBe(false);
    }
  );
});
