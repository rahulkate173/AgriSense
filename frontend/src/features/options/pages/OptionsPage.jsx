import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Cloud, Search, MessageSquare, ArrowLeft, ShoppingBag, X, MapPin, Upload, Bell } from 'lucide-react';
import { useTranslation } from 'react-i18next';
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
      title: t('navWeather') || 'Weather',
      description: 'Get precise 7-day weather forecasts and real-time alerts tailored to your farm location.',
      icon: <Cloud size={48} color="#2a9d8f" />,
      link: '/weather',
      themeClass: 'weather-card'
    },
    {
      title: t('navDoctor') || 'Crop Doctor',
      description: 'Upload photos of your crop leaves and identify diseases instantly with AI-powered vision.',
      icon: <Search size={48} color="#e07a2c" />,
      link: '/disease',
      themeClass: 'doctor-card'
    },
    {
      title: t('navChat') || 'Agri Chat',
      description: 'Upload your soil reports and get conversational insights from your personal AI farm assistant.',
      icon: <MessageSquare size={48} color="#4a7c3f" />,
      link: '/upload_report',
      themeClass: 'chat-card'
    },
    {
      title: 'For Sale',
      description: 'List your crops directly to the marketplace and reach thousands of buyers instantly.',
      icon: <ShoppingBag size={48} color="#10b981" />,
      onClick: () => setIsSellModalOpen(true),
      themeClass: 'marketplace-card'
    },
    {
      title: 'Notifications',
      description: 'View active alerts, weather warnings, and personalized messages.',
      icon: <Bell size={48} color="#e63946" />,
      link: '/notifications',
      themeClass: 'notification-card'
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
          alert('Could not fetch location. Please ensure tracking is allowed.');
        }
      );
    } else {
      setIsLocating(false);
      alert('Geolocation not supported by your browser.');
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
      
      const res = await fetch('http://localhost:3000/api/marketplace/list', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to list crop');

      setToastMessage('Crop listed successfully!');
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
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
          <Link to="/" style={{ color: 'var(--olive)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold' }}>
            <ArrowLeft size={20} /> Back to Home
          </Link>
          <div style={{ padding: '0.5rem 1rem', background: 'rgba(74, 124, 63, 0.1)', borderRadius: '20px', color: 'var(--green-primary)', fontWeight: '600' }}>
            AgriSense Dashboard
          </div>
        </header>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: 'center', marginBottom: '4rem' }}
        >
          <h1 style={{ fontSize: '2.5rem', color: 'var(--olive)', marginBottom: '1rem', fontFamily: 'Outfit, sans-serif' }}>
            Select a Tool to Continue
          </h1>
          <p style={{ color: '#64748b', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
            Access our suite of precision agriculture tools designed to maximize your yield and protect your crops.
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
                  <p style={{ color: '#64748b', textAlign: 'center', lineHeight: '1.6' }}>
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
                  <p style={{ color: '#64748b', textAlign: 'center', lineHeight: '1.6' }}>
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
                background: 'white', borderRadius: '24px', padding: '2.5rem', width: '100%', maxWidth: '700px',
                maxHeight: '90vh', overflowY: 'auto', position: 'relative', boxShadow: '0 24px 64px rgba(0,0,0,0.2)'
              }}
            >
              <button 
                onClick={() => setIsSellModalOpen(false)}
                style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'rgba(0,0,0,0.05)', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              >
                <X size={20} color="#64748b" />
              </button>

              <h2 style={{ fontSize: '1.8rem', color: 'var(--olive-deep)', marginBottom: '1.5rem', fontWeight: '800' }}>List Crop for Sale</h2>
              
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
                      <p style={{ fontWeight: '600' }}>Click to upload crop image</p>
                    </div>
                  )}
                  <input type="file" accept="image/*" onChange={handleImageChange} required style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontWeight: '600', color: 'var(--olive-deep)', fontSize: '0.9rem' }}>Crop Name</label>
                    <input type="text" value={sellForm.cropName} onChange={e => setSellForm(f => ({...f, cropName: e.target.value}))} required placeholder="e.g., Tomatoes" style={{ padding: '0.8rem 1rem', borderRadius: '10px', border: '1px solid rgba(0,0,0,0.1)', outline: 'none' }} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontWeight: '600', color: 'var(--olive-deep)', fontSize: '0.9rem' }}>Price per kg (₹)</label>
                    <input type="number" value={sellForm.price} onChange={e => setSellForm(f => ({...f, price: e.target.value}))} required placeholder="e.g., 40" min="1" style={{ padding: '0.8rem 1rem', borderRadius: '10px', border: '1px solid rgba(0,0,0,0.1)', outline: 'none' }} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontWeight: '600', color: 'var(--olive-deep)', fontSize: '0.9rem' }}>Quantity (kg)</label>
                    <input type="number" value={sellForm.quantity} onChange={e => setSellForm(f => ({...f, quantity: e.target.value}))} required placeholder="Total available" min="1" style={{ padding: '0.8rem 1rem', borderRadius: '10px', border: '1px solid rgba(0,0,0,0.1)', outline: 'none' }} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontWeight: '600', color: 'var(--olive-deep)', fontSize: '0.9rem' }}>Location (City/District)</label>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <input type="text" value={sellForm.cityDistrict} onChange={e => setSellForm(f => ({...f, cityDistrict: e.target.value}))} required placeholder="e.g., Pune" style={{ flex: 1, padding: '0.8rem 1rem', borderRadius: '10px', border: '1px solid rgba(0,0,0,0.1)', outline: 'none' }} />
                      <button type="button" onClick={handleLocation} style={{ background: 'rgba(74, 124, 63, 0.1)', border: 'none', borderRadius: '10px', padding: '0 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--green-primary)' }}>
                        <MapPin size={20} />
                      </button>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontWeight: '600', color: 'var(--olive-deep)', fontSize: '0.9rem' }}>Description</label>
                  <textarea value={sellForm.description} onChange={e => setSellForm(f => ({...f, description: e.target.value}))} rows="3" placeholder="Additional details..." maxLength={500} style={{ padding: '0.8rem 1rem', borderRadius: '10px', border: '1px solid rgba(0,0,0,0.1)', outline: 'none', resize: 'none' }} />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1rem' }}>
                  <button type="submit" disabled={isSubmitting || !sellForm.lat} style={{ flex: 1, background: 'var(--green-primary)', color: 'white', padding: '1rem', borderRadius: '12px', border: 'none', fontWeight: 'bold', fontSize: '1.05rem', cursor: (isSubmitting || !sellForm.lat) ? 'not-allowed' : 'pointer', opacity: (isSubmitting || !sellForm.lat) ? 0.6 : 1, transition: 'all 0.3s' }}>
                    {isSubmitting ? 'Listing Crop...' : 'List Crop for Sale'}
                  </button>
                </div>
                {!sellForm.lat && <p style={{ color: 'var(--amber)', fontSize: '0.8rem', textAlign: 'center', marginTop: '-0.5rem' }}>* Please tap the location marker icon to verify your GPS coordinates before listing.</p>}
              </form>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OptionsPage;
