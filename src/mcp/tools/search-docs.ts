import type {McpServer} from '@modelcontextprotocol/sdk/server/mcp.js';
import {SentryGlobalSearch, standardSDKSlug} from '@sentry-internal/global-search';
import {z} from 'zod';

const docsSearch = new SentryGlobalSearch([{site: 'docs', pathBias: true, platformBias: true}]);
const developSearch = new SentryGlobalSearch(['develop']);

/**
 * Strip HTML tags from a string iteratively to handle nested angle brackets.
 * Prevents incomplete sanitization like `<<script>` → `<script>`
 */
function stripHtmlTags(str: string): string {
  let result = str;
  let previous = '';
  while (result !== previous) {
    previous = result;
    result = result.replace(/<[^>]*>/g, '');
  }
  return result;
}

export function registerSearchDocs(server: McpServer) {
  const description = [
    'Search Sentry documentation for SDK setup, configuration, and usage guidance.',
    '',
    'Use this tool when you need to:',
    '- Find SDK setup instructions for any platform or framework',
    '- Look up configuration options and API references',
    '- Find code examples and implementation patterns',
    '',
    'Returns snippets with relevance scores. Use `get_doc` to fetch full content.',
    '',
    '<hints>',
    '- Use guide parameter to filter by platform (e.g., "javascript/nextjs")',
    '- Include specific terms like "beforeSend", "tracesSampleRate", "DSN"',
    '</hints>',
  ].join('\n');

  const paramsSchema = {
    query: z
      .string()
      .min(2, 'Query too short, minimum 2 characters')
      .max(200, 'Query too long, maximum 200 characters')
      .describe('Search query in natural language'),
    maxResults: z
      .number()
      .int()
      .min(1)
      .max(10)
      .default(5)
      .describe('Maximum results to return (1-10)'),
    site: z
      .enum(['docs', 'develop'])
      .default('docs')
      .describe('Which site to search: docs (user docs) or develop (SDK dev docs)'),
    guide: z
      .string()
      .optional()
      .describe('Filter by platform/guide (e.g., "javascript/nextjs", "python/django")'),
  };

  server.tool('search_docs', description, paramsSchema, async ({query, maxResults, site, guide}) => {
    try {
      const search = site === 'develop' ? developSearch : docsSearch;
      const platforms = guide ? [standardSDKSlug(guide)?.slug].filter(Boolean) : [];

      const results = await search.query(query, {
        platforms: platforms as string[],
        searchAllIndexes: false,
      });

      // Flatten and format results
      const allHits = results.flatMap(result =>
        result.hits.map(hit => ({
          id: hit.id,
          url: hit.url,
          title: stripHtmlTags(hit.title || ''),
          snippet:
            stripHtmlTags(hit.text || '').slice(0, 300) ||
            stripHtmlTags(hit.context?.context1 || '').slice(0, 300) ||
            '',
        }))
      );

      const limitedResults = allHits.slice(0, maxResults);

      if (limitedResults.length === 0) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `No documentation found for "${query}". Try different search terms or check the spelling.`,
            },
          ],
        };
      }

      let output = `# Search Results for "${query}"\n\n`;
      output += `Found ${limitedResults.length} result(s)\n\n`;
      output += 'Use `get_doc` with the path to fetch full content.\n\n';

      for (const [index, result] of limitedResults.entries()) {
        const path = new URL(result.url).pathname.replace(/\/$/, '');
        output += `## ${index + 1}. ${result.title || 'Untitled'}\n\n`;
        output += `**Path**: \`${path}\`\n`;
        output += `**URL**: ${result.url}\n\n`;
        if (result.snippet) {
          output += `> ${result.snippet.replace(/\n/g, '\n> ')}\n\n`;
        }
      }

      return {
        content: [{type: 'text' as const, text: output}],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text' as const,
            text: `Error searching documentation: ${error instanceof Error ? error.message : 'Unknown error'}`,
          },
        ],
      };
    }
  });
}
