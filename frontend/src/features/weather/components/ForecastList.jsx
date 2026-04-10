import { motion } from 'framer-motion';
import ForecastCard from './ForecastCard';

const ForecastList = ({ forecast }) => {
  if (!forecast?.length) return null;

  return (
    <div className="forecast-section">
      <motion.h2
        className="forecast-title"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        7-Day Forecast
      </motion.h2>
      <div className="forecast-scroll-container">
        <div className="forecast-list">
          {forecast.map((day, index) => (
            <ForecastCard key={day.dt} day={day} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ForecastList;
