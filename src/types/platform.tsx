/**
 * This is the canonical representation of a Platform within the docs.
 *
 * This object is resolve from the {@link PlatformConfig} type.
 */
export interface Platform extends PlatformConfig {
  /**
   * The set of guides associated with this platform
   */
  guides: PlatformGuide[];
  /**
   * The platform identifier. This is based on the directory name of where
   * the platform is within the file system.
   */
  key: string;
  /**
   * Same as key. Use `title` for a human readable platform name.
   *
   * @see Platform.key
   */
  name: string;
  /**
   * Used to discriminate a platform from a guide
   */
  type: 'platform';
  /**
   * The relative URL to the docs for this platform
   */
  url: string;
}

/**
 * Each platform may have one or more "Guides".
 *
 * Guide inherits most fields from {@link Platform} object, but it is not quite
 * the same thing as a platform.
 */
export interface PlatformGuide extends Omit<Platform, 'guides' | 'type'> {
  /**
   * The key is the fully qualified name of the guide: `${platformKey}.${guideName}`
   */
  key: string;
  /**
   * The name of a guide is the name of the guide on the file system
   */
  name: string;
  /**
   * The parent platform of the guide
   */
  platform: string;
  /**
   * Used to discriminate a platform from a guide
   */
  type: 'guide';
  /**
   * The relative URL to the docs for this guide
   */
  url: string;
}

/**
 * A platform config object comes from two sources within the `platforms/**`
 * documentation directory. This may represent at platform as a whole, or a
 * specific platform guide.
 *
 * - `index.mdx` frontmatter
 * - `config.yml`
 *
 * These two objects are merged and make up a PlatformConfig. All properties in
 * this type may be defined in either of these two locations.
 *
 * NOTE: There is no `key` identifier property in the config, since this is
 * inferred from the location of the config.yml / index.mdx within the
 * file system.
 *
 * [!!]: You probably want to use the `Platform` type.
 */
export interface PlatformConfig {
  /**
   * Additional identifiers for the platform. For example the `apple` platform
   * may also be known as `cocoa`.
   */
  aliases?: string[];
  /**
   * The case style of a platform defines the casing used for sentry SDK
   * functions / keywords. For example `before-send` would become `BeforeSend`
   * if the caseStyle is configured as PlatformCaseStyle.PASCAL_CASE.
   */
  caseStyle?: PlatformCaseStyle;
  /**
   * The categories the platform belongs to.
   */
  categories?: PlatformCategory[];
  /**
   * Useful to define the "parent" platform. When specified the Platform will
   * inherit configuration values from the parent platform.
   */
  fallbackPlatform?: string;
  /**
   * The icon to use for this platform. This is the name of the icon as defined
   */
  icon?: string;
  /**
   * Keywords used for search etc.
   */
  keywords?: string[];
  /**
   * Used to map a platform to a specific SDK as defined by the SDK registry.
   */
  sdk?: string;
  /**
   * Is this a first-party or third-party SDK?
   */
  supportLevel?: PlatformSupportLevel;
  /**
   * The human readable name of the platform.
   */
  title?: string;
}

/**
 * @see PlatformConfig.caseStyle
 */
export enum PlatformCaseStyle {
  CANONICAL = 'canonical',
  CAMEL_CASE = 'camelCase',
  PASCAL_CASE = 'PascalCase',
  SNAKE_CASE = 'snake_case',
}

/**
 * @see PlatformConfig.supportLevel
 */
export enum PlatformSupportLevel {
  PRODUCTION = 'production',
  COMMUNITY = 'community',
}

/**
 * @see PlatformConfig.categories
 */
export enum PlatformCategory {
  BROWSER = 'browser',
  DESKTOP = 'desktop',
  MOBILE = 'mobile',
  SERVER = 'server',
  SERVERLESS = 'serverless',
}
