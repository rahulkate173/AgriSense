/**
 * useOfflineCache — simple localStorage cache with TTL support
 */
const CACHE_PREFIX = 'agrisense_cache_';

const useOfflineCache = (key, ttlMs = 10 * 60 * 1000) => {
  const fullKey = `${CACHE_PREFIX}${key}`;

  const get = () => {
    try {
      const raw = localStorage.getItem(fullKey);
      if (!raw) return null;
      const { data, timestamp } = JSON.parse(raw);
      if (Date.now() - timestamp < ttlMs) return data;
      localStorage.removeItem(fullKey);
      return null;
    } catch {
      return null;
    }
  };

  const set = (data) => {
    try {
      localStorage.setItem(fullKey, JSON.stringify({ data, timestamp: Date.now() }));
    } catch {
      // Storage full — clear old entries
      try {
        Object.keys(localStorage)
          .filter((k) => k.startsWith(CACHE_PREFIX))
          .forEach((k) => localStorage.removeItem(k));
        localStorage.setItem(fullKey, JSON.stringify({ data, timestamp: Date.now() }));
      } catch {
        // Give up silently
      }
    }
  };

  const clear = () => {
    try {
      localStorage.removeItem(fullKey);
    } catch {
      // Silently fail
    }
  };

  return { get, set, clear };
};

export default useOfflineCache;
