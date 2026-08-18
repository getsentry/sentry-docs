/**
 * Infers which migration facets apply from a pasted `package.json` and/or
 * `Sentry.init()` block.
 *
 * Ticking boxes by hand is only as accurate as the reader's memory of their own
 * config, and being wrong means a breaking change silently disappears from
 * their guide. Reading it off their actual setup is more reliable, so this is
 * the preferred way to narrow the guide — but the checkboxes work on their own,
 * and a detected result is always overridable by hand.
 *
 * Detection deliberately errs toward false positives: showing an extra section
 * costs a reader some scrolling, whereas a missed one costs them a broken
 * upgrade.
 */

export type DetectionSignal = {
  /** The literal that matched, shown back to the reader so the result is checkable. */
  evidence: string;
  facet: string;
};

/** The guide a pasted dependency list belongs to. */
export type FrameworkMatch = {
  /**
   * Every guide this package serves. `@sentry/node` backs the Express, Fastify,
   * Koa, Hapi, Connect and Firebase guides as well as the Node one, so a match
   * narrows the reader down to a set of pages, not to a single one.
   */
  guides: readonly string[];
  /** The package that matched, quoted back to the reader. */
  pkg: string;
  /** The guide to link to when the reader is on none of `guides`. */
  primary: string;
};

export type Detection = {
  facets: Set<string>;
  /** Undefined when no Sentry SDK package is present. */
  framework: FrameworkMatch | undefined;
  gaps: DetectionGaps;
  signals: DetectionSignal[];
};

export type DetectionGaps = {
  missingInit: boolean;
  missingManifest: boolean;
};

type Rule = {
  facet: string;
  /**
   * Each pattern must carry a capture group or match a literal we can quote
   * back as evidence.
   */
  patterns: RegExp[];
};

const RULES: Rule[] = [
  {
    facet: 'tracing',
    patterns: [
      /\btracesSampleRate\b/,
      /\btracesSampler\b/,
      /\btracePropagationTargets\b/,
      /\bbrowserTracingIntegration\b/,
      /\btraceLifecycle\b/,
      /\bbeforeSendTransaction\b/,
      /\bignoreTransactions\b/,
      /\bbeforeSendSpan\b/,
      /\bstartSpan\b/,
    ],
  },
  {
    facet: 'profiling',
    patterns: [
      /@sentry\/profiling-node/,
      /\bprofilesSampleRate\b/,
      /\bprofilesSampler\b/,
      /\bprofileSessionSampleRate\b/,
      /\bprofileLifecycle\b/,
      /\bnodeProfilingIntegration\b/,
      /\bbrowserProfilingIntegration\b/,
    ],
  },
  {
    facet: 'logs',
    patterns: [
      /\benableLogs\b/,
      /Sentry\.logger\b/,
      /\bconsoleLoggingIntegration\b/,
      /@sentry\/pino-transport/,
    ],
  },
  {
    facet: 'metrics',
    patterns: [/Sentry\.metrics\b/, /\benableMetrics\b/, /\bbeforeSendMetric\b/],
  },
  {
    facet: 'ai-agents',
    patterns: [
      /\bvercelAIIntegration\b/,
      /\bopenAIIntegration\b/,
      /\banthropicAIIntegration\b/,
      /\bgoogleGenAIIntegration\b/,
      /\blangChainIntegration\b/,
      /\blangGraphIntegration\b/,
      /\binstrument(OpenAi|AnthropicAi|GoogleGenAI|WorkersAi)Client\b/,
      /\binstrument(LangGraph|StateGraph)\b/,
      /"(openai|@anthropic-ai\/sdk|@google\/genai|langchain|@langchain\/langgraph|ai)"\s*:/,
    ],
  },
  {
    facet: 'custom-otel',
    patterns: [
      /"@opentelemetry\/[a-z-]+"\s*:/,
      /\bskipOpenTelemetrySetup\b/,
      /\benableOpenTelemetrySetup\b/,
      /\bNodeTracerProvider\b/,
      /\bSentrySpanProcessor\b/,
      /\bSentryContextManager\b/,
      /\bSentrySampler\b/,
      /\botlpIntegration\b/,
      /@sentry\/opentelemetry/,
      /@sentry\/node-core\/light\/otlp/,
    ],
  },
];

