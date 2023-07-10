import {createContext, useEffect, useState} from 'react';

type CodeContextStatus = 'loading' | 'loaded';

type ProjectCodeKeywords = {
  API_URL: string;
  DSN: string;
  MINIDUMP_URL: string;
  ORG_ID: number;
  ORG_INGEST_DOMAIN: string;
  ORG_SLUG: string;
  PROJECT_ID: number;
  PROJECT_SLUG: string;
  PUBLIC_DSN: string;
  PUBLIC_KEY: string;
  SECRET_KEY: string;
  UNREAL_URL: string;
  title: string;
};

type UserCodeKeywords = {
  ID: number;
  NAME: string;
};

type CodeKeywords = {
  PROJECT: ProjectCodeKeywords[];
  USER: UserCodeKeywords | undefined;
};

type Dsn = {
  host: string;
  pathname: string;
  publicKey: string;
  scheme: string;
  secretKey?: string;
};

type ProjectApiResult = {
  dsn: string;
  dsnPublic: string;
  id: number;
  organizationId: number;
  organizationSlug: string;
  projectSlug: string;
  slug: string;
};

type UserApiResult = {
  avatarUrl: string;
  id: number;
  isAuthenticated: boolean;
  name: string;
};

// only fetch them once
let cachedCodeKeywords = null;

const DEFAULTS: CodeKeywords = {
  PROJECT: [
    {
      DSN: 'https://examplePublicKey@o0.ingest.sentry.io/0',
      PUBLIC_DSN: 'https://examplePublicKey@o0.ingest.sentry.io/0',
      PUBLIC_KEY: 'examplePublicKey',
      SECRET_KEY: 'exampleSecretKey',
      API_URL: 'https://sentry.io/api',
      PROJECT_ID: 0,
      PROJECT_SLUG: 'example-project',
      ORG_ID: 0,
      ORG_SLUG: 'example-org',
      ORG_INGEST_DOMAIN: 'o0.ingest.sentry.io',
      MINIDUMP_URL:
        'https://o0.ingest.sentry.io/api/0/minidump/?sentry_key=examplePublicKey',
      UNREAL_URL: 'https://o0.ingest.sentry.io/api/0/unreal/examplePublicKey/',
      title: `example-org / example-project`,
    },
  ],
  USER: undefined,
};

type CodeContextType = {
  codeKeywords: CodeKeywords;
  sharedCodeSelection: any;
  sharedKeywordSelection: any;
  status: CodeContextStatus;
};

export const CodeContext = createContext<CodeContextType | null>(null);

const parseDsn = function (dsn: string): Dsn {
  const match = dsn.match(/^(.*?\/\/)(.*?):(.*?)@(.*?)(\/.*?)$/);

  return {
    scheme: match[1],
    publicKey: escape(match[2]),
    secretKey: escape(match[3]),
    host: escape(match[4]),
    pathname: escape(match[5]),
  };
};

const formatMinidumpURL = ({scheme, host, pathname, publicKey}: Dsn) => {
  return `${scheme}${host}/api${pathname}/minidump/?sentry_key=${publicKey}`;
};

const formatUnrealEngineURL = ({scheme, host, pathname, publicKey}: Dsn) => {
  return `${scheme}${host}/api${pathname}/unreal/${publicKey}/`;
};

const formatApiUrl = ({scheme, host}: Dsn) => {
  const apiHost = host.indexOf('.ingest.') >= 0 ? host.split('.ingest.')[1] : host;

  return `${scheme}${apiHost}/api`;
};

/**
 * Fetch project details from sentry
 */
export async function fetchCodeKeywords(): Promise<CodeKeywords> {
  let json: {projects: ProjectApiResult[]; user: UserApiResult} | null = null;

  const url =
    process.env.NODE_ENV === 'development'
      ? 'http://dev.getsentry.net:8000/docs/api/user/'
      : 'https://sentry.io/docs/api/user/';

  const makeDefaults = () => {
    // eslint-disable-next-line no-console
    console.warn('Unable to fetch codeContext - using defaults.');
    return DEFAULTS;
  };

  try {
    const resp = await fetch(url, {credentials: 'include'});

    if (!resp.ok) {
      return makeDefaults();
    }

    json = await resp.json();
  } catch {
    return makeDefaults();
  }

  const {projects, user} = json;

  if (projects?.length === 0) {
    return makeDefaults();
  }

  return {
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
    USER: user.isAuthenticated
      ? {
          ID: user.id,
          NAME: user.name,
        }
      : undefined,
  };
}

export function useCodeContextState(fetcher = fetchCodeKeywords): CodeContextType {
  const [codeKeywords, setCodeKeywords] = useState(cachedCodeKeywords ?? DEFAULTS);

  const [status, setStatus] = useState<CodeContextStatus>(
    cachedCodeKeywords ? 'loaded' : 'loading'
  );

  useEffect(() => {
    if (cachedCodeKeywords === null) {
      setStatus('loading');
      fetcher().then((config: CodeKeywords) => {
        cachedCodeKeywords = config;
        setCodeKeywords(config);
        setStatus('loaded');
      });
    }
  }, [setStatus, setCodeKeywords, fetcher]);

  return {
    codeKeywords,
    sharedCodeSelection: useState(null),
    sharedKeywordSelection: useState({}),
    status,
  };
}
