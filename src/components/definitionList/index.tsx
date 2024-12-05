import styles from './styles.module.scss';

export function DefinitionList({children}: {children: React.ReactNode}) {
  return <div className={styles['large-definition-list']}>{children}</div>;
}
