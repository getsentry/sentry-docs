import React, {useContext} from 'react';
import {useLocation} from '@reach/router';

import {CodeContext} from './codeContext';
import {ExternalLink} from './externalLink';
import {Note} from './note';

export function SignInNote(): JSX.Element {
  const location = useLocation();

  const {codeKeywords} = useContext(CodeContext);

  const user = codeKeywords.USER;

  // This means the user is signed in
  if (user) {
    return null;
  }

  return (
    <Note>
      The following code sample will let you chose your personal config from the dropdown,
      once you're{' '}
      <ExternalLink
        href={'https://sentry.io/auth/login/?nextUri=' + location.href}
        target=""
      >
        logged in
      </ExternalLink>
      .
    </Note>
  );
}
