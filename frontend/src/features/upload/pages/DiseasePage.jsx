import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import '../styles/Disease.css';
import { uploadAndPredict } from '../services/uploadService.js';
import { isMobileDevice, formatFileSize } from '../utils/uploadUtils.js';
import LanguageSwitcher from '../../../components/LanguageSwitcher.jsx';

const DiseasePage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  
  const [status, setStatus] = useState('idle'); // idle | uploading | success | error
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const { t } = useTranslation();
  
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setErrorMsg(t('drFileSizeExceeds'));
      setStatus('error');
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setStatus('idle');
    setResult(null);
    setErrorMsg('');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      // Create a mock event-like object to trigger the same logic
      handleFileSelect({ target: { files: [e.dataTransfer.files[0]] } });
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setStatus('idle');
    setResult(null);
    setErrorMsg('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAnalyse = async () => {
    if (!selectedFile) return;

    try {
      setStatus('uploading');
      setProgress(0);

      const data = await uploadAndPredict(selectedFile, (pct) => {
        setProgress(pct);
      });

      setResult(data);
      setStatus('success');
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || t('drVerificationFailed'));
      setStatus('error');
    }
  };

  // Status rendering helpers
  const renderIdleState = () => (
    <div 
      className="upload-card"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onClick={() => !previewUrl && fileInputRef.current?.click()}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        className="upload-input-hidden"
        accept="image/jpeg, image/png, image/webp, image/heic"
        capture={isMobileDevice() ? "environment" : undefined}
      />
      
      {!previewUrl ? (
        <>
          <div className="upload-icon-wrap">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="48" height="48"><path d="M2 6.00087C2 5.44811 2.45531 5 2.9918 5H21.0082C21.556 5 22 5.44463 22 6.00087V19.9991C22 20.5519 21.5447 21 21.0082 21H2.9918C2.44405 21 2 20.5554 2 19.9991V6.00087ZM4 7V19H20V7H4ZM14 16C15.6569 16 17 14.6569 17 13C17 11.3431 15.6569 10 14 10C12.3431 10 11 11.3431 11 13C11 14.6569 12.3431 16 14 16ZM14 18C11.2386 18 9 15.7614 9 13C9 10.2386 11.2386 8 14 8C16.7614 8 19 10.2386 19 13C19 15.7614 16.7614 18 14 18ZM4 2H10V4H4V2Z"></path></svg>
          </div>
          <h3 className="upload-title">{t('drUploadTitle')}</h3>
          <p className="upload-subtitle">
            {t('drUploadSub')}
          </p>
          <div className="upload-action-row">
            <button className="upload-btn upload-btn--primary">
              {t('drTakePhoto')}
            </button>
            <button className="upload-btn upload-btn--ghost">
              {t('drBrowse')}
            </button>
          </div>
          <p className="upload-hint">{t('drSupports')}</p>
        </>
      ) : (
        <div className="preview-wrap" onClick={(e) => e.stopPropagation()}>
          <img src={previewUrl} alt="Selected Leaf" className="preview-img" />
          <div className="preview-overlay">
            <span className="preview-filename">
              {selectedFile?.name || 'plant_image.jpg'} 
              {' '}({selectedFile ? formatFileSize(selectedFile.size) : ''})
            </span>
            <button className="preview-change-btn" onClick={clearSelection}>
              {t('drRetake')}
            </button>
          </div>
        </div>
      )}
    </div>
  );

  const renderUploadingState = () => (
    <div className="progress-wrap">
      <div className="progress-spinner-ring">
        <svg viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" className="track" />
          <circle 
            cx="50" cy="50" r="45" 
            className="fill" 
            strokeDasharray="283" 
            strokeDashoffset={283 - (283 * progress) / 100} 
          />
        </svg>
        <div className="progress-pct">{progress}%</div>
      </div>
      <div>
        <h3 className="progress-label">
          {progress < 100 ? t('drUploading') : (
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', justifyContent: 'center' }}>
              {t('drAnalyzing')} 
              <span className="progress-dots">
                <span className="progress-dot"></span>
                <span className="progress-dot"></span>
                <span className="progress-dot"></span>
              </span>
            </span>
          )}
        </h3>
        <p className="progress-sublabel">
          {progress < 100 ? t('drKeepAppOpen') : t('drRunningAI')}
        </p>
      </div>
      <div className="progress-bar-outer">
        <div className="progress-bar-inner" style={{ width: `${progress}%` }}></div>
      </div>
    </div>
  );

  const renderSuccessState = () => {
    if (!result) return null;

    let barClass = 'bar--high';
    let valClass = 'high';
    if (result.confidence < 0.8) {
      barClass = 'bar--medium';
      valClass = 'medium';
    } 
    if (result.confidence < 0.6) {
      barClass = 'bar--low';
      valClass = 'low';
    }

    const confPct = Math.round(result.confidence * 100);

    return (
      <div className="result-card">
        <div className="result-image-wrap">
          <img src={result.imageUrl || previewUrl} alt="Analyzed Crop" className="result-image" />
          <span className={`result-image-badge badge--${result.severity || 'moderate'}`}>
            {result.severity || t('drNotice')}
          </span>
        </div>
        
        <div className="result-body">
          <div className="result-stage-row">
            <h2 className="result-stage">{result.stage}</h2>
            <div className="result-confidence-pill">
              <span className="confidence-label">{t('drAIConfidence')}</span>
              <span className={`confidence-value ${valClass}`}>{confPct}%</span>
            </div>
          </div>
          
          <div className="confidence-bar-outer">
            <div className={`confidence-bar-inner ${barClass}`} style={{ width: `${confPct}%` }}></div>
          </div>

          <div className="result-summary">
            {result.summary}
          </div>

          {result.recommendations && result.recommendations.length > 0 && (
            <div style={{ marginBottom: '1rem' }}>
              <h4 className="result-recs-title">{t('drRecActions')}</h4>
              <ul className="result-recs-list">
                {result.recommendations.map((rec, i) => (
                  <li key={i} className="result-rec-item">
                    <span className="rec-icon">✓</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="result-disclaimer">
            <span style={{ fontSize: '1.2rem' }}>ℹ️</span>
            <div>
              {t('drDisclaimer')}
            </div>
          </div>
        </div>

        <div className="result-actions">
          <button className="result-action-btn btn-analyse-again" onClick={clearSelection}>
            {t('drAnotherPlant')}
          </button>
          <button className="result-action-btn btn-share">
            {t('drShareBtn')}
          </button>
        </div>
      </div>
    );
  };

  const renderErrorState = () => (
    <div className="error-card">
      <div className="error-icon">⚠️</div>
      <h3 className="error-title">{t('drAnalysisFailed')}</h3>
      <p className="error-msg">{errorMsg || t('drSomethingWentWrong')}</p>
      <button className="retry-btn" onClick={() => setStatus('idle')}>
        {t('drTryAgain')}
      </button>
    </div>
  );

  return (
    <div className="disease-page">
      {/* Top Bar */}
      <header className="disease-topbar">
        <div className="disease-topbar-inner" style={{ display: 'flex', alignItems: 'center' }}>
          <Link to="/" className="disease-back-btn">
            ← {t('backToHome')}
          </Link>
          <span className="disease-topbar-title">{t('drTitle')}</span>
          <div style={{ display: 'flex', alignItems: 'center', marginLeft: 'auto', gap: '0.8rem' }}>
            <LanguageSwitcher />
            <div className="disease-topbar-badge">
              <span className="topbar-badge-dot"></span>
              {t('drLive')}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="disease-content">
        <div className="disease-hero">
          <span className="disease-hero-tag">{t('drHeroTag')}</span>
          <h1 className="disease-hero-title">{t('drHeroTitlePrefix')} <em>{t('drHeroTitleEmphasis')}</em> {t('drHeroTitleSuffix')}</h1>
          <p className="disease-hero-sub">
            {t('drHeroSub')}
          </p>
        </div>

        {status === 'idle' && renderIdleState()}
        {status === 'idle' && previewUrl && (
          <div className="analyse-btn-wrap">
            <button className="analyse-btn" onClick={handleAnalyse}>
              {t('drAnalyzeBtn')}
            </button>
          </div>
        )}

        {status === 'uploading' && renderUploadingState()}
        {status === 'success' && renderSuccessState()}
        {status === 'error' && renderErrorState()}

        {/* Informational Tips (only in idle/error state) */}
        {['idle', 'error'].includes(status) && (
          <div className="tips-strip">
            <div className="tip-card">
              <span className="tip-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M12 18C8.68629 18 6 15.3137 6 12C6 8.68629 8.68629 6 12 6C15.3137 6 18 8.68629 18 12C18 15.3137 15.3137 18 12 18ZM12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16ZM11 1H13V4H11V1ZM11 20H13V23H11V20ZM3.51472 4.92893L4.92893 3.51472L7.05025 5.63604L5.63604 7.05025L3.51472 4.92893ZM16.9497 18.364L18.364 16.9497L20.4853 19.0711L19.0711 20.4853L16.9497 18.364ZM19.0711 3.51472L20.4853 4.92893L18.364 7.05025L16.9497 5.63604L19.0711 3.51472ZM5.63604 16.9497L7.05025 18.364L4.92893 20.4853L3.51472 19.0711L5.63604 16.9497ZM23 11V13H20V11H23ZM4 11V13H1V11H4Z"></path></svg></span>
              <span className="tip-title">{t('drTip1Title')}</span>
              <span className="tip-text">{t('drTip1Desc')}</span>
            </div>
            <div className="tip-card">
              <span className="tip-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M12 2C12.5523 2 13 2.44772 13 3C13 3.55228 12.5523 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20C16.4183 20 20 16.4183 20 12C20 11.4477 20.4477 11 21 11C21.5523 11 22 11.4477 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2ZM12 6C12.5523 6 13 6.44772 13 7C13 7.55228 12.5523 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16C14.2091 16 16 14.2091 16 12C16 11.4477 16.4477 11 17 11C17.5523 11 18 11.4477 18 12C18 15.3137 15.3137 18 12 18C8.68629 18 6 15.3137 6 12C6 8.68629 8.68629 6 12 6ZM18.5713 2.10059C18.8474 2.1006 19.0712 2.32449 19.0713 2.60059V4.42969C19.0716 4.70553 19.2954 4.92866 19.5713 4.92871H21.3994C21.6754 4.92871 21.8992 5.15275 21.8994 5.42871V6.34375L20.0107 8.23242C19.6358 8.60719 19.1268 8.81824 18.5967 8.81836H16.5967L12.707 12.707C12.3165 13.0974 11.6835 13.0975 11.293 12.707C10.9027 12.3165 10.9026 11.6834 11.293 11.293L15.1826 7.4043V5.4043C15.1826 4.87411 15.3928 4.36526 15.7676 3.99023L17.6572 2.10059H18.5713Z"></path></svg></span>
              <span className="tip-title">{t('drTip2Title')}</span>
              <span className="tip-text">{t('drTip2Desc')}</span>
            </div>
            <div className="tip-card">
              <span className="tip-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M20.998 3V5C20.998 14.6274 15.6255 19 8.99805 19L5.24077 18.9999C5.0786 19.912 4.99805 20.907 4.99805 22H2.99805C2.99805 20.6373 3.11376 19.3997 3.34381 18.2682C3.1133 16.9741 2.99805 15.2176 2.99805 13C2.99805 7.47715 7.4752 3 12.998 3C14.998 3 16.998 4 20.998 3ZM12.998 5C8.57977 5 4.99805 8.58172 4.99805 13C4.99805 13.3624 5.00125 13.7111 5.00759 14.0459C6.26198 12.0684 8.09902 10.5048 10.5019 9.13176L11.4942 10.8682C8.6393 12.4996 6.74554 14.3535 5.77329 16.9998L8.99805 17C15.0132 17 18.8692 13.0269 18.9949 5.38766C17.6229 5.52113 16.3481 5.436 14.7754 5.20009C13.6243 5.02742 13.3988 5 12.998 5Z"></path></svg></span>
              <span className="tip-title">{t('drTip3Title')}</span>
              <span className="tip-text">{t('drTip3Desc')}</span>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default DiseasePage;
