import React, {Fragment, useContext} from 'react';

import {CodeContext} from './codeContext';

export function SignedInCheck({
  children,
  isUserAuthenticated,
}: {
  children: React.ReactNode;
  isUserAuthenticated: boolean;
}) {
  const {codeKeywords, status} = useContext(CodeContext);

  // Never render until loaded
  if (status !== 'loaded') {
    return null;
  }

  const user = codeKeywords.USER;

  const hasUser = !!user;
  if (hasUser !== isUserAuthenticated) {
    return null;
  }

  return <Fragment>{children}</Fragment>;
}
