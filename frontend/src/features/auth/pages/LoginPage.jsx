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

const LoginPage = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState('')
  const [success, setSuccess] = useState(false)

  const validate = () => {
    const e = {}
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Valid email required'
    if (!form.password || form.password.length < 6) e.password = 'Minimum 6 characters'
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
      const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://agrisense-lu27.onrender.com';
      const res = await fetch(`${BACKEND_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, password: form.password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Login failed')

      // Persist minimal user info
      localStorage.setItem('agrisense_user', JSON.stringify(data.data))

      setSuccess(true)
      setTimeout(() => {
        if (data.data.role === 'user') {
          navigate('/user-dashboard')
        } else {
          navigate('/options')
        }
      }, 1500)
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
            Welcome back, <em>farmer</em>
          </h1>
          <p className="auth-visual-sub">
            Sign in to access your personalized crop dashboard, real-time weather alerts, and AI-powered soil insights.
          </p>

          <div className="auth-stats">
            <div className="auth-stat">
              <span className="auth-stat-num">50K+</span>
              <span className="auth-stat-label">Active Farmers</span>
            </div>
            <div className="auth-stat">
              <span className="auth-stat-num">18</span>
              <span className="auth-stat-label">States Covered</span>
            </div>
            <div className="auth-stat">
              <span className="auth-stat-num">99.9%</span>
              <span className="auth-stat-label">Uptime</span>
            </div>
          </div>
        </div>

        <div className="auth-feature-pills">
          {[
            { icon: '🌾', text: 'Personalized crop advisory' },
            { icon: '⛅', text: '7-day precision weather forecasts' },
            { icon: '📉', text: 'Water & input cost reduction' },
            { icon: '🔔', text: 'Pest & disease early warnings' },
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
            <span className="auth-form-tag">Welcome Back</span>
            <h2 className="auth-form-title">Sign in to AgriSense</h2>
            <p className="auth-form-subtitle">
              Don't have an account?{' '}
              <Link to="/register">Create one free</Link>
            </p>
          </div>

          {success && (
            <div className="auth-alert auth-alert--success" style={{ marginBottom: '1.25rem' }}>
              <span className="auth-alert-icon">✅</span>
              <span>Login successful! Redirecting…</span>
            </div>
          )}

          {apiError && (
            <div className="auth-alert auth-alert--error" style={{ marginBottom: '1.25rem' }}>
              <span className="auth-alert-icon">⚠️</span>
              <span>{apiError}</span>
            </div>
          )}

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            {/* Email */}
            <div className="auth-field">
              <label htmlFor="login-email">Email Address</label>
              <div className="auth-input-wrap">
                <span className="auth-input-icon">✉️</span>
                <input
                  id="login-email"
                  name="email"
                  type="email"
                  className={`auth-input${errors.email ? ' error' : ''}`}
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  autoComplete="email"
                  autoFocus
                />
              </div>
              {errors.email && <span className="auth-field-error">⚡ {errors.email}</span>}
            </div>

            {/* Password */}
            <div className="auth-field">
              <label htmlFor="login-password">Password</label>
              <div className="auth-input-wrap">
                <span className="auth-input-icon">🔒</span>
                <input
                  id="login-password"
                  name="password"
                  type={showPw ? 'text' : 'password'}
                  className={`auth-input${errors.password ? ' error' : ''}`}
                  placeholder="Your password"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                />
                <button type="button" className="auth-eye-btn" onClick={() => setShowPw(v => !v)} aria-label="Toggle password visibility">
                  {showPw ? '🙈' : '👁️'}
                </button>
              </div>
              {errors.password && <span className="auth-field-error">⚡ {errors.password}</span>}
            </div>

            {/* Forgot password */}
            <div style={{ textAlign: 'right', marginTop: '-0.3rem' }}>
              <a href="#" className="auth-forgot">Forgot password?</a>
            </div>

            <button type="submit" className="auth-submit" id="login-submit-btn" disabled={loading || success}>
              {loading ? (
                <><div className="auth-submit-spinner" /> Signing In…</>
              ) : (
                <>🌿 Sign In</>
              )}
            </button>

            <div className="auth-divider">
              <div className="auth-divider-line" />
              <span>or</span>
              <div className="auth-divider-line" />
            </div>

            <div style={{ textAlign: 'center' }}>
              <Link to="/register" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', border: '1.5px solid var(--border-strong)', borderRadius: '10px', fontSize: '0.9rem', fontWeight: '700', color: 'var(--olive)', transition: 'all 0.3s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--green-primary)'; e.currentTarget.style.background = 'rgba(74,124,63,0.05)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-strong)'; e.currentTarget.style.background = 'transparent' }}
              >
                🌱 Create a free account
              </Link>
            </div>

            <p className="auth-terms">
              Protected by industry-standard encryption. Your data stays private.
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
