import React from "react";
import * as Sentry from "@sentry/gatsby";

import Layout from "../components/layout";
import SEO from "../components/seo";

const NotFoundPage = () => {
  const tx = Sentry.getCurrentHub()
    .getScope()
    .getTransaction();
  if (tx) {
    tx.setStatus("not_found");
  }

  return (
    <Layout>
      <SEO title="Page Not Found" />
      <h1>Page Not Found</h1>
      <p>We couldn't find the page you were looking for.</p>
    </Layout>
  );
};

export default NotFoundPage;
