'use client';

import {useEffect} from 'react';

import {DocMetrics, PageType} from '../metrics';

type PageLoadMetricsProps = {
  pageType: PageType;
  attributes?: Record<string, any>;
};

export function PageLoadMetrics({pageType, attributes = {}}: PageLoadMetricsProps) {
  useEffect(() => {
    DocMetrics.pageLoad(pageType, attributes);
  }, [pageType, attributes]);

  return null;
}

