import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ArrowLeft, Calculator, Droplets, FlaskConical, Languages } from 'lucide-react';
import { Link } from 'react-router-dom';

const PesticideCalculator = () => {
  const { t, i18n } = useTranslation();
  
  const [formData, setFormData] = useState({
    area: '',
    rate: '',
    volume: '',
    tankSize: ''
  });
  
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
  const [isCalculating, setIsCalculating] = useState(false);
  const resultsRef = useRef(null);

  useEffect(() => {
    if (results && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [results]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Allow empty string to easily clear fields, only allow numbers and decimals
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setFormData(prev => ({ ...prev, [name]: value }));
      setError('');
    }
  };

  const handleLanguageToggle = () => {
    const langs = ['en', 'hi', 'mr'];
    const currentIndex = langs.indexOf(i18n.language);
    const nextIndex = (currentIndex + 1) % langs.length;
    i18n.changeLanguage(langs[nextIndex]);
    localStorage.setItem('lang', langs[nextIndex]);
  };

  const currentLangLabel = () => {
    if (i18n.language === 'en') return 'English';
    if (i18n.language === 'hi') return 'हिन्दी';
    if (i18n.language === 'mr') return 'मराठी';
    return 'English';
  };

  const calculateResults = async (e) => {
    e.preventDefault();
    setError('');

    const area = parseFloat(formData.area);
    const rate = parseFloat(formData.rate);
    const volume = parseFloat(formData.volume);
    const tankSize = parseFloat(formData.tankSize);

    // Validation
    if (!area || area <= 0 || !rate || rate <= 0 || !volume || volume <= 0 || !tankSize || tankSize <= 0) {
      setError(t('calcError') || 'Please enter positive values for all fields.');
      return;
    }

    setIsCalculating(true);

    try {
      // Bonus: Try to calculate via backend endpoint first
      const res = await fetch('http://localhost:3000/api/calculator/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ area, pesticideRate: rate, sprayVolume: volume, tankSize })
      });

      if (res.ok) {
        const data = await res.json();
        setResults(data.data);
      } else {
        throw new Error('Backend failed');
      }
    } catch (err) {
      // Fallback: Client-side calculation if backend is not available
      const totalPesticide = area * rate;
      const pesticidePerTank = (tankSize / volume) * rate;
      const numberOfTanks = (area * volume) / tankSize;
      const totalWater = area * volume;

      setResults({
        totalPesticide: totalPesticide.toFixed(2),
        pesticidePerTank: pesticidePerTank.toFixed(2),
        numberOfTanks: numberOfTanks.toFixed(2),
        totalWater: totalWater.toFixed(2)
      });
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#F3EDE4', padding: '2rem' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
          <Link to="/options" style={{ color: 'var(--olive)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold' }}>
            <ArrowLeft size={20} /> {t('backToOptions') || 'Back'}
          </Link>
          <button 
            onClick={handleLanguageToggle}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', 
              background: 'white', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '20px', 
              color: 'var(--olive)', fontWeight: '600', cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
            }}
          >
            <Languages size={18} /> {currentLangLabel()}
          </button>
        </header>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: 'center', marginBottom: '3rem' }}
        >
          <div style={{ display: 'inline-block', padding: '1.5rem', background: 'rgba(74, 124, 63, 0.1)', borderRadius: '50%', marginBottom: '1rem' }}>
            <Calculator size={48} color="var(--green-primary)" />
          </div>
          <h1 style={{ fontSize: '2.5rem', color: 'var(--olive)', marginBottom: '1rem', fontFamily: 'Outfit, sans-serif' }}>
            {t('calcTitle') || 'Pesticide Calculator'}
          </h1>
          <p style={{ color: '#64748b', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
            {t('calcSub') || 'Accurately measure pesticide and water requirements for your farm.'}
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          style={{ background: 'white', borderRadius: '24px', padding: '2.5rem', boxShadow: '0 10px 40px rgba(0,0,0,0.08)' }}
        >
          <form onSubmit={calculateResults} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '1.5rem' }}>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '100%' }}>
              <label style={{ fontWeight: '600', color: 'var(--olive-deep)', fontSize: '1rem' }}>
                {t('calcArea') || 'Area (in hectares)'}
              </label>
              <input 
                type="text" name="area" value={formData.area} onChange={handleInputChange} 
                placeholder="e.g. 2.5" 
                style={{ width: '100%', boxSizing: 'border-box', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.1)', fontSize: '1.1rem', outline: 'none' }} 
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '100%' }}>
              <label style={{ fontWeight: '600', color: 'var(--olive-deep)', fontSize: '1rem' }}>
                {t('calcRate') || 'Pesticide Rate (ml/hectare)'}
              </label>
              <input 
                type="text" name="rate" value={formData.rate} onChange={handleInputChange} 
                placeholder="e.g. 500" 
                style={{ width: '100%', boxSizing: 'border-box', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.1)', fontSize: '1.1rem', outline: 'none' }} 
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '100%' }}>
              <label style={{ fontWeight: '600', color: 'var(--olive-deep)', fontSize: '1rem' }}>
                {t('calcVolume') || 'Spray Volume (L/hectare)'}
              </label>
              <input 
                type="text" name="volume" value={formData.volume} onChange={handleInputChange} 
                placeholder="e.g. 200" 
                style={{ width: '100%', boxSizing: 'border-box', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.1)', fontSize: '1.1rem', outline: 'none' }} 
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '100%' }}>
              <label style={{ fontWeight: '600', color: 'var(--olive-deep)', fontSize: '1rem' }}>
                {t('calcTankSize') || 'Tank Size (Liters)'}
              </label>
              <input 
                type="text" name="tankSize" value={formData.tankSize} onChange={handleInputChange} 
                placeholder="e.g. 15" 
                style={{ width: '100%', boxSizing: 'border-box', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.1)', fontSize: '1.1rem', outline: 'none' }} 
              />
            </div>

            {error && (
              <div style={{ gridColumn: '1 / -1', padding: '1rem', background: '#fee2e2', color: '#dc2626', borderRadius: '12px', fontWeight: '500', textAlign: 'center' }}>
                {error}
              </div>
            )}

            <div style={{ gridColumn: '1 / -1', marginTop: '1rem' }}>
              <button 
                type="submit" 
                disabled={isCalculating}
                style={{ 
                  width: '100%', padding: '1.2rem', background: 'var(--green-primary)', color: 'white', 
                  borderRadius: '16px', border: 'none', fontSize: '1.2rem', fontWeight: 'bold', 
                  cursor: isCalculating ? 'not-allowed' : 'pointer', opacity: isCalculating ? 0.8 : 1,
                  display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem',
                  boxShadow: '0 8px 16px rgba(74, 124, 63, 0.2)'
                }}
              >
                {isCalculating ? t('calcProcessing') || 'Calculating...' : t('calcBtn') || 'Calculate Now'}
              </button>
            </div>
          </form>
        </motion.div>

        {results && (
          <motion.div 
            ref={resultsRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}
          >
            <div style={{ background: 'white', padding: '1.5rem', borderRadius: '16px', textAlign: 'center', borderLeft: '4px solid var(--green-primary)', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
              <FlaskConical size={32} color="var(--green-primary)" style={{ margin: '0 auto 1rem' }} />
              <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '0.5rem', fontWeight: '600' }}>{t('calcTotalPesticide') || 'Total Pesticide'}</p>
              <p style={{ color: 'var(--olive-deep)', fontSize: '1.8rem', fontWeight: 'bold' }}>{results.totalPesticide} <span style={{fontSize: '1rem'}}>ml</span></p>
            </div>

            <div style={{ background: 'white', padding: '1.5rem', borderRadius: '16px', textAlign: 'center', borderLeft: '4px solid #e07a2c', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
              <FlaskConical size={32} color="#e07a2c" style={{ margin: '0 auto 1rem' }} />
              <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '0.5rem', fontWeight: '600' }}>{t('calcPesticidePerTank') || 'Pesticide per Tank'}</p>
              <p style={{ color: 'var(--olive-deep)', fontSize: '1.8rem', fontWeight: 'bold' }}>{results.pesticidePerTank} <span style={{fontSize: '1rem'}}>ml</span></p>
            </div>

            <div style={{ background: 'white', padding: '1.5rem', borderRadius: '16px', textAlign: 'center', borderLeft: '4px solid #4a7c3f', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
              <Calculator size={32} color="#4a7c3f" style={{ margin: '0 auto 1rem' }} />
              <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '0.5rem', fontWeight: '600' }}>{t('calcNumTanks') || 'Number of Tanks'}</p>
              <p style={{ color: 'var(--olive-deep)', fontSize: '1.8rem', fontWeight: 'bold' }}>{results.numberOfTanks}</p>
            </div>

            <div style={{ background: 'white', padding: '1.5rem', borderRadius: '16px', textAlign: 'center', borderLeft: '4px solid #3b82f6', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
              <Droplets size={32} color="#3b82f6" style={{ margin: '0 auto 1rem' }} />
              <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '0.5rem', fontWeight: '600' }}>{t('calcTotalWater') || 'Total Water'}</p>
              <p style={{ color: 'var(--olive-deep)', fontSize: '1.8rem', fontWeight: 'bold' }}>{results.totalWater} <span style={{fontSize: '1rem'}}>L</span></p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default PesticideCalculator;
