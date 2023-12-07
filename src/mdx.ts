import { bundleMDX } from 'mdx-bundler';
import fs from 'fs';
import path from 'path';
import getAllFilesRecursively from './files';
import matter from 'gray-matter';

const root = process.cwd();

function formatSlug(slug) {
  return slug.replace(/\.(mdx|md)/, '');
}

type FrontMatter = {[key: string]: any};

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
  const mdxPath = path.join(root, 'docs', `${slug}.mdx`)
  const mdPAth = path.join(root, 'docs', `${slug}.md`)
  const source = fs.existsSync(mdxPath)
    ? fs.readFileSync(mdxPath, 'utf8')
    : fs.readFileSync(mdPath, 'utf8');
  
    process.env.ESBUILD_BINARY_PATH = path.join(root, 'node_modules', 'esbuild', 'bin', 'esbuild');
    
    let toc = []
    
    const { code, frontmatter } = await bundleMDX({

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
