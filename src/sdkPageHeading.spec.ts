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
  add('platforms/javascript/guides/cloudflare', 'Cloudflare');
  add('platforms/javascript/guides/cloudflare/frameworks', 'Frameworks on Cloudflare');
  add('platforms/javascript/guides/cloudflare/frameworks/astro', 'Astro on Cloudflare');
  add('platforms/javascript/guides/cloudflare/frameworks/hono', 'Hono on Cloudflare');
  add('platforms/javascript/guides/cloudflare/frameworks/nuxt', 'Nuxt on Cloudflare');
  add(
    'platforms/javascript/guides/cloudflare/frameworks/nuxt__v7.x',
    'Old Nuxt on Cloudflare'
  );
  add(
    'platforms/javascript/guides/cloudflare/frameworks/nextjs',
    'Next.js on Cloudflare'
  );
  add(
    'platforms/javascript/guides/cloudflare/frameworks/cloudflareflare',
    'Cloudflareflare'
  );
  add('platforms/javascript/guides/cloudflare/frameworks/configuration', 'Configuration');
  add('platforms/javascript/guides/effect', 'Effect');
  add('platforms/javascript/guides/aws-lambda', 'AWS Lambda');
  add('platforms/javascript/guides/custom-integration', '');
  nodes.get('platforms/javascript/guides/custom-integration')!.missing = true;
  add('platforms/javascript/guides/custom-integration/configuration', 'Configuration');
  add('platforms/javascript/guides/custom-integration__v7.x', 'Old Guide');
  add('platforms/dotnet', '.NET');
  add('platforms/dotnet/guides', 'Guides');
  add('platforms/dotnet/guides/aws-lambda', 'AWS Lambda');
  add('platforms/dotnet/guides/aws-lambda/aspnet', 'AWS Lambda for .NET');
  add('platforms/dotnet/guides/custom-integration', '');
  nodes.get('platforms/dotnet/guides/custom-integration')!.missing = true;
  add('platforms/dotnet/guides/custom-integration/configuration', 'Configuration');
  add('platforms/java', 'Java');
  add('platforms/java/legacy', 'Legacy SDK');
  add('platforms/java/legacy/logging', 'java.util.logging');
  add('platforms/java/guides', 'Guides');
  add('platforms/java/guides/jul', 'java.util.logging');
  add('platforms/java/guides/jul/legacy', 'Legacy SDK');
  add('platforms/java/guides/jul/legacy/logging', 'java.util.logging');
  add('platforms/go', 'Go');
  add('platforms/go/logs', 'Set Up Logs in Go');
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
  add(
    'platforms/javascript/guides/react/user-feedback/configuration__v8.x',
    'Old Configuration',
    {
      h1_title: 'Legacy User Feedback Configuration for React',
    }
  );
  add('platforms/javascript/guides/react/configuration', 'Extended Configuration', {
    h1_title: 'React SDK Configuration',
  });
  add('platforms/javascript/guides/react/configuration__v7.x', 'Old Configuration', {
    h1_title: 'Legacy React Configuration',
  });
  add('platforms/javascript/guides/react/configuration__v8.x', 'Old Configuration');
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

  test('does not repeat context already present as a complete framework name', () => {
    expect(heading('platforms/javascript/guides/cloudflare/frameworks')).toBe(
      'Frameworks on Cloudflare'
    );
    for (const framework of ['astro', 'hono']) {
      const path = `platforms/javascript/guides/cloudflare/frameworks/${framework}`;
      expect(heading(path)).toBe(nodes.get(path)!.frontmatter.title);
    }
    expect(heading('platforms/javascript/guides/cloudflare/frameworks/nuxt')).toBe(
      'Nuxt on Cloudflare'
    );
    expect(heading('platforms/javascript/guides/cloudflare/frameworks/nextjs')).toBe(
      'Next.js on Cloudflare'
    );
    expect(
      heading('platforms/javascript/guides/cloudflare/frameworks/configuration')
    ).toBe('Frameworks on Cloudflare Configuration');
    expect(
      heading('platforms/javascript/guides/cloudflare/frameworks/cloudflareflare')
    ).toBe('Cloudflareflare for Cloudflare');
    expect(heading('platforms/dotnet/guides/aws-lambda/aspnet')).toBe(
      'AWS Lambda for .NET'
    );
    expect(heading('platforms/java/legacy/logging')).toBe('java.util.logging for Java');
    expect(heading('platforms/java/guides/jul/legacy/logging')).toBe('java.util.logging');
    expect(heading('platforms/go/logs')).toBe('Set Up Logs in Go');
  });

  test('uses the current page heading on versioned pages and labels the SDK version', () => {
    expect(heading('platforms/php__v7.x')).toBe('Sentry for PHP (SDK v7.x)');
    expect(
      heading('platforms/javascript/guides/react/user-feedback/configuration__v7.x')
    ).toBe('User Feedback Configuration for React (SDK v7.x)');
    expect(heading('platforms/javascript/guides/cloudflare/frameworks/nuxt__v7.x')).toBe(
      'Nuxt on Cloudflare (SDK v7.x)'
    );
  });

  test('prefers a version-specific H1 override while retaining the base override as a fallback', () => {
    expect(
      heading('platforms/javascript/guides/react/user-feedback/configuration__v8.x')
    ).toBe('Legacy User Feedback Configuration for React (SDK v8.x)');
    expect(heading('platforms/javascript/guides/react/configuration__v7.x')).toBe(
      'Legacy React Configuration (SDK v7.x)'
    );
    expect(heading('platforms/javascript/guides/react/configuration__v8.x')).toBe(
      'React SDK Configuration (SDK v8.x)'
    );
  });

  test('falls back to guide slugs when a guide root has no index page', () => {
    expect(heading('platforms/javascript/guides/custom-integration/configuration')).toBe(
      'Configuration for Custom Integration'
    );
    expect(heading('platforms/dotnet/guides/custom-integration/configuration')).toBe(
      'Configuration for Custom Integration'
    );
    expect(heading('platforms/javascript/guides/custom-integration__v7.x')).toBe(
      'Sentry for Custom Integration (SDK v7.x)'
    );
  });

  test('does not change headings when other pages or guides are removed', () => {
    const {root: reducedRoot, nodes: reducedNodes} = makeTree();
    const feedback = reducedNodes.get(
      'platforms/javascript/guides/react/user-feedback/configuration'
    )!;
    feedback.parent!.children = feedback.parent!.children.filter(
      child => child !== feedback
    );
    const dotnetLambda = reducedNodes.get('platforms/dotnet/guides/aws-lambda')!;
    dotnetLambda.parent!.children = dotnetLambda.parent!.children.filter(
      child => child !== dotnetLambda
    );

    const replay = 'platforms/javascript/guides/react/session-replay/configuration';
    expect(
      getSdkPageHeading(
        reducedRoot,
        replay.split('/'),
        reducedNodes.get(replay)!.frontmatter
      )
    ).toBe(heading(replay));
    const lambda = 'platforms/javascript/guides/aws-lambda';
    expect(
      getSdkPageHeading(
        reducedRoot,
        lambda.split('/'),
        reducedNodes.get(lambda)!.frontmatter
      )
    ).toBe(heading(lambda));
  });

  test('supports an H1 override without changing titles outside SDK docs', () => {
    expect(heading('platforms/javascript/guides/react/configuration')).toBe(
      'React SDK Configuration'
    );
    expect(heading('product/configuration')).toBe('Configuration');
  });
});
