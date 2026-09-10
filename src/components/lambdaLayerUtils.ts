import type {LayerData} from 'sentry-docs/build/awsLambdaLayerRegistry';
import type {Runtime} from 'sentry-docs/build/awsLambdaRuntimes';

type RuntimeVersion = {
  language: 'node' | 'python';
  major: number;
  minor?: number;
};

export type Layer = {
  accountNumber: string;
  canonical: string;
  compatibleRuntimes: string[];
  layerName: string;
  regions: Array<{layerVersion: string; region: string}>;
  runtime: string;
  sdkVersion: string;
};

function compareSdkVersions(a: string, b: string): number {
  const aParts = a.split(/[+-]/)[0].split('.').map(Number);
  const bParts = b.split(/[+-]/)[0].split('.').map(Number);
  for (let index = 0; index < Math.max(aParts.length, bParts.length); index++) {
    const difference = (bParts[index] ?? 0) - (aParts[index] ?? 0);
    if (difference !== 0) {
      return difference;
    }
  }
  return b.localeCompare(a);
}

export function sortSdkVersions(versions: string[]): string[] {
  return [...new Set(versions)].sort(compareSdkVersions);
}

export function normalizeLayer(layer: LayerData): Layer {
  return {
    accountNumber: layer.account_number,
    canonical: layer.canonical,
    compatibleRuntimes: layer.compatible_runtimes,
    layerName: layer.layer_name,
    regions: layer.regions
      .map(region => ({
        layerVersion: region.layer_version,
        region: region.region,
      }))
      .sort((a, b) => a.region.localeCompare(b.region)),
    runtime: layer.runtime,
    sdkVersion: layer.sdk_version,
  };
}

function parseRuntime(runtime: string): RuntimeVersion | undefined {
  const pythonMatch = /^python(\d+)\.(\d+)$/.exec(runtime);
  if (pythonMatch) {
    return {
      language: 'python',
      major: Number(pythonMatch[1]),
      minor: Number(pythonMatch[2]),
    };
  }

  const nodeMatch = /^nodejs(\d+)\.x$/.exec(runtime);
  if (nodeMatch) {
    return {
      language: 'node',
      major: Number(nodeMatch[1]),
    };
  }

  return undefined;
}

function compareRuntimeVersions(a: string, b: string): number {
  const aVersion = parseRuntime(a);
  const bVersion = parseRuntime(b);

  if (!aVersion || !bVersion) {
    return a.localeCompare(b);
  }

  if (aVersion.language !== bVersion.language) {
    return aVersion.language.localeCompare(bVersion.language);
  }

  const majorDifference = aVersion.major - bVersion.major;
  if (majorDifference !== 0) {
    return majorDifference;
  }

  return (aVersion.minor ?? 0) - (bVersion.minor ?? 0);
}

export function sortRuntimes(runtimes: string[]): string[] {
  return [...new Set(runtimes)].sort((a, b) => compareRuntimeVersions(b, a));
}

export function makeLayerArn({
  accountNumber,
  layerName,
  layerVersion,
  region,
}: {
  accountNumber: string;
  layerName: string;
  layerVersion: string;
  region: string;
}): string {
  return `arn:aws:lambda:${region}:${accountNumber}:layer:${layerName}:${layerVersion}`;
}

function formatRuntime(runtime: string): string {
  const parsed = parseRuntime(runtime);
  if (!parsed) {
    return runtime;
  }

  if (parsed.language === 'python') {
    return `Python ${parsed.major}.${parsed.minor}`;
  }

  return `Node.js ${parsed.major}.x`;
}

export function formatRuntimeRanges(runtimes: string[]): string {
  const groups = new Map<string, RuntimeVersion[]>();
  const unknownRuntimes: string[] = [];

  for (const runtime of runtimes) {
    const parsed = parseRuntime(runtime);
    if (!parsed) {
      unknownRuntimes.push(runtime);
      continue;
    }

    const key = parsed.language === 'python' ? `python:${parsed.major}` : 'node';
    const group = groups.get(key);
    if (group) {
      group.push(parsed);
    } else {
      groups.set(key, [parsed]);
    }
  }

  const ranges = [...groups.values()].flatMap(group => {
    const language = group[0].language;
    const step = language === 'node' ? 2 : 1;
    const versions = [
      ...new Map(group.map(version => [runtimeNumber(version), version])).values(),
    ].sort((a, b) => runtimeNumber(a) - runtimeNumber(b));
    const segments: Array<{start: RuntimeVersion; end: RuntimeVersion}> = [];

    for (const version of versions) {
      const previous = segments.at(-1);
      if (previous && runtimeNumber(version) - runtimeNumber(previous.end) === step) {
        previous.end = version;
      } else {
        segments.push({start: version, end: version});
      }
    }

    return segments.map(({start, end}) => formatRuntimeRange(start, end));
  });

  return [...ranges, ...unknownRuntimes].join(', ');
}

function runtimeNumber(runtime: RuntimeVersion): number {
  return runtime.language === 'python'
    ? runtime.major * 100 + (runtime.minor ?? 0)
    : runtime.major;
}

function formatRuntimeRange(start: RuntimeVersion, end: RuntimeVersion): string {
  if (start.language === 'python') {
    const first = `${start.major}.${start.minor}`;
    const last = `${end.major}.${end.minor}`;
    return first === last ? `Python ${first}` : `Python ${first}-${last}`;
  }

  const first = `${start.major}.x`;
  const last = `${end.major}.x`;
  return first === last ? `Node.js ${first}` : `Node.js ${first}-${last}`;
}

function isDeprecationWithinSixMonths(deprecationDate: string): boolean {
  const parsedDate = Date.parse(deprecationDate);
  if (Number.isNaN(parsedDate)) {
    return false;
  }

  const now = new Date();
  const cutoff = new Date(now);
  cutoff.setMonth(cutoff.getMonth() + 6);
  return parsedDate >= now.getTime() && parsedDate <= cutoff.getTime();
}

export function formatRuntimeOption(runtime: string, lifecycle?: Runtime): string {
  const label = formatRuntime(runtime);
  if (lifecycle?.lifecycle === 'deprecated') {
    return `${label} (deprecated by AWS)`;
  }
  if (lifecycle?.lifecycle === 'preview') {
    return `${label} (preview)`;
  }
  if (
    lifecycle?.lifecycle === 'supported' &&
    lifecycle.deprecationDate &&
    lifecycle.deprecationDate !== 'Not scheduled' &&
    isDeprecationWithinSixMonths(lifecycle.deprecationDate)
  ) {
    return `${label} (deprecates ${lifecycle.deprecationDate})`;
  }
  return label;
}
