import { useEffect, useState } from "react";

function useLocalStorageState<T>(
  key: string,
  initialValue: T,
): [T, (value: T) => void] {
  // Retrieve the value from localStorage or use the initial value
  const [state, setState] = useState<T>(() => {
    try {
      const storedValue = localStorage.getItem(key);
      return storedValue !== null
        ? (JSON.parse(storedValue) as T)
        : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Update localStorage whenever the state changes
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, state]);

  return [state, setState];
}

export default useLocalStorageState;
