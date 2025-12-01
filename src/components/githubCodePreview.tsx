'use client';

import {useEffect, useState} from 'react';

import {CodeBlock} from './codeBlock';
import {CodeTabs} from './codeTabs';
import {codeToJsx} from './highlightCode';

interface GitHubCodePreviewProps {
  /**
   * GitHub blob URL with optional line numbers
   * Examples:
   * - https://github.com/owner/repo/blob/main/src/file.ts#L10-L20
   * - https://github.com/owner/repo/blob/abc123/src/file.ts#L5
   */
  url: string;
}

interface ParsedGitHubUrl {
  owner: string;
  path: string;
  ref: string;
  repo: string;
  endLine?: number;
  startLine?: number;
}

function parseGitHubUrl(url: string): ParsedGitHubUrl | null {
  try {
    const urlObj = new URL(url);

    // Check if it's a GitHub URL
    if (urlObj.hostname !== 'github.com') {
      return null;
    }

    // Parse pathname: /owner/repo/blob/ref/path/to/file
    const pathParts = urlObj.pathname.split('/').filter(Boolean);

    if (pathParts.length < 5 || pathParts[2] !== 'blob') {
      return null;
    }

    const owner = pathParts[0];
    const repo = pathParts[1];
    const ref = pathParts[3];
    const path = pathParts.slice(4).join('/');

    // Parse line numbers from hash (#L10-L20 or #L10)
    let startLine: number | undefined;
    let endLine: number | undefined;

    if (urlObj.hash) {
      const lineMatch = urlObj.hash.match(/^#L(\d+)(?:-L(\d+))?$/);
      if (lineMatch) {
        startLine = parseInt(lineMatch[1], 10);
        endLine = lineMatch[2] ? parseInt(lineMatch[2], 10) : startLine;
      }
    }

    return {owner, repo, ref, path, startLine, endLine};
  } catch {
    return null;
  }
}

function getLanguageFromPath(path: string): string {
  const ext = path.split('.').pop()?.toLowerCase();

  // Map file extensions to supported languages
  const langMap: Record<string, string> = {
    js: 'javascript',
    jsx: 'javascript',
    ts: 'typescript',
    tsx: 'typescript',
    json: 'json',
    sh: 'bash',
    bash: 'bash',
    py: 'python',
  };

  return langMap[ext || ''] || 'text';
}

async function fetchGitHubContent(parsed: ParsedGitHubUrl): Promise<string | null> {
  try {
    // Use GitHub raw content URL - encode path segments to handle special characters
    const encodedPath = parsed.path
      .split('/')
      .map(segment => encodeURIComponent(segment))
      .join('/');
    const rawUrl = `https://raw.githubusercontent.com/${encodeURIComponent(parsed.owner)}/${encodeURIComponent(parsed.repo)}/${encodeURIComponent(parsed.ref)}/${encodedPath}`;

    const response = await fetch(rawUrl);

    if (!response.ok) {
      return null;
    }

    const content = await response.text();

    // Extract specific lines if specified
    if (parsed.startLine && parsed.endLine) {
      const lines = content.split('\n');
      const selectedLines = lines.slice(parsed.startLine - 1, parsed.endLine);
      return selectedLines.join('\n');
    }

    return content;
  } catch {
    return null;
  }
}

export function GitHubCodePreview({url}: GitHubCodePreviewProps) {
  const [code, setCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [parsed, setParsed] = useState<ParsedGitHubUrl | null>(null);

  useEffect(() => {
    const loadCode = async () => {
      setLoading(true);
      setError(null);

      const parsedUrl = parseGitHubUrl(url);

      if (!parsedUrl) {
        setError('Invalid GitHub URL');
        setLoading(false);
        return;
      }

      setParsed(parsedUrl);

      const content = await fetchGitHubContent(parsedUrl);

      if (content === null) {
        setError('Failed to fetch code from GitHub');
        setLoading(false);
        return;
      }

      setCode(content);
      setLoading(false);
    };

    loadCode();
  }, [url]);

  if (loading) {
    return (
      <div style={{padding: '1rem', color: 'var(--gray-500)'}}>
        Loading code from GitHub...
      </div>
    );
  }

  if (error || !parsed || !code) {
    return (
      <div style={{padding: '1rem', color: 'var(--red-500)'}}>
        {error || 'Failed to load code'}
      </div>
    );
  }

  const language = getLanguageFromPath(parsed.path);
  const filename = parsed.path.split('/').pop() || parsed.path;
  const lineInfo =
    parsed.startLine && parsed.endLine
      ? `#L${parsed.startLine}${parsed.startLine !== parsed.endLine ? `-L${parsed.endLine}` : ''}`
      : '';

  return (
    <CodeTabs>
      <CodeBlock filename={filename + lineInfo} language={language} externalLink={url}>
        <pre className={`language-${language}`}>
          <code>{codeToJsx(code, language)}</code>
        </pre>
      </CodeBlock>
    </CodeTabs>
  );
}
