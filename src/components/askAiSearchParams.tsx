'use client';

import {Fragment, useEffect} from 'react';
import {useSearchParams} from 'next/navigation';

import {usePlausibleEvent} from 'sentry-docs/hooks/usePlausibleEvent';

export default function AskAiSearchParams() {
  const searchParams = useSearchParams();
  const {emit} = usePlausibleEvent();

  useEffect(() => {
    const askAi = searchParams?.get('askAI');
    // Give Kapa.ai some time to be fully loaded
    const timer = setTimeout(() => {
      if (window.Kapa?.open && askAi === 'true') {
        // open kapa modal
        window.Kapa.open({});
        if (searchParams?.get('referrer')) {
          emit('Ask AI Referrer', {
            props: {referrer: searchParams.get('referrer') ?? ''},
          });
        }
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchParams, emit]);

  return <Fragment />;
}
