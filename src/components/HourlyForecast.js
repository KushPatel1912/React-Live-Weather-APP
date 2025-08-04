import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;

const HourlyForecast = ({ city }) => {
  const [hourly, setHourly] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHourly = async () => {
      setLoading(true);
      setError(null);
      setHourly([]);
      try {
        if (!city?.lat || !city?.lon) throw new Error('No city selected');
        
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${city.lat}&lon=${city.lon}&appid=${API_KEY}&units=metric`
        );
        if (!res.ok) throw new Error('Failed to fetch hourly forecast');
        const data = await res.json();
        
        console.log('API Response:', data);
        console.log('Available data points:', data.list.length);
        console.log('First few data points:', data.list.slice(0, 3));
        
        // Get first 24 hours of data (8 data points for 3-hour intervals)
        const hourlyData = data.list.slice(0, 8).map(item => ({
          dt: item.dt,
          main: item.main, // Keep the full main object
          weather: item.weather[0],
          time: new Date(item.dt * 1000).getHours()
        }));
        
        console.log('Processed hourly data (24 hours):', hourlyData);
        console.log('Temperature values:', hourlyData.map(h => h.main?.temp));
        
        if (hourlyData.length === 0) {
          throw new Error('No hourly data available');
        }
        
        setHourly(hourlyData);
      } catch (err) {
        console.error('Error fetching hourly data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchHourly();
  }, [city]);

  const formatTime = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getWeatherIcon = (weatherId) => {
    if (weatherId >= 200 && weatherId < 300) return '⛈️';
    if (weatherId >= 300 && weatherId < 400) return '🌧️';
    if (weatherId >= 500 && weatherId < 600) return '🌧️';
    if (weatherId >= 600 && weatherId < 700) return '❄️';
    if (weatherId >= 700 && weatherId < 800) return '🌫️';
    if (weatherId === 800) return '☀️';
    if (weatherId >= 801 && weatherId < 900) return '☁️';
    return '🌤️';
  };

  if (loading) {
    return (
      <div style={{ 
        textAlign: 'center', 
        color: 'var(--color-text-secondary)',
        padding: '40px',
        fontSize: '16px'
      }}>
        Loading hourly forecast...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        textAlign: 'center', 
        color: 'var(--color-text-secondary)',
        padding: '40px',
        fontSize: '16px'
      }}>
        Error: {error}
      </div>
    );
  }

  if (!hourly || hourly.length === 0) {
    return (
      <div style={{ 
        textAlign: 'center', 
        color: 'var(--color-text-secondary)',
        padding: '40px',
        fontSize: '16px'
      }}>
        No hourly data available
      </div>
    );
  }

  // Calculate chart dimensions
  const temps = hourly.map(h => h.main?.temp || 0);
  const minTemp = Math.min(...temps);
  const maxTemp = Math.max(...temps);
  const tempRange = maxTemp - minTemp;
  const paddedMin = minTemp - (tempRange * 0.2);
  const paddedMax = maxTemp + (tempRange * 0.2);
  const paddedRange = paddedMax - paddedMin;

  return (
    <div style={{ 
      width: '100%', 
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px'
    }}>
      {/* Chart Container with Y-Axis Labels */}
      <div style={{
        width: '100%',
        height: '300px',
        position: 'relative',
        marginBottom: '24px',
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '12px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '20px',
        overflow: 'visible'
      }}>
        {/* SVG Chart */}
        <svg
          width="100%"
          height="100%"
          style={{ position: 'absolute', top: 0, left: 0 }}
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          {/* Background Grid and Subtle Gradient */}
          <defs>
            <pattern id="grid" width="12" height="12" patternUnits="userSpaceOnUse">
              <path d="M 12 0 L 0 0 0 12" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.3"/>
            </pattern>
            <linearGradient id="tempGradient" x1="0" y1="100" x2="0" y2="0" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#fff6e4" stopOpacity="0.13"/>
              <stop offset="60%" stopColor="#fff6e4" stopOpacity="0"/>
            </linearGradient>
          </defs>
          <rect width="100" height="100" fill="url(#tempGradient)" />
          <rect width="100" height="100" fill="url(#grid)" />

          {/* (Removed border and main horizontal grid lines to eliminate white rectangle-like borders) */}

          {/* Straight Temperature Line */}
          <motion.path
            d={
              (() => {
                // Calculate coordinates
                const points = hourly.map((h, i) => {
                  const temp = h.main?.temp || 0;
                  const x = (i / (hourly.length - 1)) * 77 + 8;
                  const y = 80 - ((temp - paddedMin) / paddedRange) * 65;
                  return { x, y };
                });
                if (points.length < 2) return '';
                // Straight line: connect points directly
                let d = `M ${points[0].x} ${points[0].y}`;
                for (let i = 1; i < points.length; i++) {
                  d += ` L ${points[i].x} ${points[i].y}`;
                }
                return d;
              })()
            }
            stroke="#ffaa33"
            strokeWidth="1"
            fill="none"
            strokeDasharray="4,3"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />

          {/* Elegant, Small Outlined Circles at Data Points */}
          {hourly.map((h, i) => {
            const temp = h.main?.temp || 0;
            const x = (i / (hourly.length - 1)) * 77 + 8;
            const y = 80 - ((temp - paddedMin) / paddedRange) * 65;
            return (
              <motion.circle
                key={i}
                cx={x}
                cy={y}
                r="1.2"
                fill="#fff6e4"
                stroke="#cc7c1c"
                strokeWidth="0.6"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: i * 0.15, duration: 0.4 }}
                whileHover={{ scale: 1.35, strokeWidth: 1.0 }}
              />
            );
          })}
        </svg>

        {/* Y-Axis Labels - Just Outside the Card */}
        <div style={{
          position: 'absolute',
          right: '-25px',
          top: '20px',
          height: '310px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          pointerEvents: 'none',
          width: '20px'
        }}>
          <div style={{
            fontSize: '16px',
            fontWeight: '700',
            color: '#ffaa33',
            textShadow: '0 0 8px #ffaa33',
            textAlign: 'right'
          }}>
            {Math.round(paddedMax)}°
          </div>
          <div style={{
            fontSize: '16px',
            fontWeight: '700',
            color: '#ffaa33',
            textShadow: '0 0 8px #ffaa33',
            textAlign: 'right'
          }}>
            {Math.round((paddedMax + paddedMin) / 2)}°
          </div>
          <div style={{
            fontSize: '16px',
            fontWeight: '700',
            color: '#ffaa33',
            textShadow: '0 0 8px #ffaa33',
            textAlign: 'right'
          }}>
            {Math.round(paddedMin)}°
          </div>
        </div>
      </div>

      {/* Time Labels */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        width: '100%',
        padding: '0 16px'
      }}>
        {hourly.map((h, i) => (
          <motion.div
            key={i}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px'
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
          >
            <div style={{
              fontSize: '14px',
              fontWeight: '600',
              color: 'var(--color-text-secondary)'
            }}>
              {formatTime(h.dt)}
            </div>
            <div style={{
              fontSize: '16px',
              fontWeight: '700',
              color: '#ffaa33',
              textShadow: '0 0 8px #ffaa33'
            }}>
              {Math.round(h.main?.temp || 0)}°
            </div>
            <div style={{
              fontSize: '20px',
              filter: 'drop-shadow(0 0 6px rgba(0, 212, 255, 0.4))'
            }}>
              {getWeatherIcon(h.weather.id)}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default HourlyForecast;