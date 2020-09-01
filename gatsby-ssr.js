import React from "react";
import { PageContextProvider } from "~src/components/pageContext";

export const wrapPageElement = ({ element, props: { pageContext } }) => (
  <PageContextProvider value={pageContext}>{element}</PageContextProvider>
);
