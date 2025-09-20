import {createMcpHandler} from "mcp-handler";
import {z} from "zod";

import {formatMatchAsBlock, searchIndex} from "../search/searchIndex";
import {readDocContent} from "../../shared/docs-utils";

const handler = createMcpHandler(
  (server) => {
    server.tool(
      "search_docs",
      "Search the precomputed markdown index and return matching documentation entry points.",
      {
        query: z.string().min(1),
        limit: z.number().int().min(1).max(25).default(5),
      },
      async ({query, limit}) => {
        const matches = await searchIndex(query, limit);
        const contentText = matches.length
          ? matches.map(formatMatchAsBlock).join("\n\n")
          : "No matches found.";

        return {
          content: [{type: "text", text: contentText}],
        };
      }
    );

    server.tool(
      "get_doc",
      "Fetch raw markdown from the documentation exports. Reads local files when available, otherwise fetches from DOCS_PUBLIC_BASE.",
      {
        path: z.string().min(1),
      },
      async ({path}) => {
        const content = await readDocContent(path);
        return {
          content: [{type: "text", text: content}],
        };
      }
    );
  },
  {
    // Optional server options
  },
  {
    basePath: "/api",
    maxDuration: 60,
    verboseLogs: false,
  }
);

function normalizeRequest(request: Request): Request {
  const url = new URL(request.url);
  if (url.pathname.endsWith("/") && url.pathname.length > 1) {
    url.pathname = url.pathname.slice(0, -1);
  }

  return new Request(url.toString(), {
    method: request.method,
    headers: request.headers,
    body: request.body,
    // @ts-ignore - duplex is needed for streaming
    duplex: "half",
  });
}

function wrappedHandler(request: Request) {
  const normalizedRequest = normalizeRequest(request);
  return handler(normalizedRequest);
}

export {wrappedHandler as GET, wrappedHandler as POST, wrappedHandler as DELETE};