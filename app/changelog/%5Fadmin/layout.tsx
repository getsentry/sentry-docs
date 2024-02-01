import {type ReactNode} from 'react';

export default function Layout({children}: {children: ReactNode}) {
  return (
    <div className="relative min-h-[calc(100vh-8rem)] w-full mx-auto grid grid-cols-12 bg-gray-200 pt-16">
      {children}
    </div>
  );
}
