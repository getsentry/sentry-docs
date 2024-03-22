import {getCurrentPlatformOrGuide} from 'sentry-docs/docTree';
import {serverContext} from 'sentry-docs/serverContext';

import {NavbarClient} from './navbarClient';

export function Navbar() {
  const {rootNode, path} = serverContext();
  const currentPlatform = rootNode && getCurrentPlatformOrGuide(rootNode, path);

  return <NavbarClient currentPlatform={currentPlatform} />;
}
