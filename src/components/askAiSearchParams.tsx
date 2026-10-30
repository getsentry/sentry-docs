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
      return undefined;
    }
    // openKapa resolves once the widget is actually ready, so the deep link no
    // longer races a fixed timeout. Loading can take seconds, so abort on
    // unmount to avoid popping the modal over whatever page the user moved on to.
    const controller = new AbortController();
    const referrer = searchParams.get('referrer');
    openKapa({}, controller.signal).then(opened => {
      if (opened && referrer) {
        emit('Ask AI Referrer', {props: {referrer}});
      }
    });
    return () => controller.abort();
  }, [searchParams, emit]);

  return <Fragment />;
}
