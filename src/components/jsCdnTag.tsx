import React, { useState } from "react";

import CodeBlock from "./codeBlock";
import CodeTabs from "./codeTabs";

let cachedVersionData = null;

type Props = {
  tracing?: boolean;
};

export default ({ tracing = false }: Props): JSX.Element => {
  const [versionData, setVersionData] = useState(cachedVersionData);

  if (!versionData && typeof fetch !== "undefined") {
    fetch(
      "https://release-registry.services.sentry.io/sdks/sentry.javascript.browser/latest"
    ).then(data => {
      data.json().then(jsonData => {
        setVersionData(jsonData);
        cachedVersionData = jsonData;
      });
    });
  }

  const packageName = tracing ? "bundle.tracing.min.js" : "bundle.min.js";
  const packageData = versionData
    ? versionData
    : {
        version: "{VERSION}",
        files: {
          [packageName]: { checksums: { "sha384-base64": "{CHECKSUM}" } },
        },
      };

  return (
    <CodeTabs>
      <CodeBlock>
        <div className="gatsby-highlight" data-language="html">
          <pre className="language-html">
            <code className="language-html">{`<script src="https://browser.sentry-cdn.com/${packageData.version}/${packageName}" integrity="sha384-${packageData.files[packageName].checksums["sha384-base64"]}" crossorigin="anonymous"></script>`}</code>
          </pre>
        </div>
      </CodeBlock>
    </CodeTabs>
  );
};
