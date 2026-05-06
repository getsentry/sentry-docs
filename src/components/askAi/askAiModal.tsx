'use client';

import {
  ArrowUpIcon,
  ChatBubbleIcon,
  CopyIcon,
  Cross1Icon,
  ExclamationTriangleIcon,
  PlusIcon,
  ReloadIcon,
  StopIcon,
} from '@radix-ui/react-icons';
import {toJsxRuntime} from 'hast-util-to-jsx-runtime';
import type {ReactNode} from 'react';
import {Fragment, useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {jsx, jsxs} from 'react/jsx-runtime';
import {refractor} from 'refractor/lib/common';
import {MagicIcon} from 'sentry-docs/components/cutomIcons/magic';

import {useAskAi} from './askAiContext';

const ASK_AI_API_URL =
  process.env.NEXT_PUBLIC_ASK_AI_API_URL ?? 'https://docs-mcp.getsentry.workers.dev';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

type ToolStatus = {tool: string; state: 'running' | 'done'};

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const EXAMPLE_QUESTIONS = [
  {label: 'Set up Sentry', question: 'How do I set up Sentry for Next.js?'},
  {label: 'Debug source maps', question: 'How do I debug missing source maps?'},
  {label: 'Session Replay', question: 'How do I configure Session Replay?'},
];

const TOOL_LABELS: Record<string, string> = {
  search_docs: 'Searching documentation',
  fetch_doc_page: 'Reading page',
};

// ---------------------------------------------------------------------------
// SSE helpers
// ---------------------------------------------------------------------------

interface SSEEvent {
  type: string;
  data: Record<string, unknown>;
}

function parseSSEChunk(buffer: string): {events: SSEEvent[]; remaining: string} {
  const events: SSEEvent[] = [];
  const blocks = buffer.split('\n\n');
  const remaining = blocks.pop() ?? '';

  for (const block of blocks) {
    if (!block.trim()) {
      continue;
    }
    let eventType = 'message';
    let data = '';

    for (const line of block.split('\n')) {
      if (line.startsWith('event: ')) {
        eventType = line.slice(7).trim();
      } else if (line.startsWith('data: ')) {
        data = line.slice(6);
      }
    }

    if (data) {
      try {
        events.push({type: eventType, data: JSON.parse(data)});
      } catch {
        // skip malformed JSON
      }
    }
  }

  return {events, remaining};
}

// ---------------------------------------------------------------------------
// Scroll helpers
// ---------------------------------------------------------------------------

/** Returns true when the scrollable element is within threshold px of bottom. */
function isNearBottom(el: HTMLElement, threshold = 80): boolean {
  return el.scrollHeight - el.scrollTop - el.clientHeight < threshold;
}

// ---------------------------------------------------------------------------
// AskAiModal
// ---------------------------------------------------------------------------

export function AskAiModal() {
  const {isOpen, initialQuery, autoSubmit, close} = useAskAi();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [toolStatus, setToolStatus] = useState<ToolStatus | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const hasAutoSubmitted = useRef(false);
  const abortRef = useRef<AbortController | null>(null);
  const shouldAutoScroll = useRef(true);

  // -- actions ---------------------------------------------------------------

  const handleStop = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  const submitMessage = useCallback(
    async (messageText?: string) => {
      const text = (messageText ?? input).trim();
      if (!text || isStreaming) {
        return;
      }

      setError(null);
      setToolStatus(null);
      shouldAutoScroll.current = true;
      const userMessage: Message = {role: 'user', content: text};
      const newMessages = [...messages, userMessage];
      setMessages(newMessages);
      setInput('');
      setIsStreaming(true);

      // Reset textarea height
      if (inputRef.current) {
        inputRef.current.style.height = 'auto';
      }

      const abort = new AbortController();
      abortRef.current = abort;

      try {
        const response = await fetch(`${ASK_AI_API_URL}/api/ask`, {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({messages: newMessages}),
          signal: abort.signal,
        });

        if (!response.ok) {
          const errBody = await response.text();
          throw new Error(errBody || `HTTP ${response.status}`);
        }

        const reader = response.body?.getReader();
        if (!reader) {
          throw new Error('No response body');
        }

        const decoder = new TextDecoder();
        setMessages(prev => [...prev, {role: 'assistant', content: ''}]);

        let sseBuffer = '';
        let done = false;
        while (!done) {
          const result = await reader.read();
          done = result.done;
          if (result.value) {
            sseBuffer += decoder.decode(result.value, {stream: true});
            const {events, remaining} = parseSSEChunk(sseBuffer);
            sseBuffer = remaining;

            for (const evt of events) {
              switch (evt.type) {
                case 'text':
                  if (typeof evt.data.text === 'string') {
                    setMessages(prev => {
                      const updated = [...prev];
                      const last = updated[updated.length - 1];
                      updated[updated.length - 1] = {
                        role: 'assistant',
                        content: last.content + evt.data.text,
                      };
                      return updated;
                    });
                  }
                  break;
                case 'tool_start':
                  setToolStatus({tool: String(evt.data.tool), state: 'running'});
                  break;
                case 'tool_end':
                  setToolStatus({tool: String(evt.data.tool), state: 'done'});
                  break;
                case 'error':
                  setError(friendlyError(String(evt.data.message)));
                  break;
                case 'done':
                  break;
                default:
                  break;
              }
            }
          }
        }
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') {
          // User cancelled
        } else {
          const raw = err instanceof Error ? err.message : 'Unknown error';
          setError(friendlyError(raw));
          setMessages(prev => {
            if (prev.length > 0 && prev[prev.length - 1].content === '') {
              return prev.slice(0, -1);
            }
            return prev;
          });
        }
      } finally {
        setIsStreaming(false);
        setToolStatus(null);
        abortRef.current = null;
      }
    },
    [input, messages, isStreaming]
  );

  // -- effects ---------------------------------------------------------------

  useEffect(() => {
    if (isOpen && initialQuery && !hasAutoSubmitted.current) {
      setInput(initialQuery);
      if (autoSubmit) {
        hasAutoSubmitted.current = true;
        setTimeout(() => submitMessage(initialQuery), 0);
      }
    }
    if (!isOpen) {
      hasAutoSubmitted.current = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, initialQuery, autoSubmit]);

  useEffect(() => {
    if (isOpen && !autoSubmit) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, autoSubmit]);

  // Auto-scroll only when user hasn't scrolled up
  useEffect(() => {
    if (shouldAutoScroll.current) {
      messagesEndRef.current?.scrollIntoView({behavior: 'smooth'});
    }
  }, [messages, toolStatus]);

  // Track scroll position to decide auto-scroll
  useEffect(() => {
    const el = scrollAreaRef.current;
    if (!el) {
      return undefined;
    }
    const onScroll = () => {
      shouldAutoScroll.current = isNearBottom(el);
    };
    el.addEventListener('scroll', onScroll, {passive: true});
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        close();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, close]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
    return undefined;
  }, [isOpen]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      submitMessage();
    },
    [submitMessage]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        submitMessage();
      }
    },
    [submitMessage]
  );

  const handleNewConversation = useCallback(() => {
    abortRef.current?.abort();
    setMessages([]);
    setInput('');
    setError(null);
    setCopiedIndex(null);
    setToolStatus(null);
    shouldAutoScroll.current = true;
    inputRef.current?.focus();
  }, []);

  const handleCopy = useCallback((text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  }, []);

  const handleRetry = useCallback(() => {
    if (messages.length < 2) {
      return;
    }
    const lastUserMsg = [...messages].reverse().find(m => m.role === 'user');
    if (lastUserMsg) {
      setMessages(prev => {
        const idx = prev.findLastIndex(m => m.role === 'user');
        return prev.slice(0, idx);
      });
      setTimeout(() => submitMessage(lastUserMsg.content), 0);
    }
  }, [messages, submitMessage]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={close}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        className="ask-ai-modal relative w-full sm:max-w-2xl sm:mx-4 h-[85vh] sm:max-h-[min(740px,85vh)] rounded-t-xl sm:rounded-xl bg-[var(--gray-2)] border border-[var(--gray-6)] flex flex-col overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-label="Ask AI"
        style={{
          boxShadow: '0 8px 40px rgba(0, 0, 0, 0.25), 0 2px 12px rgba(0, 0, 0, 0.15)',
          animation: 'askAiSlideUp 0.15s ease-out',
        }}
      >
        {/* Mobile drag handle */}
        <div className="sm:hidden flex justify-center pt-2 pb-0 shrink-0">
          <div className="w-9 h-1 rounded-full bg-[var(--gray-a6)]" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-5 h-12 border-b border-[var(--gray-5)] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="size-7 rounded-lg bg-[var(--accent-purple)] flex items-center justify-center">
              <MagicIcon className="size-4 text-white" />
            </div>
            <h2 className="text-sm font-medium text-[var(--foreground)]">Sentry AI</h2>
          </div>
          <div className="flex items-center gap-1">
            {messages.length > 0 && (
              <button
                type="button"
                onClick={handleNewConversation}
                className="flex items-center gap-1.5 text-xs text-[var(--gray-11)] hover:text-[var(--foreground)] h-7 px-2.5 rounded-lg hover:bg-[var(--gray-4)] transition-colors"
                title="New conversation"
              >
                <PlusIcon width={12} height={12} />
                <span className="hidden sm:inline">New chat</span>
              </button>
            )}
            <button
              type="button"
              onClick={close}
              className="size-7 flex items-center justify-center rounded-lg hover:bg-[var(--gray-4)] transition-colors text-[var(--gray-11)] hover:text-[var(--foreground)]"
              aria-label="Close"
            >
              <Cross1Icon width={14} height={14} />
            </button>
          </div>
        </div>

        {/* Messages area */}
        <div ref={scrollAreaRef} className="flex-1 overflow-y-auto min-h-0">
          {messages.length === 0 ? (
            <EmptyState onSubmit={submitMessage} />
          ) : (
            <div className="px-4 sm:px-5 py-4 space-y-5">
              {messages.map((msg, i) => {
                const isLastAssistant =
                  msg.role === 'assistant' && i === messages.length - 1;
                return (
                  <div key={i}>
                    {msg.role === 'user' ? (
                      <UserMessage content={msg.content} />
                    ) : (
                      <AssistantMessage
                        content={msg.content}
                        isStreaming={isStreaming && isLastAssistant}
                        toolStatus={isStreaming && isLastAssistant ? toolStatus : null}
                        isCopied={copiedIndex === i}
                        isLast={isLastAssistant}
                        onCopy={() => handleCopy(msg.content, i)}
                        onRetry={handleRetry}
                      />
                    )}
                  </div>
                );
              })}

              {error && (
                <div className="flex items-start gap-3" role="alert">
                  <div className="size-6 rounded-full bg-red-100 dark:bg-red-500/10 flex items-center justify-center shrink-0 mt-0.5">
                    <ExclamationTriangleIcon className="size-3.5 text-red-600 dark:text-red-400" />
                  </div>
                  <div className="text-sm text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-500/10 rounded-lg px-4 py-3 border border-red-200 dark:border-red-500/20">
                    {error}
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input area */}
        <div className="shrink-0 px-4 sm:px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-2">
          <form
            onSubmit={handleSubmit}
            className="ask-ai-input relative rounded-xl border border-[var(--gray-5)] bg-[var(--gray-3)] transition-[border-color,box-shadow] duration-150"
          >
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask a question about Sentry..."
              rows={1}
              className="w-full resize-none bg-transparent px-4 pt-3 pb-10 text-base sm:text-sm text-[var(--foreground)] placeholder:text-[var(--gray-9)] focus:outline-none max-h-36"
              disabled={isStreaming}
              style={{height: 'auto', minHeight: '44px'}}
              onInput={e => {
                const t = e.target as HTMLTextAreaElement;
                t.style.height = 'auto';
                t.style.height = `${Math.min(t.scrollHeight, 144)}px`;
              }}
            />
            <div className="absolute bottom-2 right-2 flex items-center">
              {isStreaming ? (
                <button
                  type="button"
                  onClick={handleStop}
                  className="size-7 flex items-center justify-center rounded-lg bg-[var(--gray-4)] text-[var(--foreground)] hover:bg-[var(--gray-5)] transition-colors"
                  aria-label="Stop generating"
                  title="Stop generating"
                >
                  <StopIcon width={14} height={14} />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="size-7 flex items-center justify-center rounded-lg bg-[var(--accent-purple)] text-white disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
                  aria-label="Send message"
                >
                  <ArrowUpIcon width={14} height={14} />
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      <style>{`
        @keyframes askAiSlideUp {
          from { opacity: 0; transform: translateY(12px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0)    scale(1);    }
        }
        @keyframes askAiPulse {
          0%, 80%, 100% { opacity: 0.4; transform: scale(0.8); }
          40% { opacity: 1; transform: scale(1); }
        }
        @keyframes askAiCursorBlink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.2; }
        }

        /* Focus ring — use a real rgba so it works without Tailwind color decomposition */
        .ask-ai-input:focus-within {
          border-color: rgba(106, 95, 193, 0.4);
          box-shadow: 0 0 0 3px rgba(106, 95, 193, 0.1);
        }

        /* Code block styles matching the site */
        .ask-ai-code-block pre[class*="language-"] {
          margin: 0 !important;
          border-radius: 0 0 6px 6px !important;
          border: 1px solid var(--accent-11) !important;
          border-top: none !important;
          font-size: 0.85rem !important;
          scrollbar-width: thin;
          scrollbar-color: rgba(148, 129, 164, 0.4) transparent;
        }
        .ask-ai-code-block pre[class*="language-"]::-webkit-scrollbar { height: 6px; }
        .ask-ai-code-block pre[class*="language-"]::-webkit-scrollbar-track { background: transparent; }
        .ask-ai-code-block pre[class*="language-"]::-webkit-scrollbar-thumb {
          background-color: rgba(148, 129, 164, 0.4);
          border-radius: 9999px;
        }

        /* Prose styles for AI responses */
        .ask-ai-prose p { margin: 0.5rem 0; }
        .ask-ai-prose p:first-child { margin-top: 0; }
        .ask-ai-prose p:last-child { margin-bottom: 0; }
        .ask-ai-prose ul, .ask-ai-prose ol { margin: 0.5rem 0; }
        .ask-ai-prose li { margin: 0.125rem 0; }
        .ask-ai-prose li > p { margin: 0; }
        .ask-ai-prose strong { font-weight: 500; }
        .ask-ai-prose pre { font-family: var(--font-family-monospace); }
        .ask-ai-prose > :first-child { margin-top: 0; }

        /* Modal shadow + border for dark mode */
        .dark .ask-ai-modal {
          box-shadow: 0 8px 40px rgba(0, 0, 0, 0.5), 0 2px 12px rgba(0, 0, 0, 0.4) !important;
        }
      `}</style>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Friendly error messages
// ---------------------------------------------------------------------------

function friendlyError(raw: string): string {
  if (raw.includes('429') || raw.toLowerCase().includes('rate limit')) {
    return 'Too many requests. Please wait a moment and try again.';
  }
  if (raw.includes('500') || raw.includes('502') || raw.includes('503')) {
    return 'Something went wrong on our end. Please try again.';
  }
  if (raw.includes('Failed to fetch') || raw.includes('NetworkError')) {
    return 'Network error. Check your connection and try again.';
  }
  return 'Something went wrong. Please try again.';
}

// ---------------------------------------------------------------------------
// EmptyState
// ---------------------------------------------------------------------------

function EmptyState({onSubmit}: {onSubmit: (q: string) => void}) {
  return (
    <div className="flex flex-col items-center justify-center h-full px-6 py-12">
      <div className="size-12 rounded-2xl bg-[var(--accent-purple)] flex items-center justify-center mb-5">
        <MagicIcon className="size-6 text-white" />
      </div>
      <h3 className="text-lg font-semibold text-[var(--foreground)] mb-1.5">
        Ask Sentry AI
      </h3>
      <p className="text-sm text-[var(--gray-10)] mb-8 text-center max-w-sm">
        Get answers from the official Sentry documentation. Ask about setup,
        configuration, troubleshooting, and more.
      </p>
      <div className="w-full max-w-sm space-y-2">
        {EXAMPLE_QUESTIONS.map(({label, question}) => (
          <button
            type="button"
            key={question}
            onClick={() => onSubmit(question)}
            aria-label={question}
            className="w-full flex items-center gap-3 text-left px-4 py-3 rounded-xl border border-[var(--gray-5)] hover:border-[var(--gray-7)] hover:bg-[var(--gray-3)] text-sm text-[var(--gray-12)] transition-all group"
          >
            <ChatBubbleIcon
              width={14}
              height={14}
              className="text-[var(--gray-8)] group-hover:text-[var(--accent-purple)] transition-colors shrink-0"
            />
            <span>{label}</span>
            <ArrowUpIcon
              width={12}
              height={12}
              className="ml-auto text-[var(--gray-7)] group-hover:text-[var(--gray-10)] -rotate-45 transition-colors shrink-0"
            />
          </button>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// UserMessage
// ---------------------------------------------------------------------------

function UserMessage({content}: {content: string}) {
  return (
    <div className="flex justify-end">
      <div className="max-w-[85%] rounded-2xl rounded-br-md bg-[var(--accent-purple)] text-white px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap">
        {content}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// AssistantMessage
// ---------------------------------------------------------------------------

function AssistantMessage({
  content,
  isStreaming,
  toolStatus,
  isCopied,
  isLast,
  onCopy,
  onRetry,
}: {
  content: string;
  isStreaming: boolean;
  toolStatus: ToolStatus | null;
  isCopied: boolean;
  isLast: boolean;
  onCopy: () => void;
  onRetry: () => void;
}) {
  const isEmpty = content.length === 0;

  return (
    <div className="flex gap-3">
      <div className="hidden sm:flex size-6 rounded-lg bg-[var(--gray-4)] items-center justify-center shrink-0 mt-0.5">
        <MagicIcon className="size-3.5 text-[var(--accent-purple)]" />
      </div>

      <div className="min-w-0 flex-1" aria-live={isStreaming ? 'polite' : undefined}>
        {isStreaming && (isEmpty || toolStatus?.state === 'running') && (
          <ToolStatusIndicator toolStatus={toolStatus} />
        )}

        {!isEmpty && (
          <div className="ask-ai-prose text-sm text-[var(--foreground)] leading-relaxed">
            <MarkdownContent content={content} />
            {isStreaming && (
              <span
                className="inline-block w-0.5 h-[1.1em] bg-[var(--accent-purple)] ml-0.5 align-text-bottom rounded-full"
                style={{animation: 'askAiCursorBlink 1s ease-in-out infinite'}}
              />
            )}
          </div>
        )}

        {!isEmpty && !isStreaming && isLast && (
          <div className="flex items-center gap-1 mt-2.5">
            <button
              type="button"
              onClick={onCopy}
              className="flex items-center gap-1.5 h-7 px-2 rounded-md text-[var(--gray-9)] hover:text-[var(--foreground)] hover:bg-[var(--gray-4)] transition-colors text-xs"
              title="Copy response"
            >
              <CopyIcon width={12} height={12} />
              <span aria-live="polite">{isCopied ? 'Copied' : 'Copy'}</span>
            </button>
            <button
              type="button"
              onClick={onRetry}
              className="flex items-center gap-1.5 h-7 px-2 rounded-md text-[var(--gray-9)] hover:text-[var(--foreground)] hover:bg-[var(--gray-4)] transition-colors text-xs"
              title="Retry"
            >
              <ReloadIcon width={12} height={12} />
              Retry
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// ToolStatusIndicator
// ---------------------------------------------------------------------------

function ToolStatusIndicator({toolStatus}: {toolStatus: ToolStatus | null}) {
  const label = toolStatus
    ? (TOOL_LABELS[toolStatus.tool] ?? toolStatus.tool)
    : 'Thinking';

  return (
    <div
      className="flex items-center gap-2.5 py-1.5 text-xs text-[var(--gray-9)]"
      role="status"
      aria-live="polite"
    >
      <span className="flex gap-1">
        <span
          className="size-1.5 rounded-full bg-[var(--gray-8)]"
          style={{animation: 'askAiPulse 1.4s ease-in-out infinite'}}
        />
        <span
          className="size-1.5 rounded-full bg-[var(--gray-8)]"
          style={{animation: 'askAiPulse 1.4s ease-in-out 0.2s infinite'}}
        />
        <span
          className="size-1.5 rounded-full bg-[var(--gray-8)]"
          style={{animation: 'askAiPulse 1.4s ease-in-out 0.4s infinite'}}
        />
      </span>
      {label}...
    </div>
  );
}

// ---------------------------------------------------------------------------
// Markdown rendering
// ---------------------------------------------------------------------------

function MarkdownContent({content}: {content: string}) {
  const rendered = useMemo(() => renderMarkdown(content), [content]);
  return <Fragment>{rendered}</Fragment>;
}

function highlightCode(code: string, lang: string): ReactNode {
  try {
    if (lang && refractor.registered(lang)) {
      const tree = refractor.highlight(code, lang);
      return toJsxRuntime(tree as Parameters<typeof toJsxRuntime>[0], {
        Fragment,
        jsx,
        jsxs,
      });
    }
  } catch {
    // fall through
  }
  return code;
}

// ---------------------------------------------------------------------------
// AiCodeBlock — matches the site's CodeBlock look
// ---------------------------------------------------------------------------

function AiCodeBlock({code, language}: {code: string; language: string}) {
  const [copied, setCopied] = useState(false);
  const highlighted = useMemo(() => highlightCode(code, language), [code, language]);

  const onCopy = useCallback(() => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  }, [code]);

  return (
    <div className="ask-ai-code-block relative my-3 group">
      {/* Header bar — integrated into the dark container */}
      <div className="flex items-center justify-between h-8 px-3 rounded-t-md bg-[#251f3d] border border-b-0 border-[var(--accent-11)]">
        <span className="text-[11px] text-[#9481a4] font-mono select-none">
          {language && language !== 'text' ? language : ''}
        </span>
        <button
          type="button"
          onClick={onCopy}
          className="flex items-center gap-1 text-[11px] text-[#9481a4] hover:text-[#f2edf6] transition-colors"
          title="Copy code"
        >
          <CopyIcon width={12} height={12} />
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre className={`language-${language || 'text'}`}>
        <code className={language ? `language-${language}` : ''}>{highlighted}</code>
      </pre>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Block-level markdown parser
// ---------------------------------------------------------------------------

function renderMarkdown(md: string): ReactNode[] {
  const out: ReactNode[] = [];
  const parts = md.split(/(```[\w.+-]*\n[\s\S]*?```)/g);

  for (const part of parts) {
    const fenceMatch = part.match(/^```([\w.+-]*)\n([\s\S]*?)```$/);
    if (fenceMatch) {
      out.push(
        <AiCodeBlock
          key={out.length}
          language={fenceMatch[1] || 'text'}
          code={fenceMatch[2]}
        />
      );
      continue;
    }

    const blocks = part.split(/\n\n+/);
    for (const block of blocks) {
      const trimmed = block.trim();
      if (!trimmed) {
        continue;
      }
      const node = parseBlock(trimmed, out.length);
      if (node) {
        out.push(node);
      }
    }
  }

  return out;
}

function parseBlock(text: string, keyBase: number): ReactNode {
  const lines = text.split('\n');

  if (/^(-{3,}|\*{3,}|_{3,})$/.test(text)) {
    return <hr key={keyBase} className="my-4 border-[var(--gray-5)]" />;
  }

  const hMatch = lines[0].match(/^(#{1,4})\s+(.+)$/);
  if (hMatch && lines.length === 1) {
    const depth = hMatch[1].length;
    const Tag = `h${Math.min(depth + 1, 6)}` as keyof JSX.IntrinsicElements;
    return (
      <Tag key={keyBase} className={HEADING_CLASSES[depth] ?? HEADING_CLASSES[4]}>
        {renderInline(hMatch[2])}
      </Tag>
    );
  }

  if (lines.every(l => l.startsWith('> ') || l === '>')) {
    return (
      <blockquote
        key={keyBase}
        className="border-l-2 border-[var(--gray-6)] pl-4 my-3 text-[var(--gray-11)]"
      >
        <p className="my-0">
          {renderInline(lines.map(l => (l === '>' ? '' : l.slice(2))).join('\n'))}
        </p>
      </blockquote>
    );
  }

  if (lines.length >= 2 && lines[0].includes('|') && /^\|?[\s:|-]+\|?$/.test(lines[1])) {
    return renderTable(lines, keyBase);
  }

  if (lines.length > 0 && lines.every(l => /^\s*[-*]\s/.test(l))) {
    return (
      <ul key={keyBase} className="my-2 pl-5 list-disc space-y-1">
        {lines.map((l, i) => (
          <li key={i}>{renderInline(l.replace(/^\s*[-*]\s+/, ''))}</li>
        ))}
      </ul>
    );
  }

  if (lines.length > 0 && lines.every(l => /^\s*\d+[.)]\s/.test(l))) {
    return (
      <ol key={keyBase} className="my-2 pl-5 list-decimal space-y-1">
        {lines.map((l, i) => (
          <li key={i}>{renderInline(l.replace(/^\s*\d+[.)]\s+/, ''))}</li>
        ))}
      </ol>
    );
  }

  return (
    <p key={keyBase} className="my-2 first:mt-0">
      {renderInline(text)}
    </p>
  );
}

const HEADING_CLASSES: Record<number, string> = {
  1: 'text-base font-semibold mt-5 mb-2',
  2: 'text-base font-semibold mt-4 mb-2',
  3: 'text-sm font-semibold mt-3 mb-1.5',
  4: 'text-sm font-medium mt-3 mb-1',
};

function renderTable(lines: string[], key: number): ReactNode {
  const split = (row: string) =>
    row
      .replace(/^\||\|$/g, '')
      .split('|')
      .map(c => c.trim());

  const header = split(lines[0]);
  const rows = lines.slice(2).filter(l => l.includes('|'));

  return (
    <div key={key} className="my-3 overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr>
            {header.map((cell, i) => (
              <th
                key={i}
                className="text-left font-semibold pb-2 pr-4 border-b border-[var(--gray-5)]"
              >
                {renderInline(cell)}
              </th>
            ))}
          </tr>
        </thead>
        {rows.length > 0 && (
          <tbody>
            {rows.map((row, ri) => (
              <tr key={ri}>
                {split(row).map((cell, ci) => (
                  <td
                    key={ci}
                    className="py-1.5 pr-4 border-b border-[var(--gray-4)] align-top"
                  >
                    {renderInline(cell)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        )}
      </table>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Inline markdown parser
// ---------------------------------------------------------------------------

const INLINE_RE = /(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*|~~[^~]+~~|\[[^\]]+\]\([^)]+\))/g;

function renderInline(text: string): ReactNode[] {
  const out: ReactNode[] = [];
  let cursor = 0;

  for (const match of text.matchAll(INLINE_RE)) {
    if ((match.index ?? 0) > cursor) {
      pushTextWithBreaks(out, text.slice(cursor, match.index));
    }

    const token = match[0];
    const k = `${match.index}`;

    if (token.startsWith('`')) {
      out.push(
        <code
          key={k}
          className="bg-[var(--gray-4)] px-1.5 py-0.5 rounded text-[0.8em] font-[var(--font-family-monospace)] text-[var(--codeColor)]"
        >
          {token.slice(1, -1)}
        </code>
      );
    } else if (token.startsWith('**')) {
      out.push(<strong key={k}>{token.slice(2, -2)}</strong>);
    } else if (token.startsWith('~~')) {
      out.push(<del key={k}>{token.slice(2, -2)}</del>);
    } else if (token.startsWith('*')) {
      out.push(<em key={k}>{token.slice(1, -1)}</em>);
    } else if (token.startsWith('[')) {
      const lm = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (lm) {
        out.push(
          <a
            key={k}
            href={sanitizeHref(lm[2])}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--accent)] underline underline-offset-2 hover:opacity-80"
          >
            {lm[1]}
          </a>
        );
      }
    }

    cursor = (match.index ?? 0) + token.length;
  }

  if (cursor < text.length) {
    pushTextWithBreaks(out, text.slice(cursor));
  }

  return out;
}

function pushTextWithBreaks(out: ReactNode[], text: string) {
  const segs = text.split('\n');
  for (let i = 0; i < segs.length; i++) {
    if (segs[i]) {
      out.push(<Fragment key={`t${out.length}`}>{segs[i]}</Fragment>);
    }
    if (i < segs.length - 1) {
      out.push(<br key={`br${out.length}`} />);
    }
  }
}

function sanitizeHref(raw: string): string {
  if (raw.startsWith('/')) {
    return `https://docs.sentry.io${raw}`;
  }
  try {
    const u = new URL(raw);
    if (u.protocol === 'https:' || u.protocol === 'http:') {
      return u.href;
    }
  } catch {
    // not a valid URL
  }
  return '#';
}
