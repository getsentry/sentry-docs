'use client';

import {Alert} from 'sentry-docs/components/alert';
import {MdxClient} from 'sentry-docs/components/mdxClient';

type Props = {
  code: string;
};

export function ChangelogMdx({code}: Props) {
  return <MdxClient code={code} components={{Alert}} />;
}

