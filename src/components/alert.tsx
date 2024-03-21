'use client';

type Props = {
  children?: any;
  level?: 'info' | 'warning' | 'danger' | 'success' | '';
  title?: string;
};

export function Alert({title, children, level}: Props) {
  let className = 'alert';
  if (level) {
    className += ` alert-${level}`;
  }
  if (children.props && typeof children.props.children === 'string') {
    className += ' markdown-text-only';
  }
  return (
    <div className={className} role="alert">
      {title && <h5 className="no_toc">{title}</h5>}
      <div className="alert-body content-flush-bottom">{children}</div>
    </div>
  );
}
