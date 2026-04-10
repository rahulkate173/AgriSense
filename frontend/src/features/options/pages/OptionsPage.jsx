import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Cloud, Search, MessageSquare, ArrowLeft, ShoppingBag, X, MapPin, Upload, Bell, Calculator } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../../../components/LanguageSwitcher.jsx';
import '../../Home/styles/Home.css'; // Reuse home typography if needed
const OptionsPage = () => {
  const { t } = useTranslation();
  const [isSellModalOpen, setIsSellModalOpen] = React.useState(false);
  const [sellForm, setSellForm] = React.useState({
    cropName: '', price: '', quantity: '', description: '', lat: '', lng: '', cityDistrict: '', image: null
  });
  const [isLocating, setIsLocating] = React.useState(false);
  const [imagePreview, setImagePreview] = React.useState(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [toastMessage, setToastMessage] = React.useState('');
  const cards = [
    {
      title: t('navWeather') || ' Weather',
      description: t('weatherDesc'),
      icon: <Cloud size={48} color="#2a9d8f" />,
      link: '/weather',
      themeClass: 'weather-card'
    },
    {
      title: t('navDoctor') || ' Crop Doctor',
      description: t('doctorDesc'),
      icon: <Search size={48} color="#e07a2c" />,
      link: '/disease',
      themeClass: 'doctor-card'
    },
    {
      title: t('navChat') || 'Agri Chat',
      description: t('chatDesc'),
      icon: <MessageSquare size={48} color="#4a7c3f" />,
      link: '/upload_report',
      themeClass: 'chat-card'
    },
    {
      title: t('forSaleTitle') || 'For Sale',
      description: t('forSaleDesc'),
      icon: <ShoppingBag size={48} color="#10b981" />,
      onClick: () => setIsSellModalOpen(true),
      themeClass: 'marketplace-card'
    },
    {
      title: t('notificationsTitle') || 'Notifications',
      description: t('notificationsDesc'),
      icon: <Bell size={48} color="#e63946" />,
      link: '/notifications',
      themeClass: 'notification-card'
    },
    {
      title: t('calcTitle') || 'Pesticide Calculator',
      description: t('calcDesc'),
      icon: <Calculator size={48} color="var(--green-primary)" />,
      link: '/calculator',
      themeClass: 'calculator-card'
    }
  ];

  const handleLocation = () => {
    setIsLocating(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setSellForm((prev) => ({
            ...prev,
            lat: position.coords.latitude.toString(),
            lng: position.coords.longitude.toString(),
            cityDistrict: 'GPS Location Captured'
          }));
          setIsLocating(false);
        },
        (error) => {
          console.error(error);
          setIsLocating(false);
          alert(t('sellLocationRequired'));
        }
      );
    } else {
      setIsLocating(false);
      alert(t('sellLocationNotSupported'));
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSellForm((prev) => ({ ...prev, image: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSellSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const formData = new FormData();
      Object.keys(sellForm).forEach(key => {
        if (sellForm[key]) {
          formData.append(key, sellForm[key]);
        }
      });

      const token = JSON.parse(localStorage.getItem('agrisense_user'))?.token;
      
      const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://agrisense-lu27.onrender.com';
      const res = await fetch(`${BACKEND_URL}/api/marketplace/list`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to list crop');

      setToastMessage(t('sellSuccess'));
      setTimeout(() => setToastMessage(''), 3000);
      setIsSellModalOpen(false);
      setSellForm({ cropName: '', price: '', quantity: '', description: '', lat: '', lng: '', cityDistrict: '', image: null });
      setImagePreview(null);
    } catch (err) {
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#F3EDE4', padding: '2rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <header style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem', gap: '1rem' }}>
          <Link to="/" style={{ color: 'var(--olive)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold' }}>
            <ArrowLeft size={20} /> {t('backToHome')}
          </Link>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1rem' }}>
            <div style={{ padding: '0.5rem 1rem', background: 'rgba(74, 124, 63, 0.1)', borderRadius: '20px', color: 'var(--green-primary)', fontWeight: '600' }}>
              {t('optionsDashboard')}
            </div>
            <LanguageSwitcher />
          </div>
        </header>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: 'center', marginBottom: '4rem' }}
        >
          <h1 style={{ fontSize: '2.5rem', color: 'var(--olive)', fontFamily: 'Outfit, sans-serif' }}>
            {t('optionsTitle')}
          </h1>
          <p style={{ color: '#64748b', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
            {t('optionsSubtitle')}
          </p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          {cards.map((card, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -10, boxShadow: '0 20px 40px rgba(0,0,0,0.08)' }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              {card.onClick ? (
                <button
                  onClick={card.onClick}
                  style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', background: '#ffffff',
                    padding: '3rem 2rem', borderRadius: '24px', border: '1px solid rgba(0,0,0,0.05)',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', cursor: 'pointer', height: '100%', width: '100%',
                    fontFamily: 'inherit', textAlign: 'center'
                  }}
                >
                  <div style={{ marginBottom: '1.5rem', padding: '1.5rem', background: '#f8f9fa', borderRadius: '50%' }}>
                    {card.icon}
                  </div>
                  <h2 style={{ fontSize: '1.5rem', color: 'var(--olive)', marginBottom: '1rem', fontFamily: 'Outfit, sans-serif' }}>
                    {card.title}
                  </h2>
                  <p style={{ color: '#64748b', textAlign: 'center', lineHeight: '1.6',fontSize:'0.9rem' }}>
                    {card.description}
                  </p>
                </button>
              ) : (
                <Link 
                  to={card.link}
                  style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', background: '#ffffff',
                    padding: '3rem 2rem', borderRadius: '24px', textDecoration: 'none', color: 'inherit',
                    height: '100%', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
                  }}
                >
                  <div style={{ marginBottom: '1.5rem', padding: '1.5rem', background: '#f8f9fa', borderRadius: '50%' }}>
                    {card.icon}
                  </div>
                  <h2 style={{ fontSize: '1.5rem', color: 'var(--olive)', marginBottom: '1rem', fontFamily: 'Outfit, sans-serif' }}>
                    {card.title}
                  </h2>
                  <p style={{ color: '#64748b', textAlign: 'center', lineHeight: '1.6',fontSize:'0.8rem' }}>
                    {card.description}
                  </p>
                </Link>
              )}
            </motion.div>
          ))}
        </div>

        {/* Success Toast */}
        {toastMessage && (
          <div style={{
            position: 'fixed', top: '20px', right: '20px', background: 'var(--green-primary)', color: 'white',
            padding: '1rem 1.5rem', borderRadius: '12px', boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
            fontWeight: '600', zIndex: 1000, display: 'flex', alignItems: 'center', gap: '0.5rem'
          }}>
            ✅ {toastMessage}
          </div>
        )}

        {/* Sell Modal */}
        {isSellModalOpen && (
          <div style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999, padding: '1rem'
          }}>
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              style={{
                background: 'white', borderRadius: '24px', padding: '1.5rem', width: '100%', maxWidth: '700px',
                maxHeight: '90vh', overflowY: 'auto', position: 'relative', boxShadow: '0 24px 64px rgba(0,0,0,0.2)'
              }}
            >
              <button 
                onClick={() => setIsSellModalOpen(false)}
                style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'rgba(0,0,0,0.05)', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              >
                <X size={20} color="#64748b" />
              </button>

              <h2 style={{ fontSize: '1.8rem', color: 'var(--olive-deep)', marginBottom: '1.5rem', fontWeight: '800' }}>{t('sellModalTitle')}</h2>
              
              <form onSubmit={handleSellSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                
                {/* Image Upload */}
                <div style={{
                  border: '2px dashed rgba(74, 124, 63, 0.3)', borderRadius: '16px', padding: '2rem', textAlign: 'center',
                  background: 'rgba(74, 124, 63, 0.02)', cursor: 'pointer', position: 'relative'
                }}>
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" style={{ maxHeight: '150px', borderRadius: '8px', margin: '0 auto' }} />
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
                      <Upload size={32} color="var(--green-primary)" />
                      <p style={{ fontWeight: '600' }}>{t('sellImageLabel')}</p>
                    </div>
                  )}
                  <input type="file" accept="image/*" onChange={handleImageChange} required style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontWeight: '600', color: 'var(--olive-deep)', fontSize: '0.9rem' }}>{t('sellCropName')}</label>
                    <input type="text" value={sellForm.cropName} onChange={e => setSellForm(f => ({...f, cropName: e.target.value}))} required placeholder={t('sellCropPlaceholder')} style={{ padding: '0.8rem 1rem', borderRadius: '10px', border: '1px solid rgba(0,0,0,0.1)', outline: 'none' }} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontWeight: '600', color: 'var(--olive-deep)', fontSize: '0.9rem' }}>{t('sellPrice')}</label>
                    <input type="number" value={sellForm.price} onChange={e => setSellForm(f => ({...f, price: e.target.value}))} required placeholder={t('sellPricePlaceholder')} min="1" style={{ padding: '0.8rem 1rem', borderRadius: '10px', border: '1px solid rgba(0,0,0,0.1)', outline: 'none' }} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontWeight: '600', color: 'var(--olive-deep)', fontSize: '0.9rem' }}>{t('sellQty')}</label>
                    <input type="number" value={sellForm.quantity} onChange={e => setSellForm(f => ({...f, quantity: e.target.value}))} required placeholder={t('sellQtyPlaceholder')} min="1" style={{ padding: '0.8rem 1rem', borderRadius: '10px', border: '1px solid rgba(0,0,0,0.1)', outline: 'none' }} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontWeight: '600', color: 'var(--olive-deep)', fontSize: '0.9rem' }}>{t('sellLocation')}</label>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <input type="text" value={sellForm.cityDistrict} onChange={e => setSellForm(f => ({...f, cityDistrict: e.target.value}))} required placeholder={t('sellLocationPlaceholder')} style={{ flex: 1, padding: '0.8rem 1rem', borderRadius: '10px', border: '1px solid rgba(0,0,0,0.1)', outline: 'none' }} />
                      <button type="button" onClick={handleLocation} style={{ background: 'rgba(74, 124, 63, 0.1)', border: 'none', borderRadius: '10px', padding: '0 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--green-primary)' }}>
                        <MapPin size={20} />
                      </button>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontWeight: '600', color: 'var(--olive-deep)', fontSize: '0.9rem' }}>{t('sellDescription')}</label>
                  <textarea value={sellForm.description} onChange={e => setSellForm(f => ({...f, description: e.target.value}))} rows="3" placeholder={t('sellDescPlaceholder')} maxLength={500} style={{ padding: '0.8rem 1rem', borderRadius: '10px', border: '1px solid rgba(0,0,0,0.1)', outline: 'none', resize: 'none' }} />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1rem' }}>
                  <button type="submit" disabled={isSubmitting || !sellForm.lat} style={{ flex: 1, background: 'var(--green-primary)', color: 'white', padding: '1rem', borderRadius: '12px', border: 'none', fontWeight: 'bold', fontSize: '1.05rem', cursor: (isSubmitting || !sellForm.lat) ? 'not-allowed' : 'pointer', opacity: (isSubmitting || !sellForm.lat) ? 0.6 : 1, transition: 'all 0.3s' }}>
                    {isSubmitting ? t('sellListing') : t('sellBtn')}
                  </button>
                </div>
                {!sellForm.lat && <p style={{ color: 'var(--amber)', fontSize: '0.8rem', textAlign: 'center', marginTop: '-0.5rem' }}>{t('sellLocationNote')}</p>}
              </form>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OptionsPage;
