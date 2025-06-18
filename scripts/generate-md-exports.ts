#!/usr/bin/env ts-node

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import yaml from 'js-yaml';

import getAllFilesRecursively from '../src/files';
import {FrontMatter, PlatformConfig} from '../src/types';

// Simple utility function to filter out null/undefined values
function isNotNil<T>(value: T | null | undefined): value is T {
  return value != null;
}

const root = process.cwd();
const OUTPUT_DIR = path.join(root, 'public', 'md-exports');

// Ensure output directory exists
function ensureDir(dirPath: string) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function formatSlug(slug: string) {
  return slug.replace(/\.(mdx|md)/, '');
}

// Get all documentation front matter (simplified version)
function getDocsFrontMatter(): FrontMatter[] {
  const docsPath = path.join(root, 'docs');
  const files = getAllFilesRecursively(docsPath);
  const allFrontMatter: FrontMatter[] = [];

  files.forEach(file => {
    const fileName = file.slice(docsPath.length + 1);
    if (path.extname(fileName) !== '.md' && path.extname(fileName) !== '.mdx') {
      return;
    }

    if (fileName.indexOf('/common/') !== -1) {
      return;
    }

    const source = fs.readFileSync(file, 'utf8');
    const {data: frontmatter} = matter(source);
    allFrontMatter.push({
      ...(frontmatter as FrontMatter),
      slug: formatSlug(fileName),
      sourcePath: path.join('docs', fileName),
    });
  });

  // Add all `common` files in the right place.
  const platformsPath = path.join(docsPath, 'platforms');
  if (fs.existsSync(platformsPath)) {
    const platformNames = fs
      .readdirSync(platformsPath)
      .filter(p => !fs.statSync(path.join(platformsPath, p)).isFile());
    
    platformNames.forEach(platformName => {
      let platformFrontmatter: PlatformConfig = {};
      const configPath = path.join(platformsPath, platformName, 'config.yml');
      if (fs.existsSync(configPath)) {
        platformFrontmatter = yaml.load(
          fs.readFileSync(configPath, 'utf8')
        ) as PlatformConfig;
      }

      const commonPath = path.join(platformsPath, platformName, 'common');
      if (!fs.existsSync(commonPath)) {
        return;
      }

      const commonFileNames: string[] = getAllFilesRecursively(commonPath).filter(
        p => path.extname(p) === '.mdx'
      );
      
      const commonFiles = commonFileNames.map(commonFileName => {
        const source = fs.readFileSync(commonFileName, 'utf8');
        const {data: frontmatter} = matter(source);
        const fileName = commonFileName.slice(commonPath.length + 1);
        return {
          ...(frontmatter as FrontMatter),
          ...platformFrontmatter,
          slug: `platforms/${platformName}/${formatSlug(fileName)}`,
          sourcePath: commonFileName,
        };
      });

      allFrontMatter.push(...commonFiles);
    });
  }

  // Remove trailing /index from slugs
  allFrontMatter.forEach(fm => {
    const trailingIndex = '/index';
    if (fm.slug.endsWith(trailingIndex)) {
      fm.slug = fm.slug.slice(0, fm.slug.length - trailingIndex.length);
    }
  });

  return allFrontMatter;
}

// Get developer docs front matter (simplified version)
function getDevDocsFrontMatter(): FrontMatter[] {
  const folder = 'develop-docs';
  const docsPath = path.join(root, folder);
  
  if (!fs.existsSync(docsPath)) {
    return [];
  }

  const files = getAllFilesRecursively(docsPath);
  const fmts = files
    .map(file => {
      const fileName = file.slice(docsPath.length + 1);
      if (path.extname(fileName) !== '.md' && path.extname(fileName) !== '.mdx') {
        return undefined;
      }

      const source = fs.readFileSync(file, 'utf8');
      const {data: frontmatter} = matter(source);
      return {
        ...(frontmatter as FrontMatter),
        slug: fileName.replace(/\/index.mdx?$/, '').replace(/\.mdx?$/, ''),
        sourcePath: path.join(folder, fileName),
      };
    })
    .filter(isNotNil);
  return fmts;
}

