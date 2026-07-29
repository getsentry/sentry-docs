'use client';

import * as Sentry from '@sentry/nextjs';
import Link from 'next/link';
import {useCallback, useState} from 'react';
import {Check, Copy} from 'react-feather';
import {usePlausibleEvent} from 'sentry-docs/hooks/usePlausibleEvent';
import Claude from 'sentry-docs/icons/claude';
import Codex from 'sentry-docs/icons/codex';
import Cursor from 'sentry-docs/icons/cursor';
import {DocMetrics} from 'sentry-docs/metrics';

import styles from './home.module.scss';

/** Keep in sync with /ai/agent-plugin/. */
const INSTALL_COMMAND = 'npx @sentry/ai install';

export function HomeAiSetupCard() {
  const [copied, setCopied] = useState(false);
  const {emit} = usePlausibleEvent();

  const copyCommand = useCallback(async () => {
    emit('Copy AI Prompt', {
      props: {page: window.location.pathname, title: 'Homepage Setup Card'},
    });

    try {
      await navigator.clipboard.writeText(INSTALL_COMMAND);
      setCopied(true);
      DocMetrics.copyAIPrompt(window.location.pathname, undefined, true, 'homepage_card');
      setTimeout(() => setCopied(false), 1500);
    } catch (error) {
      Sentry.logger.warn('clipboard.writeText failed', {
        error: (error as Error)?.message,
        errorName: (error as Error)?.name,
      });
      DocMetrics.copyAIPrompt(
        window.location.pathname,
        undefined,
        false,
        'homepage_card'
      );
      setCopied(false);
    }
  }, [emit]);

  return (
    <div className={styles.setupCard}>
      <div className={styles.setupIcon}>
        <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M12 2l1.9 4.6L18.5 8.5 13.9 10.4 12 15l-1.9-4.6L5.5 8.5l4.6-1.9L12 2z" />
          <path d="M18.5 13.5l.95 2.3 2.3.95-2.3.95-.95 2.3-.95-2.3-2.3-.95 2.3-.95.95-2.3z" />
        </svg>
      </div>
      <h2 className={styles.setupTitle}>
        <Link href="/ai/agent-plugin/" className={styles.cardLink}>
          Set up with a coding agent
        </Link>
      </h2>
      <p className={styles.setupDesc}>
        One command teaches Claude Code, Cursor, Codex, and Grok how to install and
        configure Sentry for you.
      </p>
      <button
        type="button"
        className={styles.commandPill}
        onClick={copyCommand}
        aria-label={`Copy "${INSTALL_COMMAND}" to the clipboard`}
      >
        <span className={styles.agentIcons} aria-hidden>
          <Claude width={15} height={15} />
          <Codex width={15} height={15} />
          <Cursor width={14} height={14} />
        </span>
        <code className={styles.commandText}>{INSTALL_COMMAND}</code>
        <span className={styles.commandAction}>
          {copied ? <Check size={14} /> : <Copy size={14} />}
        </span>
      </button>
    </div>
  );
}
