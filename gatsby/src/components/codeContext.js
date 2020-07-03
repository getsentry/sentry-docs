import React, { useState, useEffect } from "react";

// only fetch them once
let cachedCodeKeywords = null;

const DEFAULTS = {
  PROJECT: [
    {
      DSN: "https://examplePublicKey@o0.ingest.sentry.io/0",
      PUBLIC_DSN: "https://examplePublicKey@o0.ingest.sentry.io/0",
      PUBLIC_KEY: "examplePublicKey",
      SECRET_KEY: "exampleSecretKey",
      API_URL: "https://sentry.io/api",
      PROJECT_ID: 0,
      PROJECT_NAME: "example-project",
      ORG_ID: 0,
      ORG_NAME: "Example Organization",
      ORG_SLUG: "exmaple-org",
      MINIDUMP_URL: "https://examplePublicKey@o0.ingest.sentry.io/0",
      UNREAL_URL: "https://examplePublicKey@o0.ingest.sentry.io/0",
      title: `example-org / example-project`
    }
  ]
};

const CodeContext = React.createContext(DEFAULTS);

const parseDsn = function(dsn) {
  const match = dsn.match(/^(.*?\/\/)(.*?):(.*?)@(.*?)(\/.*?)$/);

  return {
    scheme: escape(match[1]),
    publicKey: escape(match[2]),
    secretKey: `${escape(match[3])}`,
    host: escape(match[4]),
    pathSection: escape(match[5])
  };
};

const formatMinidumpURL = ({ scheme, host, pathSection, publicKey }) => {
  return `${scheme}${host}/api${pathSection}/minidump/?sentry_key=${publicKey}`;
};

const formatUnrealEngineURL = ({ scheme, host, pathSection, publicKey }) => {
  return `${scheme}${host}/api${pathSection}/unreal/${publicKey}/`;
};

const formatApiUrl = ({ scheme, host }) => {
  const apiHost =
    host.indexOf(".ingest.") >= 0 ? host.split(".ingest.")[1] : host;

  return `${scheme}${apiHost}/api`;
};

export function fetchCodeKeywords() {
  return new Promise(resolve => {
    function transformResults(projects) {
      if (projects.length === 0) {
        resolve(DEFAULTS);
      } else {
        resolve({
          PROJECT: projects.map(project => {
            const parsedDsn = parseDsn(project.dsn);
            return {
              DSN: project.dsn,
              PUBLIC_DSN: project.dsnPublic,
              PUBLIC_KEY: parsedDsn.publicKey,
              SECRET_KEY: parsedDsn.secretKey,
              API_URL: formatApiUrl(parsedDsn),
              PROJECT_ID: project.id,
              PROJECT_NAME: project.slug,
              ORG_ID: project.organizationId,
              ORG_NAME: project.organizationName,
              ORG_SLUG: project.organizationSlug,
              MINIDUMP_URL: formatMinidumpURL(parsedDsn),
              UNREAL_URL: formatUnrealEngineURL(parsedDsn),
              title: `${project.organizationSlug} / ${project.projectSlug}`
            };
          })
        });
      }
    }

    const xhr = new XMLHttpRequest();
    xhr.open("GET", "https://sentry.io/docs/api/user/");
    xhr.withCredentials = true;
    xhr.responseType = "json";
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (xhr.status === 0) {
          transformResults([]);
        } else {
          const { projects } = xhr.response;
          transformResults(projects);
        }
      }
    };
    xhr.send(null);
  });
}

export default CodeContext;

export function useCodeContextState(fetcher = fetchCodeKeywords) {
  let [codeKeywords, setCodeKeywords] = useState(null);
  if (codeKeywords === null && cachedCodeKeywords !== null) {
    setCodeKeywords(cachedCodeKeywords);
    codeKeywords = cachedCodeKeywords;
  }

  useEffect(() => {
    if (cachedCodeKeywords === null) {
      fetcher().then(config => {
        cachedCodeKeywords = config;
        setCodeKeywords(config);
      });
    }
  });

  return {
    codeKeywords,
    sharedCodeSelection: useState(null),
    sharedKeywordSelection: useState({})
  };
}
