import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, FileText, ArrowLeft } from 'lucide-react';
import { uploadPDF, resetUploadStatus } from '../../../store/chatSlice.js';
import '../styles/Chat.css';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import i18n from '../../../i18n';
import LanguageSwitcher from '../../../components/LanguageSwitcher.jsx';

const ChatUploadPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { sessionId, uploadStatus, error } = useSelector((state) => state.chat);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  const { t } = useTranslation();

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
      dispatch(resetUploadStatus());
    } else {
      alert(t('invalidPdf'));
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
      dispatch(resetUploadStatus());
    } else {
      alert(t('invalidPdf'));
    }
  };

  const handleDragOver = (e) => e.preventDefault();

  const handleUpload = async () => {
    if (!selectedFile) return;

    // Use current user from localStorage if logged in
    let userId = 'anonymous_farmer';
    try {
      const user = JSON.parse(localStorage.getItem('agrisense_user'));
      if (user && user._id) userId = user._id;
    } catch {}

    const resultAction = await dispatch(uploadPDF({ 
      file: selectedFile, 
      userId, 
      sessionId,
      language: i18n.language 
    }));
    if (uploadPDF.fulfilled.match(resultAction)) {
      navigate('/chat');
    }
  };

  return (
    <div className="chat-upload-page" style={{ position: 'relative' }}>
      {/* Standardized Back Button */}
      <Link 
        to="/options" 
        style={{ position: 'absolute', top: '1.5rem', left: '1.5rem', zIndex: 1000, display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fff', textDecoration: 'none', fontWeight: 'bold', background: 'rgba(0,0,0,0.3)', padding: '0.5rem 1rem', borderRadius: '20px' }}
      >
        <ArrowLeft size={18} /> {t('backToHome')}
      </Link>

      <div style={{ position: 'absolute', top: '1rem', right: '1.5rem' }}>
        <LanguageSwitcher />
      </div>
      <div className="chat-upload-card">
        <div className="chat-upload-icon">
          <FileText size={32} />
        </div>
        <h1 className="chat-upload-title">{t('uploadTitle')}</h1>
        <p className="chat-upload-sub">
          {t('uploadSub')}
        </p>

        <div 
          className="chat-upload-dropzone" 
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileSelect} 
            accept="application/pdf" 
            style={{ display: 'none' }} 
          />
          {selectedFile ? (
            <div style={{ color: 'var(--chat-primary)', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              <FileText size={20} />
              {selectedFile.name}
            </div>
          ) : (
            <div style={{ color: 'var(--chat-text-muted)' }}>
              <UploadCloud size={32} style={{ marginBottom: '1rem', color: 'var(--chat-primary)' }} />
              <div>{t('uploadDropzone')}</div>
            </div>
          )}
        </div>

        {error && <p style={{ color: 'red', fontSize: '0.8rem', marginTop: '-1rem', marginBottom: '1rem' }}>{error}</p>}

        <button 
          className="chat-upload-btn" 
          disabled={!selectedFile || uploadStatus === 'uploading'}
          onClick={handleUpload}
        >
          {uploadStatus === 'uploading' ? t('uploadAnalyzing') : t('uploadBtn')}
        </button>
      </div>
    </div>
  );
};

export default ChatUploadPage;
