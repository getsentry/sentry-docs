'use client';

import {useEffect, useState} from 'react';
import styles from './githubLinkPreview.module.scss';

interface GitHubFile {
  path: string;
  url: string;
  html_url: string;
  repository: string;
  lines?: {
    start: number;
    end: number;
  };
  content?: string;
  language?: string;
}

interface Props {
  url: string;
}

function parseGitHubUrl(url: string): GitHubFile | null {
  // Match GitHub URLs for files with optional line numbers
  // e.g., https://github.com/getsentry/sentry/blob/master/src/sentry/api/endpoints/organization_details.py#L123-L145
  const fileMatch = url.match(
    /https?:\/\/github\.com\/([\w-]+\/[\w-]+)\/blob\/([\w.-]+)\/(.*?)(?:#L(\d+)(?:-L(\d+))?)?$/
  );

  if (fileMatch) {
    const [, repo, branch, filePath, startLine, endLine] = fileMatch;
    return {
      path: filePath,
      url,
      html_url: url,
      repository: repo,
      lines:
        startLine
          ? {
              start: parseInt(startLine, 10),
              end: endLine ? parseInt(endLine, 10) : parseInt(startLine, 10),
            }
          : undefined,
    };
  }

  return null;
}

export function GitHubLinkPreview({url}: Props) {
  const [fileData, setFileData] = useState<GitHubFile | null>(null);
  const [content, setContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const parsedUrl = parseGitHubUrl(url);
    if (!parsedUrl) {
      setError('Invalid GitHub URL');
      setLoading(false);
      return;
    }

    setFileData(parsedUrl);

    // Fetch file content from our API route
    fetch(`/api/github-preview?url=${encodeURIComponent(url)}`)
      .then(res => {
        if (!res.ok) {
          throw new Error('Failed to fetch file content');
        }
        return res.json();
      })
      .then(data => {
        setContent(data.content);
        setFileData(prev => ({...prev!, language: data.language}));
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [url]);

  if (loading) {
    return (
      <div className={styles.preview}>
        <div className={styles.header}>
          <span className={styles.loading}>Loading preview...</span>
        </div>
      </div>
    );
  }

  if (error || !fileData) {
    // Fallback to a regular link
    return (
      <a href={url} target="_blank" rel="noopener noreferrer">
        {url}
      </a>
    );
  }

  const displayPath = fileData.lines
    ? `${fileData.path}#L${fileData.lines.start}${fileData.lines.end !== fileData.lines.start ? `-L${fileData.lines.end}` : ''}`
    : fileData.path;

  return (
    <div className={styles.preview}>
      <div className={styles.header}>
        <svg
          className={styles.icon}
          viewBox="0 0 16 16"
          width="16"
          height="16"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"
          />
        </svg>
        <span className={styles.repository}>{fileData.repository}</span>
        <span className={styles.separator}>/</span>
        <span className={styles.path}>{displayPath}</span>
      </div>
      {content && (
        <div className={styles.content}>
          <pre>
            <code>{content}</code>
          </pre>
        </div>
      )}
      <div className={styles.footer}>
        <a
          href={fileData.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.link}
        >
          View on GitHub
          <svg
            className={styles.externalIcon}
            viewBox="0 0 16 16"
            width="12"
            height="12"
          >
            <path
              fillRule="evenodd"
              d="M10.604 1h4.146a.25.25 0 01.25.25v4.146a.25.25 0 01-.427.177L13.03 4.03 9.28 7.78a.75.75 0 01-1.06-1.06l3.75-3.75-1.543-1.543A.25.25 0 0110.604 1zM3.75 2A1.75 1.75 0 002 3.75v8.5c0 .966.784 1.75 1.75 1.75h8.5A1.75 1.75 0 0014 12.25v-3.5a.75.75 0 00-1.5 0v3.5a.25.25 0 01-.25.25h-8.5a.25.25 0 01-.25-.25v-8.5a.25.25 0 01.25-.25h3.5a.75.75 0 000-1.5h-3.5z"
            />
          </svg>
        </a>
      </div>
    </div>
  );
}
