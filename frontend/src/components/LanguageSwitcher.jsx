import React from 'react';
import { useTranslation } from 'react-i18next';
import './LanguageSwitcher.css';

const LANGUAGES = [
  { code: 'en', label: 'EN', full: 'English' },
  { code: 'hi', label: 'हि', full: 'हिंदी' },
  { code: 'mr', label: 'म',  full: 'मराठी' },
];

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const handleChange = (code) => {
    i18n.changeLanguage(code);
    localStorage.setItem('lang', code);
  };

  return (
    <div className="lang-switcher" role="group" aria-label="Language switcher">
      {LANGUAGES.map(({ code, label, full }) => (
        <button
          key={code}
          className={`lang-btn ${i18n.language === code ? 'lang-btn--active' : ''}`}
          onClick={() => handleChange(code)}
          title={full}
          aria-pressed={i18n.language === code}
        >
          {label}
        </button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;
