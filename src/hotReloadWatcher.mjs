import path from 'path';
import {watch} from 'node:fs/promises';
import {WebSocketServer} from 'ws';

const watchedConent = new Set(['.mdx', '.md', '.png', '.jpg', '.jpeg', '.gif', '.svg']);

export const throttle = (fn, delay) => {
  let last = 0;
  return (...args) => {
    const now = Date.now();
    if (now - last < delay) {
      return;
    }
    last = now;
    return fn(...args);
  };
};

const wss = new WebSocketServer({port: 8080});
console.info('⚡️ Hot reload watcher listening on ws://localhost:8080');

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
      if (watchedConent.has(path.extname(event.filename))) {
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
