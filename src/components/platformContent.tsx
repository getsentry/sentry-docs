import {useMemo} from 'react';
import {getMDXComponent} from 'sentry-docs/getMDXComponent';
import {mdxComponents} from 'sentry-docs/mdxComponents';
import {resolvePlatformContent} from 'sentry-docs/platformContentResolver';
import {serverContext} from 'sentry-docs/serverContext';

import {FrameworkContent} from './frameworkSelector';
import {Include} from './include';

type Props = {
  includePath: string;
  children?: React.ReactNode;
  fallbackPlatform?: string;
  noGuides?: boolean;
  platform?: string;
  /**
   * Allow this content to be swapped client-side for another guide's version
   * when rendered inside a `<FrameworkSelector>`.
   */
  switchable?: boolean;
};

function MDXLayoutRenderer({mdxSource: source, ...rest}) {
  const MDXLayout = useMemo(() => getMDXComponent(source), [source]);
  return <MDXLayout components={mdxComponentsWithWrapper} {...rest} />;
}

export async function PlatformContent({
  includePath,
  platform,
  noGuides,
  switchable,
}: Props) {
  const {path} = serverContext();

  const doc = await resolvePlatformContent({includePath, path, platform, noGuides});

  const content = doc ? <MDXLayoutRenderer mdxSource={doc.mdxSource} /> : null;

  if (switchable) {
    return <FrameworkContent includePath={includePath}>{content}</FrameworkContent>;
  }

  return content;
}

const mdxComponentsWithWrapper = mdxComponents({Include, PlatformContent});
