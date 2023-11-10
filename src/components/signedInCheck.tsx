import React, {Fragment, useContext} from 'react';

import {CodeContext} from './codeContext';

/**
 * This component checks if the user is signed in at sentry.io or not.
 * If the signed in status matches the given `isUserAuthenticated`,
 * we render the children, else nothing.
 *
 * Example usage:
 * <SignedInCheck isUserAuthenticated={false}>
 *   <div>Only render this if the user is not signed in</div>
 * </SignedInCheck>
 */
export function SignedInCheck({
  children,
  isUserAuthenticated,
}: {
  children: React.ReactNode;
  isUserAuthenticated: boolean;
}) {
  const codeContext = useContext(CodeContext);

  if (!codeContext) {
    return null;
  }

  // Never render until loaded
  if (codeContext.isLoading) {
    return null;
  }

  const user = codeContext.codeKeywords.USER;

  const hasUser = !!user;
  if (hasUser !== isUserAuthenticated) {
    return null;
  }

  return <Fragment>{children}</Fragment>;
}
