import {Fragment} from 'react';
import * as Sentry from '@sentry/nextjs';
import type {Metadata} from 'next';

import Article from 'sentry-docs/components/changelog/article';

import Header from './header';

export default async function ChangelogList() {
  return (
    <Fragment>
      <Header loading={false} />
      <div className="w-full mx-auto grid grid-cols-12 bg-gray-200">
        <div className="hidden md:block md:col-span-2 pl-5 pt-10" />
        <div className="col-span-12 md:col-span-8">
          <div className="max-w-3xl mx-auto px-4 pb-4 sm:px-6 md:px-8">
            <div className="flex justify-between items-center py-6 space-x-4" />

            <Article title="Be right back" />
          </div>
        </div>
        <div className="hidden md:block md:col-span-2 pl-5 pt-10" />
      </div>
    </Fragment>
  );
}

export function generateMetadata(): Metadata {
  return {
    description:
      'Stay up to date on everything big and small, from product updates to SDK changes with the Sentry Changelog.',
    alternates: {
      canonical: `https://sentry.io/changelog/`,
    },
    other: {
      'sentry-trace': `${Sentry.getActiveSpan()?.toTraceparent()}`,
    },
  };
}
