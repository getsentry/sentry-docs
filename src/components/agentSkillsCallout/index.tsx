'use client';

import {useCallback, useState} from 'react';
import {ChevronDownIcon, ChevronRightIcon} from '@radix-ui/react-icons';
import * as Sentry from '@sentry/nextjs';
import Link from 'next/link';

import {usePlausibleEvent} from 'sentry-docs/hooks/usePlausibleEvent';

import styles from './style.module.scss';

import {CodeBlock} from '../codeBlock';
import {CodeTabs} from '../codeTabs';

const SKILLS_BASE_URL = 'https://skills.sentry.gg';
const SKILLS_REPO = 'getsentry/sentry-for-ai';

type Props = {
  /** Display name for the platform, e.g. "Next.js", "Python". Omit for generic. */
  platformName?: string;
  /** Skill package name, e.g. "sentry-nextjs-sdk". Omit for generic/all skills. */
  skill?: string;
};

function buildPromptUrl(skill?: string): string {
  if (!skill) {
    return SKILLS_BASE_URL + '/';
  }
  return `${SKILLS_BASE_URL}/${skill}/SKILL.md`;
}

function buildPrompt(skill?: string): string {
  const url = buildPromptUrl(skill);
  return `Use curl to download, read and follow: ${url}`;
}

function buildDotagentsCommand(skill?: string): string {
  if (!skill) {
    return `npx @sentry/dotagents add ${SKILLS_REPO} --all`;
  }
  return `npx @sentry/dotagents add ${SKILLS_REPO} --name ${skill}`;
}

function buildNpxSkillsCommand(skill?: string): string {
  if (!skill) {
    return `npx skills add ${SKILLS_REPO}`;
  }
  return `npx skills add ${SKILLS_REPO} --skill ${skill}`;
}

export function AgentSkillsCallout({skill, platformName}: Props) {
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const {emit} = usePlausibleEvent();

  const prompt = buildPrompt(skill);

  const copyPrompt = useCallback(
    async (event: React.MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();
      event.preventDefault();

      emit('Copy AI Prompt', {
        props: {page: window.location.pathname, title: 'Agent Skills Callout'},
      });

      try {
        setCopied(false);
        await navigator.clipboard.writeText(prompt);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      } catch (error) {
        Sentry.captureException(error);
        setCopied(false);
      }
    },
    [prompt, emit]
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
        <Link href="/ai/agent-skills/" className={styles.viewDocs}>
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
          <span>Install the full skills package</span>
        </summary>
        <div className={styles.expandBody}>
          <p>
            Run this in your project to add Sentry agent skills. See the{' '}
            <Link href="/ai/agent-skills/">installation docs</Link> for more details.
          </p>
          <CodeTabs>
            <CodeBlock language="bash" title="dotagents">
              <pre className="language-bash">
                <code>{buildDotagentsCommand(skill)}</code>
              </pre>
            </CodeBlock>
            <CodeBlock language="bash" title="npx skills">
              <pre className="language-bash">
                <code>{buildNpxSkillsCommand(skill)}</code>
              </pre>
            </CodeBlock>
          </CodeTabs>
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
