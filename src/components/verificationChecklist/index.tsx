'use client';

import {
  Children,
  isValidElement,
  ReactElement,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {ArrowRightIcon, CheckIcon, ChevronDownIcon} from '@radix-ui/react-icons';

import {usePlausibleEvent} from 'sentry-docs/hooks/usePlausibleEvent';

import styles from './style.module.scss';

type ChecklistItemProps = {
  id: string;
  label: string;
  children?: ReactNode;
  description?: string;
  /** Secondary link (usually to docs) */
  docsLink?: string;
  docsLinkText?: string;
  /** Primary link (usually to Sentry UI) */
  link?: string;
  linkText?: string;
  /** Onboarding option ID - shows "(Optional)" when this option is unchecked */
  optionId?: string;
};

// Marker symbol to identify ChecklistItem components
const CHECKLIST_ITEM_MARKER = Symbol.for('sentry-docs-checklist-item');

// Individual checklist item component for use as children
// Note: This component doesn't render anything itself - it's used as a container
// for props/children that VerificationChecklist extracts and renders
function ChecklistItemComponent(_props: ChecklistItemProps) {
  // Return null - VerificationChecklist extracts props and renders items itself
  return null;
}
ChecklistItemComponent.displayName = 'ChecklistItem';
// Static marker for identification
(
  ChecklistItemComponent as unknown as {__checklistItemMarker: symbol}
).__checklistItemMarker = CHECKLIST_ITEM_MARKER;

export const ChecklistItem = ChecklistItemComponent;

type Props = {
  /** Unique identifier for this checklist (used for localStorage) */
  checklistId?: string;
  children?: ReactNode;
  /** Enable collapsible items (default: true) */
  collapsible?: boolean;
  /** Auto-expand next item when current is checked (default: true) */
  sequential?: boolean;
};

function getStorageKey(checklistId: string): string {
  return `sentry-docs-checklist-${checklistId}`;
}

export function VerificationChecklist({
  children,
  checklistId = 'default',
  collapsible = true,
  sequential = true,
}: Props) {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  const [mounted, setMounted] = useState(false);
  const [optionalItemIds, setOptionalItemIds] = useState<Set<string>>(new Set());
  const listRef = useRef<HTMLUListElement>(null);
  const {emit} = usePlausibleEvent();

  // Helper to check if an element is a ChecklistItem
  // MDX may transform the component type, so we check multiple ways
  const isChecklistItemElement = useCallback((child: ReactElement): boolean => {
    const type = child.type;
    const props = child.props as Record<string, unknown>;

    // Check for our static marker (most reliable)
    if (typeof type === 'function') {
      const funcType = type as {
        __checklistItemMarker?: symbol;
        displayName?: string;
        name?: string;
      };
      if (funcType.__checklistItemMarker === CHECKLIST_ITEM_MARKER) {
        return true;
      }
      if (funcType.displayName === 'ChecklistItem' || funcType.name === 'ChecklistItem') {
        return true;
      }
    }

    // Direct reference check
    if (type === ChecklistItem) {
      return true;
    }

    // MDX might set mdxType or originalType
    if (props.mdxType === 'ChecklistItem' || props.originalType === ChecklistItem) {
      return true;
    }

    // Last resort: check if props match ChecklistItem structure and it's not a DOM element
    if (
      typeof type !== 'string' &&
      typeof props.id === 'string' &&
      typeof props.label === 'string'
    ) {
      return true;
    }

    return false;
  }, []);

  // Extract items from children - memoize to avoid infinite loops
  // MDX may wrap children in fragments, so we need to deeply traverse
  const items = useMemo(() => {
    const extracted: ChecklistItemProps[] = [];

    const processChild = (child: ReactNode) => {
      if (!isValidElement(child)) {
        return;
      }

      // Check if this is a ChecklistItem
      if (isChecklistItemElement(child)) {
        const props = child.props as ChecklistItemProps;
        if (props.id && props.label) {
          extracted.push(props);
        }
        return;
      }

      // If it's a fragment or wrapper, recurse into its children
      const childProps = child.props as {children?: ReactNode};
      if (childProps.children) {
        Children.forEach(childProps.children, processChild);
      }
    };

    Children.forEach(children, processChild);
    return extracted;
  }, [children, isChecklistItemElement]);

  // Get the first item ID for initial expanded state
  const firstItemId = items.length > 0 ? items[0].id : null;

  // Load checked items from localStorage on mount and set initial expanded state
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

    // If collapsible, expand the first item by default
    if (collapsible && firstItemId) {
      setExpandedItems({[firstItemId]: true});
    }
  }, [checklistId, collapsible, firstItemId]);

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

  // Watch for which onboarding options are enabled/disabled
  // We watch the OnboardingOptionButtons checkboxes to determine which options are enabled
  useEffect(() => {
    if (!mounted) {
      return undefined;
    }

    const updateOptionalItems = () => {
      const newOptionalIds = new Set<string>();
      const onboardingContainer = document.querySelector('.onboarding-options');

      items.forEach(item => {
        if (item.optionId && onboardingContainer) {
          // Find all Radix checkboxes in the onboarding options
          // The checkbox has data-state="checked" or data-state="unchecked"
          const checkboxes = onboardingContainer.querySelectorAll(
            'button[role="checkbox"]'
          );

          // Map option IDs to their display names
          const optionNameMap: Record<string, string> = {
            performance: 'Tracing',
            'session-replay': 'Session Replay',
            logs: 'Logs',
            'error-monitoring': 'Error Monitoring',
          };

          const optionName = optionNameMap[item.optionId];
          if (!optionName) {
            return;
          }

          // Find the checkbox whose parent label contains the option name
          let isChecked = false;
          checkboxes.forEach(checkbox => {
            const label = checkbox.closest('label');
            if (label && label.textContent?.includes(optionName)) {
              isChecked = checkbox.getAttribute('data-state') === 'checked';
            }
          });

          if (!isChecked) {
            newOptionalIds.add(item.id);
          }
        }
      });
      setOptionalItemIds(newOptionalIds);
    };

    // Initial check after a short delay to let onboarding buttons render
    const initialTimeout = setTimeout(updateOptionalItems, 100);

    // Set up MutationObserver to watch for checkbox state changes
    const observer = new MutationObserver(() => {
      updateOptionalItems();
    });

    // Watch the document for data-state attribute changes on checkboxes
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['data-state'],
      subtree: true,
    });

    // Also listen for click events on the onboarding buttons container
    const handleClick = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.closest('.onboarding-options')) {
        // Delay to let checkbox state update
        setTimeout(updateOptionalItems, 50);
      }
    };
    document.addEventListener('click', handleClick);

    return () => {
      clearTimeout(initialTimeout);
      observer.disconnect();
      document.removeEventListener('click', handleClick);
    };
  }, [items, mounted]);

  // All items are always visible, but some are marked as optional
  const completedCount = items.filter(item => checkedItems[item.id]).length;
  const totalCount = items.length;
  const allComplete = completedCount === totalCount && totalCount > 0;

  const toggleItem = useCallback(
    (itemId: string, itemLabel: string) => {
      // Get current state to calculate new values
      const currentChecked = checkedItems[itemId] ?? false;
      const newChecked = !currentChecked;

      // Update checked state (pure state update)
      setCheckedItems(prev => ({...prev, [itemId]: newChecked}));

      // Side effects happen after state update, outside the updater
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

      // If sequential and checking an item, expand the next unchecked item
      if (sequential && newChecked) {
        const currentIndex = items.findIndex(item => item.id === itemId);
        if (currentIndex !== -1 && currentIndex < items.length - 1) {
          // Find the next unchecked item
          for (let i = currentIndex + 1; i < items.length; i++) {
            if (!checkedItems[items[i].id]) {
              setExpandedItems(prevExpanded => ({
                ...prevExpanded,
                [itemId]: false, // Collapse current
                [items[i].id]: true, // Expand next
              }));
              break;
            }
          }
        }
      }

      // Check if all items are now complete
      const newCompletedCount =
        items.filter(item => (item.id === itemId ? newChecked : checkedItems[item.id])).length;
      if (newCompletedCount === items.length && newChecked) {
        emit('Checklist Complete', {
          props: {
            checklistId,
            page: window.location.pathname,
          },
        });
      }
    },
    [checkedItems, checklistId, emit, items, sequential]
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

  // Get children content for each item
  const getItemChildren = (itemId: string): ReactNode => {
    let itemChildren: ReactNode = null;

    const processChild = (child: ReactNode) => {
      if (!isValidElement(child) || itemChildren !== null) {
        return;
      }

      if (isChecklistItemElement(child)) {
        const props = child.props as ChecklistItemProps;
        if (props.id === itemId) {
          itemChildren = props.children;
        }
        return;
      }

      // If it's a fragment or wrapper, recurse into its children
      const childProps = child.props as {children?: ReactNode};
      if (childProps.children) {
        Children.forEach(childProps.children, processChild);
      }
    };

    Children.forEach(children, processChild);
    return itemChildren;
  };

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
          const isExpanded = collapsible ? expandedItems[item.id] || false : true;
          const itemChildren = getItemChildren(item.id);
          const hasContent = !!itemChildren || !!item.description || !!item.link;
          const isOptional = optionalItemIds.has(item.id);

          return (
            <li
              key={item.id}
              className={`${styles.item} ${hasContent ? styles.hasContent : ''} ${isExpanded ? styles.expanded : styles.collapsed}`}
              data-item-id={item.id}
              {...(item.optionId ? {'data-checklist-option': item.optionId} : {})}
            >
              <div
                className={styles.itemHeader}
                onClick={collapsible ? () => toggleExpanded(item.id) : undefined}
                style={collapsible ? {cursor: 'pointer'} : undefined}
              >
                <div className={styles.headerLeft}>
                  <span className={styles.checkboxWrapper}>
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={e => {
                        e.stopPropagation();
                        toggleItem(item.id, item.label);
                      }}
                      onClick={e => e.stopPropagation()}
                      className={styles.checkbox}
                    />
                    <span
                      className={`${styles.customCheckbox} ${isChecked ? styles.checked : ''}`}
                      onClick={e => {
                        e.stopPropagation();
                        toggleItem(item.id, item.label);
                      }}
                    >
                      {isChecked && <CheckIcon className={styles.checkIcon} />}
                    </span>
                  </span>
                  <span className={styles.labelContainer}>
                    <span
                      className={`${styles.labelText} ${isChecked ? styles.checked : ''}`}
                    >
                      {item.label}
                      {isOptional && (
                        <span className={styles.optionalBadge}>(Optional)</span>
                      )}
                    </span>
                  </span>
                </div>
                <div className={styles.headerRight}>
                  {item.docsLink && (
                    <a
                      href={item.docsLink}
                      className={styles.docsLink}
                      onClick={e => {
                        e.stopPropagation();
                        handleLinkClick(
                          item.id,
                          item.docsLinkText || 'Learn more',
                          item.docsLink!
                        );
                      }}
                    >
                      {item.docsLinkText || 'Learn more'}
                    </a>
                  )}
                  {collapsible && (
                    <button
                      type="button"
                      className={`${styles.expandButton} ${isExpanded ? styles.expanded : ''}`}
                      onClick={e => {
                        e.stopPropagation();
                        toggleExpanded(item.id);
                      }}
                      aria-expanded={isExpanded}
                      aria-label={isExpanded ? 'Collapse' : 'Expand'}
                    >
                      <ChevronDownIcon className={styles.chevronIcon} />
                    </button>
                  )}
                </div>
              </div>
              {isExpanded && hasContent && (
                <div className={styles.expandedContent}>
                  {item.description && (
                    <p className={styles.expandedDescription}>{item.description}</p>
                  )}
                  {item.link && (
                    <a
                      href={item.link}
                      target={item.link.startsWith('http') ? '_blank' : undefined}
                      rel={
                        item.link.startsWith('http') ? 'noopener noreferrer' : undefined
                      }
                      className={styles.primaryLink}
                      onClick={() =>
                        handleLinkClick(item.id, item.linkText || 'Open', item.link!)
                      }
                    >
                      {item.linkText || 'Open'}
                      <ArrowRightIcon className={styles.arrowIcon} />
                    </a>
                  )}
                  {itemChildren && (
                    <div className={styles.itemContent}>{itemChildren}</div>
                  )}
                </div>
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
