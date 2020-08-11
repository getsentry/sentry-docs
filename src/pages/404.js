import React from "react";

import SEO from "../components/seo";
import * as Sentry from '@sentry/browser';

const NotFoundPage = () => {
  const tx = Sentry.getCurrentHub().getScope().getTransaction();
  if (tx) {
    tx.setStatus("not_found");
  }

  return (
    <div>
      <SEO title="404: Not found" />
      <h1>NOT FOUND</h1>
      <p>You just hit a route that doesn&#39;t exist... the sadness.</p>
    </div>
  )
};

export default NotFoundPage;
