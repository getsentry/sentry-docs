import React from "react";

type PageContext = {
  [key: string]: any;
};

export const PageContext = React.createContext<null | PageContext>(null);

export default PageContext;
