import {Fragment} from 'react';
import {Link} from 'react-feather';

import styles from './style.module.scss';

import {NavChevron} from './navChevron';
import {DefaultSidebarProps, SidebarNode} from './types';

export function DefaultSidebar({node, path}: DefaultSidebarProps) {
  const activeClassName = (n: SidebarNode, baseClassName = '') => {
    const className = n.path === path.join('/') ? 'active' : '';
    return `${baseClassName} ${className}`;
  };

  const renderChildren = (children: SidebarNode[]) =>
    children && (
      <ul data-sidebar-tree>
        {children
          .filter(n => n.frontmatter.sidebar_title || n.frontmatter.title)
          .map(n => (
            <li className="toc-item" key={n.path} data-sidebar-branch>
              <Link
                href={'/' + n.path}
                data-sidebar-link
                className={activeClassName(n, 'flex items-center justify-between gap-1')}
              >
                {n.frontmatter.sidebar_title || n.frontmatter.title}
                {n.children.length > 0 && <NavChevron direction="down" />}
              </Link>
              {renderChildren(n.children)}
            </li>
          ))}
      </ul>
    );

  return (
    <ul data-sidebar-tree>
      <li className="mb-3" data-sidebar-branch>
        <Fragment>
          <Link
            href={'/' + node.path}
            data-active={node.path === path.join('/')}
            className={activeClassName(
              node,
              [styles['sidebar-title'], 'flex items-center justify-between gap-1'].join(
                ' '
              )
            )}
            data-sidebar-link
            key={node.path}
          >
            <h6>{node.frontmatter.sidebar_title || node.frontmatter.title}</h6>
          </Link>
          {renderChildren(node.children)}
        </Fragment>
      </li>
    </ul>
  );
}
