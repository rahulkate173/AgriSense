import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'

const testimonials = [
  {
    id: 'test-1',
    quoteKey: 'test1Quote',
    initials: 'RS',
    nameKey: 'test1Name',
    locKey: 'test1Loc',
    gainKey: 'test1Gain',
  },
  {
    id: 'test-2',
    quoteKey: 'test2Quote',
    initials: 'PD',
    nameKey: 'test2Name',
    locKey: 'test2Loc',
    gainKey: 'test2Gain',
  },
  {
    id: 'test-3',
    quoteKey: 'test3Quote',
    initials: 'AK',
    nameKey: 'test3Name',
    locKey: 'test3Loc',
    gainKey: 'test3Gain',
  },
]

const hiwSteps = [
  {
    num: '01',
    titleKey: 'hiw1Title',
    descKey: 'hiw1Desc',
  },
  {
    num: '02',
    titleKey: 'hiw2Title',
    descKey: 'hiw2Desc',
  },
  {
    num: '03',
    titleKey: 'hiw3Title',
    descKey: 'hiw3Desc',
  },
]

const Impact = () => {
  const testRefs = useRef([])
  const hiwRefs = useRef([])
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
    ;[...testRefs.current, ...hiwRefs.current].forEach((el) => { if (el) observer.observe(el) })
    return () => observer.disconnect()
  }, [])

  return (
    <section className="impact" id="impact">
      <div className="section-grid-lines">
        <div className="vline"></div>
        <div className="vline"></div>
        <div className="vline"></div>
      </div>
      <div className="container">
        <div className="section-header">
          <span className="section-tag">{t('impactTag')}</span>
          <h2 className="section-title">{t('impactTitle')}</h2>
        </div>

        <div className="testimonials-grid">
          {testimonials.map((test, i) => (
            <div
              className="testimonial-card"
              id={test.id}
              key={test.id}
              ref={(el) => (testRefs.current[i] = el)}
              style={{ transitionDelay: `${i * 0.1}s` }}
            >
              <div className="test-quote">{t(test.quoteKey)}</div>
              <div className="test-footer">
                <div className="test-avatar">{test.initials}</div>
                <div className="test-info">
                  <span className="test-name">{t(test.nameKey)}</span>
                  <span className="test-loc">{t(test.locKey)}</span>
                </div>
                <div className="test-gain">{t(test.gainKey)}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="hiw-section" id="how-it-works">
          <div className="section-header section-header--center" style={{ marginTop: '5rem' }}>
            <span className="section-tag">{t('hiwTag')}</span>
            <h2 className="section-title">{t('hiwTitle')}</h2>
          </div>
          <div className="hiw-steps">
            {hiwSteps.map((step, i) => (
              <div
                className="hiw-step"
                id={`hiw-${i + 1}`}
                key={step.num}
                ref={(el) => (hiwRefs.current[i] = el)}
                style={{ transitionDelay: `${i * 0.1}s` }}
              >
                <div className="hiw-step-num">{step.num}</div>
                <div className="hiw-step-connector"></div>
                <div className="hiw-step-body">
                  <h4>{t(step.titleKey)}</h4>
                  <p>{t(step.descKey)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Impact
