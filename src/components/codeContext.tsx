import React, { useState, useEffect } from "react";

type ProjectCodeKeywords = {
  DSN: string;
  PUBLIC_DSN: string;
  PUBLIC_KEY: string;
  SECRET_KEY: string;
  API_URL: string;
  PROJECT_ID: number;
  PROJECT_SLUG: string;
  ORG_ID: number;
  ORG_SLUG: string;
  ORG_INGEST_DOMAIN: string;
  MINIDUMP_URL: string;
  UNREAL_URL: string;
  title: string;
};

type CodeKeywords = {
  PROJECT: ProjectCodeKeywords[];
};

type Dsn = {
  scheme: string;
  publicKey: string;
  secretKey?: string;
  host: string;
  pathname: string;
};

type ProjectApiResult = {
  dsn: string;
  dsnPublic: string;
  id: string;
  slug: string;
  organizationId: string;
  organizationSlug: string;
  projectSlug: string;
};

// only fetch them once
let cachedCodeKeywords = null;

const DEFAULTS: CodeKeywords = {
  PROJECT: [
    {
      DSN: "https://examplePublicKey@o0.ingest.sentry.io/0",
      PUBLIC_DSN: "https://examplePublicKey@o0.ingest.sentry.io/0",
      PUBLIC_KEY: "examplePublicKey",
      SECRET_KEY: "exampleSecretKey",
      API_URL: "https://sentry.io/api",
      PROJECT_ID: 0,
      PROJECT_SLUG: "example-project",
      ORG_ID: 0,
      ORG_SLUG: "exmaple-org",
      ORG_INGEST_DOMAIN: "o0.ingest.sentry.io",
      MINIDUMP_URL: "https://o0.ingest.sentry.io/api/0/minidump/?sentry_key=examplePublicKey",
      UNREAL_URL: "https://o0.ingest.sentry.io/api/0/unreal/examplePublicKey/",
      title: `example-org / example-project`,
    },
  ],
};

type CodeContextType = {
  codeKeywords: CodeKeywords;
  sharedCodeSelection: any;
  sharedKeywordSelection: any;
};

const CodeContext = React.createContext<CodeContextType | null>(null);

const parseDsn = function(dsn: string): Dsn {
  const match = dsn.match(/^(.*?\/\/)(.*?):(.*?)@(.*?)(\/.*?)$/);

  return {
    scheme: match[1],
    publicKey: escape(match[2]),
    secretKey: escape(match[3]),
    host: escape(match[4]),
    pathname: escape(match[5]),
  };
};

const formatMinidumpURL = ({ scheme, host, pathname, publicKey }: Dsn) => {
  return `${scheme}${host}/api${pathname}/minidump/?sentry_key=${publicKey}`;
};

const formatUnrealEngineURL = ({ scheme, host, pathname, publicKey }: Dsn) => {
  return `${scheme}${host}/api${pathname}/unreal/${publicKey}/`;
};

const formatApiUrl = ({ scheme, host }: Dsn) => {
  const apiHost =
    host.indexOf(".ingest.") >= 0 ? host.split(".ingest.")[1] : host;

  return `${scheme}${apiHost}/api`;
};

export function fetchCodeKeywords() {
  return new Promise(resolve => {
    function transformResults(projects: ProjectApiResult[]) {
      if (projects.length === 0) {
        console.warn("Unable to fetch codeContext - using defaults.");
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
              PROJECT_SLUG: project.projectSlug,
              ORG_ID: project.organizationId,
              ORG_SLUG: project.organizationSlug,
              ORG_INGEST_DOMAIN: `o${project.organizationId}.ingest.sentry.io`,
              MINIDUMP_URL: formatMinidumpURL(parsedDsn),
              UNREAL_URL: formatUnrealEngineURL(parsedDsn),
              title: `${project.organizationSlug} / ${project.projectSlug}`,
            };
          }),
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
          const {
            projects,
          }: {
            projects: ProjectApiResult[];
          } = xhr.response;
          transformResults(projects);
        }
      }
    };
    xhr.send(null);
  });
}

export default CodeContext;

export function useCodeContextState(fetcher = fetchCodeKeywords) {
  let [codeKeywords, setCodeKeywords] = useState(DEFAULTS);
  if (codeKeywords === null && cachedCodeKeywords !== null) {
    setCodeKeywords(cachedCodeKeywords);
    codeKeywords = cachedCodeKeywords;
  }

  useEffect(() => {
    if (cachedCodeKeywords === null) {
      fetcher().then((config: CodeKeywords) => {
        cachedCodeKeywords = config;
        setCodeKeywords(config);
      });
    }
  });

  return {
    codeKeywords,
    sharedCodeSelection: useState(null),
    sharedKeywordSelection: useState({}),
  };
}
