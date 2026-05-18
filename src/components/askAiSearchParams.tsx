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
