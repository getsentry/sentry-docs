import {ReactNode} from 'react';
import {
  CheckCircledIcon,
  ExclamationTriangleIcon,
  InfoCircledIcon,
} from '@radix-ui/react-icons';

import {Callout} from './callout';

type AlertProps = {
  children?: ReactNode;
  level?: 'info' | 'warning' | 'success';
  title?: string;
};

const ICON_MAP = {
  info: InfoCircledIcon,
  warning: ExclamationTriangleIcon,
  success: CheckCircledIcon,
} as const;

export function Alert({title, children, level = 'info'}: AlertProps) {
  const Icon = ICON_MAP[level];

  if (!Icon) {
    throw new Error(`Invalid alert level: "${level}" passed to Alert component`);
  }

  return (
    <Callout role="alert" level={level} Icon={Icon} title={title}>
      {children}
    </Callout>
  );
}
