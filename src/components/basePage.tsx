import React, {Fragment, useState} from 'react';

import {getCurrentTransaction} from '../utils';

import {Banner} from './banner';
import {CodeContextProvider} from './codeContext';
import {GitHubCTA} from './githubCta';
import {Layout} from './layout';
import {SEO} from './seo';
import {TableOfContents} from './tableOfContents';

export type PageContext = {
  description?: string;
  excerpt?: string;
  noindex?: boolean;
  notoc?: boolean;
  platform?: {
    name: string;
  };
  title?: string;
};

type Props = {
  children?: React.ReactNode;
  data?: {
    file?: {
      [key: string]: any;
    };
  };
  pageContext?: {
    description?: string;
    excerpt?: string;
    noindex?: boolean;
    notoc?: boolean;
    title?: string;
  };
  prependToc?: React.ReactNode;
  seoTitle?: string;
  sidebar?: React.ReactNode;
};

export function BasePage({
  data: {file} = {},
  pageContext = {},
  seoTitle,
  sidebar,
  children,
  prependToc,
}: Props) {
  const tx = getCurrentTransaction();
  if (tx) {
    tx.setStatus('ok');
  }

  const {title, excerpt, description} = pageContext;
  const hasToc = !pageContext.notoc;

  const [contentElement, setContentElement] = useState<HTMLElement | null>(null);

  const pageDescription = description || (excerpt ? excerpt.slice(0, 160) : '');

  return (
    // @ts-expect-error TODO(epurkhiser): Understand why these types are
    // totally different
    <Layout {...{sidebar, pageContext}}>
      <SEO
        title={seoTitle ?? title ?? 'Sentry Docs'}
        description={pageDescription}
        noindex={pageContext.noindex}
      />

      <div className="row">
        <div
          className={
            hasToc || prependToc ? 'col-sm-8 col-md-12 col-lg-8 col-xl-9' : 'col-12'
          }
        >
          <h1 className="mb-3">{title}</h1>
          <div id="main" ref={setContentElement}>
            <CodeContextProvider>{children}</CodeContextProvider>

            {file && (
              <GitHubCTA
                sourceInstanceName={file.sourceInstanceName}
                relativePath={file.relativePath}
              />
            )}
          </div>
        </div>
        {(hasToc || prependToc) && (
          <div className="col-sm-4 col-md-12 col-lg-4 col-xl-3">
            <div className="page-nav">
              <Banner isModule />
              <Fragment>
                {prependToc}
                {hasToc && contentElement && (
                  <TableOfContents content={contentElement} pageContext={pageContext} />
                )}
              </Fragment>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
