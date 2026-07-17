'use client';

import * as Tooltip from '@radix-ui/react-tooltip';
import {Theme} from '@radix-ui/themes';
import * as Sentry from '@sentry/nextjs';
import {useTheme} from 'next-themes';
import {useCallback, useMemo, useState} from 'react';
import {usePlausibleEvent} from 'sentry-docs/hooks/usePlausibleEvent';
import {DocMetrics} from 'sentry-docs/metrics';

import {buildPrompt} from '../agentSetupCallout/shared';
import styles from './style.module.scss';

type Props = {
  /** Skill package name, e.g. "sentry-nextjs-sdk". Used for analytics. */
  skill: string;
  /** Display name for the SDK, e.g. "Next.js". Named in the copied prompt. */
  platformName?: string;
};

export function CopyPromptButton({skill, platformName}: Props) {
  const [copied, setCopied] = useState(false);
  const {emit} = usePlausibleEvent();
  const {resolvedTheme} = useTheme();
  const isDark = resolvedTheme === 'dark';

  const prompt = buildPrompt(platformName);

  /**
   * Tooltip styles matching the onboarding tooltip pattern.
   * Inline styles are required because Radix portals the tooltip to document.body,
   * outside the Theme wrapper, so CSS module classes don't reliably apply.
   */
  const tooltipContentStyle: React.CSSProperties = useMemo(
    () => ({
      borderRadius: '4px',
      padding: '8px 12px',
      fontSize: '12px',
      lineHeight: 1.2,
      textAlign: 'center' as const,
      color: isDark ? 'var(--foreground)' : 'var(--gray-11)',
      backgroundColor: isDark ? 'var(--gray-4)' : 'white',
      boxShadow: '0px 4px 16px 0px rgba(31, 22, 51, 0.1)',
      zIndex: 9999,
      position: 'relative' as const,
      pointerEvents: 'none' as const,
      userSelect: 'none' as const,
      whiteSpace: 'nowrap' as const,
      animationDuration: '100ms',
      animationTimingFunction: 'ease-in',
    }),
    [isDark]
  );

  const tooltipArrowStyle: React.CSSProperties = useMemo(
    () => ({
      fill: isDark ? 'var(--gray-4)' : 'white',
    }),
    [isDark]
  );

  const copyPrompt = useCallback(
    async (event: React.MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();
      event.preventDefault();

      emit('Copy AI Prompt', {
        props: {page: window.location.pathname, title: 'Inline Platform Link'},
      });

      try {
        setCopied(false);
        await navigator.clipboard.writeText(prompt);
        setCopied(true);
        DocMetrics.copyAIPrompt(window.location.pathname, skill, true, 'inline_link');
        setTimeout(() => setCopied(false), 1500);
      } catch (error) {
        if ((error as Error)?.name !== 'NotAllowedError') {
          Sentry.captureException(error);
        }
        DocMetrics.copyAIPrompt(window.location.pathname, skill, false, 'inline_link');
        setCopied(false);
      }
    },
    [prompt, emit, skill]
  );

  return (
    <span className={styles.wrapper}>
      <span className={styles.divider}>|</span>
      <Tooltip.Provider delayDuration={200}>
        <Tooltip.Root>
          <Tooltip.Trigger asChild>
            <button
              className={styles.button}
              onClick={copyPrompt}
              type="button"
              aria-label="Copy setup prompt for AI agents"
            >
              <CopyIcon />
              <span className={styles.label}>{copied ? 'Copied!' : 'Copy Prompt'}</span>
            </button>
          </Tooltip.Trigger>
          {!copied && (
            <Tooltip.Portal>
              <Theme accentColor="iris">
                <Tooltip.Content style={tooltipContentStyle} sideOffset={6}>
                  Copy setup prompt for AI agents
                  <Tooltip.Arrow style={tooltipArrowStyle} />
                </Tooltip.Content>
              </Theme>
            </Tooltip.Portal>
          )}
        </Tooltip.Root>
      </Tooltip.Provider>
    </span>
  );
}

function CopyIcon() {
  return (
    <svg
      width="12"
      height="12"
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
