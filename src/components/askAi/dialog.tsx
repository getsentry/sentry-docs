'use client';

import * as Dialog from '@radix-ui/react-dialog';
import {Cross1Icon} from '@radix-ui/react-icons';
import {Fragment, useCallback, useEffect, useRef, useState} from 'react';
import {
  AskAiEvent,
  MAX_QUESTION_LENGTH,
  readEventStream,
} from 'sentry-docs/lib/askAi/types';

import {MagicIcon} from '../cutomIcons/magic';
import {Answer, sanitizeAnswer} from './answer';
import styles from './dialog.module.scss';
import {applyAnswerEvent, ChatMessage} from './messages';
import {OpenAskAiOptions} from './provider';

const EXAMPLES = [
  'How to set up Sentry for Next.js?',
  'What are tracePropagationTargets?',
];

async function api(body: object, token: string | null, signal?: AbortSignal) {
  const response = await fetch('/api/ask-ai/', {
    method: 'POST',
    // Preserve an existing preview-protection login. Ask AI never sets cookies.
    credentials: 'same-origin',
    cache: 'no-store',
    referrerPolicy: 'no-referrer',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? {Authorization: `Bearer ${token}`} : {}),
    },
    body: JSON.stringify(body),
    signal,
  });
  if (!response.ok) {
    const result = await response.json().catch(() => ({}));
    throw new Error(
      result.error || 'Ask AI is temporarily unavailable. Use docs search.'
    );
  }
  return response;
}

