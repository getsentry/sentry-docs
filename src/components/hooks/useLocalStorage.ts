import {useState} from 'react';

type Callback<T> = (value: T) => T;

function useLocalStorage<T>(
  key: string,
  defaultValue: T
): [T, (value: T | Callback<T>) => void] {
  const storage = typeof window !== 'undefined' && window.localStorage;
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (!storage) {
      return defaultValue;
    }
    try {
      const item = storage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      // return defaultValue on error
      return defaultValue;
    }
  });

  const setValue = (value: T | Callback<T>) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      storage && storage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  };

  return [storedValue, setValue];
}

export default useLocalStorage;
