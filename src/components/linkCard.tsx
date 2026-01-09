import Link from 'next/link';

export function LinkCard({
  href,
  icon,
  title,
  description,
  className = '',
}: {
  href: string;
  icon: string;
  title: string;
  description: string;
  className?: string;
}) {
  return (
    <Link href={href} className={`no-underline ${className}`}>
      <div className="flex flex-col md:flex-row shadow dark:bg-[var(--gray-4)] p-6 rounded gap-4 h-full text-[var(--foreground)]">
        <span className="text-4xl flex-shrink-0">{icon}</span>
        <div className="flex flex-col justify-center space-y-2">
          <h3 className="text-xl font-medium m-0">{title}</h3>
          <p className="text-[length:--font-size-3] m-0">{description}</p>
        </div>
      </div>
    </Link>
  );
}

export function LinkCardGrid({children}: {children: React.ReactNode}) {
  return <div className="flex flex-wrap gap-6 not-prose mt-8">{children}</div>;
}
