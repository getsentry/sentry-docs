import React from 'react';

import {formatCaseStyle, usePlatform} from './hooks/usePlatform';

type Props = {
  name: string;
  platform?: string;
};

export function PlatformIdentifier({name, platform}: Props): JSX.Element {
  const [currentPlatform] = usePlatform(platform);
  return <code>{formatCaseStyle(currentPlatform.caseStyle, name)}</code>;
}
