import { useState, useEffect } from 'react';

/**
 * Returns a debounced version of the given value.
 * @param {any} value
 * @param {number} delay - ms
 */
export function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
