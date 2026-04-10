import { motion } from 'framer-motion';

const layers = [
  { id: 'wind', label: '💨 Wind', color: '#7ab367' }, // Light green
  { id: 'rain', label: '🌧️ Rain', color: '#2a9d8f' }, // Teal
  { id: 'temp', label: '🌡️ Temp', color: '#e07a2c' }, // Amber
  { id: 'clouds', label: '☁️ Clouds', color: '#a89c8a' }, // Muted tan
];

const LayerToggle = ({ activeLayer, onLayerChange }) => {
  return (
    <div className="layer-toggle">
      {layers.map((layer) => (
        <motion.button
          key={layer.id}
          className={`layer-btn ${activeLayer === layer.id ? 'active' : ''}`}
          onClick={() => onLayerChange(layer.id)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{
            '--layer-color': layer.color,
          }}
        >
          {layer.label}
        </motion.button>
      ))}
    </div>
  );
};

export default LayerToggle;
