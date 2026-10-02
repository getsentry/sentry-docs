'use client';

import classNames from 'classnames';
import React, {useCallback, useEffect, useMemo, useState} from 'react';

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
  /** Guide slug, used to scope checklist storage. */
  framework: string;
  items: MigrationItem[];
};

export function MigrationGuideClient({items, bodies: renderedBodies, framework}: Props) {
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
