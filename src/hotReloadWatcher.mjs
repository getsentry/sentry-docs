/* eslint-disable no-console */
import path from 'path';

import {watch} from 'node:fs/promises';
import {WebSocketServer} from 'ws';

const watchedContent = new Set(['.mdx', '.md', '.png', '.jpg', '.jpeg', '.gif', '.svg']);
const hotReloadPort = Number.parseInt(
  process.env.NEXT_PUBLIC_HOT_RELOAD_PORT ?? process.env.SENTRY_DOCS_HOT_RELOAD_PORT ?? '8081',
  10
);
const hotReloadHost = process.env.NEXT_PUBLIC_HOT_RELOAD_HOST ?? 'localhost';

export const throttle = (fn, delay) => {
  let last = 0;
  return (...args) => {
    const now = Date.now();
    if (now - last < delay) {
      return undefined;
    }
    last = now;
    return fn(...args);
  };
};

const wss = new WebSocketServer({port: hotReloadPort, host: hotReloadHost});
console.info(`⚡️ Hot reload watcher listening on ws://${hotReloadHost}:${hotReloadPort}`);

wss.on('connection', async function onConnect(ws) {
  ws.on('error', err => {
    console.log('ws error', err);
  });
  ws.on('message', function incoming(_msg) {
    // no reason for the client to send messages for now
  });

  const ac = new AbortController();
  const {signal} = ac;
  ws.on('close', () => ac.abort());

  // avoid fileystem chatter when you save a file
  const sendReload = throttle(() => ws.send('reload'), 10);

  try {
    const watcher = watch(path.join(import.meta.dirname, '..', 'docs'), {
      signal,
      recursive: true,
    });
    for await (const event of watcher) {
      if (watchedContent.has(path.extname(event.filename))) {
        sendReload();
      }
    }
  } catch (err) {
    if (err.name === 'AbortError') {
      return;
    }
    throw err;
  }
});
