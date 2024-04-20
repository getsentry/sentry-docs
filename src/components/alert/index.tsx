import {ReactNode} from 'react';

// explicitly not usig CSS modules here
// because there's some prerendered content that depends on these exact class names
import './styles.scss';

type AlertProps = {
  children?: ReactNode;
  level?: 'info' | 'warning' | 'danger' | 'success' | '';
  title?: string;
};

export function Alert({title, children, level = 'info'}: AlertProps) {
  return (
    <div className={`alert ${'alert-' + level}`} role="alert">
      {title && <h5 className="alert-header">{title}</h5>}
      <div className="alert-body content-flush-bottom">{children}</div>
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
