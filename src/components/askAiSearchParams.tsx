'use client';

import {Fragment, useEffect} from 'react';
import {useSearchParams} from 'next/navigation';

export default function AskAiSearchParams() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const askAi = searchParams?.get('askAI');
    // Give Kapa.ai some time to be fully loaded
    const timer = setTimeout(() => {
      if (window.Kapa?.open && askAi === 'true') {
        // open kapa modal
        window.Kapa.open({});
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchParams]);

  return <Fragment />;
}
