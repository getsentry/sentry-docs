// Type declaration for remark-mdx-images to prevent TypeScript from
// type-checking the package's shipped .ts source files, which have
// incompatible sub-dependency type versions under pnpm's strict isolation.
// This package is deprecated; consider replacing with rehype-mdx-import-media.
declare module 'remark-mdx-images' {
  import type {Plugin} from 'unified';

  const remarkMdxImages: Plugin;
  export default remarkMdxImages;
}
