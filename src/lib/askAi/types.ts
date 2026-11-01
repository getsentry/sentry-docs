export type AskAiSource = {title: string; url: string};

export type AskAiEvent =
  | {type: 'session'; token: string}
  | {type: 'reference'; reference: string}
  | {type: 'chunk'; id: string; text: string; index: number}
  | {type: 'answer'; id: string; streamId?: string; html: string; sources: AskAiSource[]}
  | {type: 'status'; status: string}
  | {type: 'error'; message: string};

export const MAX_QUESTION_LENGTH = 4000;

// Both upstream SSE and our first-party stream use JSON data frames. Handle
// arbitrary network boundaries, CRLF, comments, and multiline data fields.
export async function* readEventStream(body: ReadableStream<Uint8Array>) {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  try {
    while (true) {
      const {done, value} = await reader.read();
      buffer += decoder.decode(value, {stream: !done});
      let boundary: RegExpExecArray | null;
      while ((boundary = /\r?\n\r?\n/.exec(buffer))) {
        const frame = buffer.slice(0, boundary.index);
        buffer = buffer.slice(boundary.index + boundary[0].length);
        const data = frame
          .split(/\r?\n/)
          .filter(line => line.startsWith('data:'))
          .map(line => line.slice(5).replace(/^ /, ''))
          .join('\n');
        if (data) yield JSON.parse(data) as Record<string, unknown>;
      }
      if (buffer.length > 512_000) throw new Error('Event frame too large');
      if (done) break;
    }
  } finally {
    await reader.cancel().catch(() => {});
    reader.releaseLock();
  }
}

export function safeSourceUrl(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && !url.username && !url.password ? url.href : null;
  } catch {
    return null;
  }
}
