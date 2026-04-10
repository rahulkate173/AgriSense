import { useState, useCallback, useRef } from 'react';

/**
 * Returns a debounced version of the callback.
 * @param {Function} fn - Function to debounce
 * @param {number} delay - Delay in milliseconds
 */
const useDebounce = (fn, delay = 300) => {
  const timerRef = useRef(null);

  const debouncedFn = useCallback(
    (...args) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        fn(...args);
      }, delay);
    },
    [fn, delay]
  );

  return debouncedFn;
};

export default useDebounce;
