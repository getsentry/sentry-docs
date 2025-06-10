import { NextRequest, NextResponse } from 'next/server';
import { nodeForPath, getDocsRootNode } from 'sentry-docs/docTree';
import { getFileBySlugWithCache, getDocsFrontMatter, getDevDocsFrontMatter } from 'sentry-docs/mdx';
import { isDeveloperDocs } from 'sentry-docs/isDeveloperDocs';
import { stripVersion } from 'sentry-docs/versioning';
import matter from 'gray-matter';
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const pathParam = searchParams.get('path');
  
  if (!pathParam) {
    return new NextResponse('Path parameter is required', { status: 400 });
  }

  try {
    // Parse the path - it should be the original path without llms.txt
    const pathSegments = pathParam.split('/').filter(Boolean);
    
    // Get the document tree
    const rootNode = await getDocsRootNode();
    
    if (pathSegments.length === 0 && !isDeveloperDocs) {
      // Handle home page - try to get the actual index content
      try {
        const indexPath = path.join(process.cwd(), 'docs/index.mdx');
        if (fs.existsSync(indexPath)) {
          const rawContent = fs.readFileSync(indexPath, 'utf8');
          const parsed = matter(rawContent);
          const cleanContent = cleanupMarkdown(parsed.content);
          return createResponse(parsed.data.title || 'Welcome to Sentry Documentation', cleanContent, '/');
        }
      } catch (e) {
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
        const doc = await getFileBySlugWithCache(`develop-docs/${pathSegments.join('/') || ''}`);
        
        // Try to get raw content from file system
        const possiblePaths = [
          path.join(process.cwd(), `develop-docs/${pathSegments.join('/') || 'index'}.mdx`),
          path.join(process.cwd(), `develop-docs/${pathSegments.join('/') || 'index'}.md`),
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

        pageTitle = frontMatter.title || doc.frontMatter.title || `Developer Documentation: ${pathSegments.join(' / ')}`;
      } catch (e) {
        return new NextResponse('Page not found', { status: 404 });
      }
    } else if (pathSegments[0] === 'api' && pathSegments.length > 1) {
      // Handle API docs - these are generated from OpenAPI specs
      // For now, provide a message explaining this
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
        return new NextResponse('Page not found', { status: 404 });
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

        // Check if it's a common file
        if (pageNode.path.includes('platforms/')) {
          const pathParts = pageNode.path.split('/');
          if (pathParts.length >= 3) {
            const commonPath = path.join(pathParts.slice(0, 3).join('/'), 'common');
            if (pathParts.length >= 5 && pathParts[3] === 'guides') {
              possiblePaths.push(path.join(process.cwd(), 'docs', commonPath, pathParts.slice(5).join('/') + '.mdx'));
              possiblePaths.push(path.join(process.cwd(), 'docs', commonPath, pathParts.slice(5).join('/') + '.md'));
              possiblePaths.push(path.join(process.cwd(), 'docs', commonPath, pathParts.slice(5).join('/'), 'index.mdx'));
            } else {
              possiblePaths.push(path.join(process.cwd(), 'docs', commonPath, pathParts.slice(3).join('/') + '.mdx'));
              possiblePaths.push(path.join(process.cwd(), 'docs', commonPath, pathParts.slice(3).join('/') + '.md'));
              possiblePaths.push(path.join(process.cwd(), 'docs', commonPath, pathParts.slice(3).join('/'), 'index.mdx'));
            }
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
          pageTitle = frontMatter.title || pageNode.frontmatter.title || `Documentation: ${pathSegments.join(' / ')}`;
        } else {
          // Fallback - try to get processed content
          const doc = await getFileBySlugWithCache(`docs/${pageNode.path}`);
          pageTitle = doc.frontMatter.title || `Documentation: ${pathSegments.join(' / ')}`;
          pageContent = `# ${pageTitle}

This page exists in the documentation tree but the source markdown content could not be accessed directly.

**Path**: \`${pageNode.path}\`

The content may be dynamically generated or processed through the MDX pipeline. 
For the complete content with full formatting, code examples, and interactive elements, please visit the original page.`;
        }
      } catch (e) {
        return new NextResponse('Error processing page', { status: 500 });
      }
    }

    // Clean up the markdown content
    const cleanContent = cleanupMarkdown(pageContent);
    
    return createResponse(pageTitle, cleanContent, `/${pathSegments.join('/')}`);

  } catch (error) {
    console.error('Error generating llms.txt:', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}

function createResponse(title: string, content: string, originalPath: string): NextResponse {
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

function cleanupMarkdown(content: string): string {
  return content
    // Remove JSX components and their content (basic cleanup)
    .replace(/<[A-Z][a-zA-Z0-9]*[^>]*>[\s\S]*?<\/[A-Z][a-zA-Z0-9]*>/g, '')
    // Remove self-closing JSX components
    .replace(/<[A-Z][a-zA-Z0-9]*[^>]*\/>/g, '')
    // Remove import statements
    .replace(/^import\s+.*$/gm, '')
    // Remove export statements
    .replace(/^export\s+.*$/gm, '')
    // Remove JSX expressions (basic)
    .replace(/\{[^}]*\}/g, '')
    // Clean up multiple newlines
    .replace(/\n{3,}/g, '\n\n')
    // Remove leading/trailing whitespace
    .trim();
}