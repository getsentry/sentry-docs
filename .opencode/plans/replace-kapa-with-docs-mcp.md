# Replace Kapa AI with docs-mcp

## Overview

Replace the third-party Kapa AI chatbot widget with a first-party AI chat powered by the `docs-mcp` Cloudflare Worker in `getsentry/cli-init-api`. This gives us full control over the AI experience, better answer quality (using docs.sentry.io's `.md` exports directly), and eliminates the dependency on Kapa's external service.

## Architecture

```
Browser (sentry-docs)                     Cloudflare Worker (docs-mcp)
┌─────────────────────┐                   ┌──────────────────────────┐
│ AskAI Modal         │   POST /api/ask   │                          │
│ (React component)   │ ───SSE stream───> │ ask-agent                │
│                     │                   │  ├─ search_docs (doctree)│
│ - multi-turn chat   │ <──text/deltas──  │  ├─ fetch_doc_page (.md) │
│ - streaming display │                   │  └─ Claude Sonnet answer │
│ - markdown render   │                   │                          │
└─────────────────────┘                   └──────────────────────────┘
```

**Why this is better than Kapa:**
- Uses our own `.md` exports (structured, up-to-date)
- Full control over the prompt, model, and answer quality
- No third-party JS bundle (faster page load)
- No external dependencies (Kapa's Google Cloud Run proxy)
- Can cite specific doc pages with links
- Can be tuned specifically for Sentry docs

---

## Part 1: docs-mcp Backend Changes

All changes in `getsentry/cli-init-api`, specifically `apps/docs-mcp/`.

### 1.1 Add AI SDK dependencies

**File: `apps/docs-mcp/package.json`**

Add to `dependencies`:
```json
"@ai-sdk/anthropic": "^1.2.0",
"ai": "^5.0.0"
```

Run `bun install` from the monorepo root.

### 1.2 Update Env type

**File: `apps/docs-mcp/src/types.ts`**

Add `ANTHROPIC_API_KEY` to the `Env` interface:

```typescript
export interface Env {
  ANTHROPIC_API_KEY: string;
  CF_VERSION_METADATA: string;
}
```

Set this secret via `wrangler secret put ANTHROPIC_API_KEY`.

### 1.3 Create doc fetcher for docs.sentry.io

**New file: `apps/docs-mcp/src/docs/fetcher.ts`**

This fetches pages from `docs.sentry.io` using `.md` exports and `doctree.json`. The docs-mcp already has `skill-fetcher.ts` for `skills.sentry.dev` — this is the equivalent for the docs site itself.

```typescript
import * as Sentry from "@sentry/cloudflare";

const DOCS_BASE = "https://docs.sentry.io";
const PAGE_CACHE_TTL = 3600;      // 1 hour for individual pages
const DOCTREE_CACHE_TTL = 21600;  // 6 hours for doctree
const FETCH_TIMEOUT_MS = 10_000;

// ── Types ───────────────────────────────────────────────────────────

export interface DocTreeNode {
  title: string;
  description?: string;
  path: string;
  children?: DocTreeNode[];
}

export interface DocSearchHit {
  title: string;
  description: string;
  path: string;
  url: string;
}

// ── Cached fetch helper ─────────────────────────────────────────────

async function cachedFetch(url: string, ttl: number): Promise<string> {
  return Sentry.startSpan(
    { op: "http.client", name: `fetch ${url}` },
    async (span) => {
      let cache: Cache | undefined;
      try {
        cache = caches?.default;
      } catch {
        // Not in CF runtime
      }

      const request = new Request(url);

      if (cache) {
        const cached = await cache.match(request);
        if (cached) {
          span.setAttribute("cache.hit", true);
          return cached.text();
        }
      }

      span.setAttribute("cache.hit", false);
      const response = await fetch(request, {
        signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch ${url}: ${response.status}`);
      }

      const body = await response.text();

      if (cache) {
        const cacheResponse = new Response(body, {
          headers: {
            "Cache-Control": `public, max-age=${ttl}`,
            "Content-Type": response.headers.get("Content-Type") ?? "text/plain",
          },
        });
        await cache.put(request, cacheResponse);
      }

      return body;
    }
  );
}

