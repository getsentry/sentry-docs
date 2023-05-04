import React from 'react';
import {graphql, useStaticQuery} from 'gatsby';

import CodeBlock from './codeBlock';
import CodeTabs from './codeTabs';

type Props = {
  name?: string;
  tracing?: boolean;
};

const query = graphql`
  query JsCdnPackage {
    package(id: {eq: "sentry.javascript.browser"}) {
      version
      files {
        name
        checksums {
          name
          value
        }
      }
    }
  }
`;

export default function JsCdnTag({tracing = false, name = ''}: Props): JSX.Element {
  const {package: packageData} = useStaticQuery(query);

  const bundleName = tracing ? 'bundle.tracing.min.js' : name || 'bundle.min.js';

  return (
    <CodeTabs>
      <CodeBlock>
        <div className="gatsby-highlight" data-language="html">
          <pre className="language-html">
            <code className="language-html">{`<script src="https://browser.sentry-cdn.com/${
              packageData.version
            }/${bundleName}" integrity="sha384-${
              packageData.files
                .find(f => f.name === bundleName)
                .checksums.find(c => c.name === 'sha384-base64').value
            }" crossorigin="anonymous"></script>`}</code>
          </pre>
        </div>
      </CodeBlock>
    </CodeTabs>
  );
}
