import React from "react";
import PageContext from "~src/components/pageContext";

export const wrapPageElement = ({ element, props: { pageContext } }) => (
  <PageContext.Provider value={pageContext}>{element}</PageContext.Provider>
);