// ── Doctree ─────────────────────────────────────────────────────────

let doctreeCache: DocTreeNode[] | null = null;

async function getDoctree(): Promise<DocTreeNode[]> {
  if (doctreeCache) return doctreeCache;

  const raw = await cachedFetch(`${DOCS_BASE}/doctree.json`, DOCTREE_CACHE_TTL);
  doctreeCache = JSON.parse(raw) as DocTreeNode[];
  return doctreeCache;
}

function flattenDoctree(
  nodes: DocTreeNode[],
  results: DocSearchHit[] = []
): DocSearchHit[] {
  for (const node of nodes) {
    results.push({
      title: node.title,
      description: node.description ?? "",
      path: node.path,
      url: `${DOCS_BASE}${node.path}`,
    });
    if (node.children) {
      flattenDoctree(node.children, results);
    }
  }
  return results;
}

// ── Search ──────────────────────────────────────────────────────────

export async function searchDocs(
  query: string,
  maxResults = 8
): Promise<DocSearchHit[]> {
  const tree = await getDoctree();
  const allPages = flattenDoctree(tree);

  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);

  const scored = allPages
    .map((page) => {
      const haystack =
        `${page.title} ${page.description} ${page.path}`.toLowerCase();
      let score = 0;
      for (const term of terms) {
        if (page.title.toLowerCase().includes(term)) score += 3;
        if (page.path.toLowerCase().includes(term)) score += 2;
        if (page.description.toLowerCase().includes(term)) score += 1;
      }
      return { page, score };
    })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxResults);

  return scored.map((s) => s.page);
}

// ── Fetch page ──────────────────────────────────────────────────────

export async function fetchDocPage(path: string): Promise<string> {
  const normalizedPath = path.replace(/\/$/, "");
  const url = `${DOCS_BASE}${normalizedPath}.md`;
  const content = await cachedFetch(url, PAGE_CACHE_TTL);
  // Truncate very long pages to stay within token budget
  return content.length > 25_000 ? content.slice(0, 25_000) + "\n\n[truncated]" : content;
}
```

### 1.4 Create the ask agent

**New file: `apps/docs-mcp/src/ask/agent.ts`**

This is the core AI agent that answers questions about Sentry using docs.

```typescript
import { anthropic } from "@ai-sdk/anthropic";
import * as Sentry from "@sentry/cloudflare";
import { streamText, tool } from "ai";
import { z } from "zod";
import { fetchDocPage, searchDocs } from "../docs/fetcher";

// ── Agent-internal tools ────────────────────────────────────────────

const agentTools = {
  search_docs: tool({
    description:
      "Search the Sentry documentation for pages relevant to a query. " +
      "Returns titles, descriptions, and paths of matching pages.",
    parameters: z.object({
      query: z
        .string()
        .describe("Search query — use keywords related to the user's question"),
    }),
    execute: async ({ query }) => {
      const hits = await searchDocs(query);
      return hits.map((h) => ({
        title: h.title,
        description: h.description,
        path: h.path,
        url: h.url,
      }));
    },
  }),

  fetch_doc_page: tool({
    description:
      "Fetch the full markdown content of a specific Sentry documentation page. " +
      "Use this after search_docs to read the details of a relevant page.",
    parameters: z.object({
      path: z
        .string()
        .describe("The path of the doc page, e.g. /platforms/javascript/guides/nextjs/"),
    }),
    execute: async ({ path }) => {
      const content = await fetchDocPage(path);
      return { path, content };
    },
  }),
};

// ── System prompt ───────────────────────────────────────────────────

