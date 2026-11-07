'use client';

import {ArrowRightIcon, CaretSortIcon} from '@radix-ui/react-icons';
import * as RadixSelect from '@radix-ui/react-select';
import {useRouter} from 'next/navigation';
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
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
import {PlatformIcon} from '../platformIcon';
import {SmartLink} from '../smartLink';
import styles from '../versionSelector/style.module.scss';
import {
  Framework,
  FRAMEWORK_QUERY_PARAM,
  PlatformContentPayload,
  platformContentUrl,
  RUNTIMES,
} from './frameworks';
import frameworkStyles from './style.module.scss';

const DEFAULT_VALUE = 'none';
const GUIDE_VALUE_PREFIX = 'guide:';
const groupLabelClassName = 'px-2 pt-2 pb-1 text-xs font-medium text-[var(--gray-11)]';

/** The state of a switchable block while a framework is selected. */
type ContentStatus =
  | {state: 'loading' | 'unchanged'}
  /** `step` is the title of the `h2` step that contains the block, `targetId` the block's id. */
  | {state: 'changed'; targetId: string; step?: string};

type FrameworkContextValue = {
  framework: Framework | null;
  platform: string;
  /** Records the status of the block with `includePath`, or removes it with `null`. */
  reportContent: (includePath: string, status: ContentStatus | null) => void;
  /** The runtime guide the page belongs to, e.g. `node`. */
  runtime: string;
};

const FrameworkContext = createContext<FrameworkContextValue | null>(null);

function ItemLabel({icon, title}: {icon: string; title: string}) {
  return (
    <span className="flex items-center gap-2">
      <PlatformIcon
        platform={icon}
        size={16}
        format="sm"
        className="!border-none !shadow-none"
      />
      {title}
    </span>
  );
}

function stepTitle(el: HTMLElement): string | undefined {
  const step = Array.from(document.querySelectorAll<HTMLElement>('main h2[id]'))
    .filter(h => h.compareDocumentPosition(el) & Node.DOCUMENT_POSITION_FOLLOWING)
    .pop();
  return (step?.querySelector('a') ?? step)?.textContent?.trim();
}

