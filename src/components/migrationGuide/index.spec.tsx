import {readFileSync} from 'fs';
import matter from 'gray-matter';
import React from 'react';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';

const {context} = vi.hoisted(() => ({
  context: {
    platform: undefined as {type: string; name: string; categories: string[]} | undefined,
  },
}));

vi.mock('sentry-docs/docTree', () => ({
  getCurrentPlatformOrGuide: () => context.platform,
}));
vi.mock('sentry-docs/serverContext', () => ({
  serverContext: () => ({rootNode: {}, path: ''}),
}));
vi.mock('sentry-docs/mdx', () => ({
  getFileBySlugWithCache: (slug: string) => {
    const {data, content} = matter(readFileSync(`${slug}.mdx`, 'utf8'));
    return {frontMatter: data, mdxSource: content};
  },
}));
vi.mock('sentry-docs/getMDXComponent', () => ({getMDXComponent: vi.fn()}));
vi.mock('sentry-docs/mdxComponents', () => ({mdxComponents: () => ({})}));
vi.mock('./client', () => ({MigrationGuideClient: () => null}));

import {MigrationGuide} from './index';

describe('migration guide collection selection', () => {
  afterEach(() => vi.unstubAllGlobals());

  beforeEach(() => {
    vi.stubGlobal('React', React);
    context.platform = undefined;
  });

  it('preserves the default JavaScript collection and existing saved progress key', async () => {
    const result = await MigrationGuide({});
    expect(result.props.storageKey).toBe('sentry-v11-migration:javascript');
    expect(result.props.items.some(item => item.id === 'node-version')).toBe(true);
    expect(
      result.props.items.some(item => item.id === 'apple-swift-package-manager')
    ).toBe(false);
  });

  it('loads all Flutter steps with independent saved progress', async () => {
    context.platform = {type: 'guide', name: 'flutter', categories: []};
    const result = await MigrationGuide({migration: 'flutter-v10'});
    expect(result.props.storageKey).toBe('sentry-flutter-v10-migration:flutter');
    expect(result.key).toBe(result.props.storageKey);
    expect(result.props.items).toHaveLength(17);
    expect(
      result.props.items.some(item => item.id === 'apple-swift-package-manager')
    ).toBe(true);
    expect(result.props.items.some(item => item.id === 'node-version')).toBe(false);
    expect(result.props.bodies.map(item => item.id)).toEqual(
      result.props.items.map(item => item.id)
    );
  });

  it('keeps JavaScript progress scoped to the selected framework', async () => {
    context.platform = {type: 'guide', name: 'nextjs', categories: ['browser', 'server']};
    const result = await MigrationGuide({});
    expect(result.props.storageKey).toBe('sentry-v11-migration:nextjs');
    expect(result.key).toBe(result.props.storageKey);
  });
});
