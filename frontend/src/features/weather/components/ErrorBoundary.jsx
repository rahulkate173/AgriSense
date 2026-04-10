import { motion } from 'framer-motion';

const ErrorBoundary = ({ error, onRetry }) => {
  return (
    <motion.div
      className="error-card glass-card"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="error-icon">⚡</div>
      <h3 className="error-title">Weather Unavailable</h3>
      <p className="error-message">{error}</p>
      {onRetry && (
        <motion.button
          className="btn-retry"
          onClick={onRetry}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Try Again
        </motion.button>
      )}
    </motion.div>
  );
};

export default ErrorBoundary;
