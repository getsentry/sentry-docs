import React from 'react';

import {formatCaseStyle, usePlatform} from './hooks/usePlatform';

type Props = {
  name: string;
  platform?: string;
};

export function PlatformIdentifier({name, platform}: Props) {
  const [currentPlatform] = usePlatform(platform);

  if (!currentPlatform) {
    return null;
  }

  return <code>{formatCaseStyle(currentPlatform.caseStyle, name)}</code>;
}
