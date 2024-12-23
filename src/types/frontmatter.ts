import {PaginationNavNode} from './paginationNavNode';

/**
 ** a YAML-formatted blob defined at the top of every markdown or mdx file
 */
export interface FrontMatter {
  /**
   * The slug is the URL path to the document. generated from the file path.
   */
  slug: string;

  /**
   * Document title - used in <title> as well as things like search titles.
   */
  title: string;
  /**
   * A description to use in the <meta> header, as well as in auto generated page grids.
   */
  customCanonicalTag?: string;
  /**  Add this if you want to add a canonical tag (without this it will default to the page url). Should be a relative path without the domain (e.g. `/platforms/react/options/`) */
  description?: string;
  /**
   * Set this to true to mark this page as a draft, and hide it from various other components (such as the PageGrid).
   */
  draft?: boolean;
  /**
   * A list of keywords for indexing with search.
   */
  keywords?: string[];

  /**
   * The next page in the bottom pagination navigation.
   */
  nextPage?: PaginationNavNode;
  /**
   * relative links to use in the "next steps" section of the page grid
   * takes precendence over children when present
   */
  next_steps?: string[];
  /**
   * Set this to true to disable indexing (robots, algolia) of this content.
   */
  noindex?: boolean;

  /**
   * Specific guides that this page is not relevant to.
   */
  notSupported?: string[];

  /**
   * Set this to true to disable page-level table of contents rendering.
   */
  notoc?: boolean;

  /**
   * The previous page in the bottom pagination navigation.
   */
  previousPage?: PaginationNavNode;

  /**
   * The next page in the sidebar navigation.
   */
  /**
   * Set this to true to hide from the sidebar
   */
  sidebar_hidden?: boolean;

  /**
   * The order of this page in auto generated sidebars and grids.
   */
  sidebar_order?: number;

  /**
   * optional sidebar title
   */
  sidebar_title?: string;

  /**
   * filesytem path to the source file, generated during build time
   */
  sourcePath?: string;

  /**
   * Specific guides that this page is relevant to.
   */
  supported?: string[];
  /**
   * Available versions for this page
   * @example ['v7.119.0', 'next']
   */
  versions?: string[];
}
