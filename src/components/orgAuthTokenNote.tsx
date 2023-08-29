import React, {Fragment, useContext} from 'react';
import {useLocation} from '@reach/router';
import {graphql, useStaticQuery} from 'gatsby';

import {Alert} from './alert';
import {CodeContext} from './codeContext';
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

  const orgAuthTokenUrl = useOrgAuthTokenUrl();

  return (
    <Fragment>
      <SignedInCheck isUserAuthenticated={false}>
        <Note>
          You can{' '}
          <ExternalLink href={orgAuthTokenUrl} target="_blank">
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
          You can{' '}
          <ExternalLink href={orgAuthTokenUrl} target="_blank">
            manually create an Auth Token
          </ExternalLink>{' '}
          or create a token directly from the docs. A created token will only be visible
          once right after creation - make sure to copy it!
        </Alert>
      </SignedInCheck>
    </Fragment>
  );
}

export function useOrgAuthTokenUrl() {
  const {codeKeywords, sharedKeywordSelection} = useContext(CodeContext);
  const [sharedSelection] = sharedKeywordSelection

  // When not signed in, we use a redirect URL that uses the last org the user visited
  if (!codeKeywords.USER) {
    return 'https://sentry.io/orgredirect/organizations/:orgslug/settings/auth-tokens/';
  }

  const choices = codeKeywords?.PROJECT;
  const currentSelectionIdx = sharedSelection.PROJECT ?? 0;
  const currentSelection = choices[currentSelectionIdx];

  const org = currentSelection.ORG_SLUG;

  return `https://sentry.io/settings/${org}/auth-tokens/`;
}
