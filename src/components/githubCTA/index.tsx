import Link from 'next/link';

import {nodeForPath} from 'sentry-docs/docTree';
import {serverContext} from 'sentry-docs/serverContext';

import styles from './styles.module.css';

export function GitHubCTA() {
  const {path, rootNode} = serverContext();
  let sourceUrl = 'https://github.com/getsentry/sentry-docs/';
  const pageNode = nodeForPath(rootNode, path);
  if (pageNode && pageNode.sourcePath) {
    sourceUrl += `edit/master/${pageNode.sourcePath}`;
  }

  return (
    <div className={styles.cta}>
      <small>
        <strong>Help improve this content</strong>
      </small>
      <br />
      <small>
        Our documentation is open source and available on GitHub. Your contributions are
        welcome, whether fixing a typo (drat!) or suggesting an update ("yeah, this would
        be better").
        <div>
          <Link href={sourceUrl}>Suggest an edit to this page</Link>{' '}
          &nbsp;&nbsp;|&nbsp;&nbsp;
          <Link href="/contributing/">Contribute to Docs</Link> &nbsp;&nbsp;|&nbsp;&nbsp;
          <Link href="https://github.com/getsentry/sentry-docs/issues/new/choose">
            Report a problem
          </Link>{' '}
        </div>
      </small>
    </div>
  );
}
