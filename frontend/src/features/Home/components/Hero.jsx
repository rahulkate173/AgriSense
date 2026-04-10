import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

const Hero = () => {
  const { t, i18n } = useTranslation()
  useEffect(() => {
    const handleMouseMove = (e) => {
      const cards = document.querySelectorAll('.hero-floating-card')
      const xFrac = (e.clientX / window.innerWidth - 0.5) * 2
      const yFrac = (e.clientY / window.innerHeight - 0.5) * 2
      cards.forEach((card, i) => {
        const factor = i === 0 ? 10 : -8
        card.style.transform = `translate(${xFrac * factor}px, ${yFrac * factor}px)`
      })
    }
    document.addEventListener('mousemove', handleMouseMove)
    return () => document.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const handleScroll = (e, href) => {
    e.preventDefault()
    const target = document.querySelector(href)
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <section className="hero" id="hero">
      <div className="hero-grid-lines">
        <div className="vline"></div>
        <div className="vline"></div>
        <div className="vline"></div>
        <div className="vline"></div>
      </div>

      <div className="hero-content">
        <div className="hero-badge">
          <span className="badge-dot"></span>
          <span>{t('heroBadge')}</span>
        </div>
        <h1 
          className="hero-heading" 
          style={{ lineHeight: (i18n.language === 'hi' || i18n.language === 'mr') ? 'normal' : undefined }}
        >
          {t('heroTitlePrefix')}<br />
          <em>{t('heroTitleEmphasis')}</em>
        </h1>
        <p className="hero-sub">
          {t('heroSub')}
        </p>
        <div className="hero-actions">
          <a href="#problem" className="btn btn-primary btn-lg" id="hero-learn-more" onClick={(e) => handleScroll(e, '#problem')}>
            {t('heroExploreProblem')}
          </a>
          <a href="#solution" className="btn btn-ghost btn-lg" id="hero-solution-link" onClick={(e) => handleScroll(e, '#solution')}>
            {t('heroSeeSolution')}
          </a>
        </div>
        <div className="hero-stats">
          <div className="stat-item">
            <span className="stat-number">40%</span>
            <span className="stat-label">{t('statYield')}</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <span className="stat-number">92%</span>
            <span className="stat-label">{t('statWeather')}</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <span className="stat-number">3x</span>
            <span className="stat-label">{t('statReports')}</span>
          </div>
        </div>
      </div>

      <div className="hero-image-wrap">
        <div className="hero-image-frame">
          <img
            src="/assets/farm_hero.png"
            alt="Farmer using AgriSense precision technology in fields"
            className="hero-img"
            id="hero-main-img"
          />
          <div className="hero-floating-card card-weather">
            <div className="float-card-icon">⛅</div>
            <div className="float-card-content">
              <span className="float-label">{t('heroFloatWeatherLabel')}</span>
              <span className="float-value">{t('heroFloatWeatherValue')}</span>
            </div>
          </div>
          <div className="hero-floating-card card-soil">
            <div className="float-card-icon">🌱</div>
            <div className="float-card-content">
              <span className="float-label">{t('heroFloatSoilLabel')}</span>
              <span className="float-value">{t('heroFloatSoilValue')}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="hero-scroll-hint" id="scroll-hint">
        <span>{t('heroScrollHint')}</span>
        <div className="scroll-arrow"></div>
      </div>
    </section>
  )
}

export default Hero
