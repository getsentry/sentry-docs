'use client';

import {
  ArrowUpIcon,
  ChatBubbleIcon,
  CopyIcon,
  Cross1Icon,
  PlusIcon,
  ReloadIcon,
  StopIcon,
} from '@radix-ui/react-icons';
import {Button, IconButton, ScrollArea, Separator} from '@radix-ui/themes';
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
  {label: 'Set up Sentry for Next.js', question: 'How do I set up Sentry for Next.js?'},
  {label: 'Debug missing source maps', question: 'How do I debug missing source maps?'},
  {label: 'Configure Session Replay', question: 'How do I configure Session Replay?'},
];

const TOOL_LABELS: Record<string, string> = {
  search_docs: 'Searching documentation',
  fetch_doc_page: 'Reading page',
};

// ---------------------------------------------------------------------------
// SSE parsing
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
        /* skip malformed JSON */
      }
    }
  }
  return {events, remaining};
}

// ---------------------------------------------------------------------------
// Scroll helper
// ---------------------------------------------------------------------------

function isNearBottom(el: HTMLElement, threshold = 80): boolean {
  return el.scrollHeight - el.scrollTop - el.clientHeight < threshold;
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
      const userMsg: Message = {role: 'user', content: text};
      const newMessages = [...messages, userMsg];
      setMessages(newMessages);
      setInput('');
      setIsStreaming(true);

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
          /* user cancelled */
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

  useEffect(() => {
    if (shouldAutoScroll.current) {
      messagesEndRef.current?.scrollIntoView({behavior: 'smooth'});
    }
  }, [messages, toolStatus]);

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
      <div className="absolute inset-0 bg-black/60" onClick={close} aria-hidden="true" />

      {/* Modal */}
      <div
        className="ask-ai-modal relative w-full sm:max-w-2xl sm:mx-4 h-[85vh] sm:max-h-[min(740px,85vh)] rounded-t-2xl sm:rounded-2xl bg-[var(--gray-2)] border border-[var(--gray-6)] flex flex-col overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-label="Ask AI"
        style={{animation: 'askAiSlideUp 0.15s ease-out'}}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-5 h-12 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="size-7 rounded-lg bg-[var(--accent-purple)] flex items-center justify-center">
              <MagicIcon className="size-4 text-white" />
            </div>
            <h2 className="text-sm font-medium text-[var(--foreground)]">Sentry AI</h2>
          </div>
          <div className="flex items-center gap-1">
            {messages.length > 0 && (
              <Button
                variant="ghost"
                color="gray"
                size="1"
                onClick={handleNewConversation}
                title="New conversation"
              >
                <PlusIcon width={12} height={12} />
                <span className="hidden sm:inline">New chat</span>
              </Button>
            )}
            <IconButton
              variant="ghost"
              color="gray"
              size="1"
              onClick={close}
              aria-label="Close"
            >
              <Cross1Icon width={14} height={14} />
            </IconButton>
          </div>
        </div>

        <Separator size="4" />

        {/* Messages area */}
        <ScrollArea
          scrollbars="vertical"
          style={{flex: 1, minHeight: 0}}
          ref={scrollAreaRef as React.RefObject<HTMLDivElement>}
        >
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
                <div
                  className="text-sm text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-500/10 rounded-lg px-4 py-3 border border-red-200 dark:border-red-500/20"
                  role="alert"
                >
                  {error}
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </ScrollArea>

        {/* Input area */}
        <div className="shrink-0 px-4 sm:px-5 pb-4 pt-2">
          <form
            onSubmit={handleSubmit}
            className="ask-ai-input relative rounded-lg border border-[var(--gray-5)] bg-[var(--gray-3)] transition-[border-color,box-shadow] duration-150"
          >
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask a question about Sentry..."
              rows={1}
              className="w-full resize-none bg-transparent px-3.5 pt-2.5 pb-9 text-base sm:text-sm text-[var(--foreground)] placeholder:text-[var(--gray-9)] focus:outline-none max-h-36"
              disabled={isStreaming}
              style={{height: 'auto', minHeight: '40px'}}
              onInput={e => {
                const t = e.target as HTMLTextAreaElement;
                t.style.height = 'auto';
                t.style.height = `${Math.min(t.scrollHeight, 144)}px`;
              }}
            />
            <div className="absolute bottom-1.5 right-1.5">
              {isStreaming ? (
                <IconButton
                  variant="soft"
                  color="gray"
                  size="1"
                  onClick={handleStop}
                  aria-label="Stop generating"
                  title="Stop generating"
                >
                  <StopIcon width={14} height={14} />
                </IconButton>
              ) : (
                <IconButton
                  variant="solid"
                  size="1"
                  disabled={!input.trim()}
                  aria-label="Send message"
                  type="submit"
                >
                  <ArrowUpIcon width={14} height={14} />
                </IconButton>
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
          0%, 80%, 100% { opacity: 0.4; transform: scale(0.85); }
          40% { opacity: 1; transform: scale(1); }
        }
        .ask-ai-input:focus-within {
          border-color: var(--accent-9);
          box-shadow: 0 0 0 1px var(--accent-a5);
        }
        .ask-ai-prose p { margin: 0.5rem 0; }
        .ask-ai-prose p:first-child { margin-top: 0; }
        .ask-ai-prose strong { font-weight: 500; }
        .ask-ai-prose > :first-child { margin-top: 0; }
        .ask-ai-prose ul, .ask-ai-prose ol { margin: 0.5rem 0; padding-left: 1.25rem; }
        .ask-ai-prose ul { list-style: disc; }
        .ask-ai-prose ol { list-style: decimal; }
        .ask-ai-prose li { margin: 0.125rem 0; }
        .ask-ai-prose blockquote { border-left: 2px solid var(--gray-6); padding-left: 1rem; margin: 0.75rem 0; color: var(--gray-11); }
        .ask-ai-prose hr { border: none; border-top: 1px solid var(--gray-5); margin: 1rem 0; }
        .ask-ai-prose table { width: 100%; font-size: 0.8125rem; border-collapse: collapse; margin: 0.75rem 0; }
        .ask-ai-prose th { text-align: left; font-weight: 600; padding-bottom: 0.5rem; border-bottom: 1px solid var(--gray-5); }
        .ask-ai-prose td { padding: 0.375rem 0.5rem 0.375rem 0; border-bottom: 1px solid var(--gray-4); vertical-align: top; }
        .ask-ai-prose h2, .ask-ai-prose h3, .ask-ai-prose h4, .ask-ai-prose h5 { font-weight: 600; margin-top: 1.25rem; margin-bottom: 0.5rem; color: var(--foreground); }
        .ask-ai-prose h2 { font-size: 1rem; }
        .ask-ai-prose h3 { font-size: 0.875rem; }
        .ask-ai-prose h4, .ask-ai-prose h5 { font-size: 0.8125rem; }
        .ask-ai-prose a { color: var(--accent-11); text-decoration: underline; text-underline-offset: 2px; }
        .ask-ai-prose a:hover { color: var(--accent-12); }
        .ask-ai-code pre[class*="language-"] {
          margin: 0 !important;
          border-radius: 0 0 6px 6px !important;
          border: 1px solid var(--gray-6) !important;
          border-top: none !important;
          font-size: 0.8125rem !important;
          scrollbar-width: thin;
          scrollbar-color: rgba(148,129,164,0.4) transparent;
        }
        .ask-ai-code pre[class*="language-"]::-webkit-scrollbar { height: 6px; }
        .ask-ai-code pre[class*="language-"]::-webkit-scrollbar-track { background: transparent; }
        .ask-ai-code pre[class*="language-"]::-webkit-scrollbar-thumb { background-color: rgba(148,129,164,0.4); border-radius: 9999px; }
        .dark .ask-ai-modal { box-shadow: 0 8px 40px rgba(0,0,0,0.5), 0 2px 12px rgba(0,0,0,0.4); }
      `}</style>
    </div>
  );
}

// ---------------------------------------------------------------------------
// EmptyState
// ---------------------------------------------------------------------------

function EmptyState({onSubmit}: {onSubmit: (q: string) => void}) {
  return (
    <div className="flex flex-col items-center justify-center h-full px-5 py-10">
      <div className="size-10 rounded-xl bg-[var(--accent-purple)] flex items-center justify-center mb-4">
        <MagicIcon className="size-5 text-white" />
      </div>
      <h3 className="text-base font-semibold text-[var(--foreground)] mb-1">
        Ask Sentry AI
      </h3>
      <p className="text-[13px] text-[var(--gray-11)] mb-6 text-center max-w-xs leading-relaxed">
        Get answers from the official Sentry documentation
      </p>
      <div className="w-full max-w-xs space-y-1.5">
        <p className="text-[11px] font-medium text-[var(--gray-9)] uppercase tracking-wider mb-2 px-0.5">
          Try asking
        </p>
        {EXAMPLE_QUESTIONS.map(({label, question}) => (
          <button
            type="button"
            key={question}
            onClick={() => onSubmit(question)}
            aria-label={question}
            className="w-full flex items-center gap-2.5 text-left px-3 py-2.5 rounded-lg border border-[var(--gray-5)] bg-[var(--gray-3)] hover:border-[var(--accent-9)] hover:bg-[var(--gray-4)] text-[13px] text-[var(--gray-12)] transition-all group"
          >
            <ChatBubbleIcon
              width={13}
              height={13}
              className="text-[var(--gray-9)] group-hover:text-[var(--accent-9)] transition-colors shrink-0"
            />
            <span className="flex-1">{label}</span>
            <ArrowUpIcon
              width={11}
              height={11}
              className="text-[var(--gray-8)] group-hover:text-[var(--accent-9)] -rotate-45 transition-colors shrink-0"
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
      <div className="max-w-[85%] rounded-2xl rounded-br-md bg-[var(--accent-9)] text-white px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap">
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
        <MagicIcon className="size-3.5 text-[var(--accent-9)]" />
      </div>

      <div className="min-w-0 flex-1" aria-live={isStreaming ? 'polite' : undefined}>
        {isStreaming && (isEmpty || toolStatus?.state === 'running') && (
          <ToolStatusIndicator toolStatus={toolStatus} />
        )}

        {!isEmpty && (
          <div className="ask-ai-prose text-sm text-[var(--foreground)] leading-relaxed">
            <MarkdownContent content={content} />
            {isStreaming && (
              <span className="inline-block w-0.5 h-[1.1em] bg-[var(--accent-9)] ml-0.5 align-text-bottom rounded-full animate-pulse" />
            )}
          </div>
        )}

        {!isEmpty && !isStreaming && isLast && (
          <div className="flex items-center gap-0.5 mt-2">
            <Button
              variant="ghost"
              color="gray"
              size="1"
              onClick={onCopy}
              title="Copy response"
            >
              <CopyIcon width={12} height={12} />
              {isCopied ? 'Copied' : 'Copy'}
            </Button>
            <Button variant="ghost" color="gray" size="1" onClick={onRetry} title="Retry">
              <ReloadIcon width={12} height={12} />
              Retry
            </Button>
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
    /* fall through */
  }
  return code;
}

// ---------------------------------------------------------------------------
// AiCodeBlock — matches the site's code block look
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
    <div className="ask-ai-code relative my-3">
      <div className="flex items-center justify-between h-8 px-3 rounded-t-md bg-[#251f3d] border border-b-0 border-[var(--gray-6)]">
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
    return <hr key={keyBase} />;
  }

  const hMatch = lines[0].match(/^(#{1,4})\s+(.+)$/);
  if (hMatch && lines.length === 1) {
    const depth = hMatch[1].length;
    const Tag = `h${Math.min(depth + 1, 6)}` as keyof JSX.IntrinsicElements;
    return <Tag key={keyBase}>{renderInline(hMatch[2])}</Tag>;
  }

  if (lines.every(l => l.startsWith('> ') || l === '>')) {
    return (
      <blockquote key={keyBase}>
        <p>{renderInline(lines.map(l => (l === '>' ? '' : l.slice(2))).join('\n'))}</p>
      </blockquote>
    );
  }

  if (lines.length >= 2 && lines[0].includes('|') && /^\|?[\s:|-]+\|?$/.test(lines[1])) {
    return renderTable(lines, keyBase);
  }

  if (lines.length > 0 && lines.every(l => /^\s*[-*]\s/.test(l))) {
    return (
      <ul key={keyBase}>
        {lines.map((l, i) => (
          <li key={i}>{renderInline(l.replace(/^\s*[-*]\s+/, ''))}</li>
        ))}
      </ul>
    );
  }

  if (lines.length > 0 && lines.every(l => /^\s*\d+[.)]\s/.test(l))) {
    return (
      <ol key={keyBase}>
        {lines.map((l, i) => (
          <li key={i}>{renderInline(l.replace(/^\s*\d+[.)]\s+/, ''))}</li>
        ))}
      </ol>
    );
  }

  return <p key={keyBase}>{renderInline(text)}</p>;
}

function renderTable(lines: string[], key: number): ReactNode {
  const split = (row: string) =>
    row
      .replace(/^\||\|$/g, '')
      .split('|')
      .map(c => c.trim());

  const header = split(lines[0]);
  const rows = lines.slice(2).filter(l => l.includes('|'));

  return (
    <table key={key}>
      <thead>
        <tr>
          {header.map((cell, i) => (
            <th key={i}>{renderInline(cell)}</th>
          ))}
        </tr>
      </thead>
      {rows.length > 0 && (
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri}>
              {split(row).map((cell, ci) => (
                <td key={ci}>{renderInline(cell)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      )}
    </table>
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
          className="bg-[var(--gray-4)] text-[var(--codeColor)] px-1.5 py-0.5 rounded text-[0.8em] font-[var(--font-family-monospace)]"
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
          <a key={k} href={sanitizeHref(lm[2])} target="_blank" rel="noopener noreferrer">
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
    /* not a valid URL */
  }
  return '#';
}