const SYSTEM_PROMPT = `You are the Sentry Docs AI assistant. You help users with questions about Sentry — an application monitoring and error tracking platform.

Your knowledge comes from the official Sentry documentation at docs.sentry.io. You MUST use the provided tools to search and read documentation before answering questions. Do not rely on prior knowledge — always verify against the current docs.

## Guidelines

1. **Always search first.** Use search_docs to find relevant pages, then fetch_doc_page to read them before answering.
2. **Be accurate.** Only provide information that is supported by the documentation you've read. If you can't find an answer, say so.
3. **Cite sources.** Include links to relevant documentation pages in your answers using markdown links like [Page Title](https://docs.sentry.io/path/).
4. **Be concise.** Give direct, actionable answers. Include code snippets when they help.
5. **Use markdown.** Format your responses with proper markdown — headings, code blocks with language tags, lists, etc.
6. **Stay on topic.** Only answer questions about Sentry. For unrelated questions, politely redirect.
7. **Handle platform specifics.** If the user mentions a specific platform/framework (Next.js, Django, etc.), search for platform-specific docs.

## What you can help with
- SDK setup and configuration
- Error monitoring, tracing, session replay, logs, profiling, crons
- Product features (alerts, dashboards, releases, etc.)
- Integrations (GitHub, Slack, etc.)
- Troubleshooting SDK issues
- Migration between SDK versions
- Self-hosted Sentry setup

## Privacy
Do not ask for or accept any sensitive information like auth tokens, DSNs with secrets, or personal data. If a user shares such information, remind them not to.`;

// ── Message types ───────────────────────────────────────────────────

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

// ── Stream response ─────────────────────────────────────────────────

export function streamAskResponse(
  messages: ChatMessage[],
  apiKey: string
) {
  return Sentry.startSpan(
    {
      op: "ai.ask",
      name: "streamAskResponse",
      attributes: { "ai.message_count": messages.length },
    },
    () => {
      return streamText({
        model: anthropic.chat("claude-sonnet-4-20250514", {
          apiKey,
        }),
        system: SYSTEM_PROMPT,
        messages,
        tools: agentTools,
        maxSteps: 5,
        temperature: 0,
        onError: (error) => {
          Sentry.captureException(error);
        },
      });
    }
  );
}
```

### 1.5 Add the `/api/ask` endpoint

**File: `apps/docs-mcp/src/index.ts`** — add the new route:

```typescript
import { StreamableHTTPTransport } from "@hono/mcp";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { createMcpServer } from "./mcp";
import * as Sentry from "@sentry/cloudflare";
import type { Env } from "./types";
import { streamAskResponse, type ChatMessage } from "./ask/agent";

const app = new Hono<{ Bindings: Env }>().use(cors());

// ── MCP endpoint (existing) ─────────────────────────────────────────

app.all("/mcp", async (c) => {
  const transport = new StreamableHTTPTransport();
  const mcp = createMcpServer();
  await mcp.connect(transport);
  return transport.handleRequest(c);
});

// ── Ask AI endpoint (new) ───────────────────────────────────────────

app.post("/api/ask", async (c) => {
  const body = await c.req.json<{ messages: ChatMessage[] }>();

  if (!body.messages || !Array.isArray(body.messages) || body.messages.length === 0) {
    return c.json({ error: "messages array is required" }, 400);
  }

  // Limit conversation length to prevent abuse
  if (body.messages.length > 20) {
    return c.json({ error: "conversation too long (max 20 messages)" }, 400);
  }

  const apiKey = c.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return c.json({ error: "AI service not configured" }, 503);
  }

  const result = streamAskResponse(body.messages, apiKey);

  // Return as a streaming response using Vercel AI SDK's data stream
  return result.toDataStreamResponse({
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "no-cache",
    },
  });
});

// ── Export ───────────────────────────────────────────────────────────

export default Sentry.withSentry(
  (env: Env) => ({
    dsn: "https://05c618aef6e0489b8c9d07e0d65664ce@o1.ingest.us.sentry.io/4511189954199552",
    sendDefaultPii: true,
    tracesSampleRate: 1.0,
  }),
  app
);
```

### 1.6 Add metrics for the ask endpoint

**File: `apps/docs-mcp/src/metrics.ts`** — add:

```typescript
/** Track an /api/ask call. */
export function trackAskCall(success: boolean, messageCount: number): void {
  Sentry.metrics.count("docs_mcp.ask.call", 1, {
    attributes: { success, message_count: messageCount },
  });
}

