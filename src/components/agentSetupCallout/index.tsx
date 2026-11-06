'use client';

import * as Sentry from '@sentry/nextjs';
import {Fragment, useCallback, useState} from 'react';
import {Copy} from 'react-feather';
import {usePlausibleEvent} from 'sentry-docs/hooks/usePlausibleEvent';
import {DocMetrics} from 'sentry-docs/metrics';

import {CliInstallCommand} from '../cliInstallCommand';
import {ExternalLink} from '../externalLink';
import {CliSetupMarkdown, InstructionMarkdown} from './markdown';
import {SENTRY_CLI_URL} from './shared';
import styles from './style.module.scss';

type Props = {
  /** Display name for the platform, e.g. "Next.js", "Python". Omit for generic. */
  platformName?: string;
  /** Skill package name, e.g. "sentry-nextjs-sdk". Omit for generic/all skills. */
  skill?: string;
  /** Custom instructions for tasks other than SDK setup, such as migrations. */
  instructions?: {
    title: string;
    prompt: string;
    description: string;
  };
};

export function AgentSetupCallout({skill, platformName, instructions}: Props) {
  if (instructions) {
    return <InstructionPrompt instructions={instructions} />;
  }

  return (
    <Fragment>
      <div className={styles.wrapper} data-mdast="ignore">
        <div className={styles.setup}>
          <span className={styles.title}>Set up with the Sentry CLI</span>
          <CliInstallCommand source="callout" skill={skill} platformName={platformName} />
        </div>
        <div className={styles.subRow}>
          <ExternalLink href={SENTRY_CLI_URL} className={styles.viewDocs}>
            Learn more about the Sentry CLI
          </ExternalLink>
        </div>
      </div>
      <CliSetupMarkdown platformName={platformName} />
    </Fragment>
  );
}

function InstructionPrompt({
  instructions,
}: {
  instructions: NonNullable<Props['instructions']>;
}) {
  const [copied, setCopied] = useState(false);
  const {emit} = usePlausibleEvent();

  const copyPrompt = useCallback(
    async (event: React.MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();
      event.preventDefault();

      emit('Copy AI Prompt', {
        props: {
          page: window.location.pathname,
          title: instructions.title,
        },
      });

      try {
        setCopied(false);
        await navigator.clipboard.writeText(instructions.prompt);
        setCopied(true);
        DocMetrics.copyAIPrompt(window.location.pathname, undefined, true);
        setTimeout(() => setCopied(false), 1500);
      } catch (error) {
        Sentry.logger.warn('clipboard.writeText failed', {
          error: (error as Error)?.message,
          errorName: (error as Error)?.name,
        });
        DocMetrics.copyAIPrompt(window.location.pathname, undefined, false);
        setCopied(false);
      }
    },
    [emit, instructions.prompt, instructions.title]
  );

  return (
    <Fragment>
      <div className={styles.wrapper} data-mdast="ignore">
        <div className={styles.mainRow}>
          <div className={styles.left}>
            <span className={styles.title}>{instructions.title}</span>
          </div>
          <div className={styles.promptArea}>
            <code className={styles.promptText}>{instructions.prompt}</code>
          </div>
          <button className={styles.copyButton} onClick={copyPrompt} type="button">
            <Copy size={14} />
            {copied ? 'Copied' : 'Copy Prompt'}
          </button>
        </div>
        <div className={styles.subRow}>
          <span className={styles.description}>{instructions.description}</span>
        </div>
      </div>
      <InstructionMarkdown
        title={instructions.title}
        prompt={instructions.prompt}
        description={instructions.description}
      />
    </Fragment>
  );
}
