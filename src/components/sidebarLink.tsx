import React, {Children} from 'react';
import styled from '@emotion/styled';
import {useLocation} from '@reach/router';
import {withPrefix} from 'gatsby';

import {SmartLink} from './smartLink';

interface SidebarLinkProps {
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
}

export function SidebarLink({to, title, children, collapsed = null}: SidebarLinkProps) {
  const location = useLocation();
  const isActive = location && location.pathname.indexOf(withPrefix(to)) === 0;

  const hasSubtree = Children.count(children) > 0;
  const showSubtree = isActive || collapsed === false;

  return (
    <li className="toc-item" data-sidebar-branch>
      <SidebarNavItem to={to} data-sidebar-link isActive={to === location?.pathname}>
        {title || children}
        {hasSubtree && <Chevron direction={showSubtree ? 'down' : 'right'} />}
      </SidebarNavItem>
      {title && children && (
        <ul className="list-unstyled" data-sidebar-tree>
          {showSubtree && children}
        </ul>
      )}
    </li>
  );
}

const SidebarNavItem = styled(SmartLink)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 4px;
`;

const rotation = {
  down: 0,
  right: 270,
} as const;

interface ChevronProps extends React.SVGAttributes<SVGElement> {
  direction: keyof typeof rotation;
}

const Chevron = styled(({direction: _, ...props}: ChevronProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 16 16"
    {...props}
  >
    <path
      fill="currentColor"
      d="M12.53 5.47a.75.75 0 0 1 0 1.06l-4 4a.75.75 0 0 1-1.06 0l-4-4a.75.75 0 0 1 1.06-1.06L8 8.94l3.47-3.47a.75.75 0 0 1 1.06 0Z"
    />
  </svg>
))`
  transition: transform 200ms;
  transform: rotate(${p => rotation[p.direction]}deg);
`;
