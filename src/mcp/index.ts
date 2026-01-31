import type {McpServer} from '@modelcontextprotocol/sdk/server/mcp.js';

import {registerGetDoc} from './tools/get-doc';
import {registerGetDocTree} from './tools/get-doc-tree';
import {registerListPlatforms} from './tools/list-platforms';
import {registerSearchDocs} from './tools/search-docs';

export function registerTools(server: McpServer) {
  registerSearchDocs(server);
  registerGetDoc(server);
  registerListPlatforms(server);
  registerGetDocTree(server);
}
