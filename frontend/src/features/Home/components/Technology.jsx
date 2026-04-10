import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'

const techData = [
  {
    id: 'tech-ai',
    labelKey: 'tech1Label',
    stat: '99.2%',
    descKey: 'tech1Desc',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="3" stroke="#4a7c3f" strokeWidth="1.5"/>
        <path d="M12 2 L12 6M12 18 L12 22M2 12 L6 12M18 12 L22 12" stroke="#4a7c3f" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M4.93 4.93 L7.76 7.76M16.24 16.24 L19.07 19.07M19.07 4.93 L16.24 7.76M7.76 16.24 L4.93 19.07" stroke="#4a7c3f" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: 'tech-iot',
    labelKey: 'tech2Label',
    stat: '12,000+',
    descKey: 'tech2Desc',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle cx="6" cy="12" r="2" stroke="#3a6bc4" strokeWidth="1.5"/>
        <circle cx="18" cy="6" r="2" stroke="#3a6bc4" strokeWidth="1.5"/>
        <circle cx="18" cy="18" r="2" stroke="#3a6bc4" strokeWidth="1.5"/>
        <path d="M8 12 L16 7M8 12 L16 17" stroke="#3a6bc4" strokeWidth="1.2" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: 'tech-data',
    labelKey: 'tech3Label',
    stat: '2.4 TB',
    descKey: 'tech3Desc',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="4" width="18" height="5" rx="1" stroke="#e07a2c" strokeWidth="1.5"/>
        <rect x="3" y="11" width="18" height="5" rx="1" stroke="#e07a2c" strokeWidth="1.5"/>
        <circle cx="17" cy="6.5" r="1" fill="#e07a2c"/>
        <circle cx="17" cy="13.5" r="1" fill="#e07a2c"/>
      </svg>
    ),
  },
  {
    id: 'tech-coverage',
    labelKey: 'tech4Label',
    statKey: 'tech4Stat',
    descKey: 'tech4Desc',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M12 2 C6.48 2, 2 6.48, 2 12 C2 17.52, 6.48 22, 12 22 C17.52 22, 22 17.52, 22 12 C22 6.48, 17.52 2, 12 2Z" stroke="#7c5cbf" strokeWidth="1.5"/>
        <path d="M2 12 Q6 8, 12 12 Q18 16, 22 12" stroke="#7c5cbf" strokeWidth="1.2" fill="none"/>
        <path d="M12 2 Q8 8, 12 12 Q16 16, 12 22" stroke="#7c5cbf" strokeWidth="1.2" fill="none"/>
      </svg>
    ),
  },
]

const Technology = () => {
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
    <section className="technology" id="technology">
      <div className="container">
        <div className="section-header section-header--center">
          <span className="section-tag">{t('techTag')}</span>
          <h2 className="section-title">{t('techTitle')}</h2>
          <p className="section-desc">
            {t('techDesc')}
          </p>
        </div>
        <div className="tech-cards">
          {techData.map((card, i) => (
            <div
              className="tech-card"
              id={card.id}
              key={card.id}
              ref={(el) => (cardsRef.current[i] = el)}
              style={{ transitionDelay: `${i * 0.08}s` }}
            >
              <div className="tech-card-top">
                <span className="tech-label">{t(card.labelKey)}</span>
                {card.icon}
              </div>
              <div className="tech-stat-large">{card.statKey ? t(card.statKey) : card.stat}</div>
              <p>{t(card.descKey)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Technology
