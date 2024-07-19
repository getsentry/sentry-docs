/* eslint-disable no-console */
const {VERCEL_PROJECT_ID, VERCEL_API_TOKEN, VERCEL_TEAM_ID} = process.env;

if (!VERCEL_PROJECT_ID || !VERCEL_API_TOKEN || !VERCEL_TEAM_ID) {
  console.error('Missing env vars');
}

const VERCEL_API = `https://api.vercel.com`;

const VERCEL_HEADERS = {
  Authorization: `Bearer ${VERCEL_API_TOKEN}`,
  'Content-Type': 'application/json',
};

// Keep deployments that use these urls
const SKIP_LIST = ['sentry-docs-es5gn0iog.sentry.dev'];

/** This object contains information related to the pagination of the current request, including the necessary parameters to get the next or previous page of data. */
interface Pagination {
  /** Amount of items in the current page. */
  count: number;
  /** Timestamp that must be used to request the next page. */
  next: number | null;
  /** Timestamp that must be used to request the previous page. */
  prev: number | null;
}

interface Response {
  deployments: {
    /** Timestamp of when the deployment got created. */
    created: number;
    /** Metadata information of the user who created the deployment. */
    creator: {
      /** The unique identifier of the user. */
      uid: string;
      /** The email address of the user. */
      email?: string;
      /** The GitHub login of the user. */
      githubLogin?: string;
      /** The GitLab login of the user. */
      gitlabLogin?: string;
      /** The username of the user. */
      username?: string;
    };
    /** Vercel URL to inspect the deployment. */
    inspectorUrl: string | null;
    /** The name of the deployment. */
    name: string;
    /** The type of the deployment. */
    type: 'LAMBDAS';
    /** The unique identifier of the deployment. */
    uid: string;
    /** The URL of the deployment. */
    url: string;
    aliasAssigned?: (number | boolean) | null;
    /** An error object in case aliasing of the deployment failed. */
    aliasError?: {
      code: string;
      message: string;
    } | null;
    /** Timestamp of when the deployment started building at. */
    buildingAt?: number;
    /** Conclusion for checks */
    checksConclusion?: 'succeeded' | 'failed' | 'skipped' | 'canceled';
    /** State of all registered checks */
    checksState?: 'registered' | 'running' | 'completed';
    /** The ID of Vercel Connect configuration used for this deployment */
    connectConfigurationId?: string;
    /** Timestamp of when the deployment got created. */
    createdAt?: number;
    /** Deployment can be used for instant rollback */
    isRollbackCandidate?: boolean | null;
    /** An object containing the deployment's metadata */
    meta?: {[key: string]: string};
    /** The project settings which was used for this deployment */
    projectSettings?: {
      buildCommand?: string | null;
      commandForIgnoringBuildStep?: string | null;
      createdAt?: number;
      devCommand?: string | null;
      framework?:
        | (
            | 'blitzjs'
            | 'nextjs'
            | 'gatsby'
            | 'remix'
            | 'astro'
            | 'hexo'
            | 'eleventy'
            | 'docusaurus-2'
            | 'docusaurus'
            | 'preact'
            | 'solidstart'
            | 'dojo'
            | 'ember'
            | 'vue'
            | 'scully'
            | 'ionic-angular'
            | 'angular'
            | 'polymer'
            | 'svelte'
            | 'sveltekit'
            | 'sveltekit-1'
            | 'ionic-react'
            | 'create-react-app'
            | 'gridsome'
            | 'umijs'
            | 'sapper'
            | 'saber'
            | 'stencil'
            | 'nuxtjs'
            | 'redwoodjs'
            | 'hugo'
            | 'jekyll'
            | 'brunch'
            | 'middleman'
            | 'zola'
            | 'hydrogen'
            | 'vite'
            | 'vitepress'
            | 'vuepress'
            | 'parcel'
            | 'sanity'
          )
        | null;
      gitForkProtection?: boolean;
      gitLFS?: boolean;
      installCommand?: string | null;
      nodeVersion?: '18.x' | '16.x' | '14.x' | '12.x' | '10.x';
      outputDirectory?: string | null;
      publicSource?: boolean | null;
      rootDirectory?: string | null;
      serverlessFunctionRegion?: string | null;
      skipGitConnectDuringLink?: boolean;
      sourceFilesOutsideRootDirectory?: boolean;
    };
    /** Timestamp of when the deployment got ready. */
    ready?: number;
    /** The source of the deployment. */
    source?: 'cli' | 'git' | 'import' | 'import/repo' | 'clone/repo';
    /** In which state is the deployment. */
    state?: 'BUILDING' | 'ERROR' | 'INITIALIZING' | 'QUEUED' | 'READY' | 'CANCELED';
    /** On which environment has the deployment been deployed to. */
    target?: ('production' | 'staging') | null;
  }[];
  pagination: Pagination;
}

