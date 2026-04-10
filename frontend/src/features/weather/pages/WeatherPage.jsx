import { Suspense, lazy, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import useWeather from '../hooks/useWeather';
import CurrentWeather from '../components/CurrentWeather';
import ForecastList from '../components/ForecastList';
import LoadingSkeleton from '../components/LoadingSkeleton';
import ErrorBoundary from '../components/ErrorBoundary';
import LanguageSwitcher from '../../../components/LanguageSwitcher.jsx';
import '../styles/weather.css';

// Lazy load the map for performance
const WeatherMap = lazy(() => import('../components/WeatherMap'));
const WeatherPage = () => {
  const { weatherData, locationName, loading, error, isOffline, fromCache, coords, updateLocation, refresh } =
    useWeather();
  const { t } = useTranslation();

  const [mapError, setMapError] = useState(null);

  const handleMapError = useCallback((msg) => setMapError(msg), []);

  const currentWeather = weatherData?.current;

  return (
    <motion.div
      className="weather-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{ background: '#F3EDE4' }}
    >

      {/* Header */}
      <header className="weather-header" style={{ flexWrap: 'wrap', gap: '1rem', justifyContent: 'flex-start', background: 'transparent', borderBottom: 'none' }}>
        <Link 
          to="/options" 
          className="back-btn"
          style={{ flexShrink: 0, background: '#fff', color: 'var(--olive)', border: '1px solid rgba(0,0,0,0.1)', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}
        >
          <ArrowLeft size={18} /> {t('backToHome')}
        </Link>
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
            <h1 className="logo-title" style={{ background: 'none', color: 'var(--olive)', WebkitTextFillColor: 'var(--olive)' }}>{t('weatherTitle')}</h1>
            <p className="logo-subtitle" style={{ fontSize: '0.8rem', color: '#64748b' }}>{t('weatherSub')}</p>
          </div>
        </motion.div>
        <div style={{ display: 'flex', alignItems: 'center', marginLeft: 'auto', gap: '0.8rem' }}>
          <LanguageSwitcher />
        </div>
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
