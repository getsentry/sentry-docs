import {useEffect} from 'react';

type ClickOutsideCallback = (event: MouseEvent) => void;

interface UseClickOutsideOpts<E extends HTMLElement> {
  handler: ClickOutsideCallback;
  ref: React.RefObject<E>;
  enabled?: boolean;
}

export function useOnClickOutside<E extends HTMLElement>({
  ref,
  enabled = true,
  handler,
}: UseClickOutsideOpts<E>) {
  useEffect(() => {
    const cb = (event: MouseEvent) => {
      if (!enabled) {
        return;
      }
      if (!(event.target instanceof Element)) {
        return;
      }
      if (!ref.current?.contains(event.target)) {
        handler(event);
      }
    };
    document.addEventListener('click', cb);
    return () => document.removeEventListener('click', cb);
  }, [enabled, handler, ref]);
}
