'use client';

import * as Sentry from '@sentry/nextjs';
import {useCallback, useContext, useEffect, useId, useRef, useState} from 'react';
import {Check, Copy} from 'react-feather';
import {usePlausibleEvent} from 'sentry-docs/hooks/usePlausibleEvent';
import {DocMetrics} from 'sentry-docs/metrics';

import {setupTarget} from '../agentSetupCallout/shared';
import {
  type AgentHandoff,
  CodeContext,
  createAgentHandoff,
  getAgentHandoffGuideUrl,
} from '../codeContext';
import styles from './style.module.scss';

type Props = {
  /** Display name for the platform, e.g. "Next.js". Omit for generic. */
  platformName?: string;
  /** Skill package name, used for copy metrics. */
  skill?: string;
};

type CachedHandoff = AgentHandoff & {
  disableIpPinning: boolean;
  orgSlug: string;
  copied?: boolean;
};

// Mint a fresh code when the cached one is about to expire.
const EXPIRATION_BUFFER_MS = 60_000;

function formatPrompt(guideUrl: string, code: string, platformName?: string) {
  return `Read and follow ${guideUrl} verbatim to set up ${setupTarget(platformName)}. Your handoff code is \`${code}\`.`;
}

/**
 * Docs version of the in-app agent handoff prompt. For signed-in users it mints a
 * single-use handoff code on copy, so the agent can authenticate without the
 * user installing or logging in to the Sentry CLI first.
 */
export function AgentHandoffCallout({platformName, skill}: Props) {
  const codeContext = useContext(CodeContext);
  const {emit} = usePlausibleEvent();
  const [useIpPinning, setUseIpPinning] = useState(true);
  const [isPending, setIsPending] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const handoff = useRef<CachedHandoff | null>(null);
  const ipPinningId = useId();
  const orgSelectId = useId();

  const projects = codeContext?.codeKeywords.PROJECT ?? [];
  const orgSlugs = [...new Set(projects.map(project => project.ORG_SLUG))];
  const selectedProject = projects[codeContext?.sharedKeywordSelection[0].PROJECT ?? 0];
  const [orgSlug, setOrgSlug] = useState<string | undefined>(undefined);
  const activeOrgSlug = orgSlug ?? selectedProject?.ORG_SLUG ?? orgSlugs[0];
  const guideUrl = getAgentHandoffGuideUrl();

  // Codes are single-use. Once a copied prompt could have been pasted somewhere, which
  // means the page was hidden or the window lost focus after the copy, the next copy
  // mints a fresh code. Blur covers an agent running side by side with a visible tab.
  useEffect(() => {
    const retireCopiedCode = () => {
      if (handoff.current?.copied) {
        handoff.current = null;
      }
    };
    const onVisibilityChange = () => {
      if (document.hidden) {
        retireCopiedCode();
      }
    };
    document.addEventListener('visibilitychange', onVisibilityChange);
    window.addEventListener('blur', retireCopiedCode);
    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('blur', retireCopiedCode);
    };
  }, []);

  const getPrompt = useCallback(async () => {
    if (!activeOrgSlug) {
      throw new Error('No organization available');
    }
    const disableIpPinning = !useIpPinning;
    const cached = handoff.current;
    const isFresh =
      cached &&
      cached.orgSlug === activeOrgSlug &&
      cached.disableIpPinning === disableIpPinning &&
      Date.parse(cached.expiresAt) > Date.now() + EXPIRATION_BUFFER_MS;

    if (isFresh) {
      return formatPrompt(cached.guideUrl, cached.code, platformName);
    }

    const minted = await createAgentHandoff({orgSlug: activeOrgSlug, disableIpPinning});
    handoff.current = {...minted, orgSlug: activeOrgSlug, disableIpPinning};
    return formatPrompt(minted.guideUrl, minted.code, platformName);
  }, [activeOrgSlug, platformName, useIpPinning]);

  const copyPrompt = useCallback(async () => {
    if (isPending) {
      return;
    }
    setIsPending(true);
    setError(null);
    emit('Copy AI Prompt', {
      props: {page: window.location.pathname, title: 'Agent handoff prompt'},
    });

    // Start the clipboard write inside the click so Safari keeps the user gesture
    // while the code is minted.
    const prompt = getPrompt();
    try {
      await navigator.clipboard.write([
        new ClipboardItem({
          'text/plain': prompt.then(text => new Blob([text], {type: 'text/plain'})),
        }),
      ]);
      if (handoff.current) {
        handoff.current =
          document.hidden || !document.hasFocus()
            ? null
            : {...handoff.current, copied: true};
      }
      setCopied(true);
      DocMetrics.copyAIPrompt(window.location.pathname, skill, true, 'callout');
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      const mintFailed = await prompt.then(
        () => false,
        () => true
      );
      setError(
        mintFailed
          ? 'Unable to create your agent prompt. Try again.'
          : 'Unable to copy your agent prompt. Allow clipboard access and try again.'
      );
      Sentry.logger.warn('agent handoff copy failed', {
        error: (err as Error)?.message,
        mintFailed,
      });
      DocMetrics.copyAIPrompt(window.location.pathname, skill, false, 'callout');
    } finally {
      setIsPending(false);
    }
  }, [emit, getPrompt, isPending, skill]);

  return (
    <div className={styles.wrapper} data-mdast="ignore">
      <div className={styles.header}>
        <span className={styles.title}>Set up with your coding agent</span>
        {orgSlugs.length > 1 && (
          <label className={styles.orgPicker} htmlFor={orgSelectId}>
            <span>Organization</span>
            <select
              id={orgSelectId}
              value={activeOrgSlug}
              onChange={event => setOrgSlug(event.target.value)}
            >
              {orgSlugs.map(slug => (
                <option key={slug} value={slug}>
                  {slug}
                </option>
              ))}
            </select>
          </label>
        )}
      </div>
      <p className={styles.description}>
        Paste one prompt and your agent does the rest. It signs in to Sentry as you, so
        there's nothing to install first.
      </p>

      <div className={styles.promptBox}>
        <code className={styles.promptText}>
          Read and follow{' '}
          <a href={guideUrl} target="_blank" rel="noreferrer">
            {guideUrl}
          </a>{' '}
          verbatim to set up {setupTarget(platformName)}. Your handoff code is{' '}
          <span
            className={styles.maskedCode}
            title="The secret code authorizes your agent on your behalf"
          >
            sntryh_****
          </span>
          .
        </code>
      </div>

      <div className={styles.ipPinning}>
        <input
          id={ipPinningId}
          type="checkbox"
          checked={useIpPinning}
          onChange={() => setUseIpPinning(value => !value)}
        />
        <label htmlFor={ipPinningId}>
          <span className={styles.ipPinningLabel}>Only allow this network</span>
          <span className={styles.ipPinningHelp}>
            Uncheck if your agent runs in the cloud, or you use iCloud Private Relay.
          </span>
        </label>
      </div>

      {!useIpPinning && (
        <div className={styles.warning} role="alert">
          Without IP pinning, anyone with this prompt can use its handoff code from any IP
          address to authorize an agent on your behalf. Avoid pasting your prompt when
          streaming or screen sharing.
        </div>
      )}
      {error && (
        <div className={styles.error} role="alert">
          {error}
        </div>
      )}

      <button
        className={styles.copyButton}
        disabled={isPending || !activeOrgSlug}
        onClick={copyPrompt}
        type="button"
      >
        {copied ? <Check size={14} /> : <Copy size={14} />}
        {copied ? 'Copied' : isPending ? 'Creating prompt…' : 'Copy prompt'}
      </button>
    </div>
  );
}
