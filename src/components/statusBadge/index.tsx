type StatusType = 'yes' | 'no';

interface StatusBadgeProps {
  type: StatusType;
}

const STATUS_BADGE_CONFIG: Record<StatusType, {className: string, label: string;}> = {
  yes: {
    label: 'Yes',
    className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  },
  no: {
    label: 'No',
    className: 'bg-[#fee2e2] text-[#991b1b] dark:bg-[#7f1d1d]/50 dark:text-[#fca5a5]',
  },
};

export function StatusBadge({type}: StatusBadgeProps) {
  const {label, className} = STATUS_BADGE_CONFIG[type];

  return (
    <span
      className={`inline-block align-middle text-xs font-medium px-2 py-[0.1875rem] leading-none rounded mr-2 ${className}`}
    >
      {label}
    </span>
  );
}
