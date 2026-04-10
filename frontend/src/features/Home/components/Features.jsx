import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'

const featuresData = [
  {
    id: 'feat-weather',
    large: true,
    iconClass: 'feat-icon--blue',
    icon: (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
        <path d="M18 4 C10.27 4, 4 10.27, 4 18 C4 25.73, 10.27 32, 18 32 C25.73 32, 32 25.73, 32 18 C32 10.27, 25.73 4, 18 4Z" stroke="#3a6bc4" strokeWidth="1.5" fill="#3a6bc4" fillOpacity="0.08"/>
        <path d="M18 8 L18 18 L24 22" stroke="#3a6bc4" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    titleKey: 'feat1Title',
    descKey: 'feat1Desc',
    tagKey: 'feat1Tag',
  },
  {
    id: 'feat-soil',
    large: false,
    iconClass: 'feat-icon--brown',
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <rect x="4" y="18" width="24" height="10" rx="2" fill="#8b5e3c" fillOpacity="0.12" stroke="#8b5e3c" strokeWidth="1.5"/>
        <path d="M16 18 L16 8" stroke="#8b5e3c" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M16 12 Q19 10, 21 12" stroke="#4a7c3f" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M16 15 Q13 13, 11 15" stroke="#4a7c3f" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    titleKey: 'feat2Title',
    descKey: 'feat2Desc',
    tagKey: 'feat2Tag',
  },
  {
    id: 'feat-crop',
    large: false,
    iconClass: 'feat-icon--green',
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <path d="M6 26 Q10 14, 16 10 Q22 6, 28 8 Q26 16, 20 20 Q14 24, 6 26Z" fill="#4a7c3f" fillOpacity="0.12" stroke="#4a7c3f" strokeWidth="1.5"/>
        <path d="M6 26 Q12 18, 20 14" stroke="#4a7c3f" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    titleKey: 'feat3Title',
    descKey: 'feat3Desc',
    tagKey: 'feat3Tag',
  },
  {
    id: 'feat-advisory',
    large: false,
    iconClass: 'feat-icon--amber',
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="12" stroke="#e07a2c" strokeWidth="1.5" fill="#e07a2c" fillOpacity="0.08"/>
        <path d="M10 16 L14 20 L22 12" stroke="#e07a2c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    titleKey: 'feat4Title',
    descKey: 'feat4Desc',
    tagKey: 'feat4Tag',
  },
  {
    id: 'feat-multilang',
    large: false,
    iconClass: 'feat-icon--purple',
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="12" stroke="#7c5cbf" strokeWidth="1.5" fill="none"/>
        <path d="M16 4 Q10 10, 10 16 Q10 22, 16 28" stroke="#7c5cbf" strokeWidth="1.2" fill="none"/>
        <path d="M16 4 Q22 10, 22 16 Q22 22, 16 28" stroke="#7c5cbf" strokeWidth="1.2" fill="none"/>
        <path d="M4 16 L28 16" stroke="#7c5cbf" strokeWidth="1.2" strokeLinecap="round"/>
        <path d="M7 10 L25 10M7 22 L25 22" stroke="#7c5cbf" strokeWidth="1" strokeLinecap="round" opacity="0.5"/>
      </svg>
    ),
    titleKey: 'feat5Title',
    descKey: 'feat5Desc',
    tagKey: 'feat5Tag',
  },
  {
    id: 'feat-satellite',
    large: true,
    iconClass: 'feat-icon--teal',
    icon: (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
        <circle cx="18" cy="18" r="4" stroke="#2a9d8f" strokeWidth="1.5"/>
        <path d="M22 14 L28 8" stroke="#2a9d8f" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M14 22 L8 28" stroke="#2a9d8f" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M28 8 L32 10 L30 14 L26 13 Z" fill="#2a9d8f" fillOpacity="0.2" stroke="#2a9d8f" strokeWidth="1.2"/>
        <circle cx="14" cy="14" r="7" stroke="#2a9d8f" strokeWidth="1" strokeDasharray="3 3" fill="none" opacity="0.5"/>
      </svg>
    ),
    titleKey: 'feat6Title',
    descKey: 'feat6Desc',
    tagKey: 'feat6Tag',
  },
]

const FeatureCard = ({ feature, animRef }) => {
  const { t } = useTranslation()
  return (
    <div
      className={`feature-card${feature.large ? ' feature-card--large' : ''}`}
      id={feature.id}
      ref={animRef}
    >
      <div className={`feat-icon-wrap ${feature.iconClass}`}>{feature.icon}</div>
      <div className="feat-body">
        <h3>{t(feature.titleKey)}</h3>
        <p>{t(feature.descKey)}</p>
        <div className="feat-tag">{t(feature.tagKey)}</div>
      </div>
    </div>
  )
}

const Features = () => {
  const cardsRef = useRef([])
  const { t } = useTranslation()

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1 }
    )
    cardsRef.current.forEach((el) => { if (el) observer.observe(el) })
    return () => observer.disconnect()
  }, [])

  return (
    <section className="features" id="features">
      <div className="section-grid-lines">
        <div className="vline"></div>
        <div className="vline"></div>
        <div className="vline"></div>
      </div>
      <div className="container">
        <div className="section-header">
          <span className="section-tag">{t('featTag')}</span>
          <h2 className="section-title">{t('featTitle')}</h2>
        </div>
        <div className="features-grid">
          {featuresData.map((feature, i) => (
            <FeatureCard
              key={feature.id}
              feature={feature}
              animRef={(el) => (cardsRef.current[i] = el)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Features