/**
 * Guide slugs we can recognize from a pasted dependency list, keyed by the
 * package that identifies them.
 *
 * One package can serve several guides: `@sentry/node` is the SDK behind the
 * Express, Fastify, Koa, Hapi, Connect and Firebase guides, so seeing it does
 * not mean the reader belongs on the Node page. `primary` is only used as the
 * link target when the reader is on none of the guides the package serves.
 *
 * Order matters: framework SDKs are checked before the generic `@sentry/react`,
 * `@sentry/node` and `@sentry/browser`, which they depend on and which
 * therefore appear in a lockfile-flattened dependency list too.
 *
 * `migrationGuide.spec.ts` asserts these guide lists against the `sdk:`
 * frontmatter of every JavaScript guide, so a new guide on an existing SDK
 * cannot silently fall out of the mapping.
 */
export const FRAMEWORK_PACKAGES: Array<{
  guides: readonly string[];
  pattern: RegExp;
  pkg: string;
}> = [
  {pkg: '@sentry/nextjs', guides: ['nextjs'], pattern: /"@sentry\/nextjs"\s*:/},
  {pkg: '@sentry/nuxt', guides: ['nuxt'], pattern: /"@sentry\/nuxt"\s*:/},
  {pkg: '@sentry/sveltekit', guides: ['sveltekit'], pattern: /"@sentry\/sveltekit"\s*:/},
  {pkg: '@sentry/svelte', guides: ['svelte'], pattern: /"@sentry\/svelte"\s*:/},
  {
    pkg: '@sentry/astro',
    guides: ['astro', 'azure-functions'],
    pattern: /"@sentry\/astro"\s*:/,
  },
  {pkg: '@sentry/remix', guides: ['remix'], pattern: /"@sentry\/remix"\s*:/},
  {
    pkg: '@sentry/react-router',
    guides: ['react-router'],
    pattern: /"@sentry\/react-router"\s*:/,
  },
  {
    pkg: '@sentry/solidstart',
    guides: ['solidstart'],
    pattern: /"@sentry\/solidstart"\s*:/,
  },
  {pkg: '@sentry/solid', guides: ['solid'], pattern: /"@sentry\/solid"\s*:/},
  {
    pkg: '@sentry/tanstackstart-react',
    guides: ['tanstackstart-react'],
    pattern: /"@sentry\/tanstackstart-react"\s*:/,
  },
  {pkg: '@sentry/angular', guides: ['angular'], pattern: /"@sentry\/angular"\s*:/},
  {pkg: '@sentry/vue', guides: ['vue'], pattern: /"@sentry\/vue"\s*:/},
  {pkg: '@sentry/ember', guides: ['ember'], pattern: /"@sentry\/ember"\s*:/},
  {pkg: '@sentry/gatsby', guides: ['gatsby'], pattern: /"@sentry\/gatsby"\s*:/},
  {pkg: '@sentry/nestjs', guides: ['nestjs'], pattern: /"@sentry\/nestjs"\s*:/},
  {pkg: '@sentry/nitro', guides: ['nitro'], pattern: /"@sentry\/nitro"\s*:/},
  {pkg: '@sentry/elysia', guides: ['elysia'], pattern: /"@sentry\/elysia"\s*:/},
  {pkg: '@sentry/hono', guides: ['hono'], pattern: /"@sentry\/hono"\s*:/},
  {pkg: '@sentry/effect', guides: ['effect'], pattern: /"@sentry\/effect"\s*:/},
  {
    pkg: '@sentry/cloudflare',
    guides: ['cloudflare'],
    pattern: /"@sentry\/cloudflare"\s*:/,
  },
  {pkg: '@sentry/deno', guides: ['deno'], pattern: /"@sentry\/deno"\s*:/},
  {pkg: '@sentry/bun', guides: ['bun'], pattern: /"@sentry\/bun"\s*:/},
  {
    pkg: '@sentry/aws-serverless',
    guides: ['aws-lambda'],
    pattern: /"@sentry\/aws-serverless"\s*:/,
  },
  {
    pkg: '@sentry/google-cloud-serverless',
    guides: ['gcp-functions'],
    pattern: /"@sentry\/google-cloud-serverless"\s*:/,
  },
  {pkg: '@sentry/react', guides: ['react'], pattern: /"@sentry\/react"\s*:/},
  {
    pkg: '@sentry/node',
    guides: ['node', 'connect', 'express', 'fastify', 'firebase', 'hapi', 'koa'],
    pattern: /"@sentry\/node"\s*:/,
  },
  // The bare browser SDK belongs to the platform page rather than a guide, which
  // `MigrationGuide` identifies as `javascript`.
  {pkg: '@sentry/browser', guides: ['javascript'], pattern: /"@sentry\/browser"\s*:/},
];

