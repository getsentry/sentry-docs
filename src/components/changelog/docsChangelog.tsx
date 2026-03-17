'use client';

import {useEffect, useState} from 'react';

interface ChangelogEntry {
  author: string;
  description: string;
  id: string;
  publishedAt: string;
  title: string;
  url: string;
  filesChanged?: {
    added: string[];
    modified: string[];
    removed: string[];
  };
}

export function DocsChangelog() {
  const [entries, setEntries] = useState<ChangelogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://sentry-content-dashboard.sentry.dev/api/docs')
      .then(res => (res.ok ? res.json() : []))
      .then(data => {
        setEntries(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-24 rounded-lg bg-gray-100 dark:bg-gray-800" />
        ))}
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-yellow-800 dark:border-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200">
        <p className="font-semibold">No changelog entries available</p>
        <p className="text-sm">Check back later for updates.</p>
      </div>
    );
  }

  const recentEntries = entries.slice(0, 20);

  return (
    <div className="space-y-8">
      {recentEntries.map(entry => {
        const date = new Date(entry.publishedAt);
        const totalFiles =
          (entry.filesChanged?.added?.length || 0) +
          (entry.filesChanged?.modified?.length || 0) +
          (entry.filesChanged?.removed?.length || 0);

        return (
          <article key={entry.id} className="border-b border-gray-200 pb-8 last:border-0">
            <header className="mb-3">
              <h3 className="mb-2 text-xl font-semibold">
                <a
                  href={entry.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  {entry.title.replace('Docs Update: ', '')}
                </a>
              </h3>
              <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 dark:[color:rgb(210,199,218)]">
                <time dateTime={entry.publishedAt}>
                  {date.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
                {totalFiles > 0 && <span>•</span>}
                {totalFiles > 0 && (
                  <span>
                    {totalFiles} file{totalFiles !== 1 ? 's' : ''} changed
                  </span>
                )}
              </div>
            </header>
            <p className="mb-4 text-gray-700 dark:[color:rgb(210,199,218)]">
              {entry.description}
            </p>
            {entry.filesChanged && totalFiles > 0 && (
              <details className="text-sm">
                <summary className="cursor-pointer text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200">
                  View changed files
                </summary>
                <div className="mt-2 space-y-2 rounded-md bg-gray-50 p-3 dark:bg-gray-800">
                  {entry.filesChanged.added?.length > 0 && (
                    <div>
                      <span className="font-semibold text-green-700 dark:text-green-400">
                        Added:
                      </span>
                      <ul className="ml-4 mt-1 list-inside list-disc">
                        {entry.filesChanged.added.map(file => (
                          <li key={file} className="text-gray-700 dark:text-gray-300">
                            {file}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {entry.filesChanged.modified?.length > 0 && (
                    <div>
                      <span className="font-semibold text-blue-700 dark:text-blue-400">
                        Modified:
                      </span>
                      <ul className="ml-4 mt-1 list-inside list-disc">
                        {entry.filesChanged.modified.map(file => (
                          <li key={file} className="text-gray-700 dark:text-gray-300">
                            {file}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {entry.filesChanged.removed?.length > 0 && (
                    <div>
                      <span className="font-semibold text-red-700 dark:text-red-400">
                        Removed:
                      </span>
                      <ul className="ml-4 mt-1 list-inside list-disc">
                        {entry.filesChanged.removed.map(file => (
                          <li key={file} className="text-gray-700 dark:text-gray-300">
                            {file}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </details>
            )}
          </article>
        );
      })}
    </div>
  );
}
