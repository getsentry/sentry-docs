'use client';

import {ChevronDownIcon} from '@radix-ui/react-icons';
import * as RadixSelect from '@radix-ui/react-select';
import {createContext, ReactNode, useContext, useEffect, useMemo, useState} from 'react';
import {getMDXComponent} from 'sentry-docs/getMDXComponent';

import {Alert} from '../alert';
import {CodeBlock} from '../codeBlock';
import {CodeContext} from '../codeContext';
import {CodeTabs} from '../codeTabs';
import {Expandable} from '../expandable';
import {FeatureBadge} from '../featureBadge';
import {
  OnboardingOption,
  OnboardingOptionButtons,
  OnboardingSteps,
  updateElementsVisibilityForOptions,
} from '../onboarding';
import {SmartLink} from '../smartLink';
import {
  SplitLayout,
  SplitSection,
  SplitSectionCode,
  SplitSectionText,
} from '../splitLayout';
import styles from '../versionSelector/style.module.scss';
import {
  Framework,
  FRAMEWORK_QUERY_PARAM,
  PlatformContentPayload,
  platformContentUrl,
  RUNTIMES,
} from './frameworks';

const DEFAULT_VALUE = 'none';

type FrameworkContextValue = {
  framework: Framework | null;
  platform: string;
  /** The runtime guide the page belongs to, e.g. `node`. */
  runtime: string;
};

const FrameworkContext = createContext<FrameworkContextValue | null>(null);

function readFrameworkFromUrl(frameworks: Framework[]): Framework | null {
  const key = new URLSearchParams(window.location.search).get(FRAMEWORK_QUERY_PARAM);
  return frameworks.find(f => f.key === key) ?? null;
}

function writeFrameworkToUrl(framework: Framework | null) {
  const url = new URL(window.location.href);
  if (framework) {
    url.searchParams.set(FRAMEWORK_QUERY_PARAM, framework.key);
  } else {
    url.searchParams.delete(FRAMEWORK_QUERY_PARAM);
  }
  window.history.replaceState(window.history.state, '', url);
}

/**
 * Renders a framework dropdown and lets `<PlatformContent switchable />` blocks among its
 * children swap to the selected framework's snippets for `runtime`, loaded on demand.
 * The selection is kept in the `?framework=` query param.
 */
export function FrameworkSelector({
  children,
  runtime,
  platform = 'javascript',
}: {
  children: ReactNode;
  runtime: string;
  platform?: string;
}) {
  const runtimeConfig = RUNTIMES[runtime];
  const frameworks = useMemo(() => runtimeConfig?.frameworks ?? [], [runtimeConfig]);
  const [framework, setFramework] = useState<Framework | null>(null);

  // The page is statically rendered, so the query param can only be read after mount.
  useEffect(() => {
    setFramework(readFrameworkFromUrl(frameworks));
  }, [frameworks]);

  const handleChange = (value: string) => {
    const selected = frameworks.find(f => f.key === value) ?? null;
    setFramework(selected);
    writeFrameworkToUrl(selected);
  };

  const contextValue = useMemo(
    () => ({framework, platform, runtime}),
    [framework, platform, runtime]
  );

  return (
    <FrameworkContext.Provider value={contextValue}>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4 my-4">
        <label htmlFor="framework-selector" className="font-medium">
          Framework
        </label>
        <div className="sm:w-72">
          <RadixSelect.Root
            value={framework?.key ?? DEFAULT_VALUE}
            onValueChange={handleChange}
          >
            <RadixSelect.Trigger
              id="framework-selector"
              aria-label="Framework"
              className={styles.select}
            >
              <RadixSelect.Value />
              <RadixSelect.Icon>
                <ChevronDownIcon />
              </RadixSelect.Icon>
            </RadixSelect.Trigger>
            <RadixSelect.Content
              position="popper"
              aria-label="Frameworks"
              className={styles.popover}
            >
              <RadixSelect.Item value={DEFAULT_VALUE} className={styles.item}>
                <RadixSelect.ItemText>
                  None (plain {runtimeConfig?.title ?? runtime})
                </RadixSelect.ItemText>
              </RadixSelect.Item>
              {frameworks.map(f => (
                <RadixSelect.Item key={f.key} value={f.key} className={styles.item}>
                  <RadixSelect.ItemText>{f.title}</RadixSelect.ItemText>
                </RadixSelect.Item>
              ))}
            </RadixSelect.Content>
          </RadixSelect.Root>
        </div>
      </div>
      {children}
    </FrameworkContext.Provider>
  );
}

const payloadCache = new Map<string, Promise<PlatformContentPayload>>();