/** Track /api/ask response duration. */
export function trackAskDuration(durationMs: number): void {
  Sentry.metrics.distribution("docs_mcp.ask.duration", durationMs, {
    unit: "millisecond",
  });
}
```

### 1.7 Summary of new files in docs-mcp

```
apps/docs-mcp/src/
├── ask/
│   └── agent.ts          # NEW: Ask agent with streaming + doc tools
├── docs/
│   └── fetcher.ts        # NEW: docs.sentry.io page/doctree fetcher
├── index.ts              # MODIFIED: add /api/ask route
├── mcp.ts                # UNCHANGED
├── metrics.ts            # MODIFIED: add ask metrics
├── skills/               # UNCHANGED
│   ├── registry.ts
│   ├── skill-fetcher.ts
│   └── skill-parser.ts
└── types.ts              # MODIFIED: add ANTHROPIC_API_KEY to Env
```

---

## Part 2: sentry-docs Frontend Changes

All changes in `getsentry/sentry-docs`.

### 2.1 Add environment variable

**File: `.env.example`** — add:
```
NEXT_PUBLIC_ASK_AI_API_URL=https://docs-mcp.getsentry.workers.dev
```

### 2.2 Create AskAI context provider

**New file: `src/components/askAi/askAiContext.tsx`**

Provides modal open/close state and the ability to open with a pre-filled query.

```tsx
'use client';

import {createContext, useCallback, useContext, useMemo, useState} from 'react';

interface AskAiContextValue {
  isOpen: boolean;
  initialQuery: string | null;
  autoSubmit: boolean;
  open: (opts?: {query?: string; submit?: boolean}) => void;
  close: () => void;
}

const AskAiContext = createContext<AskAiContextValue | null>(null);

export function AskAiProvider({children}: {children: React.ReactNode}) {
  const [isOpen, setIsOpen] = useState(false);
  const [initialQuery, setInitialQuery] = useState<string | null>(null);
  const [autoSubmit, setAutoSubmit] = useState(false);

  const open = useCallback((opts?: {query?: string; submit?: boolean}) => {
    setInitialQuery(opts?.query ?? null);
    setAutoSubmit(opts?.submit ?? false);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setInitialQuery(null);
    setAutoSubmit(false);
  }, []);

  const value = useMemo(
    () => ({isOpen, initialQuery, autoSubmit, open, close}),
    [isOpen, initialQuery, autoSubmit, open, close]
  );

  return <AskAiContext.Provider value={value}>{children}</AskAiContext.Provider>;
}

export function useAskAi() {
  const ctx = useContext(AskAiContext);
  if (!ctx) {
    throw new Error('useAskAi must be used within AskAiProvider');
  }
  return ctx;
}
```

### 2.3 Create the AskAI modal chat component

**New file: `src/components/askAi/askAiModal.tsx`**

This is the main chat modal component with streaming markdown support.

```tsx
'use client';

import {Cross1Icon} from '@radix-ui/react-icons';
import {useCallback, useEffect, useRef, useState} from 'react';

