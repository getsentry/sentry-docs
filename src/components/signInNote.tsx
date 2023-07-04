import React from 'react';
import {useLocation} from '@reach/router';

import {ExternalLink} from './externalLink';
import {Note} from './note';

export function SignInNote(): JSX.Element {
  const location = useLocation();

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
