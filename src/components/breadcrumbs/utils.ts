import {DocNode} from 'sentry-docs/docTree';
import {isVersioned} from 'sentry-docs/versioning';

import {BreadcrumbChildItem,BreadcrumbItem} from './index';

function getVisibleChildren(node: DocNode): BreadcrumbChildItem[] {
  return node.children
    .filter(
      child =>
        (child.frontmatter.sidebar_title || child.frontmatter.title) &&
        !child.frontmatter.sidebar_hidden &&
        !child.frontmatter.draft &&
        child.path &&
        !isVersioned(child.path)
    )
    .sort(
      (a, b) => (a.frontmatter.sidebar_order ?? 10) - (b.frontmatter.sidebar_order ?? 10)
    )
    .map(child => ({
      title: child.frontmatter.sidebar_title ?? child.frontmatter.title,
      to: `/${child.path}/`,
    }));
}

// Helper function to build breadcrumbs from DocNode (for use in server components)
export function buildBreadcrumbs(leafNode: DocNode | undefined): BreadcrumbItem[] {
  const breadcrumbs: BreadcrumbItem[] = [];

  for (let node: DocNode | undefined = leafNode; node; node = node.parent) {
    if (node && !node.missing) {
      const to = node.path === '/' ? node.path : `/${node.path}/`;
      const title = node.frontmatter.sidebar_title ?? node.frontmatter.title;
      const children = getVisibleChildren(node);

      breadcrumbs.unshift({
        to,
        title,
        children: children.length > 0 ? children : undefined,
      });
    }
  }

  return breadcrumbs;
}
