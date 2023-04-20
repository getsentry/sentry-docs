import React, {useRef} from 'react';
import * as Sentry from '@sentry/gatsby';

import Banner from './banner';
import CodeContext, {useCodeContextState} from './codeContext';
import Layout from './layout';
import SEO from './seo';
import SmartLink from './smartLink';
import TableOfContents from './tableOfContents';

type GitHubCTAProps = {
  relativePath: string;
  sourceInstanceName: string;
};

function GitHubCTA({sourceInstanceName, relativePath}: GitHubCTAProps): JSX.Element {
  return (
    <div className="github-cta">
      <small>Help improve this content</small>
      <br />
      <small>
        Our documentation is open source and available on GitHub. Your contributions are
        welcome, whether fixing a typo (drat!) to suggesting an update ("yeah, this would
        be better").
        <div className="muted">
          <SmartLink
            to={`https://github.com/getsentry/sentry-docs/edit/master/src/${sourceInstanceName}/${relativePath}`}
          >
            Suggest an edit to this page
          </SmartLink>{' '}
          &nbsp;&nbsp;|&nbsp;&nbsp;
          <SmartLink to="https://docs.sentry.io/contributing/">
            Contribute to Docs
          </SmartLink>{' '}
          &nbsp;&nbsp;|&nbsp;&nbsp;
          <SmartLink to="https://github.com/getsentry/sentry-docs/issues/new/choose">
            Report a problem
          </SmartLink>{' '}
        </div>
      </small>
    </div>
  );
}

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

type WrappedTOCProps = {
  pageContext: PageContext;
};

const WrappedTOC = React.forwardRef(
  (props: WrappedTOCProps, ref: React.RefObject<HTMLDivElement>) => {
    return <TableOfContents {...props} contentRef={ref} />;
  }
);

type Props = {
  children?: JSX.Element;
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
  prependToc?: JSX.Element;
  seoTitle?: string;
  sidebar?: JSX.Element;
};

export default function BasePage({
  data: {file} = {},
  pageContext = {},
  seoTitle,
  sidebar,
  children,
  prependToc,
}: Props): JSX.Element {
  const tx = Sentry.getCurrentHub().getScope().getTransaction();
  if (tx) {
    tx.setStatus('ok');
  }

  const {title, excerpt, description} = pageContext;
  const hasToc = !pageContext.notoc;

  const contentRef = useRef<HTMLDivElement>(null);

  const pageDescription = description || (excerpt ? excerpt.slice(0, 160) : '');

  return (
    <Layout {...{sidebar, pageContext}}>
      <SEO
        title={seoTitle || title}
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
          <div id="main" ref={contentRef}>
            <CodeContext.Provider value={useCodeContextState()}>
              {children}
            </CodeContext.Provider>

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
              <React.Fragment>
                {prependToc}
                {hasToc && <WrappedTOC ref={contentRef} pageContext={pageContext} />}
              </React.Fragment>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
