import {AskAiEvent, AskAiSource} from 'sentry-docs/lib/askAi/types';

export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  html?: string;
  streamId?: string;
  chunkIndex?: number;
  sources?: AskAiSource[];
};

export function applyAnswerEvent(
  messages: ChatMessage[],
  event: AskAiEvent
): ChatMessage[] {
  if (event.type === 'chunk') {
    const existing = messages.find(message => message.streamId === event.id);
    if (existing?.html !== undefined || (existing?.chunkIndex ?? -1) >= event.index)
      return messages;
    const next: ChatMessage = {
      id: event.id,
      streamId: event.id,
      role: 'assistant',
      text: event.text,
      chunkIndex: event.index,
    };
    return existing
      ? messages.map(message => (message === existing ? next : message))
      : [...messages, next];
  }
  if (event.type === 'answer') {
    const existing = messages.find(
      message =>
        message.id === event.id || (event.streamId && message.streamId === event.streamId)
    );
    const next: ChatMessage = {
      id: event.id,
      streamId: event.streamId,
      role: 'assistant',
      text: '',
      html: event.html,
      sources: event.sources,
    };
    return existing
      ? messages.map(message => (message === existing ? next : message))
      : [...messages, next];
  }
  return messages;
}
