// Upload Service — sends image to backend, returns prediction result
// To swap in a real ML API later, only this file needs to change.

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

/**
 * @param {File} imageFile
 * @param {function} onProgress - called with 0–100 progress value
 * @returns {Promise<{ imageUrl, stage, confidence, summary, severity, recommendations }>}
 */
export const uploadAndPredict = (imageFile, onProgress = () => {}) => {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append('image', imageFile);

    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable) {
        const pct = Math.round((e.loaded / e.total) * 100);
        onProgress(pct);
      }
    });

    xhr.addEventListener('load', () => {
      try {
        const res = JSON.parse(xhr.responseText);
        if (!res.success) {
          reject(new Error(res.message || 'Prediction failed'));
        } else {
          resolve(res.data);
        }
      } catch {
        reject(new Error('Invalid server response'));
      }
    });

    xhr.addEventListener('error', () => reject(new Error('Network error — please check your connection')));
    xhr.addEventListener('timeout', () => reject(new Error('Request timed out — please try again')));

    const userStr = localStorage.getItem('agrisense_user');
    const token = userStr ? JSON.parse(userStr).token : '';

    xhr.timeout = 60000; // 60s
    xhr.open('POST', `${BACKEND_URL}/api/upload/uploadimg`);
    if (token) {
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    }
    xhr.send(formData);
  });
};
