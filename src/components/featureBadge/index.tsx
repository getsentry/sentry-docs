import styles from './style.module.scss';

type BadgeType = 'new' | 'beta';
type BadgeSize = 'small' | 'default';

interface FeatureBadgeProps {
  size?: BadgeSize;
  type: BadgeType;
}

export function FeatureBadge({type, size = 'default'}: FeatureBadgeProps) {
  const label = type === 'new' ? 'NEW' : 'BETA';
  const typeClass = type === 'new' ? styles.newBadge : styles.betaBadge;
  const sizeClass = size === 'small' ? styles.small : '';

  return <span className={`${typeClass} ${sizeClass}`}>{label}</span>;
}
