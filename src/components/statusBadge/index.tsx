type StatusType = 'yes' | 'no' | 'required' | 'recommended' | 'encouraged';

interface StatusBadgeProps {
  type: StatusType;
}

const STATUS_BADGE_CONFIG: Record<StatusType, {className: string; label: string}> = {
  yes: {
    label: 'Yes',
    className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  },
  no: {
    label: 'No',
    className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  },
  required: {
    label: 'Required',
    className: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  },
  recommended: {
    label: 'Recommended',
    className: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  },
  encouraged: {
    label: 'Encouraged',
    className: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
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
