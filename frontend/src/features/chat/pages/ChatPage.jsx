import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchChatHistory, sendMessage, addOptimisticMessage } from '../../../store/chatSlice.js';
import { Send, ArrowLeft, MoreVertical } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../../../components/LanguageSwitcher.jsx';
import '../styles/Chat.css';

const ChatPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { messages, sessionId, status, error } = useSelector((state) => state.chat);
  const [inputStr, setInputStr] = useState('');
  const messagesEndRef = useRef(null);
  const { t, i18n } = useTranslation();

  // Scroll to bottom whenever messages update
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    // Determine userId
    let userId = 'anonymous_farmer';
    try {
      const user = JSON.parse(localStorage.getItem('agrisense_user'));
      if (user && user._id) userId = user._id;
    } catch {}

    // Fetch history
    dispatch(fetchChatHistory({ userId, sessionId }));
  }, [dispatch, sessionId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, status]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputStr.trim()) return;

    let userId = 'anonymous_farmer';
    try {
      const user = JSON.parse(localStorage.getItem('agrisense_user'));
      if (user && user._id) userId = user._id;
    } catch {}

    const currMessage = inputStr;
    setInputStr('');
    
    // Add user message optimistically
    dispatch(addOptimisticMessage(currMessage));
    
    // Dispatch to API
    dispatch(sendMessage({ userId, sessionId, message: currMessage, language: i18n.language }));
  };

  return (
    <div className="chat-page">
      {/* Header */}
      <header className="chat-header">
        <div className="chat-header-title">
          <Link to="/upload_report" className="chat-back-link">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h2 className="chat-header-name">{t('assistantName')}</h2>
            <span className="chat-header-status">
              <span className="chat-status-dot"></span> {t('onlineContext')}
            </span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <LanguageSwitcher />
        </div>
      </header>

      {/* Body */}
      <div className="chat-body">
        {messages.length === 0 && status !== 'loading' && (
          <div style={{ textAlign: 'center', color: 'var(--chat-text-muted)', marginTop: '2rem' }}>
            <p>{t('chatEmpty')}</p>
          </div>
        )}

        {messages.map((msg, index) => (
          <div key={index} className={`chat-bubble-wrap ${msg.role}`}>
            <div className={`chat-bubble ${msg.role}`}>
              {msg.role === 'ai' ? (
                <div className="chat-markdown">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              ) : (
                msg.content
              )}
            </div>
            <div className="chat-bubble-time">
              {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
            </div>
          </div>
        ))}

        {status === 'loading' && (
          <div className="chat-loading">
            <span></span><span></span><span></span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Footer input */}
      <footer className="chat-footer">
        {error && <div style={{ color: 'red', fontSize: '0.8rem', paddingBottom: '0.5rem' }}>{error}</div>}
        <form className="chat-input-row" onSubmit={handleSend}>
          <input
            type="text"
            className="chat-input"
            value={inputStr}
            onChange={(e) => setInputStr(e.target.value)}
            placeholder={t('chatPlaceholder')}
            disabled={status === 'loading'}
          />
          <button className="chat-send-btn" type="submit" disabled={!inputStr.trim() || status === 'loading'}>
            <Send size={18} />
          </button>
        </form>
      </footer>
    </div>
  );
};

export default ChatPage;
