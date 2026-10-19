'use client';

import dynamic from 'next/dynamic';
import {createContext, useCallback, useContext, useRef, useState} from 'react';

const AskAiDialog = dynamic(() => import('./dialog'), {ssr: false});
export type OpenAskAiOptions = {query?: string; submit?: boolean};
const AskAiContext = createContext<(options?: OpenAskAiOptions) => void>(() => {});

export function useAskAi() {
  return useContext(AskAiContext);
}

export function AskAiProvider({
  children,
  provider,
  supportUrl,
  handoffEnabled,
}: {
  children: React.ReactNode;
  provider: 'fin' | 'kapa';
  supportUrl: string | null;
  handoffEnabled: boolean;
}) {
  const [opened, setOpened] = useState(false);
  const [request, setRequest] = useState<{id: number; options: OpenAskAiOptions} | null>(
    null
  );
  const trigger = useRef<HTMLElement | null>(null);
  const open = useCallback(
    (options: OpenAskAiOptions = {}) => {
      if (provider === 'kapa') {
        window.Kapa?.open(options);
        return;
      }
      trigger.current =
        document.activeElement instanceof HTMLElement ? document.activeElement : null;
      setRequest(previous => ({id: (previous?.id || 0) + 1, options}));
      setOpened(true);
    },
    [provider]
  );

  return (
    <AskAiContext.Provider value={open}>
      {children}
      {provider === 'fin' && request && (
        <AskAiDialog
          open={opened}
          onOpenChange={setOpened}
          request={request}
          restoreFocus={() => trigger.current?.isConnected && trigger.current.focus()}
          supportUrl={supportUrl}
          handoffEnabled={handoffEnabled}
        />
      )}
    </AskAiContext.Provider>
  );
}