/**
 * Reads a pasted setup once and returns everything the UI needs from it.
 *
 * Comments are stripped before matching so that a commented-out option does not
 * count as usage — pasted `Sentry.init` blocks routinely carry commented
 * alternatives, and those describe a setup the reader does not have.
 */
export function detect(text: string): Detection {
  const haystack = stripComments(text);
  const {facets, signals} = matchFacets(haystack);

  return {
    facets,
    signals,
    framework: matchFramework(haystack),
    gaps: findGaps(haystack),
  };
}

/**
 * Removes `//` and block comments without touching `//` that is part of the
 * config itself.
 *
 * A regex cannot do this: `tracePropagationTargets: [/^\/\//]` and a
 * protocol-relative `"//cdn.example.com"` both contain a literal `//` that must
 * survive, and dropping the rest of that line silently loses every option after
 * it — which deselects facets and hides real breaking changes. So this walks the
 * text tracking string literals and escapes instead. Quotes are also closed at a
 * line break, so an apostrophe in prose can at worst affect its own line.
 */
function stripComments(text: string): string {
  let out = '';
  let quote: string | undefined;

  for (let index = 0; index < text.length; index++) {
    const char = text[index];

    if (quote) {
      out += char;
      if (char === '\\') {
        // An escaped character cannot close the literal.
        out += text[index + 1] ?? '';
        index++;
      } else if (char === quote || (char === '\n' && quote !== '`')) {
        quote = undefined;
      }
      continue;
    }

    if (char === '"' || char === "'" || char === '`') {
      quote = char;
      out += char;
      continue;
    }

    if (char === '\\') {
      // Outside a string this is a regex-literal escape such as `\/`; keeping
      // both characters stops the escaped slash from reading as a comment.
      out += char + (text[index + 1] ?? '');
      index++;
      continue;
    }

    if (char === '/' && text[index + 1] === '/' && text[index - 1] !== ':') {
      // Line comment. Leave the newline so line-anchored patterns still work.
      const end = text.indexOf('\n', index);
      if (end === -1) {
        return `${out} `;
      }
      out += ' ';
      index = end - 1;
      continue;
    }

    if (char === '/' && text[index + 1] === '*') {
      const end = text.indexOf('*/', index + 2);
      out += ' ';
      if (end === -1) {
        return out;
      }
      index = end + 1;
      continue;
    }

    out += char;
  }

  return out;
}

function matchFacets(haystack: string): {
  facets: Set<string>;
  signals: DetectionSignal[];
} {
  const facets = new Set<string>();
  const signals: DetectionSignal[] = [];

  for (const rule of RULES) {
    for (const pattern of rule.patterns) {
      const match = haystack.match(pattern);
      if (match) {
        facets.add(rule.facet);
        // Patterns that match a JSON key capture the surrounding quotes and
        // colon; trim them so the evidence reads as the bare identifier.
        signals.push({
          facet: rule.facet,
          evidence: match[0].replace(/^["\s]+|["\s:]+$/g, ''),
        });
        break; // One piece of evidence per facet is enough to show the reader.
      }
    }
  }

  return {facets, signals};
}

/**
 * What the pasted text cannot tell us, so the UI can ask for the missing half.
 *
 * Runtime options such as `tracesSampleRate` only appear in `Sentry.init()`,
 * and installed packages only in a manifest. Pasting one without the other
 * silently under-detects, which deselects facets and hides real breaking
 * changes — the exact failure this feature exists to prevent. Naming the gap is
 * cheaper than guessing at it.
 *
 * `Sentry.init` is matched loosely, because a named `init()` import or a
 * framework wrapper is init too and telling those readers to paste what they
 * just pasted is worse than staying quiet.
 */
function findGaps(haystack: string): DetectionGaps {
  return {
    missingInit: !/(\bSentry\.init\s*\(|\binit\s*\(\s*\{|\bdsn\s*:)/.test(haystack),
    missingManifest: !/"(dependencies|devDependencies)"\s*:/.test(haystack),
  };
}

function matchFramework(haystack: string): FrameworkMatch | undefined {
  const entry = FRAMEWORK_PACKAGES.find(({pattern}) => pattern.test(haystack));
  return entry
    ? {pkg: entry.pkg, guides: entry.guides, primary: entry.guides[0]}
    : undefined;
}
