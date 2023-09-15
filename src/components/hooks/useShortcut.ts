import {useEffect} from 'react';

type ShortcutConfig = {
  key: string;
  altKey?: boolean;
  ctrlKey?: boolean;
  shiftKey?: boolean;
};

export const useShortcut = (key: string | ShortcutConfig, callback: () => void) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (typeof key === 'string') {
        if (event.key === key) {
          callback();
        }
      } else {
        if (
          event.key === key.key &&
          event.shiftKey === key.shiftKey &&
          event.ctrlKey === key.ctrlKey &&
          event.altKey === key.altKey
        ) {
          callback();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [key, callback]);
};
