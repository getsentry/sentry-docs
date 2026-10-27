'use client';

import {useSearchParams} from 'next/navigation';
import {Fragment, useEffect} from 'react';
import {usePlausibleEvent} from 'sentry-docs/hooks/usePlausibleEvent';
import {openKapa} from 'sentry-docs/lib/kapa';

export default function AskAiSearchParams() {
  const searchParams = useSearchParams();
  const {emit} = usePlausibleEvent();

  useEffect(() => {
    if (searchParams?.get('askAI') !== 'true') {
      return;
    }
    // openKapa resolves once the widget is actually ready, so the deep link no
    // longer races a fixed timeout.
    openKapa({});
    const referrer = searchParams.get('referrer');
    if (referrer) {
      emit('Ask AI Referrer', {props: {referrer}});
    }
  }, [searchParams, emit]);

  return <Fragment />;
}
