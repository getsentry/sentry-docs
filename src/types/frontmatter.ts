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
   * Set this to true to show a "beta" badge next to the title in the sidebar
   */
  beta?: boolean;
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
   * Set this to true to take all the available width for the page content.
   */
  fullWidth?: boolean;

  /**
   * A list of keywords for indexing with search.
   */
  keywords?: string[];
  /**
   * Set this to true to show a "new" badge next to the title in the sidebar
   */
  new?: boolean;

  /**
   * The next page in the bottom pagination navigation.
   */
  nextPage?: PaginationNavNode;
  /**
   * relative links to use in the "next steps" section of the page grid
   * takes precedence over children when present
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
   * Custom Open Graph image for social sharing.
   * Can be a relative path (e.g., './img/my-image.png'), absolute path (e.g., '/images/og.png'),
   * or external URL. If not specified, the first image in the page content will be used,
   * or falls back to the default OG image.
   */
  og_image?: string;

  /**
   * The previous page in the bottom pagination navigation.
   */
  previousPage?: PaginationNavNode;

  /**
   * Set this to true to show a separator/divider below this item in the sidebar
   * @deprecated Use sidebar_section instead
   */
  section_end_divider?: boolean;

  /**
   * Set this to true to hide from the sidebar
   */
  sidebar_hidden?: boolean;

  /**
   * The order of this page in auto generated sidebars and grids.
   */
  sidebar_order?: number;

  /**
   * Which sidebar section this page belongs to (for platform docs).
   * Options: 'features' | 'configuration'
   * Defaults to 'features' if not specified.
   */
  sidebar_section?: 'features' | 'configuration';

  /**
   * optional sidebar title
   */
  sidebar_title?: string;

  /**
   * filesystem path to the source file, generated during build time
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