function fetchPayload(url: string): Promise<PlatformContentPayload> {
  let promise = payloadCache.get(url);
  if (!promise) {
    promise = fetch(url).then(res => {
      if (!res.ok) {
        throw new Error(`Failed to load ${url}: ${res.status}`);
      }
      return res.json();
    });
    // Allow retrying after a failed request
    promise.catch(() => payloadCache.delete(url));
    payloadCache.set(url, promise);
  }
  return promise;
}

/**
 * Client-side stand-ins for the server-only MDX components, scoped to the selected
 * framework on the page's runtime.
 */
function clientMdxComponents(
  payload: PlatformContentPayload,
  platform: string,
  runtime: string,
  framework: string
) {
  // Checked in order, like the server's fallback chain
  const platformKeys = [`${platform}.${framework}`, `${platform}.${runtime}`];

  function MDX({code}: {code: string | null | undefined}) {
    const Component = useMemo(() => (code ? getMDXComponent(code) : null), [code]);
    return Component ? <Component components={components} /> : null;
  }

  function Include({name}: {name: string}) {
    return <MDX code={payload.includes[name.replace(/\.mdx$/, '')]} />;
  }

  function PlatformContent({includePath}: {includePath: string}) {
    return <MDX code={payload.platformContents[includePath]} />;
  }

  function PlatformLink({children, to}: {children: ReactNode; to?: string}) {
    if (!to) {
      return children;
    }
    return (
      <SmartLink
        href={`/platforms/${platform}/guides/${runtime}/${to.replace(/^\//, '')}`}
      >
        {children}
      </SmartLink>
    );
  }

  function PlatformSection({
    children,
    supported = [],
    notSupported = [],
    noGuides,
  }: {
    children: ReactNode;
    noGuides?: boolean;
    notSupported?: string[];
    supported?: string[];
  }) {
    if (noGuides) {
      return null;
    }
    for (const key of platformKeys) {
      if (supported.includes(key)) {
        return <div>{children}</div>;
      }
      if (notSupported.includes(key)) {
        return null;
      }
    }
    return supported.length ? null : <div>{children}</div>;
  }

  const components = {
    Alert,
    CodeBlock,
    CodeTabs,
    Expandable,
    FeatureBadge,
    Include,
    Link: SmartLink,
    OnboardingOption,
    OnboardingOptionButtons,
    OnboardingSteps,
    PlatformContent,
    PlatformLink,
    PlatformSection,
    SplitLayout,
    SplitSection,
    SplitSectionCode,
    SplitSectionText,
    a: SmartLink,
  };

  return {MDX, components};
}

function RemoteFrameworkContent({
  fallback,
  framework,
  includePath,
  platform,
  runtime,
}: {
  fallback: ReactNode;
  framework: Framework;
  includePath: string;
  platform: string;
  runtime: string;
}) {
  const url = platformContentUrl(platform, runtime, framework.key, includePath);
  const [payload, setPayload] = useState<PlatformContentPayload | null>(null);
  const [error, setError] = useState(false);
  const codeContext = useContext(CodeContext);

  useEffect(() => {
    let cancelled = false;
    setPayload(null);
    setError(false);
    fetchPayload(url).then(
      result => !cancelled && setPayload(result),
      () => !cancelled && setError(true)
    );
    return () => {
      cancelled = true;
    };
  }, [url]);

  const mdx = useMemo(
    () =>
      payload ? clientMdxComponents(payload, platform, runtime, framework.key) : null,
    [payload, platform, runtime, framework.key]
  );

  // Apply the current feature selection (tracing, profiling, ...) to the new content
  useEffect(() => {
    if (payload && codeContext?.onboardingOptions) {
      updateElementsVisibilityForOptions(codeContext.onboardingOptions, false);
    }
  }, [payload, codeContext?.onboardingOptions]);

  if (error) {
    return fallback;
  }

  if (!payload || !mdx) {
    return (
      <div aria-busy="true" className="opacity-50 transition-opacity">
        {fallback}
      </div>
    );
  }

  return <mdx.MDX code={payload.code} />;
}

/**
 * Renders the server-rendered `children` by default, or the selected framework's
 * version of `includePath` when inside a `<FrameworkSelector>` with a framework selected.
 */
export function FrameworkContent({
  children,
  includePath,
}: {
  children: ReactNode;
  includePath: string;
}) {
  const context = useContext(FrameworkContext);

  if (!context?.framework) {
    return children;
  }

  return (
    <RemoteFrameworkContent
      fallback={children}
      framework={context.framework}
      includePath={includePath}
      platform={context.platform}
      runtime={context.runtime}
    />
  );
}
