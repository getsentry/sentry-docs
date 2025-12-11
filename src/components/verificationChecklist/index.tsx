'use client';

import {useCallback, useEffect, useState} from 'react';
import {ArrowRightIcon, CheckIcon} from '@radix-ui/react-icons';

import {usePlausibleEvent} from 'sentry-docs/hooks/usePlausibleEvent';

import styles from './style.module.scss';

type ChecklistItem = {
  id: string;
  label: string;
  description?: string;
  link?: string;
  linkText?: string;
};

type Props = {
  /** Unique identifier for this checklist (used for localStorage) */
  checklistId?: string;
  /** Items to display in the checklist */
  items?: ChecklistItem[];
};

const DEFAULT_ITEMS: ChecklistItem[] = [
  {
    id: 'trigger-error',
    label: 'Trigger a test error',
    description: 'Use the example code or page to generate an error',
  },
  {
    id: 'see-error',
    label: 'See the error in Sentry',
    description: "Check your project's Issues page",
  },
  {
    id: 'run-build',
    label: 'Run a production build',
    description: 'Verify source maps are uploaded',
  },
];

function getStorageKey(checklistId: string): string {
  return `sentry-docs-checklist-${checklistId}`;
}

export function VerificationChecklist({
  checklistId = 'default',
  items = DEFAULT_ITEMS,
}: Props) {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [mounted, setMounted] = useState(false);
  const {emit} = usePlausibleEvent();

  // Load checked items from localStorage on mount
  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem(getStorageKey(checklistId));
      if (stored) {
        setCheckedItems(JSON.parse(stored));
      }
    } catch {
      // Ignore localStorage errors
    }
  }, [checklistId]);

  // Save to localStorage when checked items change
  useEffect(() => {
    if (!mounted) {
      return;
    }
    try {
      localStorage.setItem(getStorageKey(checklistId), JSON.stringify(checkedItems));
    } catch {
      // Ignore localStorage errors
    }
  }, [checkedItems, checklistId, mounted]);

  const completedCount = Object.values(checkedItems).filter(Boolean).length;
  const totalCount = items.length;
  const allComplete = completedCount === totalCount;

  const toggleItem = useCallback(
    (itemId: string, itemLabel: string) => {
      setCheckedItems(prev => {
        const newChecked = !prev[itemId];
        const newState = {...prev, [itemId]: newChecked};

        // Emit event for checking/unchecking item
        emit('Checklist Item Toggle', {
          props: {
            page: window.location.pathname,
            checklistId,
            itemId,
            itemLabel,
            checked: newChecked,
          },
        });

        // Check if all items are now complete
        const newCompletedCount = Object.values(newState).filter(Boolean).length;
        if (newCompletedCount === totalCount && newChecked) {
          emit('Checklist Complete', {
            props: {
              page: window.location.pathname,
              checklistId,
            },
          });
        }

        return newState;
      });
    },
    [checklistId, emit, totalCount]
  );

  const handleLinkClick = useCallback(
    (itemId: string, linkText: string, link: string) => {
      emit('Checklist Link Click', {
        props: {
          page: window.location.pathname,
          checklistId,
          itemId,
          linkText,
          link,
        },
      });
    },
    [checklistId, emit]
  );

  return (
    <div className={styles.checklist}>
      <div className={styles.progress}>
        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{width: `${(completedCount / totalCount) * 100}%`}}
          />
        </div>
        <span className={styles.progressText}>
          {completedCount} of {totalCount} complete
        </span>
      </div>

      <ul className={styles.items}>
        {items.map(item => {
          const isChecked = checkedItems[item.id] || false;
          return (
            <li key={item.id} className={styles.item}>
              <label className={`${styles.label} ${isChecked ? styles.checked : ''}`}>
                <span className={styles.checkboxWrapper}>
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleItem(item.id, item.label)}
                    className={styles.checkbox}
                  />
                  <span
                    className={`${styles.customCheckbox} ${isChecked ? styles.checked : ''}`}
                  >
                    {isChecked && <CheckIcon className={styles.checkIcon} />}
                  </span>
                </span>
                <span className={styles.content}>
                  <span
                    className={`${styles.labelText} ${isChecked ? styles.checked : ''}`}
                  >
                    {item.label}
                  </span>
                  {item.description && (
                    <span className={styles.description}>{item.description}</span>
                  )}
                </span>
              </label>
              {item.link && (
                <a
                  href={item.link}
                  className={styles.link}
                  onClick={() =>
                    handleLinkClick(item.id, item.linkText || 'Learn more', item.link!)
                  }
                >
                  {item.linkText || 'Learn more'}
                  <ArrowRightIcon className={styles.arrowIcon} />
                </a>
              )}
            </li>
          );
        })}
      </ul>

      {allComplete && (
        <div className={styles.successMessage}>
          <CheckIcon className={styles.successIcon} />
          <span>All done! Sentry is successfully configured.</span>
        </div>
      )}
    </div>
  );
}