function FrameworkSummary({
  contents,
  framework,
  platform,
}: {
  contents: Record<string, ContentStatus>;
  framework: Framework;
  platform: string;
}) {
  const statuses = Object.values(contents);
  if (statuses.some(c => c.state === 'loading')) {
    return (
      <p className={frameworkStyles.summary}>Loading the steps for {framework.title}…</p>
    );
  }

  const changed = statuses
    .filter(c => c.state === 'changed')
    .map(c => ({...c, el: document.getElementById(c.targetId)}))
    .filter(c => c.el)
    .sort((a, b) =>
      a.el!.compareDocumentPosition(b.el!) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1
    );
  const steps = changed.filter(
    (c, i) => changed.findIndex(other => other.step === c.step) === i
  );

  return (
    <p className={frameworkStyles.summary}>
      <PlatformIcon
        platform={`${platform}-${framework.key}`}
        size={16}
        format="sm"
        className="!border-none !shadow-none"
      />
      {steps.length > 0 ? (
        <span>
          Updated for {framework.title}:{' '}
          {steps.map((c, i) => (
            <span key={c.targetId}>
              {i > 0 && ', '}
              <a href={`#${c.targetId}`}>{c.step ?? 'Show the change'}</a>
            </span>
          ))}
        </span>
      ) : (
        <span>The steps for {framework.title} are the same as without a framework.</span>
      )}
    </p>
  );
}

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
  runtime: string;
  children?: ReactNode;
  platform?: string;
}) {
  const router = useRouter();
  const runtimeConfig = RUNTIMES[runtime];
  const frameworks = useMemo(() => runtimeConfig?.frameworks ?? [], [runtimeConfig]);
  const frameworkGuides = runtimeConfig?.frameworkGuides ?? [];
  const [framework, setFramework] = useState<Framework | null>(null);
  const [contents, setContents] = useState<Record<string, ContentStatus>>({});

  const reportContent = useCallback(
    (includePath: string, status: ContentStatus | null) =>
      setContents(prev => {
        const next = {...prev};
        if (status) {
          next[includePath] = status;
        } else {
          delete next[includePath];
        }
        return next;
      }),
    []
  );

  // The page is statically rendered, so the query param can only be read after mount.
  useEffect(() => {
    setFramework(readFrameworkFromUrl(frameworks));
  }, [frameworks]);

  const handleChange = (value: string) => {
    if (value.startsWith(GUIDE_VALUE_PREFIX)) {
      router.push(value.slice(GUIDE_VALUE_PREFIX.length));
      return;
    }
    const selected = frameworks.find(f => f.key === value) ?? null;
    setFramework(selected);
    writeFrameworkToUrl(selected);
  };

  const contextValue = useMemo(
    () => ({framework, platform, reportContent, runtime}),
    [framework, platform, reportContent, runtime]
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
                <CaretSortIcon />
              </RadixSelect.Icon>
            </RadixSelect.Trigger>
            <RadixSelect.Content
              position="popper"
              aria-label="Frameworks"
              className={`${styles.popover} max-h-[var(--radix-select-content-available-height)] overflow-y-auto`}
            >
              <RadixSelect.Item value={DEFAULT_VALUE} className={styles.item}>
                <RadixSelect.ItemText>
                  <ItemLabel icon={`${platform}-${runtime}`} title="No framework" />
                </RadixSelect.ItemText>
              </RadixSelect.Item>
              {frameworks.length > 0 && (
                <RadixSelect.Group>
                  <RadixSelect.Label className={groupLabelClassName}>
                    Set up with this guide
                  </RadixSelect.Label>
                  {frameworks.map(f => (
                    <RadixSelect.Item key={f.key} value={f.key} className={styles.item}>
                      <RadixSelect.ItemText>
                        <ItemLabel icon={`${platform}-${f.key}`} title={f.title} />
                      </RadixSelect.ItemText>
                    </RadixSelect.Item>
                  ))}
                </RadixSelect.Group>
              )}
              {frameworkGuides.length > 0 && (
                <RadixSelect.Group>
                  <RadixSelect.Label className={groupLabelClassName}>
                    Set up with its own guide
                  </RadixSelect.Label>
                  {frameworkGuides.map(g => (
                    <RadixSelect.Item
                      key={g.url}
                      value={`${GUIDE_VALUE_PREFIX}${g.url}`}
                      className={styles.item}
                    >
                      <RadixSelect.ItemText>
                        <ItemLabel icon={g.icon} title={g.title} />
                      </RadixSelect.ItemText>
                      <ArrowRightIcon className="ml-auto" />
                    </RadixSelect.Item>
                  ))}
                </RadixSelect.Group>
              )}
            </RadixSelect.Content>
          </RadixSelect.Root>
        </div>
      </div>
      {framework && (
        <FrameworkSummary contents={contents} framework={framework} platform={platform} />
      )}
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
    a: SmartLink,
  };

  return {MDX, components};
}

function RemoteFrameworkContent({
  fallback,
  framework,
  includePath,
  platform,
  reportContent,
  runtime,
}: {
  fallback: ReactNode;
  framework: Framework;
  includePath: string;
  platform: string;
  reportContent: FrameworkContextValue['reportContent'];
  runtime: string;
}) {
  const url = platformContentUrl(platform, runtime, framework.key, includePath);
  const [payload, setPayload] = useState<PlatformContentPayload | null>(null);
  const [error, setError] = useState(false);
  const codeContext = useContext(CodeContext);
  const changedRef = useRef<HTMLDivElement>(null);
  const targetId = `framework-content-${includePath.replace(/\//g, '-')}`;

  useEffect(() => {
    if (error) {
      reportContent(includePath, {state: 'unchanged'});
    } else if (!payload) {
      reportContent(includePath, {state: 'loading'});
    } else if (!payload.changed || !changedRef.current) {
      reportContent(includePath, {state: 'unchanged'});
    } else {
      reportContent(includePath, {
        state: 'changed',
        step: stepTitle(changedRef.current),
        targetId,
      });
    }
  }, [error, includePath, payload, reportContent, targetId]);

  useEffect(() => () => reportContent(includePath, null), [includePath, reportContent]);

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

  if (error || payload?.changed === false) {
    return fallback;
  }

  if (!payload || !mdx) {
    return (
      <div aria-busy="true" className="opacity-50 transition-opacity">
        {fallback}
      </div>
    );
  }

  return (
    <div key={url} ref={changedRef} id={targetId} className={frameworkStyles.changed}>
      <p className={frameworkStyles.label}>
        <PlatformIcon
          platform={`${platform}-${framework.key}`}
          size={16}
          format="sm"
          className="!border-none !shadow-none"
        />
        For {framework.title}
      </p>
      <mdx.MDX code={payload.code} />
    </div>
  );
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
      reportContent={context.reportContent}
      runtime={context.runtime}
    />
  );
}
