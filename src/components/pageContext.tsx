import React from "react";

type PageContext = {
  [key: string]: any;
};

export const PageContext = React.createContext<null | PageContext>();

type Props = {
  pageContext: PageContext;
  children: any;
};

export const PageContextProvider = ({ children, pageContext }: Props) => {
  return (
    <PageContext.Provider value={pageContext}>{children}</PageContext.Provider>
  );
};

export default PageContext;
