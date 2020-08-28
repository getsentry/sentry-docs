import { useState } from "react";

type Callback<T> = (value: T) => T;

export default <T>(
  key: string,
  defaultValue: T
): [T, (value: T | Callback<T>) => void] => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(error);
      // return defaultValue on error
      return defaultValue;
    }
  });

  const setValue = (value: T | Callback<T>) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
};
