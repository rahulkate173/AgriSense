import { useState, useEffect, useCallback } from 'react';
import { fetchWeatherData, fetchLocationName } from '../services/weatherService';

const DEFAULT_LAT = 18.5204; // Pune, India
const DEFAULT_LON = 73.8567;

const useWeather = (initialLat = DEFAULT_LAT, initialLon = DEFAULT_LON) => {
  const [coords, setCoords] = useState({ lat: initialLat, lon: initialLon });
  const [weatherData, setWeatherData] = useState(null);
  const [locationName, setLocationName] = useState('Pune, Maharashtra, IN');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOffline, setIsOffline] = useState(false);
  const [fromCache, setFromCache] = useState(false);

  const loadWeather = useCallback(async (lat, lon) => {
    setLoading(true);
    setError(null);

    try {
      const [data, name] = await Promise.all([
        fetchWeatherData(lat, lon),
        fetchLocationName(lat, lon),
      ]);

      setWeatherData(data);
      setLocationName(name);
      setFromCache(data.fromCache || false);
      setIsOffline(data.offline || false);
    } catch (err) {
      console.error('Weather fetch failed:', err);
      setError(
        err.response?.status === 401
          ? 'Invalid API key. Please check your OpenWeather API key.'
          : err.response?.status === 429
          ? 'Too many requests. Please wait a moment and try again.'
          : 'Failed to load weather data. Check your internet connection.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    loadWeather(coords.lat, coords.lon);
  }, [coords.lat, coords.lon, loadWeather]);

  const updateLocation = useCallback((lat, lon) => {
    setCoords({ lat, lon });
  }, []);

  const refresh = useCallback(() => {
    loadWeather(coords.lat, coords.lon);
  }, [coords, loadWeather]);

  return {
    weatherData,
    locationName,
    loading,
    error,
    isOffline,
    fromCache,
    coords,
    updateLocation,
    refresh,
  };
};

export default useWeather;
