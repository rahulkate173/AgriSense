import { motion } from 'framer-motion';

const getConditionColor = (main) => {
  const colors = {
    Clear: '#FFD166',
    Clouds: '#a8b8c8',
    Rain: '#4a90d9',
    Drizzle: '#74b9d3',
    Thunderstorm: '#6c3b8a',
    Snow: '#b2ebf2',
    Mist: '#90a4ae',
    Fog: '#90a4ae',
    Haze: '#b0bec5',
  };
  return colors[main] || '#ffffff';
};

const ForecastCard = ({ day, index }) => {
  const iconUrl = `https://openweathermap.org/img/wn/${day.icon}@2x.png`;
  const accentColor = getConditionColor(day.main);

  return (
    <motion.div
      className="forecast-card glass-card"
      initial={{ opacity: 0, y: 40, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.5,
        delay: index * 0.07,
        ease: [0.21, 1.11, 0.81, 0.99],
      }}
      whileHover={{
        y: -8,
        scale: 1.04,
        boxShadow: `0 20px 40px rgba(0,0,0,0.3), 0 0 20px ${accentColor}33`,
      }}
      whileTap={{ scale: 0.97 }}
      style={{ '--accent': accentColor }}
    >
      {/* Day Name */}
      <p className="forecast-day">{day.dayName}</p>

      {/* Weather Icon */}
      <div className="forecast-icon-wrap">
        <img
          src={iconUrl}
          alt={day.description}
          className="forecast-icon"
          onError={(e) => (e.target.style.display = 'none')}
        />
      </div>

      {/* Temps */}
      <div className="forecast-temps">
        <span className="forecast-temp-max">{day.tempMax}°</span>
        <span className="forecast-temp-min">{day.tempMin}°</span>
      </div>

      {/* Condition */}
      <p className="forecast-desc">{day.description}</p>

      {/* Stats */}
      <div className="forecast-stats">
        <div className="forecast-stat">
          <span>💧</span>
          <span>{day.humidity}%</span>
        </div>
        <div className="forecast-stat">
          <span>💨</span>
          <span>{day.windSpeed}km/h</span>
        </div>
      </div>

      {/* Precipitation chance */}
      {day.pop > 0 && (
        <div className="forecast-pop">
          <span>🌧️ {day.pop}%</span>
        </div>
      )}

      {/* Accent glow bar */}
      <div className="forecast-glow-bar" style={{ background: accentColor }} />
    </motion.div>
  );
};

export default ForecastCard;
