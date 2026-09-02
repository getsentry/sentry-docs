import {makeFetchCache} from './fetchCache';

const RUNTIMES_URL = 'https://docs.aws.amazon.com/lambda/latest/dg/lambda-runtimes.md';

type RuntimeLifecycle = 'deprecated' | 'preview' | 'supported';

export type Runtime = {
  deprecationDate?: string;
  identifier: string;
  lifecycle: RuntimeLifecycle;
};

const FALLBACK_RUNTIMES: Runtime[] = [
  {
    identifier: 'nodejs24.x',
    lifecycle: 'supported',
    deprecationDate: 'Apr 30, 2028',
  },
  {
    identifier: 'nodejs22.x',
    lifecycle: 'supported',
    deprecationDate: 'Apr 30, 2027',
  },
  ...[
    'nodejs20.x',
    'nodejs18.x',
    'nodejs16.x',
    'nodejs14.x',
    'nodejs12.x',
    'nodejs10.x',
  ].map(identifier => ({
    identifier,
    lifecycle: 'deprecated' as const,
  })),
  {
    identifier: 'python3.14',
    lifecycle: 'supported',
    deprecationDate: 'Jun 30, 2029',
  },
  {
    identifier: 'python3.13',
    lifecycle: 'supported',
    deprecationDate: 'Jun 30, 2029',
  },
  {
    identifier: 'python3.12',
    lifecycle: 'supported',
    deprecationDate: 'Oct 31, 2028',
  },
  {
    identifier: 'python3.11',
    lifecycle: 'supported',
    deprecationDate: 'Jun 30, 2027',
  },
  {
    identifier: 'python3.10',
    lifecycle: 'supported',
    deprecationDate: 'Oct 31, 2026',
  },
  ...['python3.9', 'python3.8', 'python3.7'].map(identifier => ({
    identifier,
    lifecycle: 'deprecated' as const,
  })),
];

const fetchRuntimeDocument = makeFetchCache<string>({
  name: 'AWS Lambda runtimes',
  dataUrl: RUNTIMES_URL,
  parseResponse: response => response.text(),
});

let runtimeDataPromise: Promise<Runtime[]> | undefined;

function cleanCell(value: string): string {
  return value.trim().replace(/^`|`$/g, '').trim();
}

function getMarkdownSection(markdown: string, heading: string): string | undefined {
  const start = markdown.indexOf(`## ${heading}`);
  if (start === -1) {
    return undefined;
  }

  const end = markdown.indexOf('\n## ', start + heading.length + 3);
  return markdown.slice(start, end === -1 ? undefined : end);
}

function getPreviewRuntimeNames(supportedSection: string): Set<string> {
  const match = supportedSection.match(
    /The (.+?) runtimes? (?:is|are) in \*\*public preview\*\*/i
  );
  if (!match) {
    return new Set();
  }

  return new Set(
    match[1]
      .split(/,|\band\b/)
      .map(name => name.trim())
      .filter(Boolean)
  );
}

function parseRuntimeTable(
  markdownSection: string,
  lifecycle: Exclude<RuntimeLifecycle, 'preview'>,
  previewNames: Set<string> = new Set()
): Runtime[] {
  return markdownSection
    .split('\n')
    .filter(line => line.trimStart().startsWith('|'))
    .map(line => line.split('|').slice(1, -1).map(cleanCell))
    .filter(
      cells =>
        cells.length === 6 &&
        cells[0] !== 'Name' &&
        !cells.every(cell => /^-+$/.test(cell))
    )
    .map(([name, identifier, , deprecationDate]) => ({
      identifier,
      deprecationDate,
      lifecycle: previewNames.has(name) ? 'preview' : lifecycle,
    }));
}

function parseRuntimes(markdown: string): Runtime[] {
  const supportedSection = getMarkdownSection(markdown, 'Supported runtimes');
  const deprecatedSection = getMarkdownSection(markdown, 'Deprecated runtimes');
  if (!supportedSection || !deprecatedSection) {
    throw new Error('AWS Lambda runtime tables were not found');
  }

  const runtimes = [
    ...parseRuntimeTable(
      supportedSection,
      'supported',
      getPreviewRuntimeNames(supportedSection)
    ),
    ...parseRuntimeTable(deprecatedSection, 'deprecated'),
  ];
  if (!runtimes.some(runtime => runtime.lifecycle === 'supported')) {
    throw new Error('AWS Lambda supported runtime table was empty');
  }

  return runtimes;
}

async function loadRuntimes(): Promise<Runtime[]> {
  try {
    const document = await fetchRuntimeDocument();
    if (!document) {
      throw new Error('AWS Lambda runtime document was empty');
    }
    return parseRuntimes(document);
  } catch (error) {
    console.warn(
      'Unable to load AWS Lambda runtime lifecycle data. Using the fallback runtime list.',
      error
    );
    return FALLBACK_RUNTIMES;
  }
}

export function getRuntimes(): Promise<Runtime[]> {
  runtimeDataPromise ??= loadRuntimes();
  return runtimeDataPromise;
}
