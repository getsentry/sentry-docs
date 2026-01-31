import type {McpServer} from '@modelcontextprotocol/sdk/server/mcp.js';
import {z} from 'zod';

const MAX_CONTENT_LENGTH = 10000; // 10KB limit to avoid token bloat

export function registerGetDoc(server: McpServer) {
  const description = [
    'Fetch the full markdown content of a Sentry documentation page.',
    '',
    'Use this tool when you need to:',
    '- Read complete documentation for a topic',
    '- Get detailed code examples and configuration',
    '- Access full context after finding pages via search_docs',
    '',
    '<hints>',
    '- Use paths from search_docs results',
    '- Paths like "/platforms/javascript/guides/nextjs"',
    '- Content over 10KB will be truncated',
    '</hints>',
  ].join('\n');

  const paramsSchema = {
    path: z
      .string()
      .describe(
        'Documentation path (e.g., "/platforms/javascript/guides/nextjs"). Get from search_docs.'
      ),
    site: z
      .enum(['docs', 'develop'])
      .default('docs')
      .describe('Which site: docs (docs.sentry.io) or develop (develop.sentry.io)'),
  };

  server.tool('get_doc', description, paramsSchema, async ({path, site}) => {
    // Normalize path - remove leading slash if present, remove trailing slash
    let normalizedPath = path.replace(/^\/+/, '').replace(/\/+$/, '');

    // Don't add .md if path already has it
    if (!normalizedPath.endsWith('.md')) {
      normalizedPath = `${normalizedPath}.md`;
    }

    const baseUrl =
      site === 'develop' ? 'https://develop.sentry.io' : 'https://docs.sentry.io';

    const docUrl = `${baseUrl}/${normalizedPath}`;

    try {
      const response = await fetch(docUrl, {
        headers: {
          Accept: 'text/plain, text/markdown',
          'User-Agent': 'sentry-docs-mcp/1.0',
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          return {
            content: [
              {
                type: 'text' as const,
                text: [
                  `# Document Not Found`,
                  '',
                  `**Path**: ${path}`,
                  `**URL**: ${docUrl}`,
                  '',
                  'The document was not found. Suggestions:',
                  '- Verify the path is correct (check search_docs results)',
                  '- Try without file extension in the path',
                  '- The page may have been moved or renamed',
                  '',
                  'Use `search_docs` to find the correct path.',
                ].join('\n'),
              },
            ],
          };
        }
        throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
      }

      let content = await response.text();

      // Check if we got HTML instead of markdown
      if (content.trim().startsWith('<!DOCTYPE') || content.trim().startsWith('<html')) {
        return {
          content: [
            {
              type: 'text' as const,
              text: [
                `# Error: Received HTML Instead of Markdown`,
                '',
                `**Path**: ${path}`,
                '',
                'The server returned HTML instead of markdown.',
                'This usually means the .md endpoint is not available for this path.',
                '',
                'Try using `search_docs` to find the correct documentation path.',
              ].join('\n'),
            },
          ],
        };
      }

      // Truncate if too long
      const wasTruncated = content.length > MAX_CONTENT_LENGTH;
      if (wasTruncated) {
        content = content.slice(0, MAX_CONTENT_LENGTH);
        // Try to truncate at a natural break point
        const lastNewline = content.lastIndexOf('\n\n');
        if (lastNewline > MAX_CONTENT_LENGTH * 0.8) {
          content = content.slice(0, lastNewline);
        }
      }

      let output = `# Documentation: ${path}\n\n`;
      output += `**Source**: ${docUrl}\n`;
      if (wasTruncated) {
        output += `**Note**: Content truncated (over 10KB). View full doc at the URL above.\n`;
      }
      output += '\n---\n\n';
      output += content;
      output += '\n\n---\n';

      return {
        content: [{type: 'text' as const, text: output}],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text' as const,
            text: `Error fetching document: ${error instanceof Error ? error.message : 'Unknown error'}`,
          },
        ],
      };
    }
  });
}
