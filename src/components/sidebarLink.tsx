import React from 'react';
import {useLocation} from '@reach/router';
import {withPrefix} from 'gatsby';

import {SmartLink} from './smartLink';

type Props = {
  /**
   * The text of the link
   */
  title: string;
  to: string;
  /**
   * Children represent the additional links nested under this sidebar link
   */
  children?: React.ReactNode;
  /**
   * Indicates that the links are currently hidden. Overriden by isActive
   */
  collapsed?: boolean | null;
};

export function SidebarLink({to, title, children, collapsed = null}: Props): JSX.Element {
  const location = useLocation();
  const isActive = location && location.pathname.indexOf(withPrefix(to)) === 0;

  const showSubtree = isActive || collapsed === false;

  return (
    <li className="toc-item" data-sidebar-branch>
      <SmartLink
        to={to}
        className="d-block"
        data-sidebar-link
        isActive={to === location?.pathname}
      >
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
