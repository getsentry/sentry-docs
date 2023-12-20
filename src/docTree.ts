import type { FrontMatter} from 'sentry-docs/mdx';

export interface DocNode {
  path: string;
  slug: string;
  frontmatter: FrontMatter;
  parent?: DocNode;
  children: DocNode[];
};

function slugWithoutIndex(slug: string): string[] {
  const parts = slug.split('/');
  if (parts[parts.length - 1] === 'index') {
    parts.pop();
  }
  return parts;
}

export function frontmatterToTree(frontmatter: FrontMatter[]): DocNode | undefined {
  if (frontmatter.length === 0) {
    return;
  }

  const sortedDocs = frontmatter.sort((a, b) => {
    const partDiff = slugWithoutIndex(a.slug).length - slugWithoutIndex(b.slug).length;
    if (partDiff !== 0) {
      return partDiff;
    }
    const orderDiff = (a.sidebar_order || 99999) - (b.sidebar_order || 99999);
    if (orderDiff !== 0) {
      return orderDiff;
    }
    return (a.title || '').localeCompare(b.title || '');
  });
  
  const rootNode: DocNode = {
    path: '/',
    slug: '',
    frontmatter: {
      title: 'Home',
    },
    children: []
  }

  const slugMap = {};
  sortedDocs.forEach((doc) => {
    const slugParts = slugWithoutIndex(doc.slug);
    const slug = slugParts.join('/');
    
    if (slugParts.length === 0) {
      rootNode.frontmatter = doc;
    } else if (slugParts.length === 1) {
      const node = {
        path: slug,
        slug: slug,
        frontmatter: doc,
        parent: rootNode,
        children: []
      };
      rootNode.children.push(node);
      slugMap[slug] = node;
    } else {
      const parentSlug = slugParts.slice(0, slugParts.length - 1).join('/');
      const parent = slugMap[parentSlug];
      if (!parent) {
        throw new Error('missing parent: ' + parentSlug);
      }
      const node = {
        path: slug,
        slug: slugParts[slugParts.length - 1],
        frontmatter: doc,
        parent: parent,
        children: []
      };
      parent.children.push(node);
      slugMap[slug] = node;
    }
  }); 

  return rootNode;
}

export function nodeForPath(node: DocNode, path: string | string[]): DocNode | undefined {
  const stringPath = (typeof path === 'string') ? path : path.join('/');
  const parts = slugWithoutIndex(stringPath);
  for (let i = 0; i < parts.length; i++) {
    const maybeChild = node.children.find((child) => child.slug === parts[i])
    if (maybeChild) {
      node = maybeChild
    } else {
      return;
    }
  }
  return node;
}
