/* eslint-env node */
/* eslint import/no-nodejs-modules:0 */
/* eslint-disable no-console */

// This script removes all preview deployments from Vercel.
// To add the necessary environment variables, update your `.env.development` file.
// You can run this script with `yarn remove-preview-deployments`.
//
// Note: That by default, the script will only remove deployments that are older than 30 days.

import dotenv from 'dotenv';
import fetch from 'node-fetch';

const activeEnv = process.env.GATSBY_ENV || process.env.NODE_ENV || 'development';

console.log(`Using environment config: '${activeEnv}'`);

dotenv.config({
  path: `.env.${activeEnv}`,
});

const {VERCEL_AUTH_TOKEN, VERCEL_TEAM_ID, VERCEL_PROJECT_ID} = process.env;

if (!VERCEL_AUTH_TOKEN) {
  throw new Error('VERCEL_AUTH_TOKEN is not set');
}

if (!VERCEL_TEAM_ID) {
  throw new Error('VERCEL_TEAM_ID is not set');
}

if (!VERCEL_PROJECT_ID) {
  throw new Error('VERCEL_PROJECT_ID is not set');
}

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

async function run(next: number): Promise<void> {
  console.log(`Fetching deployments prior to ${new Date(next)}`);
  const res = await fetch(
    `https://api.vercel.com/v6/deployments?projectId=${VERCEL_PROJECT_ID}&teamId=${VERCEL_TEAM_ID}&state=READY,ERROR&limit=40&target=preview&until=${next}`,
    {
      headers: {
        Authorization: `Bearer ${VERCEL_AUTH_TOKEN}`,
      },
    }
  );

  let rateLimit: number | undefined = undefined;

  const {deployments, pagination} = (await res.json()) as Response;
  if (!deployments.length) {
    console.log('No deployments found');
    return;
  }

  for (let x = 0; x < deployments.length; x++) {
    const deployment = deployments[x];
    const id = deployment.uid;

    try {
      console.log(`Removing deployment ${deployment.url} with id ${id}`);
      const deleteRes = await fetch(
        `https://api.vercel.com/v13/deployments/${id}?teamId=${VERCEL_TEAM_ID}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${VERCEL_AUTH_TOKEN}`,
          },
        }
      );
      if (deleteRes.status === 429) {
        const {error} = (await deleteRes.json()) as RateLimitError;
        rateLimit = error.limit.reset * 1000 - Date.now();
        break;
      }
    } catch (e) {
      console.log(`Failed to remove deployment ${deployment.url} with id ${id}`, e);
    }
  }

  // We need to wait for the rate limit to reset or default 60
  // to avoid hitting the rate limit again.
  const timeout = rateLimit ? rateLimit : 60 * 1000;
  console.log(`Waiting for ${Math.round(timeout / 1000)} seconds`);
  await new Promise(resolve => setTimeout(resolve, timeout));

  run(rateLimit ? next : pagination.next);
}

// Start the script with a date 30 days ago
const thirtyDaysAgo = new Date(new Date().setDate(new Date().getDate() - 30));
run(thirtyDaysAgo.getTime());
