'use client';

import {Button, Callout, Card, Code, Flex, Select, Text, Tooltip} from '@radix-ui/themes';
import * as Sentry from '@sentry/nextjs';
import {useCallback, useContext, useEffect, useRef, useState} from 'react';
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
  const [isPending, setIsPending] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const handoff = useRef<CachedHandoff | null>(null);

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
    const cached = handoff.current;
    const isFresh =
      cached &&
      cached.orgSlug === activeOrgSlug &&
      Date.parse(cached.expiresAt) > Date.now() + EXPIRATION_BUFFER_MS;

    if (isFresh) {
      return formatPrompt(cached.guideUrl, cached.code, platformName);
    }

    const minted = await createAgentHandoff({orgSlug: activeOrgSlug});
    handoff.current = {...minted, orgSlug: activeOrgSlug};
    return formatPrompt(minted.guideUrl, minted.code, platformName);
  }, [activeOrgSlug, platformName]);

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
    <Card className={styles.wrapper} data-mdast="ignore">
      <Flex direction="column" gap="3">
        <Flex align="center" justify="between" gap="3" wrap="wrap">
          <Text size="2" weight="bold">
            Set up with your coding agent
          </Text>
          {orgSlugs.length > 1 && (
            <Select.Root size="1" value={activeOrgSlug} onValueChange={setOrgSlug}>
              <Select.Trigger aria-label="Organization" />
              <Select.Content position="popper">
                {orgSlugs.map(slug => (
                  <Select.Item key={slug} value={slug}>
                    {slug}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
          )}
        </Flex>
        <Text as="div" size="1" color="gray">
          Paste one prompt and your agent does the rest. It signs in to Sentry as you, so
          there's nothing to install first.
        </Text>

        <code className={styles.prompt}>
          Read and follow{' '}
          <a href={guideUrl} target="_blank" rel="noreferrer">
            {guideUrl}
          </a>{' '}
          verbatim to set up {setupTarget(platformName)}. Your handoff code is{' '}
          <Tooltip content="The secret code authorizes your agent on your behalf">
            <Code color="amber" variant="solid">
              sntryh_****
            </Code>
          </Tooltip>
          .
        </code>

        {error && (
          <Callout.Root color="red" size="1" role="alert">
            <Callout.Text>{error}</Callout.Text>
          </Callout.Root>
        )}

        <Button disabled={isPending || !activeOrgSlug} onClick={copyPrompt}>
          {copied ? <Check size={14} /> : <Copy size={14} />}
          {copied ? 'Copied' : isPending ? 'Creating prompt…' : 'Copy prompt'}
        </Button>
      </Flex>
    </Card>
  );
}
