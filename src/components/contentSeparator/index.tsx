/**
 * Component: ContentSeparator
 *
 * A labeled horizontal divider with the message centered between two lines.
 * Useful for visually separating groups of content within a page.
 *
 * Props overview
 * - message: string — text shown in the label (required)
 * - variant: 'neutral' | 'info' | 'warning' | 'success' | 'danger' (default 'info')
 * - marginTopRem, marginBottomRem: control vertical spacing (defaults 2 / 1)
 *
 * Usage
 * <ContentSeparator message="Advanced configuration" />
 */
type Props = {
  /** The message displayed in the center label. */
  message: string;
  /** Extra spacing below (in rem). Default: 1. */
  marginBottomRem?: number;
  /** Extra spacing above (in rem). Default: 2. */
  marginTopRem?: number;
  /** Optional visual style; default 'info'. */
  variant?: 'neutral' | 'info' | 'warning' | 'success' | 'danger';
};

import styles from './style.module.scss';

/**
 * ContentSeparator
 *
 * A labeled horizontal separator that sits between content blocks.
 * Example:
 * <ContentSeparator message="Advanced configuration" />
 */
export function ContentSeparator({
  message,
  variant = 'info',
  marginTopRem = 2,
  marginBottomRem = 1,
}: Props) {
  return (
    <section
      className={styles.wrapper}
      style={{marginTop: `${marginTopRem}rem`, marginBottom: `${marginBottomRem}rem`}}
    >
      <div className={styles.separator} role="separator" aria-label={message}>
        <span className={styles.line} aria-hidden="true" />
        <span className={`${styles.label} ${styles[`label--${variant}`]}`}>
          {message}
        </span>
        <span className={styles.line} aria-hidden="true" />
      </div>
    </section>
  );
}
