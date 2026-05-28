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
