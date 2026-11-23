'use client';

import {ChevronDownIcon} from '@radix-ui/react-icons';
import * as Sentry from '@sentry/nextjs';
import {type KeyboardEvent, useCallback, useEffect, useId, useRef, useState} from 'react';
import {Check, Copy} from 'react-feather';
import {usePlausibleEvent} from 'sentry-docs/hooks/usePlausibleEvent';
import {DocMetrics} from 'sentry-docs/metrics';

import {CLI_INSTALL_METHODS, type CliInstallMethodId} from '../agentSetupCallout/shared';
import styles from './style.module.scss';

type Props = {
  platformName?: string;
  skill?: string;
  source: 'callout' | 'homepage_card';
};

export function CliInstallCommand({platformName, skill, source}: Props) {
  const [methodId, setMethodId] = useState<CliInstallMethodId>('curl');
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const {emit} = usePlausibleEvent();
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  const method =
    CLI_INSTALL_METHODS.find(item => item.id === methodId) ?? CLI_INSTALL_METHODS[0];

  const copyCommand = useCallback(async () => {
    const title = platformName
      ? `Set up ${platformName} with the CLI`
      : 'Set up with the CLI';

    emit('Copy AI Prompt', {
      props: {page: window.location.pathname, title},
    });

    try {
      setCopied(false);
      await navigator.clipboard.writeText(method.command);
      setCopied(true);
      DocMetrics.copyAIPrompt(window.location.pathname, skill, true, source);
      setTimeout(() => setCopied(false), 1500);
    } catch (error) {
      Sentry.logger.warn('clipboard.writeText failed', {
        error: (error as Error)?.message,
        errorName: (error as Error)?.name,
      });
      DocMetrics.copyAIPrompt(window.location.pathname, skill, false, source);
      setCopied(false);
    }
  }, [emit, method.command, platformName, skill, source]);

  const closeMenu = useCallback((restoreFocus = false) => {
    setOpen(false);
    if (restoreFocus) triggerRef.current?.focus();
  }, []);

  const selectMethod = useCallback(
    (id: CliInstallMethodId) => {
      setMethodId(id);
      closeMenu(true);
    },
    [closeMenu]
  );

  useEffect(() => {
    if (!open) return undefined;

    const selectedIndex = CLI_INSTALL_METHODS.findIndex(item => item.id === methodId);
    setActiveIndex(selectedIndex === -1 ? 0 : selectedIndex);
    listRef.current?.focus();

    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) closeMenu();
    };

    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [closeMenu, methodId, open]);

  const onListKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const lastIndex = CLI_INSTALL_METHODS.length - 1;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex(index => (index >= lastIndex ? 0 : index + 1));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex(index => (index <= 0 ? lastIndex : index - 1));
    } else if (event.key === 'Home') {
      event.preventDefault();
      setActiveIndex(0);
    } else if (event.key === 'End') {
      event.preventDefault();
      setActiveIndex(lastIndex);
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      const next = CLI_INSTALL_METHODS[activeIndex];
      if (next) selectMethod(next.id);
    } else if (event.key === 'Escape') {
      event.preventDefault();
      closeMenu(true);
    } else if (event.key === 'Tab') {
      closeMenu();
    }
  };

  return (
    <div className={`${styles.bar} ${open ? styles.barOpen : ''}`}>
      <div className={styles.method} ref={rootRef}>
        <button
          ref={triggerRef}
          className={styles.methodTrigger}
          type="button"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={listId}
          onClick={() => setOpen(current => !current)}
          onKeyDown={event => {
            if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
              event.preventDefault();
              setOpen(true);
            }
          }}
        >
          <span className={styles.srOnly}>Install method:</span>
          <span>{method.label}</span>
          <ChevronDownIcon className={styles.chevron} aria-hidden />
        </button>
        {open ? (
          <div
            ref={listRef}
            id={listId}
            className={styles.menu}
            role="listbox"
            aria-label="Install method"
            tabIndex={-1}
            aria-activedescendant={`${listId}-${CLI_INSTALL_METHODS[activeIndex]?.id ?? 'curl'}`}
            onKeyDown={onListKeyDown}
          >
            {CLI_INSTALL_METHODS.map((item, index) => (
              <div
                key={item.id}
                id={`${listId}-${item.id}`}
                role="option"
                aria-selected={item.id === methodId}
                data-active={index === activeIndex}
                className={styles.option}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => selectMethod(item.id)}
              >
                {item.label}
              </div>
            ))}
          </div>
        ) : null}
      </div>
      <code className={styles.command}>{method.command}</code>
      <button
        className={styles.copyButton}
        onClick={copyCommand}
        type="button"
        aria-label={copied ? 'Copied' : `Copy ${method.label} install command`}
      >
        {copied ? <Check size={14} /> : <Copy size={14} />}
      </button>
    </div>
  );
}
