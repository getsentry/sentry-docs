import React, { useState } from "react";

let cachedVersionData = null;

export default ({ apm = false }) => {
  const [versionData, setVersionData] = useState(cachedVersionData);

  if (!versionData && typeof fetch !== "undefined") {
    fetch(
      "https://release-registry.services.sentry.io/sdks/sentry.javascript.browser/latest"
    ).then((data) => {
      data.json().then((jsonData) => {
        setVersionData(jsonData);
        cachedVersionData = jsonData;
      });
    });
  }

  const packageName = apm ? "bundle.apm.min.js" : "bundle.min.js";
  const packageData = versionData
    ? versionData
    : {
        version: "{VERSION}",
        files: {
          [packageName]: { checksums: { "sha384-base64": "{CHECKSUM}" } },
        },
      };

  return (
    <pre className="language-js">{`<script src="https://browser.sentry-cdn.com/${packageData.version}/${packageName}" integrity="${packageData.files[packageName].checksums["sha384-base64"]}" crossorigin="anonymous"></script>`}</pre>
  );
};
