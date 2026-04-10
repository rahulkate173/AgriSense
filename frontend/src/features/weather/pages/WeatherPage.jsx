import { Suspense, lazy, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import useWeather from '../hooks/useWeather';
import CurrentWeather from '../components/CurrentWeather';
import ForecastList from '../components/ForecastList';
import LoadingSkeleton from '../components/LoadingSkeleton';
import ErrorBoundary from '../components/ErrorBoundary';
import '../styles/weather.css';

// Lazy load the map for performance
const WeatherMap = lazy(() => import('../components/WeatherMap'));

// --- Dynamic gradient themes using AgriSense Home Palette ---
const GRADIENTS = {
  Clear_day: 'linear-gradient(135deg, #7ab367 0%, #4a7c3f 50%, #485421 100%)', // Vibrant Green/Olive
  Clear_night: 'linear-gradient(135deg, #1a2510 0%, #2d3614 50%, #1e2810 100%)', // Dark Olive
  Clouds: 'linear-gradient(135deg, #485421 0%, #2d3614 50%, #1a2510 100%)', // Olive to Dark
  Rain: 'linear-gradient(135deg, #2a9d8f 0%, #3a6bc4 50%, #1a2510 100%)', // Teal/Blue to Dark Olive
  Drizzle: 'linear-gradient(135deg, #2a9d8f 0%, #7ab367 50%, #4a7c3f 100%)', // Teal/Green
  Thunderstorm: 'linear-gradient(135deg, #1a2510 0%, #7c5cbf 50%, #2d3614 100%)', // Dark Olive/Purple
  Snow: 'linear-gradient(135deg, #f2ede4 0%, #7ab367 50%, #2a9d8f 100%)', // Cream to Teal
  Mist: 'linear-gradient(135deg, #a89c8a 0%, #6b6b57 50%, #485421 100%)', // Muted earthy
  Fog: 'linear-gradient(135deg, #a89c8a 0%, #6b6b57 50%, #485421 100%)',
  Haze: 'linear-gradient(135deg, #e07a2c 0%, #8b5e3c 50%, #485421 100%)', // Amber to Olive
  Night: 'linear-gradient(135deg, #1a2510 0%, #2d3614 50%, #1e2810 100%)',
  Default: 'linear-gradient(135deg, #2d3614 0%, #485421 50%, #1a2510 100%)', // Olive-Deep to Dark
};

const getGradient = (weatherMain, icon) => {
  const isNight = icon?.endsWith('n');
  if (isNight && weatherMain === 'Clear') return GRADIENTS.Clear_night;
  if (isNight) return GRADIENTS.Night;
  return GRADIENTS[weatherMain] || GRADIENTS.Default;
};

const getParticleColor = (weatherMain) => {
  const map = {
    Clear: '#e07a2c', // Amber
    Clouds: '#a89c8a', // Muted text
    Rain: '#2a9d8f', // Teal
    Drizzle: '#7ab367', // Light green
    Thunderstorm: '#7c5cbf', // Purple
    Snow: '#f2ede4', // Cream
    Default: '#8b5e3c', // Brown
  };
  return map[weatherMain] || map.Default;
};

// Floating particle animation component
const Particles = ({ color }) => {
  const particles = Array.from({ length: 12 });
  return (
    <div className="particles-container" aria-hidden="true">
      {particles.map((_, i) => (
        <motion.div
          key={i}
          className="particle"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            background: color,
            width: `${Math.random() * 4 + 2}px`,
            height: `${Math.random() * 4 + 2}px`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.3, 0.8, 0.3],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: Math.random() * 4 + 3,
            repeat: Infinity,
            delay: Math.random() * 4,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
};

const WeatherPage = () => {
  const { weatherData, locationName, loading, error, isOffline, fromCache, coords, updateLocation, refresh } =
    useWeather();
  const { t } = useTranslation();

  const [mapError, setMapError] = useState(null);

  const handleMapError = useCallback((msg) => setMapError(msg), []);

  const currentWeather = weatherData?.current;
  const gradient = currentWeather
    ? getGradient(currentWeather.main, currentWeather.icon)
    : GRADIENTS.Default;
  const particleColor = getParticleColor(currentWeather?.main);

  return (
    <motion.div
      className="weather-page"
      style={{ background: gradient }}
      animate={{ background: gradient }}
      transition={{ duration: 1.5, ease: 'easeInOut' }}
    >
      {/* Floating Particles */}
      <Particles color={particleColor} />

      {/* Background Glow Orbs */}
      <div className="glow-orb glow-orb-1" aria-hidden="true" />
      <div className="glow-orb glow-orb-2" aria-hidden="true" />

      {/* Header */}
      <header className="weather-header">
        <motion.div
          className="weather-logo"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <svg width="36" height="36" viewBox="0 0 32 32" fill="none" className="logo-icon">
            <circle cx="16" cy="16" r="15" stroke="#7ab367" strokeWidth="1.5"/>
            <path d="M16 26 C16 26, 8 20, 8 13 C8 9, 11.5 6, 16 6 C20.5 6, 24 9, 24 13 C24 20, 16 26, 16 26Z" fill="#7ab367" opacity="0.3"/>
            <path d="M16 8 L16 22" stroke="#7ab367" strokeWidth="1.2"/>
            <path d="M16 12 C16 12, 19 10, 21 12" stroke="#7ab367" strokeWidth="1.2" strokeLinecap="round"/>
            <path d="M16 16 C16 16, 13 14, 11 16" stroke="#7ab367" strokeWidth="1.2" strokeLinecap="round"/>
          </svg>
          <div>
            <h1 className="logo-title">{t('weatherTitle')}</h1>
            <p className="logo-subtitle">{t('weatherSub')}</p>
          </div>
        </motion.div>

        <motion.a
          href="/"
          className="back-btn"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          ← Home
        </motion.a>
      </header>

      {/* Sticky Map Section */}
      <section className="map-section" aria-label="Interactive weather map">
        <Suspense
          fallback={
            <div className="map-placeholder glass-card">
              <div className="map-loading-spinner">
                <div className="spinner-ring" />
                <p>{t('weatherLoadingMap')}</p>
              </div>
            </div>
          }
        >
          <WeatherMap
            lat={coords.lat}
            lon={coords.lon}
            onLocationSelect={updateLocation}
            onError={handleMapError}
          />
        </Suspense>

        {/* Map error toast */}
        <AnimatePresence>
          {mapError && (
            <motion.div
              className="map-error-toast"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
            >
              ⚠️ {mapError}
              <button onClick={() => setMapError(null)} className="toast-close">✕</button>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Weather Data Section */}
      <section className="weather-data-section">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div key="loading" exit={{ opacity: 0 }}>
              <LoadingSkeleton />
            </motion.div>
          ) : error ? (
            <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <ErrorBoundary error={error} onRetry={refresh} />
            </motion.div>
          ) : (
            <motion.div
              key="data"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <CurrentWeather
                data={weatherData}
                locationName={locationName}
                isOffline={isOffline}
                fromCache={fromCache}
              />
              <ForecastList forecast={weatherData?.forecast} />
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Footer */}
      <footer className="weather-footer">
        <p>
          {t('weatherPoweredBy')}{' '}
          <a href="https://openweathermap.org" target="_blank" rel="noreferrer">
            OpenWeather
          </a>{' '}
          &{' '}
          <a href="https://www.windy.com" target="_blank" rel="noreferrer">
            Windy
          </a>
        </p>
      </footer>
    </motion.div>
  );
};

export default WeatherPage;
