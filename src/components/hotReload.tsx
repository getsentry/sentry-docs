'use client';
import {useEffect} from 'react';
import {useRouter} from 'next/navigation';

const HOT_RELOAD_PORT = process.env.NEXT_PUBLIC_HOT_RELOAD_PORT ?? '8081';
const HOT_RELOAD_HOST = process.env.NEXT_PUBLIC_HOT_RELOAD_HOST ?? 'localhost';

function HotReload_() {
  const router = useRouter();
  let ws: WebSocket;
  const connect = () => {
    if (ws) {
      return;
    }
    ws = new WebSocket(`ws://${HOT_RELOAD_HOST}:${HOT_RELOAD_PORT}`);
    ws.onopen = function open() {
      // do nothing
    };
    ws.onmessage = function incoming(msg) {
      if (msg.data === 'reload') {
        // eslint-disable-next-line no-console
        console.info('[REFRESHING]');
        router.refresh();
      }
    };
    ws.onerror = function error(...err) {
      // eslint-disable-next-line no-console
      console.error('Hot reload ws error', err);
    };
    ws.onclose = function close() {};
  };

  useEffect(
    () => {
      connect();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return null;
}
const noop = () => null;

/**
 * Hot reloads the page when notified by the server of a change under /docs/*
 */
export const HotReload = process.env.NODE_ENV === 'development' ? HotReload_ : noop;
