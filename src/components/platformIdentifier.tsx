import React from 'react';

import usePlatform, {formatCaseStyle} from './hooks/usePlatform';

type Props = {
  name: string;
  platform?: string;
};

export default function PlatformIdentifier({name, platform}: Props): JSX.Element {
  const [currentPlatform] = usePlatform(platform);
  return <code>{formatCaseStyle(currentPlatform.caseStyle, name)}</code>;
}
