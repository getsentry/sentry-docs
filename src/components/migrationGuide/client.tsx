'use client';

import {QuestionMarkCircledIcon} from '@radix-ui/react-icons';
import * as Tooltip from '@radix-ui/react-tooltip';
import {Button, Checkbox, Theme} from '@radix-ui/themes';
import * as Sentry from '@sentry/nextjs';
import classNames from 'classnames';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {usePlausibleEvent} from 'sentry-docs/hooks/usePlausibleEvent';
import {DocMetrics} from 'sentry-docs/metrics';

import {
  isItemVisible,
  migrationGuideHref,
  migrationGuideLabel,
  MigrationItem,
  PHASES,
  SEVERITIES,
} from './constants';
import {detect, Detection} from './detect';
import styles from './styles.module.scss';

const FILTER_PARAM = 'using';

/** The facets offered on this page, which vary by guide. */
export type Facet = {description: string; id: string; label: string};

/**
 * Error monitoring has no checkbox to tick: every setup has it, and the changes
 * that come with it apply to everyone. It is rendered as a locked option rather
 * than left out, so the panel reads as the full set of what the SDK does, the
 * same way the onboarding options do.
 */
const ERRORS_OPTION = {
  label: 'Errors',
  description: 'Error monitoring is part of every setup, so those changes always apply.',
};

/** An item body, rendered on the server and matched to its item by id. */
export type ItemBody = {body: React.ReactNode; id: string};

