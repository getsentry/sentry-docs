import styles from './style.module.scss';

type BadgeType = 'new' | 'beta' | 'early_access';
type BadgeSize = 'small' | 'default';

interface FeatureBadgeProps {
  type: BadgeType;
  size?: BadgeSize;
}

const BADGE_CONFIG: Record<BadgeType, {label: string; className: string; title?: string}> =
  {
    new: {label: 'NEW', className: styles.newBadge},
    beta: {label: 'BETA', className: styles.betaBadge},
    early_access: {
      label: 'EA',
      className: styles.eaBadge,
      title: 'Early access',
    },
  };

export function FeatureBadge({type, size = 'default'}: FeatureBadgeProps) {
  const {label, className, title} = BADGE_CONFIG[type];
  const sizeClass = size === 'small' ? styles.small : '';

  return (
    <span className={`${className} ${sizeClass}`} title={title}>
      {label}
    </span>
  );
}
