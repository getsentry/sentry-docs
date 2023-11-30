import React from 'react';

import {PlatformCaseStyle} from 'sentry-docs/types';

import {usePlatform} from './hooks/usePlatform';

type Props = {
  name: string;
  platform?: string;
};

function formatCaseStyle(style: PlatformCaseStyle | undefined, value: string) {
  switch (style) {
    case 'snake_case':
      return value.replace(/-/g, '_');
    case 'camelCase':
      return value
        .split(/-/g)
        .map((val, idx) =>
          idx === 0 ? val : val.charAt(0).toUpperCase() + val.substring(1)
        )
        .join('');
    case 'PascalCase':
      return value
        .split(/-/g)
        .map(val => val.charAt(0).toUpperCase() + val.substring(1))
        .join('');
    default:
      return value;
  }
}

export function PlatformIdentifier({name, platform}: Props) {
  const [currentPlatform] = usePlatform(platform);

  if (!currentPlatform) {
    return null;
  }

  return <code>{formatCaseStyle(currentPlatform.caseStyle, name)}</code>;
}
