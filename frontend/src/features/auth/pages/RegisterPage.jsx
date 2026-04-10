import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../styles/Auth.css'

const AgriLogo = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <circle cx="16" cy="16" r="15" stroke="#4a7c3f" strokeWidth="1.5"/>
    <path d="M16 26 C16 26, 8 20, 8 13 C8 9, 11.5 6, 16 6 C20.5 6, 24 9, 24 13 C24 20, 16 26, 16 26Z" fill="#4a7c3f" opacity="0.2"/>
    <path d="M16 8 L16 22" stroke="#4a7c3f" strokeWidth="1.2"/>
    <path d="M16 12 C16 12, 19 10, 21 12" stroke="#4a7c3f" strokeWidth="1.2" strokeLinecap="round"/>
    <path d="M16 16 C16 16, 13 14, 11 16" stroke="#4a7c3f" strokeWidth="1.2" strokeLinecap="round"/>
  </svg>
)

const getPasswordStrength = (pw) => {
  if (!pw) return { score: 0, label: '', cls: '' }
  let score = 0
  if (pw.length >= 6) score++
  if (pw.length >= 10) score++
  if (/[A-Z]/.test(pw) && /[0-9]/.test(pw)) score++
  if (/[^A-Za-z0-9]/.test(pw)) score++
  const map = ['', 'weak', 'fair', 'good', 'strong']
  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong']
  return { score, label: labels[score], cls: map[score] }
}

