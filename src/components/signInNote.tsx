import React from 'react';
import {useLocation} from '@reach/router';
import {graphql, useStaticQuery} from 'gatsby';

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

export function SignInNote() {
  const location = useLocation();
  const data = useStaticQuery(siteMetaQuery);

  const url = data.site.siteMetadata.siteUrl + location.pathname;

  return (
    <SignedInCheck isUserAuthenticated={false}>
      <Note>
        The following code sample will let you choose your personal config from the
        dropdown, once you're{' '}
        <ExternalLink href={`https://sentry.io/auth/login/?next=${url}`}>
          logged in
        </ExternalLink>
        .
      </Note>
    </SignedInCheck>
  );
}
