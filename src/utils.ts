import { useEffect, useCallback, useRef } from "react";

type ClickOutsideCallback = (event: MouseEvent) => void;

export function useOnClickOutside<T>(
  ref: React.RefObject<T>,
  handler: ClickOutsideCallback
) {
  useEffect(() => {
    const cb = (event: MouseEvent) => {
      // TODO(dcramer): fix any type here
      if (!ref.current || !(ref.current as any).contains(event.target)) {
        handler(event);
      }
    };
    document.addEventListener("click", cb);
    return () => {
      document.removeEventListener("click", cb);
    };
  }, [ref, handler]);
}

type RefCallback<T> = (node: HTMLElement, old: T) => void;

export function useRefWithCallback<T>(
  callback: RefCallback<T>
): [React.MutableRefObject<T>, (node: any) => void] {
  const ref = useRef<T>();
  const setRef = useCallback(
    node => {
      const old = ref.current;
      ref.current = node;
      callback(node, old);
    },
    [callback]
  );
  return [ref, setRef];
}

export const sortBy = (arr: any[], comp: (any) => any): any[] => {
  return arr.sort((a, b) => {
    const aComp = comp(a);
    const bComp = comp(b);
    if (aComp < bComp) {
      return -1;
    }
    if (aComp > bComp) {
      return 1;
    }
    return 0;
  });
};

type Page = {
  context: {
    title?: string;
    sidebar_order?: number;
  };
};

export const sortPages = (
  arr: any,
  extractor: (any) => Page = n => n
): any[] => {
  return arr.sort((a, b) => {
    a = extractor(a);
    b = extractor(b);
    const aso = a.context.sidebar_order ?? 10;
    const bso = b.context.sidebar_order ?? 10;
    if (aso > bso) return 1;
    else if (bso > aso) return -1;
    return a.context.title.localeCompare(b.context.title);
  });
};
