import { motion } from 'framer-motion';

const LocationButton = ({ onLocationFound, onError }) => {
  const handleClick = () => {
    if (!navigator.geolocation) {
      onError?.('Geolocation is not supported by your browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        onLocationFound(latitude, longitude);
      },
      (err) => {
        const messages = {
          1: 'Location access denied. Please enable location permissions.',
          2: 'Location unavailable. Please try again.',
          3: 'Location request timed out. Please try again.',
        };
        onError?.(messages[err.code] || 'Could not get your location.');
      },
      { timeout: 10000, maximumAge: 60000 }
    );
  };

  return (
    <motion.button
      className="location-btn"
      onClick={handleClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      title="Use my current location"
    >
      <span className="location-icon">📍</span>
      <span className="location-label">My Location</span>
    </motion.button>
  );
};

export default LocationButton;
