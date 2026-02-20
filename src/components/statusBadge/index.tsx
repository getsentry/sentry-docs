import styles from './style.module.scss';

type StatusType = 'yes' | 'no';

interface StatusBadgeProps {
  type: StatusType;
}

export function StatusBadge({type}: StatusBadgeProps) {
  const label = type === 'yes' ? 'Yes' : 'No';
  const typeClass = type === 'yes' ? styles.yesBadge : styles.noBadge;

  return <span className={typeClass}>{label}</span>;
}