// Clean markdown content by removing JSX components and processing includes
async function cleanupMarkdown(content: string, pathSegments: string[] = []): Promise<string> {
  let cleaned = content;

  // First, try to resolve PlatformContent includes with actual content
  cleaned = await resolvePlatformIncludes(cleaned, pathSegments);

  // Preserve existing code blocks by temporarily replacing them
  const codeBlocks: string[] = [];
  const codeBlockPlaceholder = '___CODE_BLOCK_PLACEHOLDER___';

  // Extract code blocks to preserve them
  cleaned = cleaned.replace(/```[\s\S]*?```/g, match => {
    codeBlocks.push(match);
    return `${codeBlockPlaceholder}${codeBlocks.length - 1}`;
  });

  // First pass: Extract content from specific platform components while preserving inner text
  cleaned = cleaned
    // Extract content from Alert components
    .replace(/<Alert[^>]*>([\s\S]*?)<\/Alert>/g, '\n> **Note:** $1\n')

    // Extract content from PlatformSection components - preserve inner content
    .replace(/<PlatformSection[^>]*>([\s\S]*?)<\/PlatformSection>/g, '$1')

    // Extract content from PlatformContent components - preserve inner content
    .replace(/<PlatformContent[^>]*>([\s\S]*?)<\/PlatformContent>/g, '$1')

    // Extract content from PlatformCategorySection components - preserve inner content
    .replace(/<PlatformCategorySection[^>]*>([\s\S]*?)<\/PlatformCategorySection>/g, '$1')

    // Handle PlatformIdentifier components - extract name attribute or use placeholder
    .replace(/<PlatformIdentifier[^>]*name="([^"]*)"[^>]*\/>/g, '`$1`')
    .replace(/<PlatformIdentifier[^>]*\/>/g, '`[PLATFORM_IDENTIFIER]`')

    // Handle PlatformLink components - preserve link text and convert to markdown links when possible
    .replace(
      /<PlatformLink[^>]*to="([^"]*)"[^>]*>([\s\S]*?)<\/PlatformLink>/g,
      '[$2]($1)'
    )
    .replace(/<PlatformLink[^>]*>([\s\S]*?)<\/PlatformLink>/g, '$1');

  // Multiple passes to handle any remaining nested components
  for (let i = 0; i < 3; i++) {
    cleaned = cleaned
      // Remove any remaining JSX components but try to preserve inner content first
      .replace(/<([A-Z][a-zA-Z0-9]*)[^>]*>([\s\S]*?)<\/\1>/g, '$2')

      // Remove any remaining self-closing JSX components
      .replace(/<[A-Z][a-zA-Z0-9]*[^>]*\/>/g, '')

      // Remove JSX expressions
      .replace(/\{[^}]*\}/g, '')

      // Remove any remaining opening/closing JSX tags
      .replace(/<\/?[A-Z][a-zA-Z0-9]*[^>]*>/g, '');
  }

  // Restore code blocks
  codeBlocks.forEach((block, index) => {
    cleaned = cleaned.replace(`${codeBlockPlaceholder}${index}`, block);
  });

  return (
    cleaned
      // Remove import/export statements
      .replace(/^import\s+.*$/gm, '')
      .replace(/^export\s+.*$/gm, '')

      // Remove HTML comments
      .replace(/<!--[\s\S]*?-->/g, '')

      // Clean up whitespace and formatting
      .replace(/\n{3,}/g, '\n\n')
      .replace(/^\s*\n/gm, '\n')
      .replace(/\n\s*\n\s*\n/g, '\n\n')
      .trim()
  );
}

async function resolvePlatformIncludes(
  content: string,
  pathSegments: string[]
): Promise<string> {
  // Detect platform and guide from path segments
  let platform = '';
  let guide = '';

  if (pathSegments.length >= 2 && pathSegments[0] === 'platforms') {
    platform = pathSegments[1]; // e.g., 'javascript'

    if (pathSegments.length >= 4 && pathSegments[2] === 'guides') {
      guide = pathSegments[3]; // e.g., 'react'
    }
  }

  // Build platform identifier for include files
  let platformId = platform;
  if (guide && guide !== platform) {
    platformId = `${platform}.${guide}`;
  }

  // Replace PlatformContent includes with actual content
  const includePattern = /<PlatformContent[^>]*includePath="([^"]*)"[^>]*\/>/g;
  let result = content;
  let match;

  while ((match = includePattern.exec(content)) !== null) {
    const includePath = match[1];
    const fullMatch = match[0];

    try {
      // Try to load the platform-specific include file
      const possiblePaths = [
        path.join(root, `platform-includes/${includePath}/${platformId}.mdx`),
        path.join(root, `platform-includes/${includePath}/${platform}.mdx`),
        // Fallback to generic if platform-specific doesn't exist
        path.join(root, `platform-includes/${includePath}/index.mdx`),
      ];

      let includeContent = '';
      for (const filePath of possiblePaths) {
        if (fs.existsSync(filePath)) {
          const rawContent = fs.readFileSync(filePath, 'utf8');
          const parsed = matter(rawContent);
          includeContent = parsed.content.trim();
          break;
        }
      }

      if (includeContent) {
        result = result.replace(fullMatch, `\n${includeContent}\n`);
      } else {
        // Fallback placeholder with more descriptive text
        const sectionName = includePath.split('/').pop() || 'content';
        result = result.replace(
          fullMatch,
          `\n*[${sectionName.charAt(0).toUpperCase() + sectionName.slice(1)} instructions would appear here for ${platformId || platform || 'this platform'}]*\n`
        );
      }
    } catch (error) {
      console.error(`Error loading include ${includePath}:`, error);
      const sectionName = includePath.split('/').pop() || 'content';
      result = result.replace(
        fullMatch,
        `\n*[${sectionName.charAt(0).toUpperCase() + sectionName.slice(1)} instructions would appear here]*\n`
      );
    }
  }

  return result;
}

