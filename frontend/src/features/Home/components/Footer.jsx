import { useTranslation } from 'react-i18next'

const Footer = () => {
  const { t, i18n } = useTranslation()

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng)
    localStorage.setItem('agrisense_lang', lng)
  }

  const platformItems = t('footerPlatformItems', { returnObjects: true }) || []
  const scienceItems = t('footerScienceItems', { returnObjects: true }) || []
  const companyItems = t('footerCompanyItems', { returnObjects: true }) || []

  return (
    <footer className="footer" id="footer">
      <div className="footer-top">
        <div className="container">
          <div className="footer-grid">
            {/* Brand */}
            <div className="footer-brand" id="footer-brand">
              <div className="nav-logo" style={{ marginBottom: '1rem' }}>
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <circle cx="16" cy="16" r="15" stroke="#4a7c3f" strokeWidth="1.5"/>
                  <path d="M16 26 C16 26, 8 20, 8 13 C8 9, 11.5 6, 16 6 C20.5 6, 24 9, 24 13 C24 20, 16 26, 16 26Z" fill="#4a7c3f" opacity="0.25"/>
                  <path d="M16 8 L16 22" stroke="#4a7c3f" strokeWidth="1.2"/>
                  <path d="M16 12 C16 12, 19 10, 21 12" stroke="#4a7c3f" strokeWidth="1.2" strokeLinecap="round"/>
                  <path d="M16 16 C16 16, 13 14, 11 16" stroke="#4a7c3f" strokeWidth="1.2" strokeLinecap="round"/>
                </svg>
                <span className="logo-text" style={{ color: '#f2ede4' }}>AgriSense</span>
              </div>
              <p className="footer-tagline">
                {t('footerTagline')}
              </p>
              <div className="footer-social">
                {[
                  { id: 'footer-twitter', label: 'Twitter', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" stroke="#a89c8a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg> },
                  { id: 'footer-linkedin', label: 'LinkedIn', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="2" y="2" width="20" height="20" rx="4" stroke="#a89c8a" strokeWidth="1.5"/><path d="M7 11 L7 17M7 8 L7 8.5" stroke="#a89c8a" strokeWidth="1.5" strokeLinecap="round"/><path d="M11 17 L11 13 C11 11.5, 13 11, 14 12 L14 17" stroke="#a89c8a" strokeWidth="1.5" strokeLinecap="round"/></svg> },
                  { id: 'footer-instagram', label: 'Instagram', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="2" y="2" width="20" height="20" rx="5" stroke="#a89c8a" strokeWidth="1.5"/><circle cx="12" cy="12" r="4" stroke="#a89c8a" strokeWidth="1.5"/><circle cx="17.5" cy="6.5" r="0.75" fill="#a89c8a"/></svg> },
                  { id: 'footer-youtube', label: 'YouTube', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="2" y="5" width="20" height="14" rx="4" stroke="#a89c8a" strokeWidth="1.5"/><polygon points="10,9 16,12 10,15" fill="#a89c8a"/></svg> },
                ].map((social) => (
                  <a href="#" className="social-link" id={social.id} key={social.id} aria-label={social.label}>
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Platform */}
            <div className="footer-col">
              <h5 className="footer-col-title">{t('footerPlatformTitle')}</h5>
              <ul>
                {platformItems.map((item) => (
                  <li key={item}><a href="#features">{item}</a></li>
                ))}
              </ul>
            </div>

            {/* Science */}
            <div className="footer-col">
              <h5 className="footer-col-title">{t('footerScienceTitle')}</h5>
              <ul>
                {scienceItems.map((item) => (
                  <li key={item}><a href="#">{item}</a></li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div className="footer-col">
              <h5 className="footer-col-title">{t('footerCompanyTitle')}</h5>
              <ul>
                {companyItems.map((item) => (
                  <li key={item}><a href="#">{item}</a></li>
                ))}
                <li><a href="#contact">{t('footerContactUs')}</a></li>
              </ul>
            </div>

            {/* Contact */}
            <div className="footer-col footer-col--contact">
              <h5 className="footer-col-title">{t('footerContactTitle')}</h5>
              <div className="footer-contact-item">
                <span>📧</span>
                <a href="mailto:hello@agrisense.in">hello@agrisense.in</a>
              </div>
              <div className="footer-contact-item">
                <span>📞</span>
                <a href="tel:+918008001234">+91 800 800 1234</a>
              </div>
              <div className="footer-contact-item">
                <span>📍</span>
                <span>{t('footerAddress')}</span>
              </div>
              <div className="footer-lang-switcher" id="lang-switcher">
                <span className="lang-label">{t('footerLanguageLabel')}</span>
                {[
                  { code: 'en', label: 'EN' },
                  { code: 'hi', label: 'हि' },
                  { code: 'mr', label: 'म' }
                ].map((lang) => (
                  <button
                    key={lang.code}
                    className={`lang-btn${i18n.language === lang.code ? ' lang-btn--active' : ''}`}
                    onClick={() => changeLanguage(lang.code)}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container">
          <div className="footer-bottom-inner">
            <span>{t('footerCopyright')}</span>
            <div className="footer-legal">
              <a href="#">{t('footerPrivacyPolicy')}</a>
              <a href="#">{t('footerTermsOfService')}</a>
              <a href="#">{t('footerCookiePolicy')}</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
