import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const WeatherHeader = ({ city }) => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      setLoading(true);
      setError(null);
      try {
        const apiKey = process.env.REACT_APP_WEATHER_API_KEY;
        let url;
        if (city && city.lat && city.lon) {
          url = `https://api.openweathermap.org/data/2.5/weather?lat=${city.lat}&lon=${city.lon}&appid=${apiKey}&units=metric`;
        } else {
          url = `https://api.openweathermap.org/data/2.5/weather?q=Bengaluru&appid=${apiKey}&units=metric`;
        }
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch weather');
        const data = await response.json();
        setWeather(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchWeather();
  }, [city]);

  if (loading) {
    return (
      <motion.div 
        className="glass-card"
        style={{ 
          padding: '48px', 
          textAlign: 'center',
          margin: '24px 16px',
          minHeight: '400px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="loading-shimmer-ultra" style={{ height: '32px', marginBottom: '24px', width: '200px' }}></div>
        <div className="loading-shimmer-ultra" style={{ height: '80px', marginBottom: '24px', width: '300px' }}></div>
        <div className="loading-shimmer-ultra" style={{ height: '24px', width: '150px' }}></div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div 
        className="glass-card"
        style={{ 
          padding: '48px', 
          textAlign: 'center', 
          color: 'var(--color-text-secondary)',
          margin: '24px 16px',
          minHeight: '400px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div style={{ fontSize: '24px', fontWeight: '600' }}>Error: {error}</div>
      </motion.div>
    );
  }

  if (!weather) return null;

  return (
    <motion.div 
      className="glass-card"
      style={{ 
        padding: '48px', 
        textAlign: 'center',
        margin: '24px 16px',
        minHeight: '500px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
      whileHover={{ 
        scale: 1.02,
        transition: { duration: 0.3 }
      }}
    >
      {/* Animated Background Elements */}
      <motion.div
        style={{
          position: 'absolute',
          top: '10%',
          right: '10%',
          width: '100px',
          height: '100px',
          background: 'var(--gradient-neon)',
          borderRadius: '50%',
          opacity: 0.1,
          filter: 'blur(20px)'
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <motion.div
        style={{
          position: 'absolute',
          bottom: '20%',
          left: '5%',
          width: '80px',
          height: '80px',
          background: 'var(--gradient-accent)',
          borderRadius: '50%',
          opacity: 0.1,
          filter: 'blur(15px)'
        }}
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.1, 0.15, 0.1],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      />

      <motion.h2 
        style={{ 
          marginBottom: '32px', 
          fontSize: '36px', 
          fontWeight: '800',
          color: 'var(--color-accent)',
          textShadow: '0 0 30px rgba(0, 212, 255, 0.8)',
          letterSpacing: '-0.5px'
        }}
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        Current Weather
      </motion.h2>
      
      <motion.h3 
        style={{ 
          fontSize: '32px', 
          fontWeight: '700', 
          marginBottom: '24px',
          color: 'var(--color-text)',
          letterSpacing: '-0.3px'
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      >
        {city?.name || weather.name}, {city?.country || weather.sys.country}
      </motion.h3>
      
      <motion.div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '24px',
          marginBottom: '32px'
        }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.7, duration: 0.8 }}
      >
        <motion.h1 
          style={{ 
            fontSize: '120px', 
            fontWeight: '900', 
            color: 'var(--color-accent)',
            textShadow: '0 0 50px rgba(0, 212, 255, 1)',
            letterSpacing: '-2px',
            lineHeight: '1'
          }}
          whileHover={{ 
            scale: 1.05,
            textShadow: '0 0 60px rgba(0, 212, 255, 1.2)'
          }}
          animate={{
            textShadow: [
              '0 0 50px rgba(0, 212, 255, 1)',
              '0 0 60px rgba(0, 212, 255, 1.2)',
              '0 0 50px rgba(0, 212, 255, 1)'
            ]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {Math.round(weather.main.temp)}&deg;
        </motion.h1>
        
        <motion.div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px'
          }}
        >
          <motion.img
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`}
            alt={weather.weather[0].main}
            style={{ width: '120px', height: '120px' }}
            whileHover={{ 
              scale: 1.1, 
              rotate: 5,
              filter: 'drop-shadow(0 0 20px rgba(0, 212, 255, 0.5))'
            }}
            transition={{ duration: 0.3 }}
            animate={{
              filter: [
                'drop-shadow(0 0 20px rgba(0, 212, 255, 0.5))',
                'drop-shadow(0 0 30px rgba(0, 212, 255, 0.8))',
                'drop-shadow(0 0 20px rgba(0, 212, 255, 0.5))'
              ]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.p 
            style={{ 
              fontSize: '24px', 
              fontWeight: '600',
              color: 'var(--color-text)',
              margin: 0,
              textAlign: 'center'
            }}
            whileHover={{ scale: 1.05 }}
          >
            {weather.weather[0].main}
          </motion.p>
        </motion.div>
      </motion.div>
      
      <motion.div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '48px',
          flexWrap: 'wrap'
        }}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.8 }}
      >
        <motion.div
          style={{
            textAlign: 'center',
            padding: '20px',
            background: 'var(--gradient-glass)',
            borderRadius: '20px',
            border: '1px solid var(--color-border)',
            minWidth: '200px'
          }}
          whileHover={{ 
            scale: 1.05,
            boxShadow: 'var(--shadow-lg), var(--shadow-neon)',
            borderColor: 'rgba(0, 212, 255, 0.3)'
          }}
          transition={{ duration: 0.3 }}
        >
          <div style={{ 
            fontSize: '18px', 
            color: 'var(--color-text-secondary)',
            marginBottom: '8px',
            fontWeight: '500'
          }}>
            Feels Like
          </div>
          <div style={{ 
            fontSize: '32px', 
            fontWeight: '700',
            color: 'var(--color-accent)',
            textShadow: '0 0 20px rgba(0, 212, 255, 0.5)'
          }}>
            {Math.round(weather.main.feels_like)}&deg;C
          </div>
        </motion.div>
        
        <motion.div
          style={{
            textAlign: 'center',
            padding: '20px',
            background: 'var(--gradient-glass)',
            borderRadius: '20px',
            border: '1px solid var(--color-border)',
            minWidth: '200px'
          }}
          whileHover={{ 
            scale: 1.05,
            boxShadow: 'var(--shadow-lg), var(--shadow-neon)',
            borderColor: 'rgba(0, 212, 255, 0.3)'
          }}
          transition={{ duration: 0.3 }}
        >
          <div style={{ 
            fontSize: '18px', 
            color: 'var(--color-text-secondary)',
            marginBottom: '8px',
            fontWeight: '500'
          }}>
            Humidity
          </div>
          <div style={{ 
            fontSize: '32px', 
            fontWeight: '700',
            color: 'var(--color-accent)',
            textShadow: '0 0 20px rgba(0, 212, 255, 0.5)'
          }}>
            {weather.main.humidity}%
          </div>
        </motion.div>
        
        <motion.div
          style={{
            textAlign: 'center',
            padding: '20px',
            background: 'var(--gradient-glass)',
            borderRadius: '20px',
            border: '1px solid var(--color-border)',
            minWidth: '200px'
          }}
          whileHover={{ 
            scale: 1.05,
            boxShadow: 'var(--shadow-lg), var(--shadow-neon)',
            borderColor: 'rgba(0, 212, 255, 0.3)'
          }}
          transition={{ duration: 0.3 }}
        >
          <div style={{ 
            fontSize: '18px', 
            color: 'var(--color-text-secondary)',
            marginBottom: '8px',
            fontWeight: '500'
          }}>
            Wind Speed
          </div>
          <div style={{ 
            fontSize: '32px', 
            fontWeight: '700',
            color: 'var(--color-accent)',
            textShadow: '0 0 20px rgba(0, 212, 255, 0.5)'
          }}>
            {Math.round(weather.wind?.speed * 3.6 || 0)} km/h
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default WeatherHeader;