import React, {Fragment} from 'react';

import {FeedbackModal} from './feedback/feedbackModal';
import {SmartLink} from './smartLink';

type GitHubCTAProps = {
  relativePath: string;
  sourceInstanceName: string;
};

export function GitHubCTA({sourceInstanceName, relativePath}: GitHubCTAProps) {
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
          <FeedbackModal title="Report a Problem">
            {({showModal}) => (
              <Fragment>
                <SmartLink
                  to="https://github.com/getsentry/sentry-docs/issues/new/choose"
                  onClick={e => {
                    if (!window.Sentry?.getCurrentHub?.()) {
                      return true;
                    }

                    // Only Stop event propagation if Sentry SDK is loaded
                    // (i.e. feedback is supported), otherwise will send you to github
                    e.preventDefault();
                    showModal();
                    return false;
                  }}
                >
                  Report a problem
                </SmartLink>{' '}
              </Fragment>
            )}
          </FeedbackModal>
        </div>
      </small>
    </div>
  );
}
