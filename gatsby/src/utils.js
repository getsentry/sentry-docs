import { useEffect, useCallback, useRef } from "react";

export function useOnClickOutside(ref, handler) {
  useEffect(() => {
    const cb = (event) => {
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
    (node) => {
      let old = ref.current;
      ref.current = node;
      callback(node, old);
    },
    [callback]
  );
  return [ref, setRef];
}
