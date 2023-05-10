import React from 'react';

import Layout from '../components/layout';
import SEO from '../components/seo';
import {getCurrentTransaction} from '../utils';

function NotFoundPage() {
  const tx = getCurrentTransaction();
  if (tx) {
    tx.setStatus('not_found');
  }

  return (
    <Layout>
      <SEO
        title="Page Not Found"
        description="We couldn’t find the page you were looking for."
      />
      <h1>Page Not Found</h1>
      <p>We couldn&apos;t find the page you were looking for.</p>
    </Layout>
  );
}

export default NotFoundPage;
