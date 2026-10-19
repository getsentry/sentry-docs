/* eslint-disable no-script-url -- Malicious source URLs are intentional test inputs. */
import {describe, expect, it, vi} from 'vitest';

vi.mock('server-only', () => ({}));

import {normalizeFinEvent, validateStreamUrl} from './fin';
import {readEventStream, safeSourceUrl} from './types';

describe('Fin event contract', () => {
  it('keeps cumulative chunks separate from final rich answers and citations', () => {
    expect(
      normalizeFinEvent(
        {
          event_name: 'fin_reply_chunk',
          conversation_id: 'docs-1',
          stream_id: 'stream-1',
          chunk_index: 2,
          chunk_text: 'Full answer so far',
        },
        'docs-1'
      )
    ).toEqual({type: 'chunk', id: 'stream-1', index: 2, text: 'Full answer so far'});
    expect(
      normalizeFinEvent(
        {
          event_name: 'fin_replied',
          conversation_id: 'docs-1',
          stream_id: 'stream-1',
          message: {
            id: 'message-1',
            body: '<p>Answer [1]</p>',
            sources: [
              {title: 'Setup', url: 'https://docs.sentry.io/platforms/javascript/'},
              {title: 'Bad', url: 'javascript:alert(1)'},
            ],
          },
        },
        'docs-1'
      )
    ).toEqual({
      type: 'answer',
      id: 'message-1',
      streamId: 'stream-1',
      html: '<p>Answer [1]</p>',
      sources: [{title: 'Setup', url: 'https://docs.sentry.io/platforms/javascript/'}],
    });
  });

  it('ignores events from another conversation and malformed replies', () => {
    expect(
      normalizeFinEvent(
        {event_name: 'fin_status_updated', conversation_id: 'other', status: 'complete'},
        'docs-1'
      )
    ).toBeNull();
    expect(
      normalizeFinEvent(
        {
          event_name: 'fin_replied',
          conversation_id: 'docs-1',
          message: {body: 'Missing ID'},
        },
        'docs-1'
      )
    ).toBeNull();
  });

  it.each([
    'https://evil.example/event-stream',
    'https://primary-realtime.intercom-messenger.com.evil.example/event-stream',
    'http://primary-realtime.intercom-messenger.com/event-stream',
    'https://user:secret@primary-realtime.intercom-messenger.com/event-stream',
    'https://primary-realtime.intercom-messenger.com/other',
  ])('rejects untrusted stream URLs: %s', url => {
    expect(() => validateStreamUrl(url)).toThrow();
  });

  it('accepts the documented server-side SSE endpoint', () => {
    const url =
      'https://primary-realtime.intercom-messenger.com/event-stream?accessToken=secret';
    expect(validateStreamUrl(url)).toBe(url);
  });

  it('only accepts HTTPS source URLs without credentials', () => {
    expect(safeSourceUrl('https://docs.sentry.io/')).toBe('https://docs.sentry.io/');
    for (const url of [
      '//evil.example',
      'javascript:alert(1)',
      'data:text/html,test',
      'https://user:pass@example.com',
    ])
      expect(safeSourceUrl(url)).toBeNull();
  });
});

describe('SSE parser', () => {
  it('handles fragmented UTF-8, comments, multiple frames, and CRLF', async () => {
    const bytes = new TextEncoder().encode(
      ': heartbeat\r\n\r\ndata: {"text":"héllo"}\r\n\r\ndata: {\n' +
        'data: "status":"complete"}\n\n'
    );
    const body = new ReadableStream<Uint8Array>({
      start(controller) {
        for (const byte of bytes) controller.enqueue(Uint8Array.of(byte));
        controller.close();
      },
    });
    const events: Record<string, unknown>[] = [];
    for await (const event of readEventStream(body)) events.push(event);
    expect(events).toEqual([{text: 'héllo'}, {status: 'complete'}]);
  });
});
