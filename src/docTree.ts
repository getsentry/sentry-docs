import type { FrontMatter} from 'sentry-docs/mdx';

export interface DocNode {
  path: string;
  slug: string;
  frontmatter: FrontMatter;
  parent?: DocNode;
  children: DocNode[];
};

export function frontmatterToTree(frontmatter: FrontMatter[]): DocNode | undefined {
  if (frontmatter.length === 0) {
    return;
  }

  const sortedDocs = frontmatter.sort((a, b) => {
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
  
  const rootNode: DocNode = {
    path: '/',
    slug: '',
    frontmatter: {},
    children: []
  }

  const slugMap = {};
  sortedDocs.forEach((doc) => {
    const slugParts = doc.slug.split('/');
    if (slugParts[slugParts.length - 1] === 'index') {
      slugParts.pop();
    }
    const slug = slugParts.join('/');
    
    if (slugParts.length === 0) {
      rootNode.frontmatter = doc;
    } else if (slugParts.length === 1) {
      const node = {
        path: slug + '/',
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
      const node = {
        path: slug + '/',
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

export function nodeForPath(node: DocNode, path: string): DocNode | undefined {
  const parts = path.split('/');
  console.log(parts);
  for (let i = 0; i < parts.length; i++) {
    console.log(parts[i]);
    console.log(node.slug);
    console.log(node.children.map((c) => c.slug));
    const maybeChild = node.children.find((child) => child.slug === parts[i])
    if (maybeChild) {
      node = maybeChild
    } else {
      return;
    }
  }
  return node;
}
