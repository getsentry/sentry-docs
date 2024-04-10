'use client';

import {ReactNode} from 'react';

import styles from './styles.module.scss';

type AlertProps = {
  children?: ReactNode;
  level?: 'info' | 'warning' | 'danger' | 'success' | '';
  title?: string;
};

export function Alert({title, children, level = 'info'}: AlertProps) {
  return (
    <div className={`${styles.alert} ${styles['alert-' + level]}`} role="alert">
      {title && <h5 className={styles['alert-header']}>{title}</h5>}
      <div className="alert-body content-flush-bottom">{children}</div>
    </div>
  );
}

type NoteProps = {
  children: ReactNode;
};

export function Note({children}: NoteProps) {
  return (
    <div role="note" className={styles.alert}>
      <div className={styles['alert-body']}>{children}</div>
    </div>
  );
}
