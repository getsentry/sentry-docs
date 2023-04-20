import React from 'react';
import {useLocation} from '@reach/router';
import {withPrefix} from 'gatsby';

import SmartLink from './smartLink';

type Props = {
  to: string;
  children?: React.ReactNode;
  className?: string;
  collapsed?: boolean | null;
  title?: string;
};

export default function SidebarLink({
  to,
  title,
  children,
  collapsed = null,
  className = '',
}: Props): JSX.Element {
  const location = useLocation();
  const isActive = location && location.pathname.indexOf(withPrefix(to)) === 0;

  const showSubtree = isActive || collapsed === false;
  className += 'toc-item';

  return (
    <li className={className} data-sidebar-branch>
      <SmartLink to={to} className="d-block" data-sidebar-link>
        {title || children}
      </SmartLink>
      {title && children && (
        <ul className="list-unstyled" data-sidebar-tree>
          {showSubtree && children}
        </ul>
      )}
    </li>
  );
}
