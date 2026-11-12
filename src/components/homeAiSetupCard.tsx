import {Fragment} from 'react';

import {CliSetupMarkdown} from './agentSetupCallout/markdown';
import {SENTRY_CLI_URL} from './agentSetupCallout/shared';
import {CliInstallCommand} from './cliInstallCommand';
import {ExternalLink} from './externalLink';
import styles from './home.module.scss';

export function HomeAiSetupCard() {
  return (
    <Fragment>
      <div className={`${styles.setupCard} ${styles.agentHeader}`} data-mdast="ignore">
        <div className={styles.setupIcon}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M12 2l1.9 4.6L18.5 8.5 13.9 10.4 12 15l-1.9-4.6L5.5 8.5l4.6-1.9L12 2z" />
            <path d="M18.5 13.5l.95 2.3 2.3.95-2.3.95-.95 2.3-.95-2.3-2.3-.95 2.3-.95.95-2.3z" />
          </svg>
        </div>
        <h2 className={styles.setupTitle}>Set up with Sentry CLI</h2>
        <div className={styles.cliInstall}>
          <CliInstallCommand source="homepage_card" />
        </div>
        <div className={styles.setupRowCopy}>
          <p className={styles.setupDesc}>
            <ExternalLink href={SENTRY_CLI_URL} className={styles.seeAllLink}>
              Learn more about the Sentry CLI
            </ExternalLink>
          </p>
        </div>
      </div>
      <CliSetupMarkdown />
    </Fragment>
  );
}
