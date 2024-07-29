'use client';

import type {PropsWithChildren} from 'react';

export default function Confirm({
  action,
  changelog,
  children,
}: PropsWithChildren<{
  action: (formData: FormData) => Promise<void | {
    message: string;
  }>;
  changelog: {id: string};
}>) {
  return (
    <form
      action={action}
      className="inline-block"
      onSubmit={e => {
        e.preventDefault();
        // eslint-disable-next-line no-alert
        if (confirm('Are you sure?')) {
          action(new FormData(e.currentTarget));
        }
      }}
    >
      <input type="hidden" name="id" value={changelog.id} />
      <button
        type="submit"
        className="text-indigo-600 hover:bg-indigo-100 rounded-md px-1 py-2 text-xs whitespace-nowrap"
      >
        {children}
      </button>
    </form>
  );
}
