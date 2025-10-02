import {promises as fs} from 'node:fs';
import path from 'node:path';

import {buildDocUrl} from '../../shared/docs-utils';

const SEARCH_INDEX_PATH = path.join(process.cwd(), 'public', 'search-index.json');

type RawSearchIndexEntry = {
  content: string;
  hierarchy: string[];
  path: string;
  summary: string;
  title: string;
};

type SearchIndexFile = {
  entries: RawSearchIndexEntry[];
  generatedAt: string;
  total: number;
};

export type SearchMatch = {
  hierarchy: string[];
  matchedTokens: number;
  path: string;
  score: number;
  snippet: string | null;
  summary: string;
  title: string;
};

type CachedEntry = RawSearchIndexEntry & {
  contentLower: string;
  hierarchyLower: string[];
  pathLower: string;
  titleLower: string;
};

let searchIndexPromise: Promise<CachedEntry[]> | null = null;

async function loadSearchIndexInternal(): Promise<CachedEntry[]> {
  const raw = await fs.readFile(SEARCH_INDEX_PATH, 'utf8');
  const parsed = JSON.parse(raw) as SearchIndexFile;
  return parsed.entries.map(entry => ({
    ...entry,
    pathLower: entry.path.toLowerCase(),
    titleLower: entry.title.toLowerCase(),
    hierarchyLower: entry.hierarchy.map(segment => segment.toLowerCase()),
    contentLower: entry.content.toLowerCase(),
  }));
}

export function ensureSearchIndex(): Promise<CachedEntry[]> {
  if (!searchIndexPromise) {
    searchIndexPromise = loadSearchIndexInternal().catch(error => {
      searchIndexPromise = null;
      throw error;
    });
  }

  return searchIndexPromise;
}

function scoreEntry(entry: CachedEntry, tokens: string[]) {
  let score = 0;
  let matchedTokens = 0;

  for (const token of tokens) {
    let tokenMatched = false;

    if (entry.titleLower.includes(token)) {
      score += 6;
      tokenMatched = true;
    }

    if (entry.pathLower.includes(token)) {
      score += 4;
      tokenMatched = true;
    }

    if (entry.hierarchyLower.some(segment => segment.includes(token))) {
      score += 3;
      tokenMatched = true;
    }

    if (entry.contentLower.includes(token)) {
      score += 1;
      tokenMatched = true;
    }

    if (tokenMatched) {
      matchedTokens += 1;
    }
  }

  if (matchedTokens === 0) {
    return null;
  }

  score += getInstallBias(entry);

  return {score, matchedTokens};
}

function buildSnippet(entry: CachedEntry, tokens: string[]): string | null {
  const lines = entry.content.split(/\r?\n/);
  for (const line of lines) {
    const lineLower = line.toLowerCase();
    if (tokens.some(token => lineLower.includes(token))) {
      const trimmed = line.trim();
      if (trimmed.length === 0) {
        continue;
      }
      return trimmed.length > 200 ? `${trimmed.slice(0, 199)}…` : trimmed;
    }
  }
  return null;
}

export async function searchIndex(query: string, limit: number): Promise<SearchMatch[]> {
  const tokens = query
    .toLowerCase()
    .split(/\s+/)
    .map(token => token.trim())
    .filter(Boolean);

  if (tokens.length === 0) {
    return [];
  }

  const entries = await ensureSearchIndex();
  const matches: SearchMatch[] = [];

  for (const entry of entries) {
    const scoreResult = scoreEntry(entry, tokens);
    if (!scoreResult) {
      continue;
    }

    matches.push({
      path: entry.path,
      title: entry.title,
      hierarchy: entry.hierarchy,
      summary: entry.summary,
      snippet: buildSnippet(entry, tokens),
      score: scoreResult.score,
      matchedTokens: scoreResult.matchedTokens,
    });
  }

  matches.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    if (b.matchedTokens !== a.matchedTokens) {
      return b.matchedTokens - a.matchedTokens;
    }
    return a.path.localeCompare(b.path);
  });

  return matches.slice(0, limit);
}

function getInstallBias(entry: CachedEntry): number {
  const segments = entry.pathLower.split('/');
  const fileName = segments[segments.length - 1] ?? '';
  const baseName = fileName.replace(/\.md$/, '');

  let bias = 0;

  // Top-level platform doc like "platforms/react.md"
  if (segments[0] === 'platforms' && segments.length === 2) {
    bias += 40;
  }

  // JavaScript guide root doc like "platforms/javascript/guides/react.md"
  if (
    segments[0] === 'platforms' &&
    segments[1] === 'javascript' &&
    segments[2] === 'guides' &&
    segments.length === 4
  ) {
    bias += 50;
  }

  // Files under an install directory get a boost
  if (segments.includes('install')) {
    bias += 20;
  }

  // Common install filenames get additional weight
  if (['install', 'installation', 'setup', 'getting-started'].includes(baseName)) {
    bias += 25;
  }

  return bias;
}

export function formatMatchAsBlock(match: SearchMatch): string {
  const header = `# ${match.hierarchy.join(' > ')}`;
  const link = `[${match.title}](${match.path})`;
  const lines = [header, link];

  if (match.snippet) {
    lines.push(match.snippet);
  }

  return lines.join('\n');
}

export function mapMatchToResponse(match: SearchMatch) {
  return {
    path: match.path,
    title: match.title,
    hierarchy: match.hierarchy,
    summary: match.summary,
    snippet: match.snippet,
    url: buildDocUrl(match.path),
    score: match.score,
    matchedTokens: match.matchedTokens,
  };
}
