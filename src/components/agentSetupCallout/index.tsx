'use client';

import {ChevronDownIcon, ChevronRightIcon} from '@radix-ui/react-icons';
import * as Sentry from '@sentry/nextjs';
import Link from 'next/link';
import {useCallback, useState} from 'react';
import {usePlausibleEvent} from 'sentry-docs/hooks/usePlausibleEvent';
import {DocMetrics} from 'sentry-docs/metrics';

import {CodeBlock} from '../codeBlock';
import {buildPrompt} from './shared';
import styles from './style.module.scss';

type Props = {
  /** Display name for the platform, e.g. "Next.js", "Python". Omit for generic. */
  platformName?: string;
  /** Skill package name, e.g. "sentry-nextjs-sdk". Omit for generic/all skills. */
  skill?: string;
};

export function AgentSetupCallout({skill, platformName}: Props) {
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const {emit} = usePlausibleEvent();

  const prompt = buildPrompt(platformName);

  const copyPrompt = useCallback(
    async (event: React.MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();
      event.preventDefault();

      emit('Copy AI Prompt', {
        props: {page: window.location.pathname, title: 'Agent Setup Callout'},
      });

      try {
        setCopied(false);
        await navigator.clipboard.writeText(prompt);
        setCopied(true);
        DocMetrics.copyAIPrompt(window.location.pathname, skill, true);
        setTimeout(() => setCopied(false), 1500);
      } catch (error) {
        Sentry.logger.warn('clipboard.writeText failed', {
          error: (error as Error)?.message,
          errorName: (error as Error)?.name,
        });
        DocMetrics.copyAIPrompt(window.location.pathname, skill, false);
        setCopied(false);
      }
    },
    [prompt, emit, skill]
  );

  const description = platformName
    ? `Your agent will set up Sentry in your ${platformName} app automatically.`
    : 'Your agent will set up Sentry automatically.';

  return (
    <div className={styles.wrapper} data-mdast="ignore">
      <div className={styles.mainRow}>
        <div className={styles.left}>
          <span className={styles.title}>Agent-Assisted Setup</span>
        </div>
        <div className={styles.promptArea}>
          <code className={styles.promptText}>{prompt}</code>
        </div>
        <button className={styles.copyButton} onClick={copyPrompt} type="button">
          <CopyIcon />
          {copied ? 'Copied!' : 'Copy Prompt'}
        </button>
      </div>

      <div className={styles.subRow}>
        <span className={styles.description}>
          {description} Works with Cursor, Claude Code, Codex, and more.
        </span>
        <Link href="/ai/agent-plugin/" className={styles.viewDocs}>
          View docs ↗
        </Link>
      </div>

      <details
        className={styles.expandSection}
        open={isExpanded}
        onToggle={e => setIsExpanded(e.currentTarget.open)}
      >
        <summary className={styles.expandSummary}>
          {isExpanded ? (
            <ChevronDownIcon className={styles.expandIcon} />
          ) : (
            <ChevronRightIcon className={styles.expandIcon} />
          )}
          <span>Install the full plugin</span>
        </summary>
        <div className={styles.expandBody}>
          <p>
            Install the Sentry plugin to give your assistant every skill. See the{' '}
            <Link href="/ai/agent-plugin/">installation docs</Link> for more details.
          </p>
          <CodeBlock language="bash">
            <pre className="language-bash">
              <code>npx @sentry/ai install</code>
            </pre>
          </CodeBlock>
        </div>
      </details>
    </div>
  );
}

function CopyIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}
