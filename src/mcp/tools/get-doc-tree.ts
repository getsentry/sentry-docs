import type {McpServer} from '@modelcontextprotocol/sdk/server/mcp.js';
import {z} from 'zod';

import type {DocNode} from 'sentry-docs/docTree';
import {getDocsRootNode, nodeForPath} from 'sentry-docs/docTree';

interface TreeNode {
  path: string;
  title: string;
  children?: TreeNode[];
}

function filterTreeByDepth(node: DocNode, currentDepth: number, maxDepth: number): TreeNode {
  const title = node.frontmatter.sidebar_title || node.frontmatter.title || node.slug;

  const result: TreeNode = {
    path: node.path,
    title,
  };

  if (currentDepth < maxDepth && node.children && node.children.length > 0) {
    const visibleChildren = node.children.filter(
      child =>
        !child.frontmatter.sidebar_hidden &&
        !child.frontmatter.draft &&
        (child.frontmatter.sidebar_title || child.frontmatter.title)
    );

    if (visibleChildren.length > 0) {
      result.children = visibleChildren.map(child =>
        filterTreeByDepth(child, currentDepth + 1, maxDepth)
      );
    }
  }

  return result;
}

function treeToMarkdown(node: TreeNode, indent: number = 0): string {
  const prefix = '  '.repeat(indent);
  let output = `${prefix}- **${node.title}** \`${node.path || '/'}\`\n`;

  if (node.children) {
    for (const child of node.children) {
      output += treeToMarkdown(child, indent + 1);
    }
  }

  return output;
}

export function registerGetDocTree(server: McpServer) {
  const description = [
    'Get the documentation structure/table of contents for navigation.',
    '',
    'Use this tool to:',
    '- Understand the documentation hierarchy',
    '- Find available sections and subsections',
    '- Navigate to related documentation pages',
    '',
    '<hints>',
    '- Without path: returns top-level structure',
    '- With path: returns structure starting from that path',
    '- Use depth to control how deep to traverse (1-3)',
    '</hints>',
  ].join('\n');

  const paramsSchema = {
    path: z
      .string()
      .optional()
      .describe('Starting path to get tree from (e.g., "platforms/javascript")'),
    depth: z
      .number()
      .int()
      .min(1)
      .max(3)
      .default(2)
      .describe('How many levels deep to include (1-3)'),
    site: z
      .enum(['docs', 'develop'])
      .default('docs')
      .describe('Which site: docs or develop'),
  };

  server.tool('get_doc_tree', description, paramsSchema, async ({path, depth, site}) => {
    try {
      // Note: For develop docs, we'd need getDevelopDocsRootNode but it's not exported
      // For now, we only fully support docs site
      if (site === 'develop') {
        return {
          content: [
            {
              type: 'text' as const,
              text: [
                '# Developer Docs Tree',
                '',
                'The doc tree for develop.sentry.io is not available in this context.',
                'Use `search_docs(site="develop")` to search developer documentation.',
              ].join('\n'),
            },
          ],
        };
      }

      const rootNode = await getDocsRootNode();

      let startNode = rootNode;
      if (path) {
        const found = nodeForPath(rootNode, path);
        if (!found) {
          return {
            content: [
              {
                type: 'text' as const,
                text: [
                  `# Path Not Found: ${path}`,
                  '',
                  'The specified path does not exist in the documentation tree.',
                  'Use `get_doc_tree()` without a path to see the top-level structure.',
                ].join('\n'),
              },
            ],
          };
        }
        startNode = found;
      }

      const tree = filterTreeByDepth(startNode, 0, depth);

      let output = `# Documentation Structure\n\n`;
      if (path) {
        output += `**Starting from**: \`${path}\`\n`;
      }
      output += `**Depth**: ${depth} level(s)\n\n`;

      output += treeToMarkdown(tree);

      output += '\n## Navigation Tips\n\n';
      output += '- Use `get_doc(path="...")` to read a specific page\n';
      output += '- Use `get_doc_tree(path="...")` to explore a subsection\n';
      output += '- Use `search_docs(query="...")` to find specific topics\n';

      return {
        content: [{type: 'text' as const, text: output}],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text' as const,
            text: `Error getting doc tree: ${error instanceof Error ? error.message : 'Unknown error'}`,
          },
        ],
      };
    }
  });
}