const RegisterPage = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    fullName: '', email: '', phone: '', role: 'farmer', password: '', confirmPassword: ''
  })
  const [errors, setErrors] = useState({})
  const [showPw, setShowPw] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState('')
  const [success, setSuccess] = useState(false)

  const pwStrength = getPasswordStrength(form.password)

  const validate = () => {
    const e = {}
    if (!form.fullName.trim() || form.fullName.trim().length < 2) e.fullName = 'At least 2 characters'
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Valid email required'
    if (!form.password || form.password.length < 6) e.password = 'Minimum 6 characters'
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match'
    return e
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
    if (errors[name]) setErrors(er => ({ ...er, [name]: '' }))
    setApiError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    setLoading(true)
    setApiError('')
    try {
      const res = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: form.fullName,
          email: form.email,
          password: form.password,
          phone: form.phone,
          role: form.role,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Registration failed')
      setSuccess(true)
      setTimeout(() => navigate('/login'), 2000)
    } catch (err) {
      setApiError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-root">
      {/* ── Left Visual Panel ── */}
      <div className="auth-visual">
        <div className="auth-visual-bg" />
        <div className="auth-visual-grid" />
        <div className="auth-visual-glow" />
        <div className="auth-visual-glow-2" />

        <div className="auth-visual-content">
          <Link to="/" className="auth-logo">
            <AgriLogo />
            <span className="auth-logo-text">AgriSense</span>
          </Link>

          <h1 className="auth-visual-headline">
            Join 50,000+ farmers growing <em>smarter</em>
          </h1>
          <p className="auth-visual-sub">
            Get real-time weather, soil analytics, and AI-powered crop advisory — all in one intelligent platform built for Indian agriculture.
          </p>

          <div className="auth-stats">
            <div className="auth-stat">
              <span className="auth-stat-num">94%</span>
              <span className="auth-stat-label">Prediction Accuracy</span>
            </div>
            <div className="auth-stat">
              <span className="auth-stat-num">2.3×</span>
              <span className="auth-stat-label">Avg. Yield Boost</span>
            </div>
            <div className="auth-stat">
              <span className="auth-stat-num">28%</span>
              <span className="auth-stat-label">Water Saved</span>
            </div>
          </div>
        </div>

        <div className="auth-feature-pills">
          {[
            { icon: '🌡️', text: 'Hyper-local weather forecasts' },
            { icon: '🧪', text: 'Real-time soil health monitoring' },
            { icon: '🤖', text: 'AI crop disease detection' },
            { icon: '📊', text: 'Market price intelligence' },
          ].map(({ icon, text }) => (
            <div className="auth-pill" key={text}>
              <span className="auth-pill-icon">{icon}</span>
              <span className="auth-pill-text">{text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right Form Panel ── */}
      <div className="auth-form-panel">
        <div className="auth-form-wrap">
          <div className="auth-form-header">
            <span className="auth-form-tag">Create Account</span>
            <h2 className="auth-form-title">Start your free journey</h2>
            <p className="auth-form-subtitle">
              Already have an account?{' '}
              <Link to="/login">Sign In</Link>
            </p>
          </div>

          {success && (
            <div className="auth-alert auth-alert--success" style={{ marginBottom: '1.25rem' }}>
              <span className="auth-alert-icon">✅</span>
              <span>Account created! Redirecting to login…</span>
            </div>
          )}

          {apiError && (
            <div className="auth-alert auth-alert--error" style={{ marginBottom: '1.25rem' }}>
              <span className="auth-alert-icon">⚠️</span>
              <span>{apiError}</span>
            </div>
          )}

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            {/* Full Name */}
            <div className="auth-field">
              <label htmlFor="reg-fullName">Full Name</label>
              <div className="auth-input-wrap">
                <span className="auth-input-icon">👤</span>
                <input
                  id="reg-fullName"
                  name="fullName"
                  type="text"
                  className={`auth-input${errors.fullName ? ' error' : ''}`}
                  placeholder="Ramesh Kumar"
                  value={form.fullName}
                  onChange={handleChange}
                  autoComplete="name"
                />
              </div>
              {errors.fullName && <span className="auth-field-error">⚡ {errors.fullName}</span>}
            </div>

            {/* Email & Phone */}
            <div className="auth-form-row">
              <div className="auth-field">
                <label htmlFor="reg-email">Email</label>
                <div className="auth-input-wrap">
                  <span className="auth-input-icon">✉️</span>
                  <input
                    id="reg-email"
                    name="email"
                    type="email"
                    className={`auth-input${errors.email ? ' error' : ''}`}
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={handleChange}
                    autoComplete="email"
                  />
                </div>
                {errors.email && <span className="auth-field-error">⚡ {errors.email}</span>}
              </div>

              <div className="auth-field">
                <label htmlFor="reg-phone">Phone (optional)</label>
                <div className="auth-input-wrap">
                  <span className="auth-input-icon">📱</span>
                  <input
                    id="reg-phone"
                    name="phone"
                    type="tel"
                    className="auth-input"
                    placeholder="+91 98765 43210"
                    value={form.phone}
                    onChange={handleChange}
                    autoComplete="tel"
                  />
                </div>
              </div>
            </div>

            {/* Role */}
            <div className="auth-field">
              <label htmlFor="reg-role">I am a</label>
              <div className="auth-input-wrap auth-select-wrap">
                <span className="auth-input-icon">🌾</span>
                <select
                  id="reg-role"
                  name="role"
                  className="auth-select"
                  value={form.role}
                  onChange={handleChange}
                >
                  <option value="farmer">Farmer</option>
                  <option value="user">Buyer / User</option>
                </select>
              </div>
            </div>

            {/* Password */}
            <div className="auth-field">
              <label htmlFor="reg-password">Password</label>
              <div className="auth-input-wrap">
                <span className="auth-input-icon">🔒</span>
                <input
                  id="reg-password"
                  name="password"
                  type={showPw ? 'text' : 'password'}
                  className={`auth-input${errors.password ? ' error' : ''}`}
                  placeholder="Min. 6 characters"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                />
                <button type="button" className="auth-eye-btn" onClick={() => setShowPw(v => !v)} aria-label="Toggle password visibility">
                  {showPw ? '🙈' : '👁️'}
                </button>
              </div>
              {form.password && (
                <div className="auth-pw-strength">
                  <div className="auth-pw-bars">
                    {[1,2,3,4].map(i => (
                      <div
                        key={i}
                        className={`auth-pw-bar ${pwStrength.score >= i ? `active-${pwStrength.cls}` : ''}`}
                      />
                    ))}
                  </div>
                  <span className={`auth-pw-label ${pwStrength.cls}`}>{pwStrength.label}</span>
                </div>
              )}
              {errors.password && <span className="auth-field-error">⚡ {errors.password}</span>}
            </div>

            {/* Confirm Password */}
            <div className="auth-field">
              <label htmlFor="reg-confirmPassword">Confirm Password</label>
              <div className="auth-input-wrap">
                <span className="auth-input-icon">🔒</span>
                <input
                  id="reg-confirmPassword"
                  name="confirmPassword"
                  type={showConfirm ? 'text' : 'password'}
                  className={`auth-input${errors.confirmPassword ? ' error' : ''}`}
                  placeholder="Re-enter password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  autoComplete="new-password"
                />
                <button type="button" className="auth-eye-btn" onClick={() => setShowConfirm(v => !v)} aria-label="Toggle confirm password visibility">
                  {showConfirm ? '🙈' : '👁️'}
                </button>
              </div>
              {errors.confirmPassword && <span className="auth-field-error">⚡ {errors.confirmPassword}</span>}
            </div>

            <button type="submit" className="auth-submit" id="register-submit-btn" disabled={loading || success}>
              {loading ? (
                <><div className="auth-submit-spinner" /> Creating Account…</>
              ) : (
                <>🌱 Create Account</>
              )}
            </button>

            <p className="auth-terms">
              By creating an account you agree to our{' '}
              <a href="#">Terms of Service</a> and{' '}
              <a href="#">Privacy Policy</a>.
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage
