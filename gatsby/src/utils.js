import { useEffect, useCallback, useRef } from "react";

export function useOnClickOutside(ref, handler) {
  useEffect(() => {
    const cb = event => {
      if (!ref.current || !ref.current.contains(event.target)) {
        handler(event);
      }
    };
    document.addEventListener("click", cb);
    return () => {
      document.removeEventListener("click", cb);
    };
  }, [ref, handler]);
}

export function useRefWithCallback(callback) {
  const ref = useRef();
  const setRef = useCallback(
    node => {
      let old = ref.current;
      ref.current = node;
      callback(node, old);
    },
    [callback]
  );
  return [ref, setRef];
}

export const sortBy = (arr, comp) => {
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
