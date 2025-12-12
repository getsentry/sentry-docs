'use client';

import {ReactNode, useCallback, useEffect, useRef, useState} from 'react';
import {ArrowRightIcon, CheckIcon, ChevronDownIcon} from '@radix-ui/react-icons';

import {usePlausibleEvent} from 'sentry-docs/hooks/usePlausibleEvent';

import styles from './style.module.scss';

type ChecklistItem = {
  id: string;
  label: string;
  /** Expandable content (code blocks, additional details) */
  content?: ReactNode;
  description?: string;
  /** Secondary link (usually to docs) */
  docsLink?: string;
  docsLinkText?: string;
  /** Primary link (usually to Sentry UI) */
  link?: string;
  linkText?: string;
  /** Onboarding option ID - item will be hidden when this option is unchecked */
  optionId?: string;
};

type Props = {
  /** Unique identifier for this checklist (used for localStorage) */
  checklistId?: string;
  /** Items to display in the checklist */
  items?: ChecklistItem[];
  /** Troubleshooting link URL */
  troubleshootingLink?: string;
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
  troubleshootingLink = '/platforms/javascript/guides/nextjs/troubleshooting/',
}: Props) {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  const [mounted, setMounted] = useState(false);
  const [visibleItemIds, setVisibleItemIds] = useState<Set<string>>(
    new Set(items.map(item => item.id))
  );
  const listRef = useRef<HTMLUListElement>(null);
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

  // Watch for visibility changes on items with data-onboarding-option
  useEffect(() => {
    if (!listRef.current) {
      return undefined;
    }

    const updateVisibleItems = () => {
      const newVisibleIds = new Set<string>();
      items.forEach(item => {
        if (!item.optionId) {
          // Items without optionId are always visible
          newVisibleIds.add(item.id);
        } else {
          // Check if the item element is hidden
          const element = listRef.current?.querySelector(`[data-item-id="${item.id}"]`);
          if (element && !element.classList.contains('hidden')) {
            newVisibleIds.add(item.id);
          }
        }
      });
      setVisibleItemIds(newVisibleIds);
    };

    // Initial check
    updateVisibleItems();

    // Set up MutationObserver to watch for class changes
    const observer = new MutationObserver(mutations => {
      const hasRelevantChange = mutations.some(
        mutation =>
          mutation.type === 'attributes' &&
          mutation.attributeName === 'class' &&
          (mutation.target as HTMLElement).hasAttribute('data-onboarding-option')
      );
      if (hasRelevantChange) {
        updateVisibleItems();
      }
    });

    observer.observe(listRef.current, {
      attributes: true,
      attributeFilter: ['class'],
      subtree: true,
    });

    return () => observer.disconnect();
  }, [items, mounted]);

  const visibleItems = items.filter(item => visibleItemIds.has(item.id));
  const completedCount = visibleItems.filter(item => checkedItems[item.id]).length;
  const totalCount = visibleItems.length;
  const allComplete = completedCount === totalCount && totalCount > 0;

  const toggleItem = useCallback(
    (itemId: string, itemLabel: string) => {
      setCheckedItems(prev => {
        const newChecked = !prev[itemId];
        const newState = {...prev, [itemId]: newChecked};

        // Emit event for checking/unchecking item
        emit('Checklist Item Toggle', {
          props: {
            checked: newChecked,
            checklistId,
            itemId,
            itemLabel,
            page: window.location.pathname,
          },
        });

        // Check if all visible items are now complete
        const newCompletedCount = visibleItems.filter(item => newState[item.id]).length;
        if (newCompletedCount === visibleItems.length && newChecked) {
          emit('Checklist Complete', {
            props: {
              checklistId,
              page: window.location.pathname,
            },
          });
        }

        return newState;
      });
    },
    [checklistId, emit, visibleItems]
  );

  const toggleExpanded = useCallback((itemId: string) => {
    setExpandedItems(prev => ({...prev, [itemId]: !prev[itemId]}));
  }, []);

  const handleLinkClick = useCallback(
    (itemId: string, linkText: string, link: string) => {
      emit('Checklist Link Click', {
        props: {
          checklistId,
          itemId,
          link,
          linkText,
          page: window.location.pathname,
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
            style={{
              width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%`,
            }}
          />
        </div>
        <span className={styles.progressText}>
          {completedCount} of {totalCount} complete
        </span>
      </div>

      <ul className={styles.items} ref={listRef}>
        {items.map(item => {
          const isChecked = checkedItems[item.id] || false;
          const isExpanded = expandedItems[item.id] || false;
          const hasContent = !!item.content;

          return (
            <li
              key={item.id}
              className={`${styles.item} ${hasContent ? styles.hasContent : ''}`}
              data-item-id={item.id}
              {...(item.optionId ? {'data-onboarding-option': item.optionId} : {})}
            >
              <div className={styles.itemHeader}>
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
                    <span className={styles.descriptionRow}>
                      {item.description && (
                        <span className={styles.description}>{item.description}</span>
                      )}
                      {item.link && (
                        <a
                          href={item.link}
                          target={item.link.startsWith('http') ? '_blank' : undefined}
                          rel={
                            item.link.startsWith('http') ? 'noopener noreferrer' : undefined
                          }
                          className={styles.link}
                          onClick={e => {
                            e.stopPropagation();
                            handleLinkClick(item.id, item.linkText || 'Open', item.link!);
                          }}
                        >
                          {item.linkText || 'Open'}
                          <ArrowRightIcon className={styles.arrowIcon} />
                        </a>
                      )}
                    </span>
                  </span>
                </label>
                <div className={styles.itemActions}>
                  {item.docsLink && (
                    <a
                      href={item.docsLink}
                      className={styles.docsLink}
                      onClick={() =>
                        handleLinkClick(
                          item.id,
                          item.docsLinkText || 'Learn more',
                          item.docsLink!
                        )
                      }
                    >
                      {item.docsLinkText || 'Learn more'}
                    </a>
                  )}
                  {hasContent && (
                    <button
                      type="button"
                      className={`${styles.expandButton} ${isExpanded ? styles.expanded : ''}`}
                      onClick={() => toggleExpanded(item.id)}
                      aria-expanded={isExpanded}
                      aria-label={isExpanded ? 'Collapse details' : 'Expand details'}
                    >
                      <ChevronDownIcon className={styles.chevronIcon} />
                    </button>
                  )}
                </div>
              </div>
              {hasContent && isExpanded && (
                <div className={styles.expandedContent}>{item.content}</div>
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

      <div className={styles.troubleshooting}>
        Something not working?{' '}
        <a href={troubleshootingLink}>Check troubleshooting</a>
        {' · '}
        <a href="https://sentry.zendesk.com/hc/en-us/">Get support</a>
      </div>
    </div>
  );
}
