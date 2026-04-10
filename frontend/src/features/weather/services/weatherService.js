import axios from 'axios';

const WEATHER_API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org';
const CACHE_KEY = 'agrisense_weather_cache';
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

// ------ Cache Helpers ------
const cacheKey = (lat, lon) => `${CACHE_KEY}_${lat.toFixed(2)}_${lon.toFixed(2)}`;

const getCache = (lat, lon) => {
  try {
    const raw = localStorage.getItem(cacheKey(lat, lon));
    if (!raw) return null;
    const { data, timestamp } = JSON.parse(raw);
    if (Date.now() - timestamp < CACHE_TTL) return data;
    return null;
  } catch {
    return null;
  }
};

const setCache = (lat, lon, data) => {
  try {
    localStorage.setItem(cacheKey(lat, lon), JSON.stringify({ data, timestamp: Date.now() }));
  } catch {
    // Storage full — clear old weather entries and retry
    try {
      Object.keys(localStorage)
        .filter((k) => k.startsWith(CACHE_KEY))
        .forEach((k) => localStorage.removeItem(k));
      localStorage.setItem(cacheKey(lat, lon), JSON.stringify({ data, timestamp: Date.now() }));
    } catch { /* give up silently */ }
  }
};

const getLastCache = () => {
  try {
    const keys = Object.keys(localStorage).filter((k) => k.startsWith(CACHE_KEY));
    if (!keys.length) return null;
    const entries = keys.map((k) => JSON.parse(localStorage.getItem(k)));
    entries.sort((a, b) => b.timestamp - a.timestamp);
    return entries[0]?.data ?? null;
  } catch {
    return null;
  }
};

// ------ Main fetch (free tier: /data/2.5) ------
export const fetchWeatherData = async (lat, lon) => {
  // Serve from cache if fresh
  const cached = getCache(lat, lon);
  if (cached) return { ...cached, fromCache: true };

  try {
    const [currentRes, forecastRes] = await Promise.all([
      axios.get(`${BASE_URL}/data/2.5/weather`, {
        params: { lat, lon, appid: WEATHER_API_KEY, units: 'metric' },
      }),
      axios.get(`${BASE_URL}/data/2.5/forecast`, {
        params: { lat, lon, appid: WEATHER_API_KEY, units: 'metric', cnt: 56 },
      }),
    ]);

    const data = normalize(currentRes.data, forecastRes.data);
    setCache(lat, lon, data);
    return data;
  } catch (err) {
    // Last resort: stale offline cache
    const offline = getLastCache();
    if (offline) return { ...offline, fromCache: true, offline: true };
    throw err;
  }
};

// ------ Geocoding (reverse) ------
export const fetchLocationName = async (lat, lon) => {
  try {
    const res = await axios.get(`${BASE_URL}/geo/1.0/reverse`, {
      params: { lat, lon, limit: 1, appid: WEATHER_API_KEY },
    });
    if (res.data?.length) {
      const { name, country, state } = res.data[0];
      return state ? `${name}, ${state}, ${country}` : `${name}, ${country}`;
    }
    return `${lat.toFixed(2)}°N, ${lon.toFixed(2)}°E`;
  } catch {
    return `${lat.toFixed(2)}°N, ${lon.toFixed(2)}°E`;
  }
};

// ------ Normalize /2.5 responses ------
const normalize = (current, forecast) => {
  // Group 3-hour intervals by calendar day
  const dailyMap = {};
  forecast.list.forEach((item) => {
    const key = new Date(item.dt * 1000).toDateString();
    if (!dailyMap[key]) dailyMap[key] = [];
    dailyMap[key].push(item);
  });

  const days = Object.values(dailyMap).slice(0, 7).map((items) => {
    const temps  = items.map((i) => i.main.temp);
    // Pick the midday reading (closest to 12:00) for representative condition
    const noon   = items.find((i) => new Date(i.dt * 1000).getHours() >= 11) || items[0];
    return {
      dt:          noon.dt,
      dayName:     getDayName(noon.dt),
      tempMax:     Math.round(Math.max(...temps)),
      tempMin:     Math.round(Math.min(...temps)),
      humidity:    noon.main.humidity,
      windSpeed:   Math.round((noon.wind?.speed || 0) * 3.6), // m/s → km/h
      description: noon.weather[0].description,
      icon:        noon.weather[0].icon,
      main:        noon.weather[0].main,
      pop:         Math.round((noon.pop || 0) * 100),
    };
  });

  return {
    current: {
      temp:        Math.round(current.main.temp),
      feelsLike:   Math.round(current.main.feels_like),
      humidity:    current.main.humidity,
      windSpeed:   Math.round((current.wind?.speed || 0) * 3.6),
      description: current.weather[0].description,
      icon:        current.weather[0].icon,
      main:        current.weather[0].main,
      dt:          current.dt,
      sunrise:     current.sys?.sunrise,
      sunset:      current.sys?.sunset,
      uvi:         null, // Not available on free tier
    },
    forecast: days,
    timezone: current.timezone,
  };
};

const getDayName = (dt) => {
  const date     = new Date(dt * 1000);
  const today    = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  if (date.toDateString() === today.toDateString())    return 'Today';
  if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
  return ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'][date.getDay()];
};
