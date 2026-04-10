import { useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import LanguageSwitcher from '../../../components/LanguageSwitcher.jsx'

const Navbar = () => {
  const navbarRef = useRef(null)
  const hamburgerRef = useRef(null)
  const navLinksRef = useRef(null)
  const navigate = useNavigate()
  const { t } = useTranslation()

  const storedUser = (() => {
    try { return JSON.parse(localStorage.getItem('agrisense_user')) } catch { return null }
  })()

  useEffect(() => {
    const handleScroll = () => {
      if (navbarRef.current) {
        navbarRef.current.classList.toggle('navbar--scrolled', window.scrollY > 60)
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleMenu = () => {
    hamburgerRef.current?.classList.toggle('open')
    navLinksRef.current?.classList.toggle('nav-links--open')
  }

  const handleNavClick = (e, href) => {
    e.preventDefault()
    const target = document.querySelector(href)
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    navLinksRef.current?.classList.remove('nav-links--open')
    hamburgerRef.current?.classList.remove('open')
  }

  const handleLogout = () => {
    localStorage.removeItem('agrisense_user')
    navigate('/')
    window.location.reload()
  }

  return (
    <nav className="navbar" ref={navbarRef} id="navbar">
      <div className="nav-inner">
        <div className="nav-logo">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <circle cx="16" cy="16" r="15" stroke="#4a7c3f" strokeWidth="1.5"/>
            <path d="M16 26 C16 26, 8 20, 8 13 C8 9, 11.5 6, 16 6 C20.5 6, 24 9, 24 13 C24 20, 16 26, 16 26Z" fill="#4a7c3f" opacity="0.2"/>
            <path d="M16 8 L16 22" stroke="#4a7c3f" strokeWidth="1.2"/>
            <path d="M16 12 C16 12, 19 10, 21 12" stroke="#4a7c3f" strokeWidth="1.2" strokeLinecap="round"/>
            <path d="M16 16 C16 16, 13 14, 11 16" stroke="#4a7c3f" strokeWidth="1.2" strokeLinecap="round"/>
          </svg>
          <span className="logo-text">AgriSense</span>
        </div>

        <ul className="nav-links" ref={navLinksRef} id="nav-links">
          {[
            ['#problem', t('navProblem')],
            ['#solution', t('navSolution')],
            ['#features', t('navFeatures')],
            ['#technology', t('navTechnology')],
            ['#impact', t('navImpact')]
          ].map(([href, label]) => (
            <li key={href}>
              <a href={href} onClick={(e) => handleNavClick(e, href)}>{label}</a>
            </li>
          ))}
        </ul>

        <div className="nav-cta" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <LanguageSwitcher />
          {storedUser ? (
            <>
              <Link to="/options" style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--olive)', padding: '0 0.5rem', textDecoration: 'none' }}>
                {t('navDashboard')}
              </Link>
              <button onClick={handleLogout} className="btn btn-ghost" id="nav-logout-btn" style={{ padding: '0.6rem 1.1rem', fontSize: '0.875rem' }}>
                {t('navSignOut')}
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost" id="nav-login-btn" style={{ padding: '0.6rem 1.2rem', fontSize: '0.875rem' }}>
                {t('navSignIn')}
              </Link>
              <Link to="/register" className="btn btn-primary" id="nav-register-btn" style={{ padding: '0.6rem 1.2rem', fontSize: '0.875rem' }}>
                {t('navGetStarted')}
              </Link>
            </>
          )}
        </div>

        <button className="nav-hamburger" ref={hamburgerRef} id="hamburger" aria-label="Toggle menu" onClick={toggleMenu}>
          <span></span><span></span><span></span>
        </button>
      </div>
    </nav>
  )
}

export default Navbar
