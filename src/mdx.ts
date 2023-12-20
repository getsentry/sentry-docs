import { bundleMDX } from 'mdx-bundler';
import fs from 'fs';
import path from 'path';
import getAllFilesRecursively from './files';
import matter from 'gray-matter';

import { s } from 'hastscript'
// Remark packages
import remarkGfm from 'remark-gfm'
import remarkExtractFrontmatter from './remark-extract-frontmatter';
import remarkCodeTitles from './remark-code-title';
import remarkTocHeadings from './remark-toc-headings';
import remarkImgToJsx from './remark-img-to-jsx';
// Rehype packages
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypePrismPlus from 'rehype-prism-plus'
import rehypePresetMinify from 'rehype-preset-minify'

const root = process.cwd();

function formatSlug(slug) {
  return slug.replace(/\.(mdx|md)/, '');
}

export type FrontMatter = {[key: string]: any};

export async function getAllFilesFrontMatter(): Promise<FrontMatter[]> {
  const docsPath = path.join(root, 'docs'); 
  const files = getAllFilesRecursively(docsPath);
  const allFrontMatter: FrontMatter[] = [];
  files.forEach((file) => {
    const fileName = file.slice(docsPath.length + 1);
    if (path.extname(fileName) !== '.md' && path.extname(fileName) !== '.mdx') {
      return;
    }
    const source = fs.readFileSync(file, 'utf8');
    const { data: frontmatter } = matter(source);
    allFrontMatter.push({
      ...frontmatter,
      slug: formatSlug(fileName)
    })
  });
  return allFrontMatter;
}

export async function getFileBySlug(slug) {
  const mdxPath = path.join(root, `${slug}.mdx`)
  const mdxIndexPath = path.join(root, slug, 'index.mdx')
  const mdPath = path.join(root, `${slug}.md`)
  const mdIndexPath = path.join(root, slug, 'index.md')
  const source = fs.existsSync(mdxPath)
    ? fs.readFileSync(mdxPath, 'utf8')
    : fs.existsSync(mdxIndexPath)
    ? fs.readFileSync(mdxIndexPath, 'utf8')
    : fs.existsSync(mdPath)
    ? fs.readFileSync(mdPath, 'utf8')
    : fs.readFileSync(mdIndexPath, 'utf8');
  
    process.env.ESBUILD_BINARY_PATH = path.join(root, 'node_modules', 'esbuild', 'bin', 'esbuild');
    
    let toc = []
    
    const { code, frontmatter } = await bundleMDX({
      source,
      // mdx imports can be automatically source from the components directory
      cwd: path.join(root, 'components'),
      mdxOptions(options, frontmatter) {
        // this is the recommended way to add custom remark/rehype plugins:
        // The syntax might look weird, but it protects you in case we add/remove
        // plugins in the future.
        options.remarkPlugins = [
          ...(options.remarkPlugins ?? []),
          remarkExtractFrontmatter,
          [remarkTocHeadings, { exportRef: toc }],
          remarkGfm,
          remarkCodeTitles,
          remarkImgToJsx,
        ]
        options.rehypePlugins = [
          ...(options.rehypePlugins ?? []),
          rehypeSlug,
          [
            rehypeAutolinkHeadings,
            {
              behavior: 'append',
              properties: {
                className: 'autolink-header inline-flex ml-2',
                ariaHidden: true,
                tabIndex: -1,
              },
              content: [
                s(
                  'svg.autolink-svg',
                  {
                    xmlns: 'http://www.w3.org/2000/svg',
                    width: 16,
                    height: 16,
                    fill: 'currentColor',
                    viewBox: '0 0 24 24',
                  },
                  s('path', {
                    d: 'M9.199 13.599a5.99 5.99 0 0 0 3.949 2.345 5.987 5.987 0 0 0 5.105-1.702l2.995-2.994a5.992 5.992 0 0 0 1.695-4.285 5.976 5.976 0 0 0-1.831-4.211 5.99 5.99 0 0 0-6.431-1.242 6.003 6.003 0 0 0-1.905 1.24l-1.731 1.721a.999.999 0 1 0 1.41 1.418l1.709-1.699a3.985 3.985 0 0 1 2.761-1.123 3.975 3.975 0 0 1 2.799 1.122 3.997 3.997 0 0 1 .111 5.644l-3.005 3.006a3.982 3.982 0 0 1-3.395 1.126 3.987 3.987 0 0 1-2.632-1.563A1 1 0 0 0 9.201 13.6zm5.602-3.198a5.99 5.99 0 0 0-3.949-2.345 5.987 5.987 0 0 0-5.105 1.702l-2.995 2.994a5.992 5.992 0 0 0-1.695 4.285 5.976 5.976 0 0 0 1.831 4.211 5.99 5.99 0 0 0 6.431 1.242 6.003 6.003 0 0 0 1.905-1.24l1.723-1.723a.999.999 0 1 0-1.414-1.414L9.836 19.81a3.985 3.985 0 0 1-2.761 1.123 3.975 3.975 0 0 1-2.799-1.122 3.997 3.997 0 0 1-.111-5.644l3.005-3.006a3.982 3.982 0 0 1 3.395-1.126 3.987 3.987 0 0 1 2.632 1.563 1 1 0 0 0 1.602-1.198z',
                  })
                ),
              ],
            },
          ],
          [rehypePrismPlus, { ignoreMissing: true }],
          rehypePresetMinify,
        ]
        return options
      },
      esbuildOptions: (options) => {
        options.loader = {
          ...options.loader,
          '.js': 'jsx',
        }
        return options
      },
    });
    
    return {
      mdxSource: code,
      toc,
      frontMatter: {
        ...frontmatter,
        slug: slug,
      }
    }
}
