'use client';

import styled from "@emotion/styled";
import Link from "next/link";

export function Sidebar({ node, path }) {
  const activeClassName = (node, baseClassName = '') => {
    const className = node.path === path.join('/') ? 'active' : '';
    return `${baseClassName} ${className}`;
  }

  const renderChildren = (children) => (
    children && <ul className="list-unstyled" data-sidebar-tree>
      {children.map((node) => (
      <li className="toc-item" key={node.path} data-sidebar-branch>
        <SidebarNavItem
          href={"/" + node.path}
          data-sidebar-link
          className={activeClassName(node)}
          >
          {node.frontmatter.sidebar_title || node.frontmatter.title}
          {node.children.length > 0 && <Chevron direction="down" />}
        </SidebarNavItem>
        {renderChildren(node.children)}
      </li>
      ))}
    </ul>
  );
  
  return (
    <ul className="list-unstyled" data-sidebar-tree>
      <li className="mb-3" data-sidebar-branch>
        <>
        <SidebarNavItem
          href={"/" + node.path}
          className={activeClassName(node, 'sidebar-title d-flex align-items-center')}
          data-sidebar-link
          key={node.path}
          >
          <h6>{node.frontmatter.sidebar_title || node.frontmatter.title}</h6>
        </SidebarNavItem>
        {renderChildren(node.children)}
        </>
      </li>
    </ul>
  );
}

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

const SidebarNavItem = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 4px;
`;
