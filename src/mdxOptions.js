import rehypePresetMinify from 'rehype-preset-minify';
import rehypePrismPlus from 'rehype-prism-plus';
// Rehype packages
import rehypeSlug from 'rehype-slug';

// Remark packages
import remarkComponentSpacing from './remark-component-spacing';
import remarkExtractFrontmatter from './remark-extract-frontmatter';

export const mdxOptions = {};
// this is the recommended way to add custom remark/rehype plugins:
// The syntax might look weird, but it protects you in case we add/remove
// plugins in the future.
mdxOptions.remarkPlugins = [
  ...(mdxOptions.remarkPlugins ?? []),
  remarkExtractFrontmatter,
  remarkComponentSpacing,
];
mdxOptions.rehypePlugins = [
  ...(mdxOptions.rehypePlugins ?? []),
  rehypeSlug,
  [rehypePrismPlus, {ignoreMissing: true}],
  rehypePresetMinify,
];
