import {DocNode} from 'sentry-docs/docTree';
import {FrontMatter} from 'sentry-docs/types';

export type SidebarNode = {
  children: SidebarNode[];
  frontmatter: FrontMatter;
  path: string;
};

export type SidebarProps = {
  path: string[];
  versions?: string[];
};

export type DefaultSidebarProps = SidebarProps & {
  node: SidebarNode;
  path: string[];
};

export type ProductSidebarProps = {
  headerClassName: string;
  items: {root: string; title: string}[];
  rootNode: DocNode;
};

export type PlatformSidebarProps = {
  headerClassName: string;
  platformName: string;
  rootNode: DocNode;
  guideName?: string;
};

export type NavNode = {
  context: {
    draft: boolean;
    title: string;
    sidebar_hidden?: boolean;
    sidebar_order?: number;
    sidebar_title?: string;
  };
  path: string;
};
