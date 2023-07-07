import React, {Fragment, useContext} from 'react';

import {CodeContext} from './codeContext';

export function SignedInCheck({
  children,
  ifIsAuthenticated,
}: {
  children: any;
  ifIsAuthenticated: boolean;
}): JSX.Element {
  const {codeKeywords, status} = useContext(CodeContext);

  const user = codeKeywords.USER;

  // Never render until loaded
  if (status !== 'LOADED') {
    return null;
  }

  const hasUser = !!user;
  if (hasUser !== ifIsAuthenticated) {
    return null;
  }

  return <Fragment>{children}</Fragment>;
}
