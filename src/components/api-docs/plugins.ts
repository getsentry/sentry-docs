export const SnippedGeneratorNodeJsPlugin = {
  fn: {
    // use `requestSnippetGenerator_` + key from config (node_native) for generator fn
    requestSnippetGenerator_node_native: request => {
      const url = new URL(request.get('url'));
      let isMultipartFormDataRequest = false;
      const headers = request.get('headers');
      if (headers && headers.size) {
        request.get('headers').map((val, key) => {
          isMultipartFormDataRequest =
            isMultipartFormDataRequest ||
            (/^content-type$/i.test(key) && /^multipart\/form-data$/i.test(val));
        });
      }
      const packageStr = url.protocol === 'https:' ? 'https' : 'http';
      let reqBody = request.get('body');
      if (request.get('body')) {
        if (
          isMultipartFormDataRequest &&
          ['POST', 'PUT', 'PATCH'].includes(request.get('method'))
        ) {
          return 'throw new Error("Currently unsupported content-type: /^multipart\\/form-data$/i");';
        }
        if (!Map.isMap(reqBody)) {
          if (typeof reqBody !== 'string') {
            reqBody = JSON.stringify(reqBody);
          }
        } else {
          reqBody = getStringBodyOfMap(request);
        }
      } else if (!request.get('body') && request.get('method') === 'POST') {
        reqBody = '';
      }

      const stringBody =
        '`' + (reqBody || '').replace(/\\n/g, '\n').replace(/`/g, '\\`') + '`';

      return `const http = require("${packageStr}");
  const options = {
    "method": "${request.get('method')}",
    "hostname": "${url.host}",
    "port": ${url.port || 'null'},
    "path": "${url.pathname}"${
      headers && headers.size
        ? `,
    "headers": {
      ${request
        .get('headers')
        .map((val, key) => `"${key}": "${val}"`)
        .valueSeq()
        .join(',\n    ')}
    }`
        : ''
    }
  };
  const req = http.request(options, function (res) {
    const chunks = [];
    res.on("data", function (chunk) {
      chunks.push(chunk);
    });
    res.on("end", function () {
      const body = Buffer.concat(chunks);
      console.log(body.toString());
    });
  });
  ${reqBody ? `\nreq.write(${stringBody});` : ''}
  req.end();`;
    },
  },
};
