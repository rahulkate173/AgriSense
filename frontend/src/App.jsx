import { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './features/Home/pages/Home.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'

const WeatherPage  = lazy(() => import('./features/weather/pages/WeatherPage.jsx'))
const LoginPage    = lazy(() => import('./features/auth/pages/LoginPage.jsx'))
const RegisterPage = lazy(() => import('./features/auth/pages/RegisterPage.jsx'))
const DiseasePage  = lazy(() => import('./features/upload/pages/DiseasePage.jsx'))
const ChatUploadPage = lazy(() => import('./features/chat/pages/ChatUploadPage.jsx'))
const ChatPage     = lazy(() => import('./features/chat/pages/ChatPage.jsx'))
const OptionsPage  = lazy(() => import('./features/options/pages/OptionsPage.jsx'))
const UserDashboard = lazy(() => import('./features/marketplace/pages/UserDashboard.jsx'))
const NotificationsPage = lazy(() => import('./features/notifications/pages/NotificationsPage.jsx'))

import { NotificationProvider } from './contexts/NotificationContext.jsx';

const AuthFallback = () => (
  <div style={{ minHeight: '100vh', background: '#1a2510' }} />
)

const App = () => {
  return (
    <NotificationProvider>
      <BrowserRouter>
        <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/weather"
          element={
            <Suspense fallback={<div style={{ minHeight: '100vh', background: '#0f172a' }} />}>
              <WeatherPage />
            </Suspense>
          }
        />
        <Route
          path="/login"
          element={
            <Suspense fallback={<AuthFallback />}>
              <LoginPage />
            </Suspense>
          }
        />
        <Route
          path="/register"
          element={
            <Suspense fallback={<AuthFallback />}>
              <RegisterPage />
            </Suspense>
          }
        />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route
            path="/options"
            element={
              <Suspense fallback={<div style={{ minHeight: '100vh', background: '#f8f9fa' }} />}>
                <OptionsPage />
              </Suspense>
            }
          />
          <Route
            path="/weather"
            element={
              <Suspense fallback={<div style={{ minHeight: '100vh', background: '#0f172a' }} />}>
                <WeatherPage />
              </Suspense>
            }
          />
          <Route
            path="/disease"
            element={
              <Suspense fallback={<div style={{ minHeight: '100vh', background: '#f2ede4' }} />}>
                <DiseasePage />
              </Suspense>
            }
          />
          <Route
            path="/upload_report"
            element={
              <Suspense fallback={<div style={{ minHeight: '100vh', background: '#f2ede4' }} />}>
                <ChatUploadPage />
              </Suspense>
            }
          />
          <Route
            path="/user-dashboard"
            element={
              <Suspense fallback={<div style={{ minHeight: '100vh', background: '#f8f9fa' }} />}>
                <UserDashboard />
              </Suspense>
            }
          />
          <Route
            path="/chat"
            element={
              <Suspense fallback={<div style={{ minHeight: '100vh', background: '#f2ede4' }} />}>
                <ChatPage />
              </Suspense>
            }
          />
          <Route
            path="/notifications"
            element={
              <Suspense fallback={<div style={{ minHeight: '100vh', background: '#f8f9fa' }} />}>
                <NotificationsPage />
              </Suspense>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
    </NotificationProvider>
  )
}

export default App
