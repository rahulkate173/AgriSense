import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const getWeatherEmoji = (main) => {
  const map = {
    Clear: '☀️',
    Clouds: '⛅',
    Rain: '🌧️',
    Drizzle: '🌦️',
    Thunderstorm: '⛈️',
    Snow: '❄️',
    Mist: '🌫️',
    Fog: '🌁',
    Haze: '🌫️',
    Smoke: '🌫️',
    Dust: '🌪️',
    Sand: '🌪️',
    Tornado: '🌪️',
  };
  return map[main] || '🌡️';
};

const CurrentWeather = ({ data, locationName, isOffline, fromCache }) => {
  const { t } = useTranslation();
  if (!data) return null;

  const iconUrl = `https://openweathermap.org/img/wn/${data.current.icon}@2x.png`;
  const current = data.current;

  const formatTime = (dt) => {
    if (!dt) return '--';
    return new Date(dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const isNight = current.icon?.endsWith('n');

  return (
    <motion.div
      className="current-weather-card glass-card"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.21, 1.11, 0.81, 0.99] }}
    >
      {/* Status Badges */}
      <div className="badge-row">
        {isOffline && <span className="badge badge-offline">📴 {t('weatherOffline')}</span>}
        {fromCache && !isOffline && <span className="badge badge-cache"> {t('weatherCached')}</span>}
        {isNight && <span className="badge badge-night">🌙 {t('weatherNight')}</span>}
      </div>

      {/* Location */}
      <div className="current-location">
        <span className="location-pin">📍</span>
        <span>{locationName}</span>
      </div>

      {/* Main Temp & Icon */}
      <div className="current-main">
        <div className="current-temp-block">
          <span className="current-temp">{current.temp}°</span>
          <span className="current-unit">C</span>
        </div>
        <div className="current-icon-block">
          <img
            src={iconUrl}
            alt={current.description}
            className="current-icon"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'block';
            }}
          />
          <span className="current-emoji" style={{ display: 'none' }}>
            {getWeatherEmoji(current.main)}
          </span>
        </div>
      </div>

      {/* Description */}
      <p className="current-description">{current.description}</p>

      {/* Stats Row */}
      <div className="current-stats">
        <div className="stat-item">
          <span className="stat-icon">💧</span>
          <span className="stat-value">{current.humidity}%</span>
          <span className="stat-label">{t('weatherHumidity')}</span>
        </div>
        <div className="stat-divider" />
        <div className="stat-item">
          <span className="stat-icon">💨</span>
          <span className="stat-value">{current.windSpeed} km/h</span>
          <span className="stat-label">{t('weatherWind')}</span>
        </div>
        <div className="stat-divider" />
        <div className="stat-item">
          <span className="stat-icon">🌡️</span>
          <span className="stat-value">{current.feelsLike}°C</span>
          <span className="stat-label">{t('weatherFeelsLike')}</span>
        </div>
        {current.uvi !== null && (
          <>
            <div className="stat-divider" />
            <div className="stat-item">
              <span className="stat-icon">🔆</span>
              <span className="stat-value">{Math.round(current.uvi)}</span>
              <span className="stat-label">{t('weatherUV')}</span>
            </div>
          </>
        )}
      </div>

      {/* Sunrise / Sunset */}
      {current.sunrise && (
        <div className="sun-row">
          <div className="sun-item">
            <span>🌅</span>
            <span>{formatTime(current.sunrise)}</span>
            <small>{t('weatherSunrise')}</small>
          </div>
          <div className="sun-item">
            <span>🌇</span>
            <span>{formatTime(current.sunset)}</span>
            <small>{t('weatherSunset')}</small>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default CurrentWeather;
