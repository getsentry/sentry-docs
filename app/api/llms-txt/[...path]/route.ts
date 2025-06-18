import fs from 'fs';
import path from 'path';

import matter from 'gray-matter';
import {NextResponse} from 'next/server';

import {getDocsRootNode, nodeForPath} from 'sentry-docs/docTree';
import {isDeveloperDocs} from 'sentry-docs/isDeveloperDocs';
import {getFileBySlugWithCache} from 'sentry-docs/mdx';

export async function GET(
  _request: Request,
  {params}: {params: Promise<{path: string[]}>}
) {
  try {
    const resolvedParams = await params;
    const pathSegments = resolvedParams.path || [];

    // Get the document tree
    const rootNode = await getDocsRootNode();

    if (pathSegments.length === 0 && !isDeveloperDocs) {
      // Handle home page - try to get the actual index content
      try {
        const indexPath = path.join(process.cwd(), 'docs/index.mdx');
        if (fs.existsSync(indexPath)) {
          const rawContent = fs.readFileSync(indexPath, 'utf8');
          const parsed = matter(rawContent);
          const cleanContent = await cleanupMarkdown(parsed.content, pathSegments);
          return createResponse(
            parsed.data.title || 'Welcome to Sentry Documentation',
            cleanContent,
            '/'
          );
        }
      } catch {
        // Fallback for home page
        const homeContent = `# Welcome to Sentry Documentation

This is the home page of Sentry's documentation, providing comprehensive guides for application performance monitoring and error tracking.

## Main Sections

- **Getting Started**: Quick setup guides for various platforms
- **Platforms**: Language and framework-specific integration guides  
- **Product Guides**: Feature documentation and usage guides
- **API Reference**: Complete API documentation
- **CLI Tools**: Command-line interface documentation
- **Best Practices**: Recommended approaches and configurations

Sentry helps developers monitor and fix crashes in real time. The platform supports over 100 platforms and integrations.`;
        return createResponse('Welcome to Sentry Documentation', homeContent, '/');
      }
    }

    let pageContent = '';
    let pageTitle = '';
    let frontMatter: any = {};

    if (isDeveloperDocs) {
      // Handle developer docs
      try {
        const doc = await getFileBySlugWithCache(
          `develop-docs/${pathSegments.join('/') || ''}`
        );

        // Try to get raw content from file system
        const possiblePaths = [
          path.join(
            process.cwd(),
            `develop-docs/${pathSegments.join('/') || 'index'}.mdx`
          ),
          path.join(
            process.cwd(),
            `develop-docs/${pathSegments.join('/') || 'index'}.md`
          ),
          path.join(process.cwd(), `develop-docs/${pathSegments.join('/')}/index.mdx`),
          path.join(process.cwd(), `develop-docs/${pathSegments.join('/')}/index.md`),
        ];

        for (const filePath of possiblePaths) {
          if (fs.existsSync(filePath)) {
            const rawContent = fs.readFileSync(filePath, 'utf8');
            const parsed = matter(rawContent);
            pageContent = parsed.content;
            frontMatter = parsed.data;
            break;
          }
        }

        pageTitle =
          frontMatter.title ||
          doc.frontMatter.title ||
          `Developer Documentation: ${pathSegments.join(' / ')}`;
      } catch {
        return new NextResponse('Page not found', {status: 404});
      }
    } else if (pathSegments[0] === 'api' && pathSegments.length > 1) {
      // Handle API docs - these are generated from OpenAPI specs
      pageTitle = `API Documentation: ${pathSegments.slice(1).join(' / ')}`;
      pageContent = `# ${pageTitle}

This is API documentation generated from OpenAPI specifications.

**Path**: \`${pathSegments.join('/')}\`

API documentation is dynamically generated and may not have source markdown files. 
For complete API reference with examples and detailed parameters, please visit the interactive documentation.`;
    } else {
      // Handle regular docs
      const pageNode = nodeForPath(rootNode, pathSegments);

      if (!pageNode) {
        return new NextResponse('Page not found', {status: 404});
      }

      try {
        // Get the raw markdown content from source files
        let rawContent = '';
        const possiblePaths = [
          path.join(process.cwd(), `docs/${pageNode.path}.mdx`),
          path.join(process.cwd(), `docs/${pageNode.path}/index.mdx`),
          path.join(process.cwd(), `docs/${pageNode.path}.md`),
          path.join(process.cwd(), `docs/${pageNode.path}/index.md`),
        ];

        // Check if it's a platform guide that might use common files
        if (pageNode.path.includes('platforms/')) {
          const pathParts = pageNode.path.split('/');

          // For paths like platforms/javascript/guides/react/tracing
          // Check platforms/javascript/common/tracing
          if (pathParts.length >= 5 && pathParts[2] === 'guides') {
            const platform = pathParts[1]; // e.g., 'javascript'
            const commonPath = `platforms/${platform}/common`;
            const remainingPath = pathParts.slice(4).join('/'); // e.g., 'tracing'

            possiblePaths.push(
              path.join(process.cwd(), 'docs', commonPath, remainingPath + '.mdx'),
              path.join(process.cwd(), 'docs', commonPath, remainingPath + '.md'),
              path.join(process.cwd(), 'docs', commonPath, remainingPath, 'index.mdx'),
              path.join(process.cwd(), 'docs', commonPath, remainingPath, 'index.md')
            );
          }

          // For paths like platforms/javascript/tracing (direct platform paths)
          // Check platforms/javascript/common/tracing
          else if (pathParts.length >= 3) {
            const platform = pathParts[1]; // e.g., 'javascript'
            const commonPath = `platforms/${platform}/common`;
            const remainingPath = pathParts.slice(2).join('/'); // e.g., 'tracing'

            possiblePaths.push(
              path.join(process.cwd(), 'docs', commonPath, remainingPath + '.mdx'),
              path.join(process.cwd(), 'docs', commonPath, remainingPath + '.md'),
              path.join(process.cwd(), 'docs', commonPath, remainingPath, 'index.mdx'),
              path.join(process.cwd(), 'docs', commonPath, remainingPath, 'index.md')
            );
          }
        }

        for (const filePath of possiblePaths) {
          if (fs.existsSync(filePath)) {
            rawContent = fs.readFileSync(filePath, 'utf8');
            break;
          }
        }

        if (rawContent) {
          const parsed = matter(rawContent);
          pageContent = parsed.content;
          frontMatter = parsed.data;
          pageTitle =
            frontMatter.title ||
            pageNode.frontmatter.title ||
            `Documentation: ${pathSegments.join(' / ')}`;
        } else {
          // Fallback - try to get processed content
          const doc = await getFileBySlugWithCache(`docs/${pageNode.path}`);
          pageTitle =
            doc.frontMatter.title || `Documentation: ${pathSegments.join(' / ')}`;
          pageContent = `# ${pageTitle}

This page exists in the documentation tree but the source markdown content could not be accessed directly.

**Path**: \`${pageNode.path}\`

The content may be dynamically generated or processed through the MDX pipeline. 
For the complete content with full formatting, code examples, and interactive elements, please visit the original page.`;
        }
      } catch {
        return new NextResponse('Error processing page', {status: 500});
      }
    }

    // Clean up the markdown content
    const cleanContent = await cleanupMarkdown(pageContent, pathSegments);

    return createResponse(pageTitle, cleanContent, `/${pathSegments.join('/')}`);
  } catch (error) {
    // Log error to stderr in server environments, avoid console in production
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.error('Error generating llms.txt:', error);
    }
    return new NextResponse('Internal server error', {status: 500});
  }
}

