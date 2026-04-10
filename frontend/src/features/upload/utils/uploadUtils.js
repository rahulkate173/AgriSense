// Detects if the device has a camera (mobile-first)
export const isMobileDevice = () =>
  /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);

// Returns human-readable file size
export const formatFileSize = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};
