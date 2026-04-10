import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'

const steps = [
  {
    num: '01',
    titleKey: 'solStepTitle1',
    descKey: 'solStepDesc1',
  },
  {
    num: '02',
    titleKey: 'solStepTitle2',
    descKey: 'solStepDesc2',
  },
  {
    num: '03',
    titleKey: 'solStepTitle3',
    descKey: 'solStepDesc3',
  },
]

const Solution = () => {
  const stepsRef = useRef([])
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
    stepsRef.current.forEach((el) => { if (el) observer.observe(el) })
    return () => observer.disconnect()
  }, [])

  const handleScroll = (e, href) => {
    e.preventDefault()
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <section className="solution" id="solution">
      <div className="container">
        <div className="solution-inner">
          <div className="solution-left">
            <span className="section-tag">{t('solTag')}</span>
            <h2 className="section-title" style={{ whiteSpace: 'pre-line' }}>{t('solTitle')}</h2>
            <p className="solution-desc">
              {t('solDesc')}
            </p>
            <div className="solution-steps">
              {steps.map((step, i) => (
                <div
                  className={`sol-step sol-step--${i + 1}`}
                  id={`sol-step-${i + 1}`}
                  key={step.num}
                  ref={(el) => (stepsRef.current[i] = el)}
                  style={{ transitionDelay: `${i * 0.1}s` }}
                >
                  <div className="sol-step-num">{step.num}</div>
                  <div className="sol-step-content">
                    <h4>{t(step.titleKey)}</h4>
                    <p>{t(step.descKey)}</p>
                  </div>
                </div>
              ))}
            </div>
            <a
              href="#contact"
              className="btn btn-primary btn-lg"
              id="solution-cta-btn"
              style={{ marginTop: '2rem' }}
              onClick={(e) => handleScroll(e, '#contact')}
            >
              {t('solCTA')}
            </a>
          </div>

          <div className="solution-right">
            <div className="solution-dashboard">
              <div className="dashboard-header">
                <div className="dash-logo-sm"><span>🌾</span> {t('dashLogo')}</div>
                <div className="dash-status"><span className="live-dot"></span> {t('dashStatus')}</div>
              </div>
              <div className="dashboard-grid">
                <div className="dash-card dash-weather">
                  <span className="dash-card-label">{t('dashWeatherTitle')}</span>
                  <div className="dash-weather-display">
                    <span className="dash-temp">24°C</span>
                    <span className="dash-cond">{t('dashWeatherCond')}</span>
                  </div>
                  <div className="dash-weather-bar">
                    <div className="weather-seg" style={{ background: '#87ceeb', flex: 3 }} title="Morning"></div>
                    <div className="weather-seg" style={{ background: '#f0c040', flex: 4 }} title="Afternoon"></div>
                    <div className="weather-seg" style={{ background: '#b0c4de', flex: 3 }} title="Evening"></div>
                  </div>
                  <span className="dash-small-note">{t('dashWeatherTarget')}</span>
                </div>

                <div className="dash-card dash-soil">
                  <span className="dash-card-label">{t('dashSoilTitle')}</span>
                  <div className="soil-gauge-wrap">
                    <svg className="soil-gauge" viewBox="0 0 80 50">
                      <path d="M 10 45 A 35 35 0 0 1 70 45" stroke="#e0ddd7" strokeWidth="6" fill="none" strokeLinecap="round"/>
                      <path d="M 10 45 A 35 35 0 0 1 70 45" stroke="#4a7c3f" strokeWidth="6" fill="none" strokeLinecap="round" strokeDasharray="110" strokeDashoffset="28"/>
                      <text x="40" y="43" textAnchor="middle" fontFamily="Manrope" fontSize="11" fontWeight="700" fill="#2d4a25">87</text>
                    </svg>
                  </div>
                  <div className="soil-metrics">
                    <span>N: <strong>High</strong></span>
                    <span>P: <strong>Med</strong></span>
                    <span>K: <strong>High</strong></span>
                  </div>
                </div>

                <div className="dash-card dash-yield">
                  <span className="dash-card-label">{t('dashYieldTitle')}</span>
                  <div className="yield-bars">
                    {[
                      [t('dashYieldCrop1'), '82%', 82],
                      [t('dashYieldCrop2'), '91%', 91],
                      [t('dashYieldCrop3'), '67%', 67]
                    ].map(([crop, label, pct]) => (
                      <div className="yield-bar-item" key={crop}>
                        <span>{crop}</span>
                        <div className="ybar"><div className="ybar-fill" style={{ width: `${pct}%` }}></div></div>
                        <span>{label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="dash-card dash-alert">
                  <span className="dash-card-label">{t('dashAlertTitle')}</span>
                  <div className="alert-list">
                    <div className="alert-item alert-info">{t('dashAlert1')}</div>
                    <div className="alert-item alert-warn">{t('dashAlert2')}</div>
                    <div className="alert-item alert-ok">{t('dashAlert3')}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Solution