function createResponse(
  title: string,
  content: string,
  originalPath: string
): NextResponse {
  const markdownOutput = `# ${title}

${content}

---

**Original URL**: ${process.env.NEXT_PUBLIC_SITE_URL || 'https://docs.sentry.io'}${originalPath}
**Generated**: ${new Date().toISOString()}

*This is the full page content converted to markdown format.*`;

  return new NextResponse(markdownOutput, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}

async function cleanupMarkdown(
  content: string,
  pathSegments: string[] = []
): Promise<string> {
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

function resolvePlatformIncludes(
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
  let match = includePattern.exec(content);

  // Fix assignment in while condition by using a separate variable
  while (match !== null) {
    const includePath = match[1];
    const fullMatch = match[0];

    try {
      // Try to load the platform-specific include file
      const possiblePaths = [
        path.join(process.cwd(), `platform-includes/${includePath}/${platformId}.mdx`),
        path.join(process.cwd(), `platform-includes/${includePath}/${platform}.mdx`),
        // Fallback to generic if platform-specific doesn't exist
        path.join(process.cwd(), `platform-includes/${includePath}/index.mdx`),
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
      // Log error conditionally to avoid console warnings in production
      if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.error(`Error loading include ${includePath}:`, error);
      }
      const sectionName = includePath.split('/').pop() || 'content';
      result = result.replace(
        fullMatch,
        `\n*[${sectionName.charAt(0).toUpperCase() + sectionName.slice(1)} instructions would appear here]*\n`
      );
    }

    // Get the next match
    match = includePattern.exec(content);
  }

  return Promise.resolve(result);
}
