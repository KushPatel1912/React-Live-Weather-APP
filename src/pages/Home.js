import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import WeatherHeader from '../components/WeatherHeader';
import WeatherStats from '../components/WeatherStats';
import LocationList from '../components/LocationList';
import HourlyForecast from '../components/HourlyForecast';
import DayForecast from '../components/DayForecast';
import { useLocation as useLocationContext } from '../contexts/LocationContext';

const Home = () => {
  const location = useLocation();
  const { addToRecents } = useLocationContext();
  
  // Get selected city from route state or default to Bengaluru
  const [selectedCity, setSelectedCity] = useState(() => {
    if (location.state?.selectedCity) {
      return location.state.selectedCity;
    }
    return {
      name: 'Bengaluru',
      country: 'IN',
      lat: 12.9716,
      lon: 77.5946,
    };
  });

  // Update selected city when route state changes
  useEffect(() => {
    if (location.state?.selectedCity) {
      setSelectedCity(location.state.selectedCity);
      addToRecents(location.state.selectedCity);
    }
  }, [location.state, addToRecents]);

  const handleCitySelect = (city) => {
    setSelectedCity(city);
    addToRecents(city);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      style={{ 
        width: '100%', 
        maxWidth: '1400px', 
        margin: '0 auto', 
        padding: '32px',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        gap: '32px'
      }}
    >
      {/* Search Section */}
      <motion.div
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.8 }}
      >
        <LocationList onSelect={handleCitySelect} />
      </motion.div>
      
      {/* Current Weather Header */}
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.8 }}
      >
        <WeatherHeader city={selectedCity} />
      </motion.div>
      
      {/* Main Content Area - Daily Forecast (Left) + Hourly Forecast (Right) */}
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        style={{
          display: 'grid',
          gridTemplateColumns: '350px 1fr',
          gap: '32px',
          minHeight: '700px'
        }}
      >
        {/* Daily Forecast - Left Column */}
        <motion.div
          className="glass-card"
          style={{
            padding: '28px',
            borderRadius: '24px',
            background: 'var(--gradient-glass)',
            backdropFilter: 'blur(30px)',
            border: '1px solid var(--color-border)',
            display: 'flex',
            flexDirection: 'column',
            height: '600px'
          }}
          whileHover={{ 
            scale: 1.02,
            boxShadow: 'var(--shadow-lg)'
          }}
          transition={{ duration: 0.3 }}
        >
          <motion.h3 
            style={{ 
              color: 'var(--color-accent)', 
              marginBottom: 24, 
              fontSize: '22px',
              fontWeight: '700',
              textAlign: 'center',
              textShadow: '0 0 20px rgba(0, 212, 255, 0.6)'
            }}
          >
            Daily Forecast
          </motion.h3>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <DayForecast city={selectedCity} />
          </div>
        </motion.div>

        {/* Hourly Forecast Graph - Right Column */}
        <motion.div
          className="glass-card"
          style={{
            padding: '28px',
            borderRadius: '24px',
            background: 'var(--gradient-glass)',
            backdropFilter: 'blur(30px)',
            border: '1px solid var(--color-border)',
            height: '600px',
            display: 'flex',
            flexDirection: 'column'
          }}
          whileHover={{ 
            scale: 1.02,
            boxShadow: 'var(--shadow-lg)'
          }}
          transition={{ duration: 0.3 }}
        >
          <motion.h3 
            style={{ 
              color: 'var(--color-accent)', 
              marginBottom: 24, 
              fontSize: '22px',
              fontWeight: '700',
              textAlign: 'center',
              textShadow: '0 0 20px rgba(0, 212, 255, 0.6)'
            }}
          >
            Hourly Forecast
          </motion.h3>
          <div style={{ flex: 1 }}>
            <HourlyForecast city={selectedCity} />
          </div>
        </motion.div>
      </motion.div>

      {/* Weather Stats Grid - Below Both Sections */}
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.8 }}
      >
        <motion.div
          className="glass-card"
          style={{
            padding: '28px',
            borderRadius: '24px',
            background: 'var(--gradient-glass)',
            backdropFilter: 'blur(30px)',
            border: '1px solid var(--color-border)',
            display: 'flex',
            flexDirection: 'column'
          }}
          whileHover={{ 
            scale: 1.02,
            boxShadow: 'var(--shadow-lg)'
          }}
          transition={{ duration: 0.3 }}
        >
          <motion.h3 
            style={{ 
              color: 'var(--color-accent)', 
              marginBottom: 24, 
              fontSize: '22px',
              fontWeight: '700',
              textAlign: 'center',
              textShadow: '0 0 20px rgba(0, 212, 255, 0.6)'
            }}
          >
            Weather Stats
          </motion.h3>
          <WeatherStats city={selectedCity} />
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Home;