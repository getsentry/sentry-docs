'use client';

import Link from 'next/link';

interface GitMetadata {
  commitHash: string;
  author: string;
  timestamp: number;
}

interface LastUpdatedProps {
  gitMetadata: GitMetadata;
}

/**
 * Format a timestamp as a relative time string (e.g., "2 days ago")
 */
function formatRelativeTime(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp * 1000; // timestamp is in seconds
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (years > 0) {
    return years === 1 ? '1 year ago' : `${years} years ago`;
  }
  if (months > 0) {
    return months === 1 ? '1 month ago' : `${months} months ago`;
  }
  if (days > 0) {
    return days === 1 ? '1 day ago' : `${days} days ago`;
  }
  if (hours > 0) {
    return hours === 1 ? '1 hour ago' : `${hours} hours ago`;
  }
  if (minutes > 0) {
    return minutes === 1 ? '1 minute ago' : `${minutes} minutes ago`;
  }
  return 'just now';
}

/**
 * Format a timestamp as a full date string for tooltip
 */
function formatFullDate(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

/**
 * Abbreviate a commit hash to first 7 characters
 */
function abbreviateHash(hash: string): string {
  return hash.substring(0, 7);
}

export function LastUpdated({gitMetadata}: LastUpdatedProps) {
  const {commitHash, author, timestamp} = gitMetadata;
  const relativeTime = formatRelativeTime(timestamp);
  const fullDate = formatFullDate(timestamp);
  const abbreviatedHash = abbreviateHash(commitHash);
  const commitUrl = `https://github.com/getsentry/sentry-docs/commit/${commitHash}`;

  return (
    <div className="flex flex-wrap items-center gap-1 text-xs text-[var(--foreground-secondary)] mt-1 mb-4">
      {/* Text content */}
      <span className="flex flex-wrap items-center gap-1">
        <span>updated by</span>
        <span className="font-medium">{author}</span>
        {/* Relative time with tooltip */}
        <span title={fullDate} className="cursor-help">
          {relativeTime}
        </span>
      </span>

      {/* Commit link */}
      <span className="flex items-center gap-1">
        <span className="text-[var(--foreground-secondary)]">•</span>
        <Link
          href={commitUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-[var(--accent-purple)] underline"
        >
          #{abbreviatedHash}
        </Link>
      </span>
    </div>
  );
}