export default function AskAiDialog({
  open,
  onOpenChange,
  request,
  restoreFocus,
  supportUrl,
  handoffEnabled,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  request: {id: number; options: OpenAskAiOptions};
  restoreFocus: () => void;
  supportUrl: string | null;
  handoffEnabled: boolean;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [question, setQuestion] = useState('');
  const [busy, setBusy] = useState(false);
  const [closed, setClosed] = useState(false);
  const [error, setError] = useState('');
  const [reference, setReference] = useState('');
  const [feedback, setFeedback] = useState<Record<string, string>>({});
  const [capabilities, setCapabilities] = useState({feedback: false, handoff: false});
  const [showSupport, setShowSupport] = useState(false);
  const [email, setEmail] = useState('');
  const [handedOff, setHandedOff] = useState(false);
  const [escalated, setEscalated] = useState(false);
  const [copied, setCopied] = useState(false);
  const token = useRef<string | null>(null);
  const active = useRef<AbortController | null>(null);
  const busyRef = useRef(false);
  const handledRequest = useRef(0);
  const input = useRef<HTMLTextAreaElement>(null);
  const scroll = useRef<HTMLDivElement>(null);
  const followBottom = useRef(true);

  const send = useCallback(async (value: string) => {
    if (!value.trim() || busyRef.current || value.length > MAX_QUESTION_LENGTH) return;
    busyRef.current = true;
    setBusy(true);
    setError('');
    setQuestion('');
    setMessages(previous => [
      ...previous,
      {id: crypto.randomUUID(), role: 'user', text: value.trim()},
    ]);
    followBottom.current = true;
    const controller = new AbortController();
    active.current = controller;
    try {
      if (!token.current) {
        const response = await api(
          {action: 'session', path: window.location.pathname},
          null,
          controller.signal
        );
        const result = await response.json();
        token.current = result.token;
        setCapabilities(result.capabilities || {feedback: false, handoff: false});
      }
      const response = await api(
        {action: 'message', question: value.trim()},
        token.current,
        controller.signal
      );
      if (!response.body) throw new Error('The answer could not be loaded.');
      let finished = false;
      for await (const raw of readEventStream(response.body)) {
        if (controller.signal.aborted) break;
        const event = raw as AskAiEvent;
        if (event.type === 'session') token.current = event.token;
        if (event.type === 'reference') setReference(event.reference);
        if (event.type === 'error') throw new Error(event.message);
        if (event.type === 'chunk' || event.type === 'answer')
          setMessages(previous => applyAnswerEvent(previous, event));
        if (event.type === 'status') {
          if (event.status === 'escalated') setEscalated(true);
          if (['resolved', 'escalated', 'complete'].includes(event.status))
            setClosed(true);
          if (['awaiting_user_reply', 'complete'].includes(event.status)) finished = true;
        }
      }
      if (!finished && !controller.signal.aborted)
        throw new Error(
          'The answer was interrupted. Start a new conversation to try again.'
        );
    } catch (caught) {
      if (!controller.signal.aborted) {
        setError(
          caught instanceof Error ? caught.message : 'The answer could not be loaded.'
        );
        setClosed(true);
      }
    } finally {
      if (active.current === controller) {
        busyRef.current = false;
        setBusy(false);
        active.current = null;
        input.current?.focus();
      }
    }
  }, []);

  const reset = useCallback(() => {
    active.current?.abort();
    active.current = null;
    busyRef.current = false;
    token.current = null;
    setMessages([]);
    setQuestion('');
    setBusy(false);
    setClosed(false);
    setError('');
    setReference('');
    setFeedback({});
    setCapabilities({feedback: false, handoff: false});
    setHandedOff(false);
    setEscalated(false);
    setShowSupport(false);
    setEmail('');
    setCopied(false);
    input.current?.focus();
  }, []);

  useEffect(() => {
    if (request.id === handledRequest.current) return;
    handledRequest.current = request.id;
    if (request.options.query) {
      setQuestion(request.options.query);
      if (request.options.submit && !busyRef.current) {
        if (closed) reset();
        void send(request.options.query);
      }
    }
  }, [request, send, closed, reset]);

  useEffect(() => () => active.current?.abort(), []);
  useEffect(() => {
    if (followBottom.current && scroll.current)
      scroll.current.scrollTop = scroll.current.scrollHeight;
  }, [messages, busy, open]);

  async function rate(messageId: string, rating: string) {
    try {
      await api({action: 'feedback', messageId, rating}, token.current);
      setFeedback(previous => ({...previous, [messageId]: rating}));
    } catch {
      setError('Your feedback could not be saved. Try again.');
    }
  }

  async function copyTranscript() {
    const transcript = messages
      .map(message => {
        const content = message.html
          ? new DOMParser().parseFromString(sanitizeAnswer(message.html), 'text/html')
              .body.textContent
          : message.text;
        return `${message.role === 'user' ? 'You' : 'Sentry'}: ${content}\n${(message.sources || []).map(source => source.url).join('\n')}`;
      })
      .join('\n\n');
    try {
      await navigator.clipboard.writeText(
        `Docs Ask AI\nReference: ${reference}\nPage: ${window.location.pathname}\n\n${transcript}`
      );
      setCopied(true);
    } catch {
      setError(
        'Your browser could not copy the conversation. You can select and copy the text.'
      );
    }
  }

  async function handoff() {
    if (busyRef.current) return;
    busyRef.current = true;
    setBusy(true);
    setError('');
    try {
      await api({action: 'handoff', email}, token.current);
      setHandedOff(true);
      setClosed(true);
      setShowSupport(false);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Could not request support.');
    } finally {
      busyRef.current = false;
      setBusy(false);
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal container={document.querySelector('.radix-themes')}>
        <Dialog.Overlay className={styles.overlay} />
        <Dialog.Content
          className={`${styles.dialog} sentry-block`}
          onOpenAutoFocus={event => {
            event.preventDefault();
            input.current?.focus();
          }}
          onCloseAutoFocus={event => {
            event.preventDefault();
            restoreFocus();
          }}
        >
          <header className={styles.header}>
            <Dialog.Title className={styles.title}>
              <MagicIcon className="size-5" /> Ask AI
            </Dialog.Title>
            <div className={styles.actions}>
              <button type="button" onClick={reset} disabled={busy}>
                New conversation
              </button>
              <Dialog.Close className={styles.close} aria-label="Close Ask AI">
                <Cross1Icon width={20} height={20} />
              </Dialog.Close>
            </div>
          </header>
          <Dialog.Description className={styles.description}>
            Ask a question about Sentry. Get answers with links to the docs.
          </Dialog.Description>
          <div
            className={styles.messages}
            ref={scroll}
            onScroll={() => {
              const element = scroll.current;
              if (element)
                followBottom.current =
                  element.scrollHeight - element.scrollTop - element.clientHeight < 80;
            }}
          >
            {messages.length === 0 && (
              <div className={styles.welcome}>
                <MagicIcon className="size-9" />
                <h2>How can we help?</h2>
                <p>Ask about SDK setup, configuration, or troubleshooting.</p>
                <div className={styles.examples}>
                  {EXAMPLES.map(example => (
                    <button key={example} onClick={() => void send(example)}>
                      {example}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {messages.map(message => (
              <article
                key={message.id}
                className={message.role === 'user' ? styles.question : styles.answer}
              >
                <p className={styles.author}>
                  {message.role === 'user' ? 'You' : 'Sentry'}
                </p>
                {message.html !== undefined ? (
                  <Answer html={message.html} />
                ) : (
                  <div className={styles.plain}>{message.text}</div>
                )}
                {!!message.sources?.length && (
                  <nav aria-label="Answer sources" className={styles.sources}>
                    <strong>Sources</strong>
                    <ol>
                      {message.sources.map((source, index) => (
                        <li key={`${index}:${source.url}`}>
                          <a
                            href={source.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            referrerPolicy="no-referrer"
                          >
                            {source.title}
                          </a>
                        </li>
                      ))}
                    </ol>
                  </nav>
                )}
                {capabilities.feedback && message.html !== undefined && (
                  <div className={styles.feedback} aria-label="Rate this answer">
                    {feedback[message.id] ? (
                      <span>Thanks for your feedback.</span>
                    ) : (
                      <Fragment>
                        <span>Was this helpful?</span>
                        <button
                          disabled={busy}
                          onClick={() => void rate(message.id, 'helpful')}
                        >
                          Yes
                        </button>
                        <button
                          disabled={busy}
                          onClick={() => void rate(message.id, 'unhelpful')}
                        >
                          No
                        </button>
                      </Fragment>
                    )}
                  </div>
                )}
              </article>
            ))}
          </div>
          <div className={styles.status} role="status" aria-live="polite">
            {busy
              ? 'Working on your request…'
              : handedOff
                ? 'Support request sent. The team has your conversation and follow-up email.'
                : closed
                  ? 'This conversation has ended. Start a new one to ask another question.'
                  : ''}
          </div>
          {error && (
            <p role="alert" className={styles.error}>
              {error}
            </p>
          )}
          {showSupport ? (
            <form
              className={styles.composer}
              onSubmit={event => {
                event.preventDefault();
                void handoff();
              }}
            >
              <label htmlFor="ask-ai-email">Email for support to follow up</label>
              <input
                id="ask-ai-email"
                type="email"
                autoComplete="off"
                required
                maxLength={254}
                value={email}
                onChange={event => setEmail(event.target.value)}
              />
              <div className={styles.actions}>
                <button type="button" onClick={() => setShowSupport(false)}>
                  Cancel
                </button>
                <button type="submit" disabled={busy}>
                  Send to support
                </button>
              </div>
            </form>
          ) : (
            <form
              className={styles.composer}
              onSubmit={event => {
                event.preventDefault();
                if (!closed) void send(question);
              }}
            >
              <label htmlFor="ask-ai-question" className="sr-only">
                Your question
              </label>
              <textarea
                id="ask-ai-question"
                ref={input}
                placeholder={
                  messages.length
                    ? 'Ask a follow-up question…'
                    : 'Ask a question about Sentry…'
                }
                value={question}
                maxLength={MAX_QUESTION_LENGTH}
                rows={2}
                disabled={closed}
                onChange={event => setQuestion(event.target.value)}
                onKeyDown={event => {
                  if (
                    event.key === 'Enter' &&
                    !event.shiftKey &&
                    !event.nativeEvent.isComposing
                  ) {
                    event.preventDefault();
                    if (!closed) void send(question);
                  }
                }}
              />
              <button
                className={styles.send}
                type="submit"
                disabled={busy || closed || !question.trim()}
              >
                Ask AI
              </button>
            </form>
          )}
          <footer className={styles.footer}>
            {messages.length > 0 && (
              <div className={styles.actions}>
                <button onClick={() => void copyTranscript()}>
                  {copied ? 'Copied' : 'Copy conversation'}
                </button>
                {handoffEnabled &&
                  capabilities.handoff &&
                  reference &&
                  !handedOff &&
                  !escalated && (
                    <button disabled={busy} onClick={() => setShowSupport(true)}>
                      Contact support
                    </button>
                  )}
                {supportUrl && (
                  <a
                    href={supportUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    referrerPolicy="no-referrer"
                  >
                    {handoffEnabled && capabilities.handoff
                      ? 'Support portal'
                      : 'Contact support'}
                  </a>
                )}
              </div>
            )}
            <p>
              AI answers can be incorrect. Check the sources. Don’t include sensitive or
              personal information in your questions.{' '}
              <a
                href="https://sentry.io/privacy/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Privacy Policy
              </a>
            </p>
            {reference && (
              <p className={styles.reference}>Support reference: {reference}</p>
            )}
          </footer>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
