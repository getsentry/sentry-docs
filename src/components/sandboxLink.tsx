import React from "react";
import usePlatform from "./hooks/usePlatform";

const scenarios = [
    'performance',
    'releases',
    'alerts',
    'discover',
    'dashboards',
    'projects',
    'oneDiscoverQuery',
    'oneIssue',
    'oneBreadcrumb',
    'oneStackTrace',
    'oneTransaction',
    'oneWebVitals',
    'oneTransactionSummary',
    'oneRelease',
  ] as const;

type Props = {
    children: React.ReactNode;
    scenario?: typeof scenarios[number];
    projectSlug?: string;
    errorType?: string;
    platform?: string;
}

/**
 * Obtains the URL to the sandbox start endpoint.
 * @param param0.scenario: One of the scenarios. Determins where in the sandbox 
 * the user will be landed.
 * @param param0.projectSlug:
 * One of react, python, react-native, android, iOS
 * @param param0.errorType: A string matching the title of the error.
 * @returns URL to the sandbox start endpoint
 */
export function getSandboxURL({ scenario, projectSlug, errorType }: {
  scenario?: typeof scenarios[number],
  projectSlug?: string,
  errorType?: string,
} = {}) {
  const url = new URL('https://try.sentry-demo.com/demo/start/');

  if (scenario) url.searchParams.append('scenario', scenario);

  if (projectSlug) url.searchParams.append('projectSlug', projectSlug);

  if (errorType) url.searchParams.append('errorType', errorType);
  url.searchParams.append('source', 'docs');

  return url;
};

export const isSandboxHidden = () => process.env.GATSBY_HIDE_SANDBOX === '1';

const SANDBOX_PLATFORMS = [
    'react',
    'python',
    'react-native',
    'android',
    'ios',
] as const;

const SANDBOX_PLATFORM_MAP: { [key: string]: string } = {
    apple: 'ios',
    javascript: 'react',
    node: 'react',
};

export default function SandboxLink({ children, platform, ...params }: Props) {
    if (isSandboxHidden()) {
        return children;
    }
    const [currentPlatform] = usePlatform(platform);
    if (!params.projectSlug) {
        if ((SANDBOX_PLATFORMS as readonly string[]).includes(currentPlatform.key)) {
            params.projectSlug = currentPlatform.key;
        } else if (SANDBOX_PLATFORM_MAP[currentPlatform.key]) {
            params.projectSlug = SANDBOX_PLATFORM_MAP[currentPlatform.key];
        }
    }

    return <a href={getSandboxURL(params).toString()}>{children}</a>;
}

export function SandboxOnly({children}) {
  //kill switch for sandbox
  if (isSandboxHidden()) {
    return null;
  }
  return children;
}
