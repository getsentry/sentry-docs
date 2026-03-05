import {DocNode} from 'sentry-docs/docTree';

import {BreadcrumbItem} from './index';

// Helper function to build breadcrumbs from DocNode (for use in server components)
export function buildBreadcrumbs(leafNode: DocNode | undefined): BreadcrumbItem[] {
  const breadcrumbs: BreadcrumbItem[] = [];

  for (let node: DocNode | undefined = leafNode; node; node = node.parent) {
    if (node && !node.missing) {
      const to = node.path === '/' ? node.path : `/${node.path}/`;
      const title = node.frontmatter.sidebar_title ?? node.frontmatter.title;

      breadcrumbs.unshift({
        to,
        title,
      });
    }
  }

  return breadcrumbs;
}
