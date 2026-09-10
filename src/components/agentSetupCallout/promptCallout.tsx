import {MouseEventHandler, ReactNode} from 'react';
import {Copy} from 'react-feather';

import styles from './style.module.scss';

type Props = {
  children?: ReactNode;
  copied: boolean;
  onCopy: MouseEventHandler<HTMLButtonElement>;
  promptPreview: string;
  title: string;
};

export function AgentPromptCallout({
  children,
  copied,
  onCopy,
  promptPreview,
  title,
}: Props) {
  return (
    <div className={styles.wrapper} data-mdast="ignore">
      <div className={styles.mainRow}>
        <div className={styles.left}>
          <span className={styles.title}>{title}</span>
        </div>
        <div className={styles.promptArea}>
          <code className={styles.promptText}>{promptPreview}</code>
        </div>
        <button className={styles.copyButton} onClick={onCopy} type="button">
          <Copy size={14} />
          {copied ? 'Copied!' : 'Copy Prompt'}
        </button>
      </div>
      {children}
    </div>
  );
}