// Generate markdown file for a single page
async function generateMarkdownFile(doc: FrontMatter) {
  try {
    console.log(`Generating: ${doc.slug}.md`);
    
    // Get raw content from source file directly
    let rawContent = '';
    
    if (doc.sourcePath && fs.existsSync(doc.sourcePath)) {
      const source = fs.readFileSync(doc.sourcePath, 'utf8');
      const parsed = matter(source);
      rawContent = parsed.content;
    } else {
      // Fallback content
      rawContent = `# ${doc.title || doc.slug}

This page exists in the documentation tree but the source markdown content could not be accessed directly.

**Path**: \`${doc.slug}\`

The content may be dynamically generated or processed through the MDX pipeline. 
For the complete content with full formatting, code examples, and interactive elements, please visit the original page.`;
    }

    // Clean up the markdown content
    const pathSegments = doc.slug.split('/');
    const cleanContent = await cleanupMarkdown(rawContent, pathSegments);

    // Create the final markdown output
    const title = doc.title || `Documentation: ${doc.slug.split('/').join(' / ')}`;
    const markdownOutput = `# ${title}

${cleanContent}

---

**Original URL**: ${process.env.NEXT_PUBLIC_SITE_URL || 'https://docs.sentry.io'}/${doc.slug}
**Generated**: ${new Date().toISOString()}

*This is the full page content converted to markdown format.*`;

    // Write the file
    const outputPath = path.join(OUTPUT_DIR, `${doc.slug}.md`);
    ensureDir(path.dirname(outputPath));
    fs.writeFileSync(outputPath, markdownOutput, 'utf8');
    
    return true;
  } catch (error) {
    console.error(`Error generating ${doc.slug}.md:`, error);
    return false;
  }
}

// Main function
async function main() {
  console.log('🚀 Starting markdown export generation...');
  
  // Clear output directory
  if (fs.existsSync(OUTPUT_DIR)) {
    fs.rmSync(OUTPUT_DIR, { recursive: true });
  }
  ensureDir(OUTPUT_DIR);

  let docs: FrontMatter[];
  
  // Check if this is developer docs
  const isDeveloperDocs = process.env.NEXT_PUBLIC_DEVELOPER_DOCS === '1';
  
  if (isDeveloperDocs) {
    console.log('📚 Generating developer docs...');
    docs = getDevDocsFrontMatter();
  } else {
    console.log('📚 Generating user docs...');
    docs = getDocsFrontMatter();
  }

  console.log(`📄 Found ${docs.length} pages to process`);

  let successCount = 0;
  let errorCount = 0;

  // Process pages in batches to avoid overwhelming the system
  const BATCH_SIZE = 10;
  for (let i = 0; i < docs.length; i += BATCH_SIZE) {
    const batch = docs.slice(i, i + BATCH_SIZE);
    
    await Promise.all(
      batch.map(async (doc) => {
        const success = await generateMarkdownFile(doc);
        if (success) {
          successCount++;
        } else {
          errorCount++;
        }
      })
    );

    // Progress update
    const processed = Math.min(i + BATCH_SIZE, docs.length);
    console.log(`📊 Progress: ${processed}/${docs.length} (${Math.round(processed / docs.length * 100)}%)`);
  }

  console.log('✅ Markdown export generation complete!');
  console.log(`📈 Success: ${successCount}, Errors: ${errorCount}`);
  console.log(`📁 Output directory: ${OUTPUT_DIR}`);
}

// Run the script
if (require.main === module) {
  main().catch(console.error);
}

export { main as generateMdExports }; 