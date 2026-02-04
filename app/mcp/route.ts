import {createMcpHandler} from 'mcp-handler';

import {registerTools} from '../../src/mcp';

// Trailing slash handling is done in middleware
const handler = createMcpHandler(
  server => {
    registerTools(server);
  },
  {
    serverInfo: {
      name: 'sentry-docs-mcp',
      version: '1.0.0',
    },
  },
  {
    basePath: '/',
    maxDuration: 60,
    disableSse: true, // Stateless HTTP only - no Redis required
  }
);

export {handler as GET, handler as POST};
