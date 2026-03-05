import Link from 'next/link';

export function LinkCard({
  href,
  icon,
  iconSrc,
  title,
  description,
  className = '',
}: {
  description: string;
  href: string;
  title: string;
  className?: string;
  icon?: string;
  iconSrc?: string;
}) {
  return (
    <Link href={href} className={`no-underline ${className}`}>
      <div className="flex flex-col shadow dark:bg-[var(--gray-4)] p-6 rounded gap-4 h-full text-[var(--foreground)]">
        <div className="flex flex-row items-center gap-4">
          <span className="text-4xl flex-shrink-0 flex items-center justify-center w-12 h-12 !border-0 !shadow-none !outline-none !ring-0">
            {iconSrc ? (
              <img
                src={iconSrc}
                alt=""
                className="w-10 h-10 dark:invert !border-0 !shadow-none !outline-none !ring-0"
                style={{border: 'none', outline: 'none', boxShadow: 'none'}}
              />
            ) : (
              icon
            )}
          </span>
          <h3 className="text-xl font-medium m-0">{title}</h3>
        </div>
        <p className="text-[length:--font-size-3] m-0">{description}</p>
      </div>
    </Link>
  );
}

export function LinkCardGrid({children}: {children: React.ReactNode}) {
  return <div className="flex flex-wrap gap-6 not-prose mt-8">{children}</div>;
}