interface RateLimitError {
  error: {
    code: string;
    limit: {
      remaining: number;
      reset: number;
      resetMs: number;
      total: number;
    };
    message: string;
  };
}

const timestampThirtyDaysAgo = () => {
  const now = new Date();
  return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).getTime();
};

const deleteDeployment = ({deploymentId}: {deploymentId: string}) => {
  return fetch(`${VERCEL_API}/v13/deployments/${deploymentId}?teamId=${VERCEL_TEAM_ID}`, {
    method: 'DELETE',
    headers: {...VERCEL_HEADERS},
  });
};

const listDeployments = async ({limit = 40, until}: {until: number; limit?: number}) => {
  try {
    const deploymentsResponse = await fetch(
      `${VERCEL_API}/v6/deployments?teamId=${VERCEL_TEAM_ID}&projectId=${VERCEL_PROJECT_ID}&limit=${limit}&until=${until}`,
      {
        method: 'GET',
        headers: {...VERCEL_HEADERS},
      }
    );

    if (!deploymentsResponse.ok) {
      console.error('🚨 Could not fetch deployments');
    }

    return (await deploymentsResponse.json()) as Response;
  } catch (err) {
    const error = new Error(`🚨 Error fetching deployments`, {
      cause: err,
    });

    throw error;
  }
};

let deleteCount = 0;

const run = async ({until}: {until: number}) => {
  console.log('🗓️ Deleting stale deployments until ', new Date(until).toISOString());
  let rateLimit: number | undefined = undefined;
  let deleteCountForTimeframe = 0;

  // list deployments based until certain creation date
  const {deployments, pagination} = await listDeployments({
    until,
    limit: 40,
  });

  // only delete non-skipped preview deployments
  const deploymentsForDeletion = deployments.filter(
    ({target, url}) => target !== 'production' && !SKIP_LIST.includes(url)
  );

  // delete deployments in sequence to avoid rate limiting
  for (let x = 0; x < deploymentsForDeletion.length; x++) {
    const deployment = deploymentsForDeletion[x];
    const {uid, url} = deployment;

    try {
      console.log(`\t🧹🧹..deleting deployment ${url} with id ${uid}`);
      const deleteRes = await deleteDeployment({deploymentId: uid});
      if (deleteRes.status === 429) {
        const {error} = (await deleteRes.json()) as RateLimitError;
        rateLimit = error.limit.reset * 1000 - Date.now();
        break;
      }
      deleteCountForTimeframe += 1;
      deleteCount += 1;
    } catch (e) {
      console.log(`\t🚨 Could not delete deployment on ${url} with id ${uid}`, e);
    }
  }

  // Wait for the rate limit to reset or wait a default amount of time
  const defaultWaitTime = deleteCountForTimeframe === 0 ? 1000 : 40 * 1000;
  const timeout = rateLimit ? rateLimit : defaultWaitTime;
  if (timeout > 0) {
    console.log(`⏱️ Waiting for ${Math.round(timeout / 1000)} seconds`);
    await new Promise(resolve => setTimeout(resolve, timeout));
  }

  if (rateLimit === undefined && pagination.next === null) {
    console.log(`✅ Deleted ${deleteCount} deployments`);
    return;
  }
  run({until: rateLimit ? until : (pagination.next as number)});
};

// start deleting deployments that are older than 30d
run({until: timestampThirtyDaysAgo()});
