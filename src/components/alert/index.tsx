import {ReactNode} from 'react';
import {
  CheckCircledIcon,
  ExclamationTriangleIcon,
  InfoCircledIcon,
} from '@radix-ui/react-icons';

// explicitly not usig CSS modules here
// because there's some prerendered content that depends on these exact class names
import './styles.scss';

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
    <div className={`alert ${'alert-' + level}`} role="alert">
      <Icon className="alert-icon" />
      <div className="alert-content">
        {title && <h5 className="alert-header">{title}</h5>}
        <div className="alert-body content-flush-bottom">{children}</div>
      </div>
    </div>
  );
}

type NoteProps = {
  children: ReactNode;
};

export function Note({children}: NoteProps) {
  return <Alert>{children}</Alert>;
}
