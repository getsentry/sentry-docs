'use client';

import {ReadonlyURLSearchParams, usePathname, useSearchParams} from 'next/navigation';

export default function Tags({months}: {months: any}) {
  const pathname = usePathname();
  const searchParams = useSearchParams() as ReadonlyURLSearchParams;

  const params = new URLSearchParams(searchParams);
  const before = searchParams.get('before') || '';

  const createPageURL = (month: string) => {
    if (month === before) {
      params.delete('before');
    } else {
      params.set('before', month);
    }
    params.set('page', '1');

    return `${pathname}?${params.toString()}`;
  };

  return (
    <ul>
      {months.map((month, index) => (
        <li key={index}>
          <a
            className={`text-primary hover:text-purple-900 hover:font-extrabold ${before === month ? 'underline' : ''}`}
            href={createPageURL(month)}
          >
            {month}
          </a>
        </li>
      ))}
    </ul>
  );
}
