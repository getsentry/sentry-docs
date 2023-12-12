import {createContext} from 'react';

type PageContextType = {
  [key: string]: any;
};

export const PageContext = createContext<null | PageContextType>(null);

export default PageContext;
