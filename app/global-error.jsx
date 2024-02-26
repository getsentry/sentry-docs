'use client';

import 'prism-sentry/index.css';

import {useEffect} from 'react';
import * as Sentry from '@sentry/nextjs';
import Error from 'next/error';

import 'sentry-docs/styles/screen.scss';

export default function GlobalError({error}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html>
      <body>
        <Error />
      </body>
    </html>
  );
}
