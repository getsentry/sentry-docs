import type {McpServer} from '@modelcontextprotocol/sdk/server/mcp.js';
import {z} from 'zod';

import {extractPlatforms, getDocsRootNode} from 'sentry-docs/docTree';

export function registerListPlatforms(server: McpServer) {
  const description = [
    'List available SDK platforms and their guides in Sentry documentation.',
    '',
    'Use this tool to:',
    '- Discover all supported platforms (JavaScript, Python, Go, etc.)',
    '- Find available framework guides for a platform',
    '- Get platform slugs for filtering search_docs queries',
    '',
    '<hints>',
    '- Without platform param: returns list of all platforms',
    '- With platform param: returns detailed info including guides',
    '</hints>',
  ].join('\n');

  const paramsSchema = {
    platform: z
      .string()
      .optional()
      .describe(
        'Specific platform slug to get details for (e.g., "javascript", "python")'
      ),
  };

  server.tool('list_platforms', description, paramsSchema, async ({platform}) => {
    try {
      const rootNode = await getDocsRootNode();
      const platforms = extractPlatforms(rootNode);

      if (platform) {
        // Return details for specific platform
        const found = platforms.find(p => p.key === platform || p.name === platform);

        if (!found) {
          const availablePlatforms = platforms.map(p => p.key).join(', ');
          return {
            content: [
              {
                type: 'text' as const,
                text: [
                  `# Platform Not Found: ${platform}`,
                  '',
                  `Available platforms: ${availablePlatforms}`,
                ].join('\n'),
              },
            ],
          };
        }

        let output = `# Platform: ${found.title}\n\n`;
        output += `**Slug**: ${found.key}\n`;
        output += `**URL**: ${found.url}\n`;
        if (found.sdk) {
          output += `**SDK**: ${found.sdk}\n`;
        }
        if (found.categories?.length) {
          output += `**Categories**: ${found.categories.join(', ')}\n`;
        }
        output += '\n';

        if (found.guides && found.guides.length > 0) {
          output += `## Guides (${found.guides.length})\n\n`;
          for (const guide of found.guides) {
            output += `- **${guide.title}** - \`${guide.key}\`\n`;
            output += `  URL: ${guide.url}\n`;
          }
        } else {
          output += '*No framework-specific guides available for this platform.*\n';
        }

        return {
          content: [{type: 'text' as const, text: output}],
        };
      }

      // Return list of all platforms
      let output = `# Available Platforms\n\n`;
      output += `Found ${platforms.length} platforms. Use \`list_platforms(platform='...')\` for details.\n\n`;

      for (const p of platforms) {
        const guidesCount = p.guides?.length || 0;
        const guidesInfo = guidesCount > 0 ? ` (${guidesCount} guides)` : '';
        output += `- **${p.title}** - \`${p.key}\`${guidesInfo}\n`;
      }

      output += '\n## Usage\n\n';
      output += 'Use platform slugs with `search_docs(guide="platform/framework")`\n';
      output += 'Examples:\n';
      output += '- `search_docs(query="setup", guide="javascript/nextjs")`\n';
      output += '- `search_docs(query="configuration", guide="python/django")`\n';

      return {
        content: [{type: 'text' as const, text: output}],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text' as const,
            text: `Error listing platforms: ${error instanceof Error ? error.message : 'Unknown error'}`,
          },
        ],
      };
    }
  });
}
