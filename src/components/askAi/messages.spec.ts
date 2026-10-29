import {describe, expect, it} from 'vitest';

import {applyAnswerEvent, ChatMessage} from './messages';

describe('Ask AI transcript', () => {
  it('replaces cumulative text, ignores late chunks, and retains multipart answers', () => {
    let messages: ChatMessage[] = [];
    messages = applyAnswerEvent(messages, {
      type: 'chunk',
      id: 'stream',
      index: 0,
      text: 'Hello',
    });
    messages = applyAnswerEvent(messages, {
      type: 'chunk',
      id: 'stream',
      index: 1,
      text: 'Hello world',
    });
    expect(messages).toHaveLength(1);
    expect(messages[0].text).toBe('Hello world');
    messages = applyAnswerEvent(messages, {
      type: 'chunk',
      id: 'stream',
      index: 0,
      text: 'Hello',
    });
    expect(messages[0].text).toBe('Hello world');
    messages = applyAnswerEvent(messages, {
      type: 'answer',
      id: 'answer',
      streamId: 'stream',
      html: '<p>Hello world</p>',
      sources: [],
    });
    messages = applyAnswerEvent(messages, {
      type: 'chunk',
      id: 'stream',
      index: 2,
      text: 'Late text',
    });
    expect(messages[0].html).toBe('<p>Hello world</p>');
    messages = applyAnswerEvent(messages, {
      type: 'answer',
      id: 'answer',
      streamId: 'stream',
      html: '<p>Hello world</p>',
      sources: [],
    });
    messages = applyAnswerEvent(messages, {
      type: 'answer',
      id: 'second',
      html: '<p>Another part</p>',
      sources: [],
    });
    expect(messages).toHaveLength(2);
  });
});
