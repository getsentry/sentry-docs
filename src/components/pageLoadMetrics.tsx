'use client';

import {useEffect} from 'react';
import {usePathname} from 'next/navigation';

import {DocMetrics, PageType} from '../metrics';

type PageLoadMetricsProps = {
  pageType: PageType;
  attributes?: Record<string, any>;
};

export function PageLoadMetrics({pageType, attributes = {}}: PageLoadMetricsProps) {
  const pathname = usePathname();

  useEffect(() => {
    DocMetrics.pageLoad(pageType, {...attributes, path: pathname});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageType, pathname, JSON.stringify(attributes)]);

  return null;
}
