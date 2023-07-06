import React, {useContext} from 'react';
import {useLocation} from '@reach/router';
import {graphql, StaticQuery} from 'gatsby';

import {CodeContext} from './codeContext';
import {ExternalLink} from './externalLink';
import {Note} from './note';

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

  const {codeKeywords} = useContext(CodeContext);

  const user = codeKeywords.USER;

  // This means the user is signed in
  if (user) {
    return null;
  }

  return (
    <StaticQuery
      query={siteMetaQuery}
      render={data => {
        const url = data.site.siteMetadata.siteUrl + location.pathname;
        return (
          <Note>
            The following code sample will let you choose your personal config from the
            dropdown, once you're{' '}
            <ExternalLink
              href={`https://sentry.io/auth/login/?nextUri=${url}`}
              target="_blank"
            >
              logged in
            </ExternalLink>
            .
          </Note>
        );
      }}
    />
  );
}