import {MagicIcon} from '../cutomIcons/magic';
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

  // Handle initial query from context
  useEffect(() => {
    if (isOpen && initialQuery && !hasAutoSubmitted.current) {
      setInput(initialQuery);
      if (autoSubmit) {
        hasAutoSubmitted.current = true;
        // Submit after a tick to let the input render
        setTimeout(() => {
          submitMessage(initialQuery);
        }, 0);
      }
    }
    if (!isOpen) {
      hasAutoSubmitted.current = false;
    }
  }, [isOpen, initialQuery, autoSubmit]);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && !autoSubmit) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, autoSubmit]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({behavior: 'smooth'});
  }, [messages]);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        close();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, close]);

  const submitMessage = useCallback(
    async (messageText?: string) => {
      const text = messageText ?? input.trim();
      if (!text || isStreaming) return;

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

        // Parse Vercel AI SDK data stream
        const reader = response.body?.getReader();
        if (!reader) throw new Error('No response body');

        const decoder = new TextDecoder();
        let assistantContent = '';

        // Add empty assistant message that we'll stream into
        setMessages(prev => [...prev, {role: 'assistant', content: ''}]);

        while (true) {
          const {done, value} = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, {stream: true});
          // Vercel AI SDK data stream format: lines starting with specific prefixes
          // 0: is text delta, e: is error, d: is done
          const lines = chunk.split('\n');
          for (const line of lines) {
            if (line.startsWith('0:')) {
              // Text delta — parse the JSON string after "0:"
              try {
                const text = JSON.parse(line.slice(2));
                assistantContent += text;
                setMessages(prev => {
                  const updated = [...prev];
                  updated[updated.length - 1] = {
                    role: 'assistant',
                    content: assistantContent,
                  };
                  return updated;
                });
              } catch {
                // skip malformed chunks
              }
            }
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to get response');
        // Remove the empty assistant message if there was an error
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={close} />

      {/* Modal */}
      <div className="relative w-full max-w-2xl mx-4 max-h-[80vh] bg-[var(--gray-1)] rounded-xl border border-[var(--gray-a3)] shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--gray-a3)]">
          <div className="flex items-center gap-2">
            <MagicIcon className="size-5 text-[var(--accent-purple)]" />
            <h2 className="text-base font-semibold text-[var(--foreground)]">
              Ask AI
            </h2>
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
                    onClick={() => {
                      setInput(q);
                      submitMessage(q);
                    }}
                    className="text-xs px-3 py-1.5 rounded-full border border-[var(--gray-a3)] text-[var(--gray-11)] hover:border-[var(--accent-purple)] hover:text-[var(--accent-purple)] transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[85%] rounded-lg px-4 py-3 text-sm ${
                  msg.role === 'user'
                    ? 'bg-[var(--accent-purple)] text-white'
                    : 'bg-[var(--gray-a2)] text-[var(--foreground)]'
                }`}
              >
                {msg.role === 'assistant' ? (
                  <div
                    className="prose prose-sm dark:prose-invert max-w-none [&_pre]:bg-[var(--gray-a3)] [&_pre]:rounded-md [&_pre]:p-3 [&_code]:text-xs [&_a]:text-[var(--accent-purple)]"
                    dangerouslySetInnerHTML={{__html: simpleMarkdown(msg.content)}}
                  />
                ) : (
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                )}
                {msg.role === 'assistant' && msg.content === '' && isStreaming && (
                  <div className="flex gap-1 py-1">
                    <span className="size-1.5 bg-[var(--gray-8)] rounded-full animate-bounce [animation-delay:0ms]" />
                    <span className="size-1.5 bg-[var(--gray-8)] rounded-full animate-bounce [animation-delay:150ms]" />
                    <span className="size-1.5 bg-[var(--gray-8)] rounded-full animate-bounce [animation-delay:300ms]" />
                  </div>
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
 * Minimal markdown-to-HTML converter for streaming content.
 * Handles: headings, bold, italic, inline code, code blocks, links, lists.
 * For a production build, consider using a proper markdown library.
 */
function simpleMarkdown(md: string): string {
  let html = md
    // Code blocks (``` ... ```)
    .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre><code class="language-$1">$2</code></pre>')
    // Inline code
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    // Headings
    .replace(/^### (.+)$/gm, '<h4>$1</h4>')
    .replace(/^## (.+)$/gm, '<h3>$1</h3>')
    .replace(/^# (.+)$/gm, '<h2>$1</h2>')
    // Bold
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    // Italic
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
    // Unordered lists
    .replace(/^[*-] (.+)$/gm, '<li>$1</li>')
    // Ordered lists
    .replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
    // Paragraphs (double newline)
    .replace(/\n\n/g, '</p><p>')
    // Single newlines (within paragraphs)
    .replace(/\n/g, '<br>');

  // Wrap consecutive <li> items in <ul>
  html = html.replace(/(<li>.*?<\/li>)+/gs, '<ul>$&</ul>');

  return `<p>${html}</p>`;
}
```

### 2.4 Create the index export

**New file: `src/components/askAi/index.tsx`**

```tsx
export {AskAiProvider, useAskAi} from './askAiContext';
export {AskAiModal} from './askAiModal';
```

### 2.5 Wire provider + modal into the root layout

**File: `app/layout.tsx`**

Remove the Kapa `<Script>` tag. Add the `AskAiProvider` and `AskAiModal`.

```tsx
import './globals.css';

import {Theme} from '@radix-ui/themes';
import type {Metadata} from 'next';
import {Rubik} from 'next/font/google';
import PlausibleProvider from 'next-plausible';
import {SkipToContent} from 'sentry-docs/components/skipToContent';
import {ThemeProvider} from 'sentry-docs/components/theme-provider';

import {AskAiModal, AskAiProvider} from 'sentry-docs/components/askAi';

const rubik = Rubik({
  weight: ['400', '500', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-rubik',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Home',
  icons: {
    icon:
      process.env.NODE_ENV === 'production' ? '/favicon.ico' : '/favicon_localhost.png',
  },
  openGraph: {
    images: '/og.png',
  },
  other: {
    'zd-site-verification': 'ocu6mswx6pke3c6qvozr2e',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <PlausibleProvider taggedEvents domain="docs.sentry.io,rollup.sentry.io" />
      </head>
      <body className={rubik.variable} suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AskAiProvider>
            <Theme accentColor="iris" grayColor="sand" radius="large" scaling="95%">
              <SkipToContent />
              {children}
            </Theme>
            <AskAiModal />
          </AskAiProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
```

### 2.6 Update search component

**File: `src/components/search/index.tsx`**

Changes:
- Import `useAskAi` instead of using `window.Kapa`
- Replace `kapa-ai-class` button with `useAskAi().open()`
- Replace inline "Ask Sentry about..." button

```diff
 'use client';

 import {ArrowRightIcon} from '@radix-ui/react-icons';
 import {Button} from '@radix-ui/themes';
 ...
+import {useAskAi} from '../askAi';
 import {MagicIcon} from '../cutomIcons/magic';
 ...

 export function Search({...}: Props) {
+  const {open: openAskAi} = useAskAi();
   ...

   return (
     <div className={styles.search} ref={ref}>
       <div className={styles['search-bar']}>
         <div className={styles['input-wrapper']}>
           ...
         </div>
         <Fragment>
           <span className="text-[var(--desatPurple10)] hidden md:inline">or</span>
           <Button
-            asChild
             variant="ghost"
             color="gray"
             size="3"
             radius="medium"
-            className="font-medium text-[var(--foreground)] py-2 px-3 uppercase cursor-pointer kapa-ai-class hidden md:flex mr-4"
+            className="font-medium text-[var(--foreground)] py-2 px-3 uppercase cursor-pointer hidden md:flex mr-4"
+            onClick={() => openAskAi()}
           >
-            <div>
-              <MagicIcon />
-              <span>Ask AI</span>
-            </div>
+            <MagicIcon />
+            <span>Ask AI</span>
           </Button>
         </Fragment>
       </div>
       {query.length >= 2 && inputFocus && (
         <div className={styles['sgs-search-results']}>
           <div className={styles['sgs-ai']}>
             <button
               id="ai-list-entry"
               className={styles['sgs-ai-button']}
               onClick={() => {
-                if (window.Kapa?.open) {
-                  setInputFocus(false);
-                  window.Kapa.open({query, submit: true});
-                }
+                setInputFocus(false);
+                openAskAi({query, submit: true});
               }}
             >
```

### 2.7 Update header component

**File: `src/components/header.tsx`**

Changes:
- Import `useAskAi`
- Replace `kapa-ai-class` mobile button

```diff
 'use client';
 ...
+import {useAskAi} from './askAi';
 import {MagicIcon} from './cutomIcons/magic';
 ...

 export function Header({...}: Props) {
+  const {open: openAskAi} = useAskAi();
   ...

   {/* Mobile: Ask AI button */}
   <button
-    className="kapa-ai-class flex items-center gap-1.5 text-sm font-medium text-[var(--foreground)] px-2 py-1.5 rounded-md hover:bg-[var(--gray-a3)] transition-colors"
+    className="flex items-center gap-1.5 text-sm font-medium text-[var(--foreground)] px-2 py-1.5 rounded-md hover:bg-[var(--gray-a3)] transition-colors"
     aria-label="Ask AI"
+    onClick={() => openAskAi()}
   >
```

### 2.8 Update askAiSearchParams component

**File: `src/components/askAiSearchParams.tsx`**

Replace Kapa usage with the new context:

```tsx
'use client';

import {useSearchParams} from 'next/navigation';
import {Fragment, useEffect} from 'react';
import {usePlausibleEvent} from 'sentry-docs/hooks/usePlausibleEvent';

import {useAskAi} from './askAi';

export default function AskAiSearchParams() {
  const searchParams = useSearchParams();
  const {emit} = usePlausibleEvent();
  const {open: openAskAi} = useAskAi();

  useEffect(() => {
    const askAi = searchParams?.get('askAI');
    if (askAi === 'true') {
      // Small delay to ensure the provider is mounted
      const timer = setTimeout(() => {
        openAskAi();
        if (searchParams?.get('referrer')) {
          emit('Ask AI Referrer', {
            props: {referrer: searchParams.get('referrer') ?? ''},
          });
        }
      }, 100);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [searchParams, emit, openAskAi]);

  return <Fragment />;
}
```

### 2.9 Update globals.d.ts — remove Kapa type

**File: `src/globals.d.ts`**

```typescript
import type * as Sentry from '@sentry/browser';

declare global {
  interface Window {
    Sentry: typeof Sentry;
  }
}
```

### 2.10 Update globals.css — remove Kapa styles

**File: `app/globals.css`**

Remove lines 186-188:
```css
/* DELETE THIS: */
#kapa-widget-portal a[href='https://sentry.io/privacy/'] {
  color: rgb(134, 142, 150) !important;
}
```

### 2.11 Update CSP in vercel.json

**File: `vercel.json`**

In the `Content-Security-Policy` header value:

1. **Remove from `script-src`:** `widget.kapa.ai`
2. **Remove from `connect-src`:** `kapa-widget-proxy-la7dkmplpq-uc.a.run.app`
3. **Add to `connect-src`:** `docs-mcp.getsentry.workers.dev`

Updated CSP line:
```
"value": "upgrade-insecure-requests; default-src 'none'; script-src 'self' 'unsafe-inline' 'unsafe-eval' *.sentry-cdn.com www.googletagmanager.com plausible.io www.gstatic.com www.google.com vercel.live; connect-src 'self' *.sentry.io sentry.io *.algolia.net *.algolianet.com *.algolia.io docs-mcp.getsentry.workers.dev plausible.io reload.getsentry.net storage.googleapis.com raw.githubusercontent.com; img-src * 'self' data: www.google.com www.googletagmanager.com; style-src 'self' 'unsafe-inline'; font-src 'self' fonts.gstatic.com; frame-src www.google.com recaptcha.google.com demo.arcade.software player.vimeo.com; worker-src blob:; report-uri https://o1.ingest.sentry.io/api/1297620/security/?sentry_key=b3cfba5788cb4c138f855c8120f70eab; report-to csp"
```

### 2.12 Update .env.example

**File: `.env.example`** — add:
```
NEXT_PUBLIC_ASK_AI_API_URL=https://docs-mcp.getsentry.workers.dev
```

---

## Part 3: Files Touched Summary

### docs-mcp (getsentry/cli-init-api)

| File | Action |
|------|--------|
| `apps/docs-mcp/package.json` | Add `@ai-sdk/anthropic`, `ai` deps |
| `apps/docs-mcp/src/types.ts` | Add `ANTHROPIC_API_KEY` to Env |
| `apps/docs-mcp/src/index.ts` | Add `/api/ask` POST endpoint |
| `apps/docs-mcp/src/metrics.ts` | Add ask metrics helpers |
| `apps/docs-mcp/src/docs/fetcher.ts` | **NEW** — docs.sentry.io fetcher |
| `apps/docs-mcp/src/ask/agent.ts` | **NEW** — ask agent with streaming |

### sentry-docs (getsentry/sentry-docs)

| File | Action |
|------|--------|
| `app/layout.tsx` | Remove Kapa Script, add AskAiProvider + AskAiModal |
| `app/globals.css` | Remove `#kapa-widget-portal` CSS |
| `src/globals.d.ts` | Remove `Kapa` from Window type |
| `src/components/askAi/askAiContext.tsx` | **NEW** — context provider |
| `src/components/askAi/askAiModal.tsx` | **NEW** — chat modal component |
| `src/components/askAi/index.tsx` | **NEW** — barrel export |
| `src/components/search/index.tsx` | Replace Kapa with useAskAi |
| `src/components/header.tsx` | Replace kapa-ai-class with onClick |
| `src/components/askAiSearchParams.tsx` | Replace Kapa with useAskAi |
| `vercel.json` | Update CSP: remove Kapa, add docs-mcp |
| `.env.example` | Add `NEXT_PUBLIC_ASK_AI_API_URL` |

---

## Part 4: Deployment Order

1. **Deploy docs-mcp first** — add the `/api/ask` endpoint and deploy to Cloudflare
   - `wrangler secret put ANTHROPIC_API_KEY` (if not already set)
   - `bun run deploy` from `apps/docs-mcp/`
   - Verify: `curl -X POST https://docs-mcp.getsentry.workers.dev/api/ask -H "Content-Type: application/json" -d '{"messages":[{"role":"user","content":"How do I set up Sentry for Next.js?"}]}'`

2. **Deploy sentry-docs** — push changes, Vercel deploys automatically
   - Set `NEXT_PUBLIC_ASK_AI_API_URL=https://docs-mcp.getsentry.workers.dev` in Vercel env vars
   - The Kapa removal and new UI ship together

---

## Part 5: Future Improvements

- **Markdown rendering:** Replace `simpleMarkdown()` with a proper markdown library (e.g., `react-markdown` + `rehype-highlight`) for better code syntax highlighting
- **Rate limiting:** Add rate limiting on the `/api/ask` endpoint (by IP or session)
- **Analytics:** Track ask-AI usage in Plausible (questions asked, sessions, etc.)
- **Feedback:** Add thumbs up/down on AI answers
- **Source citations:** Show a "Sources" section below answers listing the doc pages used
- **Streaming indicator:** Show which doc pages the agent is reading in real-time
- **Context awareness:** Pass the current page URL to the API so answers can be contextual
- **Caching:** Cache common questions/answers to reduce LLM costs

---

## Unresolved Questions

1. **Rate limiting strategy:** Should we rate-limit by IP, use a session token, or both? CF Workers has built-in rate limiting.
2. **Cost management:** Claude Sonnet calls with tool use can be expensive at scale. Should we add a daily budget cap? Should we use a smaller model (Haiku) for simple questions?
3. **Markdown renderer:** The `simpleMarkdown()` function is basic. Should we add `react-markdown` as a dependency for proper rendering?
4. **Authentication:** Should the `/api/ask` endpoint require any authentication or be fully public?
5. **Doctree approach:** The doctree.json is ~6MB. An alternative is to use Algolia (which sentry-docs already uses) for search. Which do you prefer?
