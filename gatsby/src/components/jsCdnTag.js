import React, { useState } from "react";

export default ({ apm = false }) => {
  const [versionData, setVersionData] = useState(null);

  fetch(
    "https://release-registry.services.sentry.io/sdks/sentry.javascript.browser/latest"
  ).then(data => setVersionData(data));

  const packageName = apm ? "bundle.apm.min.js" : "bundle.min.js";
  const packageData =
    versionData && versionData[packageName]
      ? versionData[packageName]
      : { version: "{VERSION}", checksums: { "sha384-base64": "{CHECKSUM}" } };

  return (
    <pre className="language-js">{`<script src="https://browser.sentry-cdn.com/${packageData.version}/${packageName}" integrity="${packageData.checksums["sha384-base64"]}" crossorigin="anonymous"></script>`}</pre>
  );
};
