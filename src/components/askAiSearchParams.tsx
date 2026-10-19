'use client';

import {useSearchParams} from 'next/navigation';
import {Fragment, useEffect} from 'react';
import {useAskAi} from 'sentry-docs/components/askAi/provider';
import {usePlausibleEvent} from 'sentry-docs/hooks/usePlausibleEvent';

export default function AskAiSearchParams() {
  const searchParams = useSearchParams();
  const {emit} = usePlausibleEvent();
  const openAskAi = useAskAi();

  useEffect(() => {
    const askAi = searchParams?.get('askAI');
    // Allow the fallback widget to load before opening from a deep link.
    const timer = setTimeout(() => {
      if (askAi === 'true') {
        openAskAi();
        if (searchParams?.get('referrer')) {
          emit('Ask AI Referrer', {
            props: {referrer: searchParams.get('referrer') ?? ''},
          });
        }
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchParams, emit, openAskAi]);

  return <Fragment />;
}
