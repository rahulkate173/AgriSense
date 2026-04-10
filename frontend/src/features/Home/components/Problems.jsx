import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'

const problemsData = [
  {
    id: 'problem-weather',
    number: '01',
    image: '/assets/weather.png',
    alt: 'Unpredictable weather',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path d="M14 3 L14 5M4.22 4.22 L5.64 5.64M3 14 L5 14M4.22 23.78 L5.64 22.36M14 23 L14 25M22.36 22.36 L23.78 23.78M23 14 L25 14M22.36 5.64 L23.78 4.22" stroke="#e07a2c" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="14" cy="14" r="5" stroke="#e07a2c" strokeWidth="1.5"/>
        <path d="M8 20 Q10 16, 14 18 Q18 20, 22 16" stroke="#3a6bc4" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
      </svg>
    ),
    titleKey: 'probTitle1',
    descKey: 'probDesc1',
    statNum: '₹1.8 Lakh Cr',
    statLabelKey: 'probStatLabel1',
  },
  {
    id: 'problem-crop-health',
    number: '02',
    image: '/assets/crop.png',
    alt: 'Crop health',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <circle cx="12" cy="12" r="7" stroke="#4a7c3f" strokeWidth="1.5" fill="none"/>
        <path d="M17.5 17.5 L24 24" stroke="#4a7c3f" strokeWidth="1.8" strokeLinecap="round"/>
        <path d="M9 12 L11 14 L15 10" stroke="#e07a2c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    titleKey: 'probTitle2',
    descKey: 'probDesc2',
    statNum: '30%',
    statLabelKey: 'probStatLabel2',
  },
  {
    id: 'problem-language',
    number: '03',
    image: '/assets/soil.png',
    alt: 'Language barrier',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <rect x="4" y="5" width="20" height="15" rx="2" stroke="#7c5cbf" strokeWidth="1.5" fill="none"/>
        <path d="M8 10 L14 10M8 13 L18 13M8 16 L12 16" stroke="#7c5cbf" strokeWidth="1.2" strokeLinecap="round"/>
        <circle cx="21" cy="21" r="4" fill="#e07a2c" fillOpacity="0.15" stroke="#e07a2c" strokeWidth="1.5"/>
        <path d="M20 20.5 L20 21.5M21.5 20.5 L21.5 21.5" stroke="#e07a2c" strokeWidth="1.2" strokeLinecap="round"/>
        <circle cx="21" cy="23" r="0.5" fill="#e07a2c"/>
      </svg>
    ),
    titleKey: 'probTitle3',
    descKey: 'probDesc3',
    statNum: '78%',
    statLabelKey: 'probStatLabel3',
  },
]

const ProblemCard = ({ problem, delay }) => {
  const cardRef = useRef(null)
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
    if (cardRef.current) observer.observe(cardRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      className={`problem-card problem-card--${problem.number}`}
      id={problem.id}
      ref={cardRef}
      style={{ transitionDelay: `${delay}s` }}
    >
      <div className="problem-number">{problem.number}</div>
      <div className="problem-image-wrap">
        <img src={problem.image} alt={problem.alt} className="problem-img" />
        <div className="problem-overlay"></div>
      </div>
      <div className="problem-body">
        <div className="problem-icon-wrap">{problem.icon}</div>
        <h3 className="problem-title">{t(problem.titleKey)}</h3>
        <p className="problem-desc">{t(problem.descKey)}</p>
        <div className="problem-stat">
          <span className="problem-stat-num">{problem.statNum}</span>
          <span className="problem-stat-label">{t(problem.statLabelKey)}</span>
        </div>
      </div>
    </div>
  )
}

const Problems = () => {
  const { t } = useTranslation()
  return (
    <section className="problems" id="problem">
      <div className="section-grid-lines">
        <div className="vline"></div>
        <div className="vline"></div>
        <div className="vline"></div>
      </div>
      <div className="container">
        <div className="section-header">
          <span className="section-tag">{t('probTag')}</span>
          <h2 className="section-title">{t('probTitle')}</h2>
          <p className="section-desc">
            {t('probDesc')}
          </p>
        </div>
        <div className="problem-grid">
          {problemsData.map((problem, index) => (
            <ProblemCard key={problem.id} problem={problem} delay={index * 0.1} />
          ))}
        </div>
        <div className="problem-callout" id="problem-callout">
          <div className="callout-line"></div>
          <p className="callout-text">
            {t('probCallout')}
          </p>
          <div className="callout-line"></div>
        </div>
      </div>
    </section>
  )
}

export default Problems
