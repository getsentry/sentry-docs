import React, {Fragment, useContext} from 'react';

import {CodeContext} from './codeContext';

export function SignedInCheck({
  children,
  isUserAuthenticated,
}: {
  children: React.ReactNode;
  ifIsAuthenticated: boolean;
}): JSX.Element {
  const {codeKeywords, status} = useContext(CodeContext);

  // Never render until loaded
  if (status !== 'LOADED') {
    return null;
  }
  
   const user = codeKeywords.USER;

  const hasUser = !!user;
  if (hasUser !== ifIsAuthenticated) {
    return null;
  }

  return <Fragment>{children}</Fragment>;
}
