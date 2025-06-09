// Utility types for React 19 compatibility

// Fix RefObject null handling
declare module 'react' {
  interface RefObject<T> {
    readonly current: T | null;
  }
}

// Helper types for component props
type ReactElementProps = {
  [key: string]: any;
  children?: React.ReactNode;
  className?: string;
};

// Fix cloneElement typing for React 19
declare global {
  namespace React {
    function cloneElement<P extends ReactElementProps>(
      element: ReactElement<P>,
      props?: Partial<P> & Attributes,
      ...children: ReactNode[]
    ): ReactElement<P>;
  }
}

export {};