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
  {label: 'Distributed tracing', question: 'How do I set up distributed tracing?'},
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
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const hasAutoSubmitted = useRef(false);
  const abortRef = useRef<AbortController | null>(null);

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
      const userMessage: Message = {role: 'user', content: text};
      const newMessages = [...messages, userMessage];
      setMessages(newMessages);
      setInput('');
      setIsStreaming(true);

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
                  setError(String(evt.data.message));
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
          // User cancelled — not an error
        } else {
          setError(err instanceof Error ? err.message : 'Failed to get response');
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
    messagesEndRef.current?.scrollIntoView({behavior: 'smooth'});
  }, [messages, toolStatus]);

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

  // -- render ----------------------------------------------------------------

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={close}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') {
            close();
          }
        }}
        role="button"
        tabIndex={-1}
        aria-label="Close dialog"
      />

      {/* Modal */}
      <div
        className="relative w-full sm:max-w-2xl sm:mx-4 h-[85vh] sm:max-h-[740px] bg-[var(--gray-1)] sm:rounded-xl border border-[var(--gray-a3)] shadow-2xl flex flex-col overflow-hidden animate-[askAiSlideUp_0.15s_ease-out]"
        role="dialog"
        aria-label="Ask AI"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-5 h-13 border-b border-[var(--gray-a3)] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="size-7 rounded-lg bg-[var(--accent-purple)] flex items-center justify-center">
              <MagicIcon className="size-4 text-white" />
            </div>
            <h2 className="text-sm font-semibold text-[var(--foreground)]">Sentry AI</h2>
          </div>
          <div className="flex items-center gap-1">
            {messages.length > 0 && (
              <button
                type="button"
                onClick={handleNewConversation}
                className="flex items-center gap-1.5 text-xs text-[var(--gray-11)] hover:text-[var(--foreground)] h-7 px-2.5 rounded-lg hover:bg-[var(--gray-a3)] transition-colors"
                title="New conversation"
              >
                <PlusIcon width={12} height={12} />
                <span className="hidden sm:inline">New chat</span>
              </button>
            )}
            <button
              type="button"
              onClick={close}
              className="size-7 flex items-center justify-center rounded-lg hover:bg-[var(--gray-a3)] transition-colors text-[var(--gray-11)] hover:text-[var(--foreground)]"
              aria-label="Close"
            >
              <Cross1Icon width={14} height={14} />
            </button>
          </div>
        </div>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto min-h-0 scroll-smooth">
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
                <div className="flex items-start gap-3">
                  <div className="size-6 rounded-full bg-red-500/10 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-red-500 text-xs font-bold">!</span>
                  </div>
                  <div className="text-sm text-red-400 bg-red-500/5 rounded-lg px-4 py-3 border border-red-500/10">
                    {error}
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input area */}
        <div className="shrink-0 px-4 sm:px-5 pb-4 pt-2">
          <form
            onSubmit={handleSubmit}
            className="relative rounded-xl border border-[var(--gray-a4)] bg-[var(--gray-2)] focus-within:border-[var(--accent-purple)]/40 focus-within:ring-1 focus-within:ring-[var(--accent-purple)]/20 transition-all"
          >
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask a question about Sentry..."
              rows={1}
              className="w-full resize-none bg-transparent px-4 pt-3 pb-10 text-sm text-[var(--foreground)] placeholder:text-[var(--gray-9)] focus:outline-none max-h-36"
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
                  className="size-7 flex items-center justify-center rounded-lg bg-[var(--gray-a4)] text-[var(--foreground)] hover:bg-[var(--gray-a5)] transition-all"
                  aria-label="Stop generating"
                  title="Stop generating"
                >
                  <StopIcon width={14} height={14} />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="size-7 flex items-center justify-center rounded-lg bg-[var(--accent-purple)] text-white disabled:opacity-30 disabled:cursor-not-allowed hover:opacity-90 transition-all"
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
        @keyframes askAiBlink {
          0%, 100% { opacity: 1; }
          50%      { opacity: 0; }
        }
        /* Scoped prose styles for AI responses */
        .ask-ai-prose p { margin: 0.5rem 0; }
        .ask-ai-prose p:first-child { margin-top: 0; }
        .ask-ai-prose p:last-child { margin-bottom: 0; }
        .ask-ai-prose ul, .ask-ai-prose ol { margin: 0.5rem 0; }
        .ask-ai-prose li { margin: 0.125rem 0; }
        .ask-ai-prose li > p { margin: 0; }
        .ask-ai-prose a { color: var(--accent-purple); text-decoration: underline; text-underline-offset: 2px; }
        .ask-ai-prose a:hover { opacity: 0.8; }
        .ask-ai-prose strong { font-weight: 600; }
        .ask-ai-prose pre { font-family: var(--font-family-monospace); }
        .ask-ai-prose > :first-child { margin-top: 0; }
      `}</style>
    </div>
  );
}

// ---------------------------------------------------------------------------
// EmptyState
// ---------------------------------------------------------------------------

function EmptyState({onSubmit}: {onSubmit: (q: string) => void}) {
  return (
    <div className="flex flex-col items-center justify-center h-full px-6 py-12">
      <div className="size-12 rounded-2xl bg-gradient-to-br from-[var(--accent-purple)] to-[var(--accent-purple)]/70 flex items-center justify-center mb-5 shadow-lg shadow-[var(--accent-purple)]/20">
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
            className="w-full flex items-center gap-3 text-left px-4 py-3 rounded-xl border border-[var(--gray-a3)] hover:border-[var(--gray-a5)] hover:bg-[var(--gray-a2)] text-sm text-[var(--gray-12)] transition-all group"
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
      {/* Avatar */}
      <div className="size-6 rounded-lg bg-[var(--gray-a3)] flex items-center justify-center shrink-0 mt-0.5">
        <MagicIcon className="size-3.5 text-[var(--accent-purple)]" />
      </div>

      <div className="min-w-0 flex-1">
        {/* Tool status — shown when content is empty OR when a tool is running */}
        {isStreaming && (isEmpty || toolStatus?.state === 'running') && (
          <ToolStatusIndicator toolStatus={toolStatus} />
        )}

        {/* Content */}
        {!isEmpty && (
          <div className="ask-ai-prose text-sm text-[var(--foreground)] leading-relaxed">
            <MarkdownContent content={content} />
            {isStreaming && (
              <span
                className="inline-block w-0.5 h-[1.1em] bg-[var(--accent-purple)] ml-0.5 align-text-bottom"
                style={{animation: 'askAiBlink 1s step-end infinite'}}
              />
            )}
          </div>
        )}

        {/* Actions */}
        {!isEmpty && !isStreaming && isLast && (
          <div className="flex items-center gap-1 mt-2.5">
            <button
              type="button"
              onClick={onCopy}
              className="flex items-center gap-1.5 h-7 px-2 rounded-md text-[var(--gray-9)] hover:text-[var(--foreground)] hover:bg-[var(--gray-a3)] transition-colors text-xs"
              title="Copy response"
            >
              <CopyIcon width={12} height={12} />
              {isCopied ? 'Copied' : 'Copy'}
            </button>
            <button
              type="button"
              onClick={onRetry}
              className="flex items-center gap-1.5 h-7 px-2 rounded-md text-[var(--gray-9)] hover:text-[var(--foreground)] hover:bg-[var(--gray-a3)] transition-colors text-xs"
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
    <div className="flex items-center gap-2.5 py-1.5 text-xs text-[var(--gray-9)]">
      <span className="flex gap-1">
        <span className="size-1.5 rounded-full bg-[var(--gray-8)] animate-bounce [animation-delay:0ms]" />
        <span className="size-1.5 rounded-full bg-[var(--gray-8)] animate-bounce [animation-delay:150ms]" />
        <span className="size-1.5 rounded-full bg-[var(--gray-8)] animate-bounce [animation-delay:300ms]" />
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

/**
 * Runtime Prism highlighting via refractor.
 * Returns JSX for highlighted code, or the raw string as fallback.
 */
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
// AiCodeBlock — matches the docs site's code block look
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
    <div className="relative my-3 group">
      {/* Action bar — sits above the code block */}
      <div className="flex items-center justify-end gap-2 h-7 px-1">
        {language && language !== 'text' && (
          <span className="text-[11px] text-[var(--gray-9)] font-mono select-none">
            {language}
          </span>
        )}
        <button
          type="button"
          onClick={onCopy}
          className="flex items-center gap-1 text-[11px] text-[var(--gray-9)] hover:text-[var(--foreground)] transition-colors"
          title="Copy code"
        >
          <CopyIcon width={12} height={12} />
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      {/* Code block — styled to match prism-sentry theme */}
      <pre
        className={`language-${language || 'text'} !my-0 !rounded-md !border !border-[var(--gray-a3)] !text-[13px] !leading-relaxed overflow-x-auto`}
      >
        <code className={language ? `language-${language}` : ''}>{highlighted}</code>
      </pre>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Block-level markdown parser
// ---------------------------------------------------------------------------

/**
 * Parse a markdown string into React nodes.
 *
 * We split on fenced code blocks first (which are the only multi-line
 * constructs the AI commonly produces), then parse the remaining text
 * block-by-block.
 *
 * This is intentionally NOT a full CommonMark parser — it covers the
 * subset that Anthropic's models actually produce in practice.
 */
function renderMarkdown(md: string): ReactNode[] {
  const out: ReactNode[] = [];

  // Split on code fences. The regex also allows language names with dashes/dots.
  // Incomplete fences (streaming) won't match and are rendered as plain text.
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

    // Process non-code text as block-level elements
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

  // Horizontal rule
  if (/^(-{3,}|\*{3,}|_{3,})$/.test(text)) {
    return <hr key={keyBase} className="my-4 border-[var(--gray-a4)]" />;
  }

  // Heading
  const hMatch = lines[0].match(/^(#{1,4})\s+(.+)$/);
  if (hMatch && lines.length === 1) {
    const depth = hMatch[1].length; // 1-4
    const Tag = `h${Math.min(depth + 1, 6)}` as keyof JSX.IntrinsicElements;
    return (
      <Tag key={keyBase} className={HEADING_CLASSES[depth] ?? HEADING_CLASSES[4]}>
        {renderInline(hMatch[2])}
      </Tag>
    );
  }

  // Blockquote — every line starts with >
  if (lines.every(l => l.startsWith('> ') || l === '>')) {
    return (
      <blockquote
        key={keyBase}
        className="border-l-2 border-[var(--gray-a5)] pl-4 my-3 text-[var(--gray-11)]"
      >
        <p className="my-0">
          {renderInline(lines.map(l => (l === '>' ? '' : l.slice(2))).join('\n'))}
        </p>
      </blockquote>
    );
  }

  // Table — at least header + separator
  if (lines.length >= 2 && lines[0].includes('|') && /^\|?[\s:|-]+\|?$/.test(lines[1])) {
    return renderTable(lines, keyBase);
  }

  // Unordered list
  if (lines.length > 0 && lines.every(l => /^\s*[-*]\s/.test(l))) {
    return (
      <ul key={keyBase} className="my-2 pl-5 list-disc space-y-1">
        {lines.map((l, i) => (
          <li key={i}>{renderInline(l.replace(/^\s*[-*]\s+/, ''))}</li>
        ))}
      </ul>
    );
  }

  // Ordered list
  if (lines.length > 0 && lines.every(l => /^\s*\d+[.)]\s/.test(l))) {
    return (
      <ol key={keyBase} className="my-2 pl-5 list-decimal space-y-1">
        {lines.map((l, i) => (
          <li key={i}>{renderInline(l.replace(/^\s*\d+[.)]\s+/, ''))}</li>
        ))}
      </ol>
    );
  }

  // Default: paragraph
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
                className="text-left font-semibold pb-2 pr-4 border-b border-[var(--gray-a4)]"
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
                    className="py-1.5 pr-4 border-b border-[var(--gray-a3)] align-top"
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
    // Plain text before this match
    if ((match.index ?? 0) > cursor) {
      pushTextWithBreaks(out, text.slice(cursor, match.index));
    }

    const token = match[0];
    const k = `${match.index}`;

    if (token.startsWith('`')) {
      out.push(
        <code
          key={k}
          className="bg-[var(--gray-a3)] px-1.5 py-0.5 rounded text-[0.8em] font-[var(--font-family-monospace)]"
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
            className="text-[var(--accent-purple)] underline underline-offset-2 hover:opacity-80"
          >
            {lm[1]}
          </a>
        );
      }
    }

    cursor = (match.index ?? 0) + token.length;
  }

  // Remaining text
  if (cursor < text.length) {
    pushTextWithBreaks(out, text.slice(cursor));
  }

  return out;
}

/** Convert newlines in plain-text runs into <br/> elements. */
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

/**
 * Accept both absolute and relative URLs.
 * Relative paths like /platforms/javascript/ are prefixed with docs.sentry.io.
 */
function sanitizeHref(raw: string): string {
  // Relative path — common in AI responses citing Sentry docs
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
