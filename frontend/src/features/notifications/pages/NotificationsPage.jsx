import React from 'react';
import { motion } from 'framer-motion';
import { useNotification } from '../../../contexts/NotificationContext';
import { Bell, CloudRain, ShieldAlert, ArrowLeft, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import '../styles/Notifications.css';

const NotificationsPage = () => {
  const { notifications, clearNotifications, addNotification } = useNotification();

  const triggerMockNotification = () => {
    addNotification(
      'Heavy Rain Alert',
      'Heavy rainfall is expected in your area tomorrow. Please take necessary precautions and secure your harvested crops.',
      'weather'
    );
  };

  const getIcon = (type) => {
    switch (type) {
      case 'weather':
        return <CloudRain className="notif-icon" size={18} color="#2a9d8f" />;
      case 'alert':
        return <ShieldAlert className="notif-icon" size={18} color="#e63946" />;
      default:
        return <Bell className="notif-icon" size={18} color="#4a7c3f" />;
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#F3EDE4', padding: '2rem' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem', flexWrap: 'wrap', gap: '1rem' }}>
          <Link to="/options" style={{ color: 'var(--olive)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold' }}>
            <ArrowLeft size={20} /> Back to Options
          </Link>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <button 
              onClick={triggerMockNotification}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.2rem',
                background: '#ffe4e6', color: '#e11d48', border: '1px solid #fecdd3', borderRadius: '20px',
                cursor: 'pointer', fontWeight: 'bold'
              }}
            >
              <Bell size={16} /> Test Mock notification
            </button>
            <div style={{ padding: '0.5rem 1rem', background: 'rgba(74, 124, 63, 0.1)', borderRadius: '20px', color: 'var(--green-primary)', fontWeight: '600' }}>
              Notifications System
            </div>
          </div>
        </header>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}
        >
          <div>
            <h1 style={{ fontSize: '2.5rem', color: 'var(--olive)', marginBottom: '0.5rem', fontFamily: 'Outfit, sans-serif' }}>
              Your Notifications
            </h1>
            <p style={{ color: '#64748b', fontSize: '1.1rem' }}>
              Stay updated with the latest alerts for your farm.
            </p>
          </div>
          
          {notifications.length > 0 && (
            <button 
              onClick={clearNotifications}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.8rem 1.2rem',
                background: 'white', color: '#e63946', border: '1px solid #fee2e2', borderRadius: '12px',
                cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
              }}
            >
              <Trash2 size={18} /> Clear All
            </button>
          )}
        </motion.div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {notifications.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 2rem', background: 'white', borderRadius: '24px', color: '#94a3b8' }}>
              <Bell size={48} style={{ opacity: 0.2, marginBottom: '1rem', display: 'block', margin: '0 auto 1rem auto' }} />
              <h3 style={{fontFamily: 'Outfit, sans-serif', fontSize: '1.5rem', color: '#64748b', marginBottom: '0.5rem'}}>No new notifications</h3>
              <p>You're all caught up!</p>
            </div>
          ) : (
            notifications.map((notif, idx) => (
              <motion.div
                key={notif.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="notification-card"
                style={{
                  borderLeft: `4px solid ${notif.type === 'weather' ? '#2a9d8f' : notif.type === 'alert' ? '#e63946' : '#4a7c3f'}`,
                  boxShadow: '0 2px 4px rgba(0,0,0,0.04)'
                }}
              >
                <div className="notification-icon-wrapper">
                  {getIcon(notif.type)}
                </div>
                <div className="notification-content">
                  <div className="notification-title-row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <h3 style={{ margin: 0, color: 'var(--olive-deep)', fontSize: '1rem', fontWeight: '700', fontFamily: 'Outfit, sans-serif' }}>{notif.title}</h3>
                    <span className="notification-timestamp" style={{ color: '#94a3b8', fontSize: '0.75rem', marginTop: '0.1rem' }}>
                      {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p style={{ margin: 0, color: '#64748b', fontSize: '0.85rem', lineHeight: '1.4' }}>{notif.message}</p>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
