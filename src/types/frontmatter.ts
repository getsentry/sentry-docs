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
}
