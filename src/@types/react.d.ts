// React 19 compatibility types
declare global {
  namespace JSX {
    interface Element {
      key: any;
      props: any;
      type: any;
    }
    interface ElementClass {
      render(): any;
    }
    interface ElementAttributesProperty { 
      props: {}; 
    }
    interface ElementChildrenAttribute { 
      children: {}; 
    }
    interface IntrinsicAttributes { 
      key?: string | number | null | undefined;
    }
    interface IntrinsicClassAttributes<_T> { 
      ref?: any;
    }
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

export {};