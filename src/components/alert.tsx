import React from 'react';

type Props = {
  children?: any;
  deepLink?: string;
  dismiss?: boolean;
  level?: string;
  title?: string;
};

export default function Alert({
  title,
  children,
  level,
  deepLink,
  dismiss = false,
}: Props): JSX.Element {
  let className = 'alert';
  if (level) {
    className += ` alert-${level}`;
  }
  if (children.props && typeof children.props.children === 'string') {
    className += ' markdown-text-only';
  }
  return (
    <div className={className} role="alert" id={deepLink}>
      {dismiss && (
        <button type="button" className="close" data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      )}
      {title && <h5 className="no_toc">{title}</h5>}
      <div className="alert-body content-flush-bottom">{children}</div>
    </div>
  );
}
