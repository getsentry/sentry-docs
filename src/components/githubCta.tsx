import React from 'react';

import SmartLink from './smartLink';

type GitHubCTAProps = {
  relativePath: string;
  sourceInstanceName: string;
};

export function GitHubCTA({
  sourceInstanceName,
  relativePath,
}: GitHubCTAProps): JSX.Element {
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
