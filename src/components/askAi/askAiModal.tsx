'use client';

import {
  ArrowUpIcon,
  ChatBubbleIcon,
  CopyIcon,
  Cross1Icon,
  PlusIcon,
  ReloadIcon,
} from '@radix-ui/react-icons';
import type {ReactNode} from 'react';
import {Fragment, useCallback, useEffect, useRef, useState} from 'react';
import {MagicIcon} from 'sentry-docs/components/cutomIcons/magic';

import {useAskAi} from './askAiContext';

const ASK_AI_API_URL =
  process.env.NEXT_PUBLIC_ASK_AI_API_URL ?? 'https://docs-mcp.getsentry.workers.dev';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const EXAMPLE_QUESTIONS = [
  {label: 'Set up Sentry', question: 'How do I set up Sentry for Next.js?'},
  {label: 'Distributed tracing', question: 'How do I set up distributed tracing?'},
  {label: 'Session Replay', question: 'How do I configure Session Replay?'},
];

export function AskAiModal() {
  const {isOpen, initialQuery, autoSubmit, close} = useAskAi();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const hasAutoSubmitted = useRef(false);

  const submitMessage = useCallback(
    async (messageText?: string) => {
      const text = (messageText ?? input).trim();
      if (!text || isStreaming) {
        return;
      }

      setError(null);
      const userMessage: Message = {role: 'user', content: text};
      const newMessages = [...messages, userMessage];
      setMessages(newMessages);
      setInput('');
      setIsStreaming(true);

      try {
        const response = await fetch(`${ASK_AI_API_URL}/api/ask`, {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({messages: newMessages}),
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

        let done = false;
        while (!done) {
          const result = await reader.read();
          done = result.done;
          if (result.value) {
            const chunk = decoder.decode(result.value, {stream: true});
            if (chunk) {
              setMessages(prev => {
                const updated = [...prev];
                const last = updated[updated.length - 1];
                updated[updated.length - 1] = {
                  role: 'assistant',
                  content: last.content + chunk,
                };
                return updated;
              });
            }
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to get response');
        setMessages(prev => {
          if (prev.length > 0 && prev[prev.length - 1].content === '') {
            return prev.slice(0, -1);
          }
          return prev;
        });
      } finally {
        setIsStreaming(false);
      }
    },
    [input, messages, isStreaming]
  );

  useEffect(() => {
    if (isOpen && initialQuery && !hasAutoSubmitted.current) {
      setInput(initialQuery);
      if (autoSubmit) {
        hasAutoSubmitted.current = true;
        setTimeout(() => {
          submitMessage(initialQuery);
        }, 0);
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
  }, [messages]);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        close();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
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
    setMessages([]);
    setInput('');
    setError(null);
    setCopiedIndex(null);
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
        const lastUserIndex = prev.findLastIndex(m => m.role === 'user');
        return prev.slice(0, lastUserIndex);
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
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
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
        className="relative w-full sm:max-w-[680px] sm:mx-4 h-[85vh] sm:max-h-[720px] bg-[var(--gray-1)] sm:rounded-2xl border border-[var(--gray-a3)] shadow-2xl flex flex-col overflow-hidden animate-[slideUp_0.2s_ease-out]"
        role="dialog"
        aria-label="Ask AI"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-5 h-14 border-b border-[var(--gray-a3)] flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="size-7 rounded-lg bg-[var(--accent-purple)] flex items-center justify-center">
              <MagicIcon className="size-4 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-[var(--foreground)] leading-tight">
                Sentry AI
              </h2>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {messages.length > 0 && (
              <button
                onClick={handleNewConversation}
                className="flex items-center gap-1.5 text-xs text-[var(--gray-11)] hover:text-[var(--foreground)] h-7 px-2.5 rounded-lg hover:bg-[var(--gray-a3)] transition-colors"
                title="New conversation"
              >
                <PlusIcon width="12" height="12" />
                <span className="hidden sm:inline">New chat</span>
              </button>
            )}
            <button
              onClick={close}
              className="size-7 flex items-center justify-center rounded-lg hover:bg-[var(--gray-a3)] transition-colors text-[var(--gray-11)] hover:text-[var(--foreground)]"
              aria-label="Close"
            >
              <Cross1Icon width="14" height="14" />
            </button>
          </div>
        </div>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto min-h-0">
          {messages.length === 0 ? (
            <EmptyState onSubmit={submitMessage} />
          ) : (
            <div className="px-4 sm:px-5 py-4">
              {messages.map((msg, i) => (
                <div key={i} className="mb-5 last:mb-0">
                  {msg.role === 'user' ? (
                    <UserMessage content={msg.content} />
                  ) : (
                    <AssistantMessage
                      content={msg.content}
                      isStreaming={isStreaming && i === messages.length - 1}
                      isCopied={copiedIndex === i}
                      isLast={i === messages.length - 1}
                      onCopy={() => handleCopy(msg.content, i)}
                      onRetry={handleRetry}
                    />
                  )}
                </div>
              ))}

              {error && (
                <div className="flex items-start gap-3 mb-5">
                  <div className="size-6 rounded-full bg-red-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-red-500 text-xs">!</span>
                  </div>
                  <div className="text-sm text-red-500 bg-red-500/5 rounded-xl px-4 py-3 border border-red-500/10">
                    {error}
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input area */}
        <div className="flex-shrink-0 px-4 sm:px-5 pb-4 pt-2">
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
              style={{
                height: 'auto',
                minHeight: '44px',
              }}
              onInput={e => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = 'auto';
                target.style.height = `${Math.min(target.scrollHeight, 144)}px`;
              }}
            />
            <div className="absolute bottom-2 right-2 left-2 flex items-center justify-end">
              <button
                type="submit"
                disabled={!input.trim() || isStreaming}
                className="size-7 flex items-center justify-center rounded-lg bg-[var(--accent-purple)] text-white disabled:opacity-30 disabled:cursor-not-allowed hover:opacity-90 transition-all"
                aria-label="Send message"
              >
                {isStreaming ? (
                  <div className="size-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <ArrowUpIcon width="14" height="14" />
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(12px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}

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
            key={question}
            onClick={() => onSubmit(question)}
            className="w-full flex items-center gap-3 text-left px-4 py-3 rounded-xl border border-[var(--gray-a3)] hover:border-[var(--gray-a5)] hover:bg-[var(--gray-a2)] text-sm text-[var(--gray-12)] transition-all group"
          >
            <ChatBubbleIcon
              width="14"
              height="14"
              className="text-[var(--gray-8)] group-hover:text-[var(--accent-purple)] transition-colors flex-shrink-0"
            />
            <span>{label}</span>
            <ArrowUpIcon
              width="12"
              height="12"
              className="ml-auto text-[var(--gray-7)] group-hover:text-[var(--gray-10)] -rotate-45 transition-colors flex-shrink-0"
            />
          </button>
        ))}
      </div>
    </div>
  );
}

function UserMessage({content}: {content: string}) {
  return (
    <div className="flex justify-end">
      <div className="max-w-[85%] rounded-2xl rounded-br-md bg-[var(--accent-purple)] text-white px-4 py-2.5 text-sm">
        <p className="whitespace-pre-wrap m-0 leading-relaxed">{content}</p>
      </div>
    </div>
  );
}

function AssistantMessage({
  content,
  isStreaming,
  isCopied,
  isLast,
  onCopy,
  onRetry,
}: {
  content: string;
  isStreaming: boolean;
  isCopied: boolean;
  isLast: boolean;
  onCopy: () => void;
  onRetry: () => void;
}) {
  const isEmpty = content === '';
  return (
    <div className="flex gap-3">
      <div className="size-6 rounded-lg bg-[var(--gray-a3)] flex items-center justify-center flex-shrink-0 mt-0.5">
        <MagicIcon className="size-3.5 text-[var(--accent-purple)]" />
      </div>
      <div className="flex-1 min-w-0">
        {isEmpty && isStreaming ? (
          <div className="flex items-center gap-1.5 py-2">
            <div className="flex gap-1">
              <span className="size-1.5 bg-[var(--gray-8)] rounded-full animate-bounce [animation-delay:0ms]" />
              <span className="size-1.5 bg-[var(--gray-8)] rounded-full animate-bounce [animation-delay:150ms]" />
              <span className="size-1.5 bg-[var(--gray-8)] rounded-full animate-bounce [animation-delay:300ms]" />
            </div>
            <span className="text-xs text-[var(--gray-9)] ml-1">Searching docs...</span>
          </div>
        ) : (
          <div className="prose prose-sm dark:prose-invert max-w-none text-[var(--foreground)] [&_p]:leading-relaxed [&_p]:my-2 [&_p:first-child]:mt-0 [&_pre]:bg-[var(--gray-a3)] [&_pre]:rounded-lg [&_pre]:p-3.5 [&_pre]:my-3 [&_pre]:overflow-x-auto [&_code]:text-xs [&_code]:font-[var(--font-family-monospace)] [&_:not(pre)>code]:bg-[var(--gray-a3)] [&_:not(pre)>code]:px-1.5 [&_:not(pre)>code]:py-0.5 [&_:not(pre)>code]:rounded-md [&_a]:text-[var(--accent-purple)] [&_a]:underline [&_a]:underline-offset-2 [&_a:hover]:opacity-80 [&_ul]:my-2 [&_ol]:my-2 [&_li]:my-0.5 [&_h2]:text-base [&_h2]:font-semibold [&_h2]:mt-4 [&_h2]:mb-2 [&_h3]:text-sm [&_h3]:font-semibold [&_h3]:mt-3 [&_h3]:mb-1.5 [&_h4]:text-sm [&_h4]:font-medium [&_h4]:mt-3 [&_h4]:mb-1">
            <MarkdownContent content={content} />
            {isStreaming && (
              <span
                className="inline-block w-[2px] h-4 bg-[var(--accent-purple)] ml-0.5 align-middle"
                style={{animation: 'blink 1s step-end infinite'}}
              />
            )}
          </div>
        )}

        {/* Action buttons */}
        {!isEmpty && !isStreaming && isLast && (
          <div className="flex items-center gap-1 mt-2 -ml-1.5">
            <button
              onClick={onCopy}
              className="flex items-center gap-1.5 h-7 px-2 rounded-md text-[var(--gray-9)] hover:text-[var(--foreground)] hover:bg-[var(--gray-a3)] transition-colors text-xs"
              title="Copy response"
            >
              <CopyIcon width="12" height="12" />
              <span>{isCopied ? 'Copied' : 'Copy'}</span>
            </button>
            <button
              onClick={onRetry}
              className="flex items-center gap-1.5 h-7 px-2 rounded-md text-[var(--gray-9)] hover:text-[var(--foreground)] hover:bg-[var(--gray-a3)] transition-colors text-xs"
              title="Retry"
            >
              <ReloadIcon width="12" height="12" />
              <span>Retry</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Renders markdown content as React elements without dangerouslySetInnerHTML.
 */
function MarkdownContent({content}: {content: string}) {
  const blocks = parseBlocks(content);
  return (
    <Fragment>
      {blocks.map((block, i) => (
        <Fragment key={i}>{block}</Fragment>
      ))}
    </Fragment>
  );
}

function parseBlocks(md: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const parts = md.split(/(```\w*\n[\s\S]*?```)/g);

  for (const part of parts) {
    const codeBlockMatch = part.match(/^```(\w*)\n([\s\S]*?)```$/);
    if (codeBlockMatch) {
      nodes.push(
        <pre key={nodes.length}>
          <code className={codeBlockMatch[1] ? `language-${codeBlockMatch[1]}` : ''}>
            {codeBlockMatch[2]}
          </code>
        </pre>
      );
      continue;
    }

    const paragraphs = part.split(/\n\n+/);
    for (const para of paragraphs) {
      const trimmed = para.trim();
      if (!trimmed) {
        continue;
      }

      const headingMatch = trimmed.match(/^(#{1,4}) (.+)$/);
      if (headingMatch) {
        const level = headingMatch[1].length;
        const text = headingMatch[2];
        const HeadingTag = `h${level + 1}` as keyof JSX.IntrinsicElements;
        nodes.push(<HeadingTag key={nodes.length}>{renderInline(text)}</HeadingTag>);
        continue;
      }

      const lines = trimmed.split('\n');
      const isUnorderedList = lines.every(l => /^[*-] /.test(l));
      const isOrderedList = lines.every(l => /^\d+\. /.test(l));

      if (isUnorderedList) {
        nodes.push(
          <ul key={nodes.length}>
            {lines.map((line, li) => (
              <li key={li}>{renderInline(line.replace(/^[*-] /, ''))}</li>
            ))}
          </ul>
        );
        continue;
      }

      if (isOrderedList) {
        nodes.push(
          <ol key={nodes.length}>
            {lines.map((line, li) => (
              <li key={li}>{renderInline(line.replace(/^\d+\. /, ''))}</li>
            ))}
          </ol>
        );
        continue;
      }

      nodes.push(<p key={nodes.length}>{renderInline(trimmed)}</p>);
    }
  }

  return nodes;
}

function renderInline(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const pattern = /(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\))/g;
  let lastIndex = 0;

  for (const match of text.matchAll(pattern)) {
    const before = text.slice(lastIndex, match.index);
    if (before) {
      nodes.push(
        ...before
          .split('\n')
          .flatMap((segment, i, arr) =>
            i < arr.length - 1
              ? [
                  <Fragment key={`t${nodes.length}-${i}`}>{segment}</Fragment>,
                  <br key={`br${nodes.length}-${i}`} />,
                ]
              : [<Fragment key={`t${nodes.length}-${i}`}>{segment}</Fragment>]
          )
      );
    }

    const token = match[0];
    if (token.startsWith('`')) {
      nodes.push(<code key={`c${match.index}`}>{token.slice(1, -1)}</code>);
    } else if (token.startsWith('**')) {
      nodes.push(<strong key={`b${match.index}`}>{token.slice(2, -2)}</strong>);
    } else if (token.startsWith('*')) {
      nodes.push(<em key={`i${match.index}`}>{token.slice(1, -1)}</em>);
    } else if (token.startsWith('[')) {
      const linkMatch = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (linkMatch) {
        // Parse through URL constructor to break taint chain and sanitize scheme
        let safeHref = '#';
        try {
          const parsed = new URL(linkMatch[2]);
          if (parsed.protocol === 'https:' || parsed.protocol === 'http:') {
            safeHref = parsed.href;
          }
        } catch {
          // Invalid URL — keep '#'
        }
        nodes.push(
          <a
            key={`a${match.index}`}
            href={safeHref}
            target="_blank"
            rel="noopener noreferrer"
          >
            {linkMatch[1]}
          </a>
        );
      }
    }

    lastIndex = (match.index ?? 0) + token.length;
  }

  const remaining = text.slice(lastIndex);
  if (remaining) {
    nodes.push(
      ...remaining
        .split('\n')
        .flatMap((segment, i, arr) =>
          i < arr.length - 1
            ? [
                <Fragment key={`r${nodes.length}-${i}`}>{segment}</Fragment>,
                <br key={`rbr${nodes.length}-${i}`} />,
              ]
            : [<Fragment key={`r${nodes.length}-${i}`}>{segment}</Fragment>]
        )
    );
  }

  return nodes;
}
