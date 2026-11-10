import {CLI_INSTALL_METHODS, SENTRY_CLI_URL, setupTarget} from './shared';
import styles from './style.module.scss';

type SetupProps = {
  platformName?: string;
};

function commandLanguage(id: string) {
  return id === 'powershell' ? 'language-powershell' : 'language-bash';
}

/**
 * Semantic copy of the CLI setup card. The interactive card is omitted from
 * markdown exports, so this block is what those pages include instead.
 */
export function CliSetupMarkdown({platformName}: SetupProps) {
  return (
    <div className={styles.mdOnly} aria-hidden="true">
      <h2>Set up with Sentry CLI</h2>
      <p>
        Set up {setupTarget(platformName)} with the Sentry CLI. Install the CLI with one
        of these commands, then follow the Sentry CLI docs to finish setup.
      </p>
      {CLI_INSTALL_METHODS.map(method => (
        <div key={method.id}>
          <p>
            <strong>{method.label}</strong>
          </p>
          <pre>
            <code className={commandLanguage(method.id)}>{method.command}</code>
          </pre>
        </div>
      ))}
      <p>
        <a href={SENTRY_CLI_URL}>Learn more about the Sentry CLI</a>
      </p>
    </div>
  );
}

type InstructionProps = {
  title: string;
  prompt: string;
  description: string;
};

/** Semantic copy of a custom instruction prompt, included in markdown exports. */
export function InstructionMarkdown({title, prompt, description}: InstructionProps) {
  return (
    <div className={styles.mdOnly} aria-hidden="true">
      <h2>{title}</h2>
      <p>{prompt}</p>
      <p>{description}</p>
    </div>
  );
}
