import React from 'react';
import {useLocation} from '@reach/router';
import {graphql, StaticQuery} from 'gatsby';

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

export function SignInNote(): JSX.Element {
  const location = useLocation();

  return (
    <SignedInCheck isUserAuthenticated={false}>
      <StaticQuery
        query={siteMetaQuery}
        render={data => {
          const url = data.site.siteMetadata.siteUrl + location.pathname;
          return (
            <Note>
              The following code sample will let you choose your personal config from the
              dropdown, once you're{' '}
              <ExternalLink href={`https://sentry.io/auth/login/?next=${url}`}>
                logged in
              </ExternalLink>
              .
            </Note>
          );
        }}
      />
    </SignedInCheck>
  );
}
