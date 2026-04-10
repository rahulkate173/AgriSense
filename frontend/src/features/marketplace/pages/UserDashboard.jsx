import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Search, Phone, ShoppingCart } from 'lucide-react';
import LanguageSwitcher from '../../../components/LanguageSwitcher.jsx';

const UserDashboard = () => {
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [radius, setRadius] = useState(50);
  const [search, setSearch] = useState('');
  const [userLoc, setUserLoc] = useState({ lat: null, lng: null });

  // Mock states for actions
  const [contactModal, setContactModal] = useState({ isOpen: false, phone: '', name: '' });
  const [buyModal, setBuyModal] = useState({ isOpen: false, item: null, qty: 1 });

  const fetchCrops = async (lat, lng, r, s) => {
    setLoading(true);
    try {
      const token = JSON.parse(localStorage.getItem('agrisense_user'))?.token;
      let url = `http://localhost:3000/api/marketplace/nearby?lat=${lat}&lng=${lng}&radiusKm=${r}`;
      if (s) url += `&search=${encodeURIComponent(s)}`;

      const res = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setCrops(data.data || []);
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setUserLoc({ lat: latitude, lng: longitude });
          fetchCrops(latitude, longitude, radius, search);
        },
        (err) => {
          console.error(err);
          setLoading(false);
        }
      );
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleApplyFilters = () => {
    if (userLoc.lat && userLoc.lng) {
      fetchCrops(userLoc.lat, userLoc.lng, radius, search);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#F3EDE4', padding: '2rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Top Header */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
          <Link to="/" style={{ color: 'var(--olive)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold' }}>
            <ArrowLeft size={20} /> Back to Home
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <LanguageSwitcher />
            <div style={{ padding: '0.5rem 1rem', background: 'rgba(74, 124, 63, 0.1)', borderRadius: '20px', color: 'var(--green-primary)', fontWeight: '600' }}>
              Buyer Dashboard
            </div>
          </div>
        </header>

        {/* Hero */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2.5rem', color: 'var(--text-primary)', fontWeight: 'bold', marginBottom: '0.5rem' }}>Nearby Crops for Sale</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Connect directly with local farmers and purchase fresh produce.</p>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', background: 'white', padding: '1.5rem', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid var(--border)', marginBottom: '3rem', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, minWidth: '250px', background: '#f8f9fa', padding: '0.75rem 1rem', borderRadius: '12px' }}>
            <Search size={20} color="var(--text-muted)" />
            <input 
              type="text" 
              placeholder="Search crops..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '0.95rem' }} 
            />
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', minWidth: '250px' }}>
            <span style={{ fontWeight: '600', color: 'var(--text-primary)', fontSize: '0.95rem' }}>Radius: {radius} km</span>
            <input 
              type="range" 
              min="10" max="100" step="10" 
              value={radius} 
              onChange={(e) => setRadius(e.target.value)}
              style={{ flex: 1, accentColor: 'var(--green-primary)' }} 
            />
          </div>

          <button 
            onClick={handleApplyFilters}
            style={{ background: 'var(--green-primary)', color: 'white', padding: '0.75rem 2rem', borderRadius: '10px', border: 'none', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.3s' }}
          >
            Apply Filters
          </button>
        </div>

        {/* Crops Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>Loading nearby crops...</div>
        ) : !userLoc.lat ? (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--amber)' }}>Please enable location services to find nearby crops.</div>
        ) : crops.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 0' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🌾</div>
            <h3 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>No crops found</h3>
            <p style={{ color: 'var(--text-muted)' }}>Try increasing your search radius or check back later.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
            {crops.map((crop, i) => (
              <motion.div 
                key={crop._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -5, boxShadow: '0 12px 30px rgba(0,0,0,0.1)' }}
                style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column' }}
              >
                {/* Image */}
                <div style={{ height: '220px', width: '100%', background: '#eaeaea', position: 'relative' }}>
                  {crop.imageUrl ? (
                    <img src={crop.imageUrl} alt={crop.cropName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a0a0a0' }}>No Image</div>
                  )}
                  <div style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'rgba(255,255,255,0.9)', padding: '0.4rem 0.8rem', borderRadius: '100px', fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--olive)', display: 'flex', alignItems: 'center', gap: '0.3rem', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
                    <MapPin size={14} /> {(crop.distance / 1000).toFixed(1)} km away
                  </div>
                </div>

                {/* Content */}
                <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <h2 style={{ fontSize: '1.4rem', fontWeight: 'bold', color: 'var(--text-primary)', margin: 0 }}>{crop.cropName}</h2>
                    <span style={{ fontSize: '1.4rem', fontWeight: 'bold', color: 'var(--green-primary)' }}>₹{crop.price}<span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>/kg</span></span>
                  </div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '1rem', flex: 1 }}>{crop.description}</p>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', color: 'var(--olive)', fontWeight: '600' }}>
                    <span style={{ background: 'rgba(74, 124, 63, 0.1)', padding: '0.3rem 0.6rem', borderRadius: '6px', fontSize: '0.85rem' }}>
                      {crop.quantity} kg available
                    </span>
                    <span style={{ background: '#f1f5f9', padding: '0.3rem 0.6rem', borderRadius: '6px', fontSize: '0.85rem', color: '#475569' }}>
                      By {crop.farmerName}
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '0.8rem' }}>
                    <button 
                      onClick={() => setBuyModal({ isOpen: true, item: crop, qty: 1 })}
                      style={{ flex: 1, background: 'var(--green-primary)', color: 'white', padding: '0.75rem', borderRadius: '10px', border: 'none', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', cursor: 'pointer' }}
                    >
                      <ShoppingCart size={18} /> Buy
                    </button>
                    <button 
                      onClick={() => setContactModal({ isOpen: true, phone: crop.farmerPhone, name: crop.farmerName })}
                      style={{ background: '#3B82F6', color: 'white', padding: '0.75rem 1.25rem', borderRadius: '10px', border: 'none', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', cursor: 'pointer' }}
                    >
                      <Phone size={18} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

      </div>

      {/* Buy Modal Mock */}
      {buyModal.isOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', padding: '2rem', borderRadius: '20px', width: '90%', maxWidth: '400px', textAlign: 'center' }}>
            <h2 style={{ marginBottom: '1rem' }}>Buy {buyModal.item.cropName}</h2>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <button onClick={() => setBuyModal(p => ({...p, qty: Math.max(1, p.qty - 1)}))} style={{ padding: '0.5rem 1rem', fontSize: '1.2rem', borderRadius: '8px', border: '1px solid #ccc' }}>-</button>
              <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{buyModal.qty} kg</span>
              <button onClick={() => setBuyModal(p => ({...p, qty: Math.min(p.item.quantity, p.qty + 1)}))} style={{ padding: '0.5rem 1rem', fontSize: '1.2rem', borderRadius: '8px', border: '1px solid #ccc' }}>+</button>
            </div>
            <h3 style={{ color: 'var(--green-primary)', fontSize: '1.8rem', marginBottom: '2rem' }}>Total: ₹{buyModal.item.price * buyModal.qty}</h3>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button onClick={() => setBuyModal({ isOpen: false, item: null, qty: 1 })} style={{ flex: 1, padding: '1rem', background: '#f1f5f9', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>Cancel</button>
              <button onClick={() => { alert('Mock Payment Gateway initiated!'); setBuyModal({ isOpen: false, item: null, qty: 1 }); }} style={{ flex: 1, padding: '1rem', background: 'var(--green-primary)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>Proceed to Pay</button>
            </div>
          </div>
        </div>
      )}

      {/* Contact Modal */}
      {contactModal.isOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', padding: '2rem', borderRadius: '20px', width: '90%', maxWidth: '400px', textAlign: 'center' }}>
            <Phone size={48} color="#3B82F6" style={{ margin: '0 auto 1.5rem' }} />
            <h2 style={{ marginBottom: '0.5rem' }}>Contact {contactModal.name}</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>You can reach the farmer directly at:</p>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--text-primary)', letterSpacing: '2px', marginBottom: '2rem', background: '#f0f9ff', padding: '1rem', borderRadius: '12px', border: '1px dashed #bae6fd' }}>
              {contactModal.phone}
            </div>
            <button onClick={() => setContactModal({ isOpen: false, phone: '', name: '' })} style={{ width: '100%', padding: '1rem', background: '#3B82F6', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>Close</button>
          </div>
        </div>
      )}

    </div>
  );
};

export default UserDashboard;
