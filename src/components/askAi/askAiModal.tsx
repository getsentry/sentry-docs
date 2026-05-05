'use client';

import {Cross1Icon} from '@radix-ui/react-icons';
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

export function AskAiModal() {
  const {isOpen, initialQuery, autoSubmit, close} = useAskAi();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
            const lines = chunk.split('\n');
            for (const line of lines) {
              if (line.startsWith('0:')) {
                try {
                  const parsed = JSON.parse(line.slice(2)) as string;
                  setMessages(prev => {
                    const updated = [...prev];
                    const last = updated[updated.length - 1];
                    updated[updated.length - 1] = {
                      role: 'assistant',
                      content: last.content + parsed,
                    };
                    return updated;
                  });
                } catch {
                  // skip malformed chunks
                }
              }
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

  // Lock body scroll when modal is open
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
    inputRef.current?.focus();
  }, []);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
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

      <div
        className="relative w-full max-w-2xl mx-4 max-h-[80vh] bg-[var(--gray-1)] rounded-xl border border-[var(--gray-a3)] shadow-2xl flex flex-col overflow-hidden"
        role="dialog"
        aria-label="Ask AI"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--gray-a3)]">
          <div className="flex items-center gap-2">
            <MagicIcon className="size-5 text-[var(--accent-purple)]" />
            <h2 className="text-base font-semibold text-[var(--foreground)]">Ask AI</h2>
          </div>
          <div className="flex items-center gap-2">
            {messages.length > 0 && (
              <button
                onClick={handleNewConversation}
                className="text-xs text-[var(--gray-11)] hover:text-[var(--foreground)] px-2 py-1 rounded transition-colors"
              >
                New chat
              </button>
            )}
            <button
              onClick={close}
              className="p-1.5 rounded-md hover:bg-[var(--gray-a3)] transition-colors text-[var(--gray-11)]"
              aria-label="Close"
            >
              <Cross1Icon width="16" height="16" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 min-h-0">
          {messages.length === 0 && (
            <div className="text-center py-12">
              <MagicIcon className="size-10 text-[var(--gray-8)] mx-auto mb-4" />
              <p className="text-[var(--gray-11)] text-sm mb-6">
                Ask me anything about Sentry
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {[
                  'How do I set up Sentry for Next.js?',
                  'What are tracePropagationTargets?',
                  'How do I set up distributed tracing?',
                ].map(q => (
                  <button
                    key={q}
                    onClick={() => submitMessage(q)}
                    className="text-xs px-3 py-1.5 rounded-full border border-[var(--gray-a3)] text-[var(--gray-11)] hover:border-[var(--accent-purple)] hover:text-[var(--accent-purple)] transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-lg px-4 py-3 text-sm ${
                  msg.role === 'user'
                    ? 'bg-[var(--accent-purple)] text-white'
                    : 'bg-[var(--gray-a2)] text-[var(--foreground)]'
                }`}
              >
                {msg.role === 'assistant' ? (
                  <div className="prose prose-sm dark:prose-invert max-w-none [&_pre]:bg-[var(--gray-a3)] [&_pre]:rounded-md [&_pre]:p-3 [&_code]:text-xs [&_a]:text-[var(--accent-purple)]">
                    {msg.content === '' && isStreaming ? (
                      <div className="flex gap-1 py-1">
                        <span className="size-1.5 bg-[var(--gray-8)] rounded-full animate-bounce [animation-delay:0ms]" />
                        <span className="size-1.5 bg-[var(--gray-8)] rounded-full animate-bounce [animation-delay:150ms]" />
                        <span className="size-1.5 bg-[var(--gray-8)] rounded-full animate-bounce [animation-delay:300ms]" />
                      </div>
                    ) : (
                      <MarkdownContent content={msg.content} />
                    )}
                  </div>
                ) : (
                  <p className="whitespace-pre-wrap m-0">{msg.content}</p>
                )}
              </div>
            </div>
          ))}

          {error && (
            <div className="text-sm text-red-500 bg-red-500/10 rounded-lg px-4 py-3">
              {error}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form
          onSubmit={handleSubmit}
          className="border-t border-[var(--gray-a3)] px-5 py-3"
        >
          <div className="flex items-end gap-2">
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about Sentry..."
              rows={1}
              className="flex-1 resize-none bg-[var(--gray-a2)] rounded-lg px-4 py-2.5 text-sm text-[var(--foreground)] placeholder:text-[var(--gray-9)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-purple)]/50 max-h-32"
              disabled={isStreaming}
              style={{
                height: 'auto',
                minHeight: '40px',
              }}
              onInput={e => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = 'auto';
                target.style.height = `${Math.min(target.scrollHeight, 128)}px`;
              }}
            />
            <button
              type="submit"
              disabled={!input.trim() || isStreaming}
              className="flex-shrink-0 bg-[var(--accent-purple)] text-white rounded-lg px-4 py-2.5 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
            >
              {isStreaming ? 'Thinking...' : 'Send'}
            </button>
          </div>
          <p className="text-[10px] text-[var(--gray-9)] mt-2">
            AI answers are generated from{' '}
            <a
              href="https://docs.sentry.io"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              Sentry docs
            </a>
            . Do not share sensitive information.
          </p>
        </form>
      </div>
    </div>
  );
}

/**
 * Renders markdown content as React elements without dangerouslySetInnerHTML.
 * Handles: code blocks, inline code, headings, bold, italic, links, lists, paragraphs.
 */
function MarkdownContent({content}: {content: string}) {
  const blocks = parseBlocks(content);
  return (
    <div className="[&>:first-child]:mt-0 [&>:last-child]:mb-0">
      {blocks.map((block, i) => (
        <Fragment key={i}>{block}</Fragment>
      ))}
    </div>
  );
}

function parseBlocks(md: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  // Split into code blocks and everything else
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

    // Split remaining text into paragraphs by double newline
    const paragraphs = part.split(/\n\n+/);
    for (const para of paragraphs) {
      const trimmed = para.trim();
      if (!trimmed) {
        continue;
      }

      // Headings
      const headingMatch = trimmed.match(/^(#{1,4}) (.+)$/);
      if (headingMatch) {
        const level = headingMatch[1].length;
        const text = headingMatch[2];
        const HeadingTag = `h${level + 1}` as keyof JSX.IntrinsicElements;
        nodes.push(<HeadingTag key={nodes.length}>{renderInline(text)}</HeadingTag>);
        continue;
      }

      // List items (consecutive lines starting with - or * or 1.)
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

      // Regular paragraph
      nodes.push(<p key={nodes.length}>{renderInline(trimmed)}</p>);
    }
  }

  return nodes;
}

function renderInline(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  // Pattern matches: inline code, bold, italic, links, or plain text
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
        nodes.push(
          <a
            key={`a${match.index}`}
            href={linkMatch[2]}
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
