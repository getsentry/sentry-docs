'use client';

import * as Sentry from '@sentry/nextjs';
import classNames from 'classnames';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {usePlausibleEvent} from 'sentry-docs/hooks/usePlausibleEvent';
import {DocMetrics} from 'sentry-docs/metrics';

import {MigrationItem, PHASES, SEVERITIES} from './constants';
import styles from './styles.module.scss';

/** An item body, rendered on the server and matched to its item by id. */
export type ItemBody = {body: React.ReactNode; id: string};

type Props = {
  /**
   * Rendered item bodies, keyed by item id rather than by position: matching
   * them to `items` by array index would misplace every body after the first
   * divergence instead of failing.
   */
  bodies: ItemBody[];
  /** Guide slug, used to scope checklist storage and label the agent prompt. */
  framework: string;
  /** Human-readable platform or guide name, for the headline. */
  frameworkLabel: string;
  items: MigrationItem[];
  /** Item count before framework filtering, used for the headline. */
  totalItems: number;
};

export function MigrationGuideClient({
  items,
  bodies: renderedBodies,
  framework,
  frameworkLabel,
  totalItems,
}: Props) {
  const bodies = useMemo(
    () => new Map(renderedBodies.map(({id, body}) => [id, body])),
    [renderedBodies]
  );

  // Checklist progress is scoped per framework: someone migrating a monorepo
  // has separate checklists for their Next.js app and their Node service.
  const storageKey = `sentry-v11-migration:${framework}`;
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(storageKey);
      setChecked(new Set(stored ? (JSON.parse(stored) as string[]) : []));
    } catch {
      // Private mode, disabled storage — the guide still works, it just forgets.
    }
    setHydrated(true);
  }, [storageKey]);

  // Persisted from an effect rather than from inside the state updater, which
  // has to stay pure: React invokes updaters twice in development, and an
  // updater that writes to storage would write twice per click.
  useEffect(() => {
    if (!hydrated) {
      // Never write before the stored value has been read, or the first render
      // would overwrite the reader's saved progress with an empty set.
      return;
    }
    try {
      window.localStorage.setItem(storageKey, JSON.stringify([...checked]));
    } catch {
      // See above.
    }
  }, [checked, hydrated, storageKey]);

  const toggleChecked = useCallback((id: string) => {
    setChecked(prev => toggled(prev, id));
  }, []);

  return (
    <div className={styles.guide}>
      <Summary
        total={totalItems}
        applicable={items.length}
        frameworkLabel={frameworkLabel}
        actionRequired={items.filter(item => item.severity === 'action-required').length}
      />

      <Toolbar items={items} framework={framework} />

      {PHASES.map(phase => {
        const phaseItems = items.filter(item => item.phase === phase.id);
        if (phaseItems.length === 0) {
          return null;
        }
        const phaseLeft = phaseItems.filter(i => !checked.has(i.id)).length;

        return (
          <section key={phase.id} className={styles.phase}>
            <div className={styles.phaseHeader}>
              <h2 className={styles.phaseTitle}>{phase.title}</h2>
              <span className={styles.phaseCount}>
                {phaseLeft > 0 ? `${phaseLeft} left` : 'all done'}
              </span>
            </div>
            <p className={styles.phaseDescription}>{phase.description}</p>

            {phaseItems.map(item => (
              <Item
                key={item.id}
                item={item}
                body={bodies.get(item.id)}
                checked={checked.has(item.id)}
                onToggle={() => toggleChecked(item.id)}
              />
            ))}
          </section>
        );
      })}
    </div>
  );
}

/** Adds or removes `id`, without mutating `set`. */
function toggled(set: Set<string>, id: string): Set<string> {
  const next = new Set(set);
  if (!next.delete(id)) {
    next.add(id);
  }
  return next;
}

function Summary({
  total,
  applicable,
  frameworkLabel,
  actionRequired,
}: {
  actionRequired: number;
  applicable: number;
  frameworkLabel: string;
  total: number;
}) {
  return (
    <div className={styles.summary}>
      <p className={styles.summaryHeadline}>
        <strong>{total}</strong> changes in v11 · <strong>{applicable}</strong> steps for{' '}
        {frameworkLabel} · <strong>{actionRequired}</strong> marked &quot;Action
        required&quot;
      </p>
    </div>
  );
}

