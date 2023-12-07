'use client';

import styled from "@emotion/styled";
import Link from "next/link";

export function Sidebar({ docs }) {
  const sortedDocs = docs.sort((a, b) => {
    const partDiff = a.slug.split('/').length - b.slug.split('/').length;
    if (partDiff !== 0) {
      return partDiff;
    }
    const orderDiff = (a.sidebar_order || 99999) - (b.sidebar_order || 99999);
    if (orderDiff !== 0) {
      return orderDiff;
    }
    return a.title.localeCompare(b.title);
  });
  
  const roots: any[] = [];
  const slugMap = {};
  sortedDocs.forEach((doc) => {
    const slugParts = doc.slug.split('/');
    if (slugParts.length === 1) {
      const node = {
        doc: doc,
        children: []
      };
      roots.push(node);
      slugMap[doc.slug] = node;
    } else {
      const parentSlug = slugParts.slice(0, slugParts.length - 1).join('/');
      const node = {
        doc: doc,
        children: []
      };
      slugMap[parentSlug].children.push(node);
      slugMap[doc.slug] = node;
    }
  });
  
  const renderChildren = (children) => (
    children && <ul className="list-unstyled" data-sidebar-tree>
      {children.map((node) => (
      <li className="toc-item" key={node.doc.slug} data-sidebar-branch>
        <SidebarNavItem
          href={"/" + node.doc.slug}
          data-sidebar-link
          >
          {node.doc.title}
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
        {roots.map((node) => (
          <>
          <SidebarNavItem
            href={"/" + node.doc.slug}
            className="sidebar-title d-flex align-items-center"
            data-sidebar-link
            >
            <h6>{node.doc.title}</h6>
          </SidebarNavItem>
          {renderChildren(node.children)}
          </>
        ))}
        {/* <ul className="list-unstyled" data-sidebar-tree>
          {sortedDocs.map((doc) => (
            <li className="toc-item" key={doc.slug} data-sidebar-branch>
              <Link
                href={"/" + doc.slug}
                data-sidebar-link
                >
                {doc.title} - {doc.sidebar_order}
              </Link>
            </li>
          ))}
        </ul> */}
      </li>
      {/* <li className="mb-3" data-sidebar-branch>
        <Link
          href="/contributing"
          className="sidebar-title d-flex align-items-center"
          data-sidebar-link
        >
          <h6>Contributing to Docs</h6>
        </Link>
      </li> */}
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