type Props = {
  /**
   * Rendered item bodies, keyed by item id rather than by position: matching
   * them to `items` by array index would misplace every body after the first
   * divergence instead of failing.
   */
  bodies: ItemBody[];
  /**
   * Facets carried by at least one item on this page. A browser-only guide has
   * no OpenTelemetry or AI items, so those checkboxes are simply absent there.
   */
  facets: readonly Facet[];
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
  facets,
  framework,
  frameworkLabel,
  totalItems,
}: Props) {
  const allFacets = useMemo(() => facets.map(f => f.id), [facets]);
  const bodies = useMemo(
    () => new Map(renderedBodies.map(({id, body}) => [id, body])),
    [renderedBodies]
  );

  // Everything is selected until the reader narrows it, so the page reads as a
  // complete guide before anyone touches a checkbox — and still does with
  // JavaScript disabled, since the server renders every item.
  const [selected, setSelected] = useState<Set<string>>(() => new Set(allFacets));
  const [urlRead, setUrlRead] = useState(false);

  // Filter state is mirrored into the URL so a narrowed guide can be shared.
  //
  // It is read and written directly rather than through `useSearchParams`,
  // because that hook client-renders the tree up to the nearest Suspense
  // boundary, and this docs route is `force-static`. The guide is the page
  // body, so it would drop out of the prerendered HTML: `.md` exports are
  // generated from that HTML, so every item would disappear from `<page>.md`,
  // along with what crawlers and readers without JavaScript get. Note this
  // only shows up in a production build; in development the hook does not
  // suspend and everything looks fine.
  //
  // `history.replaceState` is what Next.js documents for updating the query
  // string without a navigation.
  useEffect(() => {
    const raw = new URLSearchParams(window.location.search).get(FILTER_PARAM);
    if (raw !== null) {
      // Ignore facets from a shared URL that this guide does not offer.
      setSelected(new Set(raw.split(',').filter(f => allFacets.includes(f))));
    }
    setUrlRead(true);
  }, [allFacets]);

  useEffect(() => {
    if (!urlRead) {
      return;
    }
    const params = new URLSearchParams(window.location.search);
    if (selected.size === allFacets.length) {
      params.delete(FILTER_PARAM);
    } else {
      params.set(FILTER_PARAM, [...selected].join(','));
    }
    const query = params.toString();
    // The hash is carried over: items render as `#<item-id>` anchors, and
    // rewriting the URL without it would break a shared deep link on the first
    // filter change — or on hydration, before the reader touches anything.
    window.history.replaceState(
      null,
      '',
      `${window.location.pathname}${query ? `?${query}` : ''}${window.location.hash}`
    );
  }, [selected, urlRead, allFacets]);

  const toggleFacet = useCallback((id: string) => {
    // Functional update, so two toggles in the same tick cannot clobber each
    // other.
    setSelected(prev => toggled(prev, id));
  }, []);

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

  const [showHidden, setShowHidden] = useState(false);

  const visible = useMemo(
    () => items.filter(item => isItemVisible(item, selected)),
    [items, selected]
  );
  const visibleIds = useMemo(() => new Set(visible.map(i => i.id)), [visible]);
  const hiddenCount = items.length - visible.length;

  const actionRequired = visible.filter(i => i.severity === 'action-required');
  // Every item is checkable: the action-required ones as work, the rest as an
  // acknowledgement that you read them and decided they need nothing. So
  // progress counts all of them, not just the work.
  const doneCount = visible.filter(i => checked.has(i.id)).length;
  const progress = visible.length ? Math.round((doneCount / visible.length) * 100) : 100;

  const shown = showHidden ? items : visible;

  return (
    <div className={styles.guide}>
      <FilterPanel
        facets={facets}
        selected={selected}
        onToggle={toggleFacet}
        onSet={setSelected}
        framework={framework}
        frameworkLabel={frameworkLabel}
      />

      <Summary
        total={totalItems}
        applicable={items.length}
        frameworkLabel={frameworkLabel}
        actionRequired={actionRequired.length}
        checkable={visible.length}
        done={doneCount}
        progress={progress}
        hydrated={hydrated}
      />

      <Toolbar
        items={visible}
        framework={framework}
        selected={selected}
        facets={facets}
      />

      {hiddenCount > 0 && (
        <button
          type="button"
          className={styles.hiddenBar}
          onClick={() => setShowHidden(v => !v)}
        >
          {showHidden
            ? `Hiding ${hiddenCount} item${hiddenCount === 1 ? '' : 's'} again`
            : `${hiddenCount} item${hiddenCount === 1 ? '' : 's'} hidden by your selection`}
          <span className={styles.hiddenBarAction}>
            {showHidden ? 'Hide them' : 'Show all'}
          </span>
        </button>
      )}

      {PHASES.map(phase => {
        const phaseItems = shown.filter(item => item.phase === phase.id);
        if (phaseItems.length === 0) {
          return null;
        }
        const phaseLeft = phaseItems.filter(
          i => visibleIds.has(i.id) && !checked.has(i.id)
        ).length;

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
                dimmed={!visibleIds.has(item.id)}
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

function FilterPanel({
  facets,
  selected,
  onToggle,
  onSet,
  framework,
  frameworkLabel,
}: {
  facets: readonly Facet[];
  framework: string;
  frameworkLabel: string;
  onSet: (next: Set<string>) => void;
  onToggle: (id: string) => void;
  selected: Set<string>;
}) {
  return (
    <div className={styles.filterPanel} data-mdast="ignore">
      <div className={styles.filterHeader}>
        <h3 className={styles.filterTitle}>What does your setup use?</h3>
        <div className={styles.filterActions}>
          <button type="button" onClick={() => onSet(new Set(facets.map(f => f.id)))}>
            Select all
          </button>
          <button type="button" onClick={() => onSet(new Set())}>
            Clear
          </button>
        </div>
      </div>

      <div className={styles.filterOptions}>
        <FacetOption
          label={ERRORS_OPTION.label}
          description={ERRORS_OPTION.description}
        />
        {facets.map(option => (
          <FacetOption
            key={option.id}
            label={option.label}
            description={option.description}
            checked={selected.has(option.id)}
            onToggle={() => onToggle(option.id)}
          />
        ))}
      </div>

      <PasteDetect
        onDetect={onSet}
        framework={framework}
        frameworkLabel={frameworkLabel}
        facets={facets}
      />
    </div>
  );
}

/**
 * One filter checkbox, built from the same Radix pair as the onboarding option
 * buttons so the two pickers read as one control. Without `onToggle` the option
 * is locked on, for things every setup has.
 */
function FacetOption({
  label,
  description,
  checked,
  onToggle,
}: {
  description: string;
  label: string;
  checked?: boolean;
  onToggle?: () => void;
}) {
  const locked = !onToggle;

  return (
    <Button variant="surface" size="2" disabled={locked} asChild>
      <label role="button" className={styles.filterOption}>
        <Checkbox
          checked={locked ? true : checked}
          disabled={locked}
          variant="soft"
          size="1"
          onCheckedChange={() => onToggle?.()}
        />
        {label}
        <Tooltip.Provider delayDuration={300}>
          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <span
                role="button"
                tabIndex={0}
                aria-label={`Help: ${label}`}
                className={styles.filterHelp}
              >
                <QuestionMarkCircledIcon />
              </span>
            </Tooltip.Trigger>
            <Tooltip.Portal>
              <Theme accentColor="iris">
                <Tooltip.Content
                  className={styles.tooltipContent}
                  sideOffset={5}
                  align="center"
                  side="top"
                >
                  {description}
                  <Tooltip.Arrow className={styles.tooltipArrow} />
                </Tooltip.Content>
              </Theme>
            </Tooltip.Portal>
          </Tooltip.Root>
        </Tooltip.Provider>
      </label>
    </Button>
  );
}

const EMPTY_DETECTION: Detection = {
  facets: new Set(),
  signals: [],
  framework: undefined,
  gaps: {missingInit: true, missingManifest: true},
};

/**
 * Reads the reader's setup off a pasted `package.json` or `Sentry.init()` block
 * and sets the filters from it, because a hand-ticked selection is only as
 * accurate as their memory of their own config.
 *
 * Everything below is optional: the checkboxes above work untouched.
 */
function PasteDetect({
  onDetect,
  framework,
  frameworkLabel,
  facets,
}: {
  facets: readonly Facet[];
  framework: string;
  frameworkLabel: string;
  onDetect: (next: Set<string>) => void;
}) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState('');
  const [detection, setDetection] = useState<Detection>(EMPTY_DETECTION);
  // The last selection this component applied. A detected result narrows the
  // filters, which means overwriting what the reader ticked — fair on a fresh
  // paste, but not on every keystroke afterwards: re-applying an unchanged
  // result would silently undo a correction they made by hand.
  const lastApplied = useRef<string | undefined>(undefined);

  const handleChange = useCallback(
    (value: string) => {
      setText(value);

      // Guard against someone pasting a lockfile: the rules are cheap, but
      // there is no reason to scan megabytes of it.
      const result = detect(value.slice(0, 200_000));

      // A pasted config can mention things this guide has no items for — a
      // React app's dependencies may include an AI SDK used only on its server.
      // Keep the detection honest by intersecting it with what this page can
      // actually show.
      const applicable = new Set(
        [...result.facets].filter(facet => facets.some(f => f.id === facet))
      );
      setDetection({
        ...result,
        facets: applicable,
        signals: result.signals.filter(s => applicable.has(s.facet)),
      });

      if (applicable.size === 0) {
        // Nothing to apply, and an emptied box should not count as "already
        // applied" — re-pasting the same config has to work.
        lastApplied.current = undefined;
        return;
      }
      const key = [...applicable].sort().join(',');
      if (key !== lastApplied.current) {
        lastApplied.current = key;
        onDetect(new Set(applicable));
      }
    },
    [facets, onDetect]
  );

  const {facets: detectedFacets, signals, gaps, framework: detectedFramework} = detection;
  // Only a framework this reader is *not* reading about is worth mentioning.
  // One package serves several guides — `@sentry/node` backs Express, Fastify,
  // Koa and more — so being outside that set is the test, not an exact match.
  const wrongGuide =
    detectedFramework && !detectedFramework.guides.includes(framework)
      ? detectedFramework
      : undefined;

  return (
    <div className={styles.paste}>
      <button
        type="button"
        className={styles.pasteToggle}
        onClick={() => setOpen(v => !v)}
        aria-expanded={open}
      >
        {open ? '−' : '+'} Or paste your `package.json` or `Sentry.init()` to detect this
        automatically
      </button>

      {open && (
        <div className={styles.pasteBody}>
          <textarea
            className={styles.pasteInput}
            value={text}
            onChange={event => handleChange(event.target.value)}
            placeholder={
              '{\n  "dependencies": {\n    "@sentry/nextjs": "^10.5.0"\n  }\n}'
            }
            rows={6}
            spellCheck={false}
            aria-label="Paste your package.json or Sentry.init configuration"
          />

          {text.trim().length > 0 &&
            (signals.length > 0 ? (
              <p className={styles.pasteResult}>
                Detected{' '}
                {signals.map((signal, index) => (
                  <span key={signal.facet}>
                    {index > 0 && ', '}
                    <strong>{facetLabel(facets, signal.facet)}</strong>{' '}
                    <span className={styles.pasteEvidence}>({signal.evidence})</span>
                  </span>
                ))}
                . Adjust the boxes above if that is not right.
              </p>
            ) : (
              <p className={styles.pasteResult}>
                No features or packages detected in that. Your selection is unchanged, so
                tick the boxes above instead.
              </p>
            ))}

          {detectedFacets.size > 0 && (gaps.missingInit || gaps.missingManifest) && (
            <p className={styles.pasteWarning}>
              {gaps.missingInit
                ? 'Paste your Sentry.init() block as well. Tracing, logs and metrics are configured there, so they cannot be detected from a dependency list alone.'
                : 'Paste your package.json as well. Profiling, AI and OpenTelemetry packages cannot be detected from Sentry.init() alone.'}
            </p>
          )}

          {wrongGuide && (
            <p className={styles.pasteWarning}>
              That looks like a <strong>{wrongGuide.pkg}</strong> app, but you are reading
              the <strong>{frameworkLabel}</strong> guide.{' '}
              <a href={migrationGuideHref(wrongGuide.primary)}>
                Switch to the {migrationGuideLabel(wrongGuide.primary)} guide
              </a>{' '}
              to see the steps for it.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function Summary({
  total,
  applicable,
  frameworkLabel,
  actionRequired,
  checkable,
  done,
  progress,
  hydrated,
}: {
  actionRequired: number;
  applicable: number;
  checkable: number;
  done: number;
  frameworkLabel: string;
  hydrated: boolean;
  progress: number;
  total: number;
}) {
  return (
    <div className={styles.summary}>
      <p className={styles.summaryHeadline}>
        <strong>{total}</strong> changes in v11 · <strong>{applicable}</strong> apply to{' '}
        {frameworkLabel} · <strong>{actionRequired}</strong> need action from you
      </p>
      {hydrated && checkable > 0 && (
        <div className={styles.progress} data-mdast="ignore">
          <div className={styles.progressTrack}>
            <div className={styles.progressBar} style={{width: `${progress}%`}} />
          </div>
          <span className={styles.progressLabel}>
            {done} of {checkable} done
          </span>
        </div>
      )}
    </div>
  );
}

function Toolbar({
  items,
  framework,
  selected,
  facets,
}: {
  facets: readonly Facet[];
  framework: string;
  items: MigrationItem[];
  selected: Set<string>;
}) {
  const [copied, setCopied] = useState(false);
  const [failed, setFailed] = useState(false);
  const {emit} = usePlausibleEvent();

  const copy = useCallback(async () => {
    emit('Copy AI Prompt', {
      props: {page: window.location.pathname, title: 'v11 Migration Guide'},
    });

    try {
      setFailed(false);
      await navigator.clipboard.writeText(
        buildAgentPrompt(items, framework, selected, facets)
      );
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
  }, [items, framework, selected, facets, emit]);

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
  dimmed,
}: {
  body: React.ReactNode;
  checked: boolean;
  dimmed: boolean;
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
        [styles.itemDimmed]: dimmed,
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
          {dimmed && <span className={styles.badgeMuted}>not selected</span>}
        </div>
      </div>
      <div className={styles.itemBody}>{body}</div>
    </div>
  );
}

/**
 * Builds the copy-for-agent payload: the reader's filtered guide, plus enough
 * instruction that an agent applies it rather than summarizing it.
 */
export function buildAgentPrompt(
  items: MigrationItem[],
  framework: string,
  selected: Set<string>,
  facets: readonly Facet[]
): string {
  const selectedLabels = [...selected].map(id => facetLabel(facets, id));

  const lines = [
    '# Upgrade the Sentry JavaScript SDK from v10 to v11',
    '',
    'Apply the following migration steps to this repository.',
    '',
    'Rules:',
    '- Apply every step marked "Action required". Steps marked "Behavior change" or',
    '  "FYI" usually need no code edit. Read them, and only act if they affect this repo.',
    '- Run the project type-check and test suite after each step that changes code.',
    '- Do not invent APIs. If a step is ambiguous for this codebase, stop and ask.',
    '- Some steps affect dashboards or alerts in Sentry rather than code. Call those out',
    '  in your summary instead of trying to change them.',
    '',
    `Setup: ${framework}${selectedLabels.length ? `, using ${selectedLabels.join(', ')}` : ''}.`,
    `${items.length} steps apply, ${items.filter(i => i.severity === 'action-required').length} of which require action.`,
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

/** Human-readable name for a facet, falling back to its id. */
function facetLabel(facets: readonly Facet[], id: string): string {
  return facets.find(f => f.id === id)?.label ?? id;
}
