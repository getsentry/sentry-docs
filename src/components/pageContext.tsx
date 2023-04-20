import React from 'react';

type PageContextType = {
  [key: string]: any;
};

export const PageContext = React.createContext<null | PageContextType>(null);

export default PageContext;