function Toolbar({items, framework}: {framework: string; items: MigrationItem[]}) {
  const [copied, setCopied] = useState(false);
  const [failed, setFailed] = useState(false);
  const {emit} = usePlausibleEvent();

  const copy = useCallback(async () => {
    emit('Copy AI Prompt', {
      props: {page: window.location.pathname, title: 'v11 Migration Guide'},
    });

    try {
      setFailed(false);
      await navigator.clipboard.writeText(buildAgentPrompt(items, framework));
      setCopied(true);
      DocMetrics.copyAIPrompt(
        window.location.pathname,
        framework,
        true,
        'migration_guide'
      );
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      // Denied permission, a non-secure context, or Safari's focus rules. Say so
      // rather than leaving the button looking inert.
      Sentry.logger.warn('clipboard.writeText failed', {
        error: (error as Error)?.message,
        errorName: (error as Error)?.name,
      });
      DocMetrics.copyAIPrompt(
        window.location.pathname,
        framework,
        false,
        'migration_guide'
      );
      setCopied(false);
      setFailed(true);
    }
  }, [items, framework, emit]);

  return (
    <div className={styles.toolbar} data-mdast="ignore">
      <button type="button" className={styles.copyButton} onClick={copy}>
        {copied ? 'Copied' : 'Copy for AI agent'}
      </button>
      <span className={styles.toolbarHint}>
        {failed
          ? 'Could not copy. Your browser blocked clipboard access, so select the steps below and copy them instead.'
          : 'Paste into Claude Code, Cursor or any coding agent with access to your repo.'}
      </span>
    </div>
  );
}

function Item({
  item,
  body,
  checked,
  onToggle,
}: {
  body: React.ReactNode;
  checked: boolean;
  item: MigrationItem;
  onToggle: () => void;
}) {
  // An item that needs no code change still needs reading, so the label says
  // what ticking it means rather than claiming work that was never there.
  const label =
    item.severity === 'action-required'
      ? `Mark "${item.title}" as done`
      : `Acknowledge "${item.title}"`;

  return (
    <div
      className={classNames(styles.item, styles[`severity-${item.severity}`], {
        [styles.itemChecked]: checked,
      })}
      id={item.id}
    >
      <div className={styles.itemHeader}>
        <label className={styles.itemCheckbox} data-mdast="ignore">
          <input
            type="checkbox"
            checked={checked}
            onChange={onToggle}
            aria-label={label}
          />
        </label>
        <div className={styles.itemHeading}>
          <h3 className={styles.itemTitle}>{item.title}</h3>
          <span className={styles.badge}>{SEVERITIES[item.severity].label}</span>
        </div>
      </div>
      <div className={styles.itemBody}>{body}</div>
    </div>
  );
}

/**
 * Builds the copy-for-agent payload with every step for the selected platform.
 */
export function buildAgentPrompt(items: MigrationItem[], framework: string): string {
  const lines = [
    '# Upgrade the Sentry JavaScript SDK from v10 to v11',
    '',
    'Review the following migration steps and apply those relevant to this repository.',
    '',
    'Rules:',
    '- Check each step against the repository dependencies and configuration. Some steps',
    '  only apply to specific integrations or options. Skip those the repository does not use.',
    '- For applicable steps marked "Action required", make the required changes. Steps',
    '  marked "Behavior change" or "FYI" usually need no code edit. Read them and act if needed.',
    '- Run the project type-check and test suite after each step that changes code.',
    '- Do not invent APIs. If a step is ambiguous for this codebase, stop and ask.',
    '- Some steps affect dashboards or alerts in Sentry rather than code. Call those out',
    '  in your summary instead of trying to change them.',
    '',
    `Platform: ${framework}.`,
    `${items.length} steps to review.`,
    '',
    '---',
    '',
  ];

  for (const phase of PHASES) {
    const phaseItems = items.filter(item => item.phase === phase.id);
    if (phaseItems.length === 0) {
      continue;
    }
    lines.push(`## ${phase.title}`, '');
    for (const item of phaseItems) {
      lines.push(
        `### ${item.title}`,
        '',
        `_${SEVERITIES[item.severity].label}_`,
        '',
        item.markdown.trim(),
        ''
      );
    }
  }

  return lines.join('\n');
}
