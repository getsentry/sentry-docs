import {describe, expect, test} from 'vitest';

import {DocNode} from './docTree';
import {getSdkPageHeading} from './sdkPageHeading';
import {FrontMatter} from './types';

function makeTree() {
  const root: DocNode = {
    path: '/',
    slug: '',
    frontmatter: {slug: 'home', title: 'Home'},
    children: [],
    missing: false,
  };
  const nodes = new Map<string, DocNode>([['', root]]);

  function add(path: string, title: string, extra: Partial<FrontMatter> = {}) {
    const parts = path.split('/');
    const parent = nodes.get(parts.slice(0, -1).join('/'));
    if (!parent) {
      throw new Error(`Missing parent for ${path}`);
    }
    const node: DocNode = {
      path,
      slug: parts.at(-1)!,
      frontmatter: {slug: path, title, ...extra},
      children: [],
      missing: false,
      parent,
    };
    parent.children.push(node);
    nodes.set(path, node);
  }

  add('platforms', 'Platforms');
  add('platforms/javascript', 'JavaScript');
  add('platforms/javascript/guides', 'Guides');
  add('platforms/javascript/guides/react', 'React');
  add('platforms/javascript/guides/nextjs', 'Next.js');
  add('platforms/javascript/guides/effect', 'Effect');
  add('platforms/javascript/guides/aws-lambda', 'AWS Lambda');
  add('platforms/javascript/guides/custom-integration', '');
  nodes.get('platforms/javascript/guides/custom-integration')!.missing = true;
  add('platforms/javascript/guides/custom-integration/configuration', 'Configuration');
  add('platforms/javascript/guides/custom-integration__v7.x', 'Old Guide');
  add('platforms/dotnet', '.NET');
  add('platforms/dotnet/guides', 'Guides');
  add('platforms/dotnet/guides/aws-lambda', 'AWS Lambda');
  add('platforms/dotnet/guides/custom-integration', '');
  nodes.get('platforms/dotnet/guides/custom-integration')!.missing = true;
  add('platforms/dotnet/guides/custom-integration/configuration', 'Configuration');
  add('platforms/php', 'PHP');
  add('platforms/php__v7.x', 'Old PHP');
  add('platforms/php/configuration', 'Configuration');
  add('platforms/javascript/guides/nextjs/tracing', 'Set Up Tracing');
  add('platforms/javascript/guides/effect/session-replay', 'Set Up Session Replay');
  add('platforms/javascript/guides/effect/session-replay/configuration', 'Configuration');
  add('platforms/javascript/guides/effect/user-feedback', 'Set Up User Feedback');
  add('platforms/javascript/guides/effect/user-feedback/configuration', 'Configuration');
  add('platforms/javascript/guides/react/session-replay', 'Set Up Session Replay');
  add('platforms/javascript/guides/react/session-replay/configuration', 'Configuration');
  add('platforms/javascript/guides/react/user-feedback', 'Set Up User Feedback');
  add('platforms/javascript/guides/react/user-feedback/configuration', 'Configuration');
  add(
    'platforms/javascript/guides/react/user-feedback/configuration__v7.x',
    'Old Configuration'
  );
  add('platforms/javascript/guides/react/configuration', 'Extended Configuration', {
    h1_title: 'React SDK Configuration',
  });
  add('product', 'Product');
  add('product/configuration', 'Configuration');

  return {root, nodes};
}

describe('getSdkPageHeading', () => {
  const {root, nodes} = makeTree();
  function heading(path: string) {
    return getSdkPageHeading(root, path.split('/'), nodes.get(path)!.frontmatter);
  }

  test('names platform and guide landing pages without redundant topic suffixes', () => {
    expect(heading('platforms/php')).toBe('Sentry for PHP');
    expect(heading('platforms/javascript/guides/react')).toBe('Sentry for React');
    expect(heading('platforms/javascript/guides/aws-lambda')).toBe(
      'Sentry for AWS Lambda (JavaScript)'
    );
    expect(heading('platforms/dotnet/guides/aws-lambda')).toBe(
      'Sentry for AWS Lambda (.NET)'
    );
  });

  test('adds the SDK context and disambiguates topics repeated within a guide', () => {
    expect(heading('platforms/php/configuration')).toBe('Configuration for PHP');
    expect(heading('platforms/javascript/guides/nextjs/tracing')).toBe(
      'Set Up Tracing for Next.js'
    );
    expect(
      heading('platforms/javascript/guides/effect/session-replay/configuration')
    ).toBe('Session Replay Configuration for Effect');
    expect(
      heading('platforms/javascript/guides/effect/user-feedback/configuration')
    ).toBe('User Feedback Configuration for Effect');
  });

  test('uses the current page heading on versioned pages and labels the SDK version', () => {
    expect(heading('platforms/php__v7.x')).toBe('Sentry for PHP (SDK v7.x)');
    expect(
      heading('platforms/javascript/guides/react/user-feedback/configuration__v7.x')
    ).toBe('User Feedback Configuration for React (SDK v7.x)');
  });

  test('falls back to guide slugs when a guide root has no index page', () => {
    expect(heading('platforms/javascript/guides/custom-integration/configuration')).toBe(
      'Configuration for Custom Integration (JavaScript)'
    );
    expect(heading('platforms/dotnet/guides/custom-integration/configuration')).toBe(
      'Configuration for Custom Integration (.NET)'
    );
    expect(heading('platforms/javascript/guides/custom-integration__v7.x')).toBe(
      'Sentry for Custom Integration (JavaScript) (SDK v7.x)'
    );
  });

  test('supports an H1 override without changing titles outside SDK docs', () => {
    expect(heading('platforms/javascript/guides/react/configuration')).toBe(
      'React SDK Configuration'
    );
    expect(heading('product/configuration')).toBe('Configuration');
  });
});
