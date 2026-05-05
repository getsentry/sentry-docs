'use client';

import {Cross1Icon} from '@radix-ui/react-icons';
import {useCallback, useEffect, useRef, useState} from 'react';
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

function MarkdownContent({content}: {content: string}) {
  return (
    <div
      dangerouslySetInnerHTML={{__html: renderMarkdown(content)}}
      className="[&>:first-child]:mt-0 [&>:last-child]:mb-0"
    />
  );
}

function renderMarkdown(md: string): string {
  let html = md;

  // Code blocks
  html = html.replace(
    /```(\w*)\n([\s\S]*?)```/g,
    '<pre><code class="language-$1">$2</code></pre>'
  );
  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
  // Headings
  html = html.replace(/^#### (.+)$/gm, '<h5>$1</h5>');
  html = html.replace(/^### (.+)$/gm, '<h4>$1</h4>');
  html = html.replace(/^## (.+)$/gm, '<h3>$1</h3>');
  html = html.replace(/^# (.+)$/gm, '<h2>$1</h2>');
  // Bold
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  // Italic
  html = html.replace(/(?<!\*)\*([^*]+?)\*(?!\*)/g, '<em>$1</em>');
  // Links
  html = html.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
  );
  // Unordered lists
  html = html.replace(/^[*-] (.+)$/gm, '<li>$1</li>');
  // Ordered lists
  html = html.replace(/^\d+\. (.+)$/gm, '<li>$1</li>');
  // Wrap consecutive <li> items in <ul>
  html = html.replace(/(<li>[\s\S]*?<\/li>(\s*))+/g, match => `<ul>${match}</ul>`);
  // Paragraphs
  html = html
    .split('\n\n')
    .map(block => {
      const trimmed = block.trim();
      if (!trimmed) {
        return '';
      }
      if (
        trimmed.startsWith('<h') ||
        trimmed.startsWith('<pre') ||
        trimmed.startsWith('<ul') ||
        trimmed.startsWith('<ol')
      ) {
        return trimmed;
      }
      return `<p>${trimmed.replace(/\n/g, '<br>')}</p>`;
    })
    .join('\n');

  return html;
}
