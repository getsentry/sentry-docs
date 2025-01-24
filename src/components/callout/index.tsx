import {
  ForwardRefExoticComponent,
  MouseEventHandler,
  ReactNode,
  useCallback,
} from 'react';

// explicitly not usig CSS modules here
// because there's some prerendered content that depends on these exact class names
import './styles.scss';

type CalloutProps = {
  Icon: ForwardRefExoticComponent<any>;
  children?: ReactNode;
  /** If defined, the title of the callout will receive this ID and render a link to this ID. */
  id?: string;
  level?: 'info' | 'warning' | 'success';
  role?: string;
  title?: string;
  titleOnClick?: MouseEventHandler;
};

function Header({
  title,
  id,
  onClick,
}: {
  title: string;
  id?: string;
  onClick?: MouseEventHandler;
}) {
  // We want to avoid actually triggering the link
  const preventDefaultOnClick = useCallback(
    (event: React.MouseEvent) => {
      if (!onClick) {
        return;
      }

      event.preventDefault();
      onClick(event);
    },
    [onClick]
  );

  if (!id) {
    return (
      <h5
        className="callout-header"
        onClick={onClick}
        role={onClick ? 'button' : undefined}
      >
        {title}
      </h5>
    );
  }

  return (
    <h5 className="callout-header" id={id}>
      <a href={'#' + id} onClick={preventDefaultOnClick}>
        {title}
      </a>
    </h5>
  );
}

export function Callout({
  title,
  children,
  level = 'info',
  Icon,
  role,
  id,
  titleOnClick,
}: CalloutProps) {
  return (
    <div className={`callout ${'callout-' + level}`} role={role}>
      <Icon
        className="callout-icon"
        onClick={titleOnClick}
        role={titleOnClick ? 'button' : undefined}
      />
      <div className="callout-content">
        {title && <Header title={title} id={id} onClick={titleOnClick} />}
        <div className="callout-body content-flush-bottom">{children}</div>
      </div>
    </div>
  );
}
