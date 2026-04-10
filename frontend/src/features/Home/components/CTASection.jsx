import { useState } from 'react'
import { useTranslation } from 'react-i18next'

const CTASection = () => {
  const { t } = useTranslation()
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({ name: '', phone: '', state: '', crop: '' })

  const states = t('ctaStates', { returnObjects: true }) || []
  const crops = t('ctaCrops', { returnObjects: true }) || []

  const handleChange = (e) => setForm({ ...form, [e.target.id.replace('form-', '')]: e.target.value })

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <section className="cta-section" id="contact">
      <div className="cta-bg-grid">
        <div className="vline"></div>
        <div className="vline"></div>
        <div className="vline"></div>
      </div>
      <div className="container">
        <div className="cta-inner">
          <div className="cta-badge">{t('ctaBadge')}</div>
          <h2 className="cta-heading" style={{ whiteSpace: 'pre-line' }}>
            {t('ctaHeading')}
          </h2>
          <p className="cta-sub">
            {t('ctaSub')}
          </p>

          {!submitted ? (
            <form className="cta-form" id="cta-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="form-name">{t('ctaNameLabel')}</label>
                  <input type="text" id="form-name" placeholder={t('ctaNamePlaceholder')} required value={form.name} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label htmlFor="form-phone">{t('ctaPhoneLabel')}</label>
                  <input type="tel" id="form-phone" placeholder={t('ctaPhonePlaceholder')} required value={form.phone} onChange={handleChange} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="form-state">{t('ctaStateLabel')}</label>
                  <select id="form-state" required value={form.state} onChange={handleChange}>
                    <option value="">{t('ctaStatePlaceholder')}</option>
                    {states.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="form-crop">{t('ctaCropLabel')}</label>
                  <select id="form-crop" required value={form.crop} onChange={handleChange}>
                    <option value="">{t('ctaCropPlaceholder')}</option>
                    {crops.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <button type="submit" className="btn btn-primary btn-xl" id="form-submit-btn">
                {t('ctaSubmitBtn')}
              </button>
            </form>
          ) : (
            <div className="cta-form-success" id="form-success">
              <div className="success-icon">✅</div>
              <h3>{t('ctaSuccessTitle')}</h3>
              <p>{t('ctaSuccessDesc')}</p>
            </div>
          )}

          <p className="cta-note">{t('ctaNote')}</p>
        </div>
      </div>
    </section>
  )
}

export default CTASection
