import {ForwardRefExoticComponent, ReactNode} from 'react';

// explicitly not usig CSS modules here
// because there's some prerendered content that depends on these exact class names
import './styles.scss';

type CalloutProps = {
  Icon: ForwardRefExoticComponent<any>;
  children?: ReactNode;
  level?: 'info' | 'warning' | 'success';
  role?: string;
  title?: string;
};

export function Callout({title, children, level = 'info', Icon, role}: CalloutProps) {
  return (
    <div className={`callout ${'callout-' + level}`} role={role}>
      <Icon className="callout-icon" />
      <div className="callout-content">
        {title && <h5 className="callout-header">{title}</h5>}
        <div className="callout-body content-flush-bottom">{children}</div>
      </div>
    </div>
  );
}
