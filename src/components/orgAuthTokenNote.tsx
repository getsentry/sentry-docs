import React, {Fragment} from 'react';
import {useLocation} from '@reach/router';
import {graphql, useStaticQuery} from 'gatsby';

import {Alert} from './alert';
import {ExternalLink} from './externalLink';
import {Note} from './note';
import {SignedInCheck} from './signedInCheck';

const siteMetaQuery = graphql`
  query SignInNoteQuery {
    site {
      siteMetadata {
        siteUrl
      }
    }
  }
`;

export function OrgAuthTokenNote() {
  const location = useLocation();
  const data = useStaticQuery(siteMetaQuery);

  const url = data.site.siteMetadata.siteUrl + location.pathname;

  return (
    <Fragment>
      <SignedInCheck isUserAuthenticated={false}>
        <Note>
          You can{' '}
          <ExternalLink href="https://sentry.io/settings/auth-tokens/" target="_blank">
            manually create an Auth Token
          </ExternalLink>{' '}
          or{' '}
          <ExternalLink href={`https://sentry.io/auth/login/?next=${url}`}>
            sign in
          </ExternalLink>{' '}
          to create a token directly from the docs.
        </Note>
      </SignedInCheck>

      <SignedInCheck isUserAuthenticated>
        <Alert level="warning">
          A created token will only be visible once right after creation - make sure to
          copy it!
        </Alert>
      </SignedInCheck>
    </Fragment>
  );
}
