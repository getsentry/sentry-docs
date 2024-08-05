import {ClientId, HarRequest, HTTPSnippet, TargetId} from 'httpsnippet';

import {GeneratorNames} from './settings';

interface SnippetOptions {
  headers: HarRequest['headers'];
  method: HarRequest['method'];
  targetId: TargetId;
  url: string;
  body?: string;
  clientId?: ClientId;
  params?: HarRequest['queryString'];
}

const generateRequestSnippet = (options: SnippetOptions): string => {
  const postData: HarRequest['postData'] = options.body
    ? {
        mimeType: 'application/json',
        text: options.body,
      }
    : {
        mimeType: '',
      };

  const snippet = new HTTPSnippet({
    method: options.method.toUpperCase(),
    url: options.url,
    log: undefined,
    bodySize: -1,
    cookies: [],
    headers: options.headers,
    headersSize: -1,
    httpVersion: '',
    postData,
    queryString: options.params || [],
  });

  return snippet.convert(options.targetId, options.clientId).toString();
};

const generateSnippetFromRequest = (
  req: any,
  targetId: TargetId, // targetIds are the name of the folder found here https://github.com/Kong/httpsnippet/tree/master/src/targets
  clientId?: ClientId // clientIds are the name of the subfolder under the appropriate targetId
) => {
  const headers = req.get('headers');
  const url = new URL(req.get('url'));

  return generateRequestSnippet({
    headers: Array.from(headers.entries()).map(([key, val]) => ({
      name: key,
      value: val,
    })),
    method: req.get('method'),
    url: url.href.split('?')[0],
    params: Array.from(url.searchParams.entries()).map(([key, val]) => ({
      name: key,
      value: val,
    })),
    body: req.get('body'),
    targetId,
    clientId,
  });
};

type CustomGeneratorNames = Exclude<
  GeneratorNames,
  'curl_bash' | 'curl_powershell' | 'curl_cmd'
>;

type HTTPGenerators = {
  [K in `requestSnippetGenerator_${CustomGeneratorNames}`]: (req: any) => void;
};

export const HTTPSnippetGenerators: {fn: HTTPGenerators} = {
  fn: {
    // use `requestSnippetGenerator_` + key from config (node_native) for generator fn
    requestSnippetGenerator_node_axios: req =>
      generateSnippetFromRequest(req, 'node', 'axios'),
    requestSnippetGenerator_python: req => generateSnippetFromRequest(req, 'python'),
    requestSnippetGenerator_php: req => generateSnippetFromRequest(req, 'php'),
    requestSnippetGenerator_csharp: req => generateSnippetFromRequest(req, 'csharp'),
  },
};
