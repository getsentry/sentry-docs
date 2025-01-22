import {ReactNode} from 'react';
import {ExclamationTriangleIcon, InfoCircledIcon} from '@radix-ui/react-icons';

// explicitly not usig CSS modules here
// because there's some prerendered content that depends on these exact class names
import './styles.scss';

type AlertProps = {
  children?: ReactNode;
  level?: 'info' | 'warning';
  title?: string;
};

export function Alert({title, children, level = 'info'}: AlertProps) {
  const Icon = level === 'warning' ? ExclamationTriangleIcon : InfoCircledIcon;

  return (
    <div className={`alert ${'alert-' + level}`} role="alert">
      <Icon className='alert-icon' />
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
  return (
    <div role="note" className="alert">
      <div className="alert-body">{children}</div>
    </div>
  );
}
