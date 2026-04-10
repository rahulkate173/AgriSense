import { motion } from 'framer-motion';

const LoadingSkeleton = () => {
  const shimmer = {
    initial: { backgroundPosition: '-200% 0' },
    animate: {
      backgroundPosition: '200% 0',
      transition: { duration: 1.6, repeat: Infinity, ease: 'linear' },
    },
  };

  const SkeletonBox = ({ className }) => (
    <motion.div
      className={`skeleton-box ${className}`}
      variants={shimmer}
      initial="initial"
      animate="animate"
    />
  );

  return (
    <div className="skeleton-wrapper">
      {/* Current Weather Skeleton */}
      <div className="skeleton-current glass-card">
        <div className="skeleton-row">
          <SkeletonBox className="skeleton-circle" />
          <div className="skeleton-col">
            <SkeletonBox className="skeleton-line w-60" />
            <SkeletonBox className="skeleton-line w-40" />
          </div>
        </div>
        <SkeletonBox className="skeleton-temp" />
        <div className="skeleton-row gap-md">
          <SkeletonBox className="skeleton-line w-30 h-sm" />
          <SkeletonBox className="skeleton-line w-30 h-sm" />
          <SkeletonBox className="skeleton-line w-30 h-sm" />
        </div>
      </div>

      {/* Forecast Skeleton */}
      <div className="skeleton-forecast-row">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="skeleton-card glass-card">
            <SkeletonBox className="skeleton-line w-60 h-sm" />
            <SkeletonBox className="skeleton-circle sm" />
            <SkeletonBox className="skeleton-line w-80 h-lg" />
            <SkeletonBox className="skeleton-line w-50 h-sm" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default LoadingSkeleton;
