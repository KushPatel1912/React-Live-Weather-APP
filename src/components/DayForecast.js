import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;

const DayForecast = ({ city }) => {
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchForecast = async () => {
      setLoading(true);
      setError(null);
      setForecast(null);
      try {
        if (!city?.lat || !city?.lon) throw new Error('No city selected');
        
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${city.lat}&lon=${city.lon}&appid=${API_KEY}&units=metric`
        );
        if (!res.ok) throw new Error('Failed to fetch forecast');
        const data = await res.json();
        
        // Group by day and get daily forecast
        const dailyData = data.list.reduce((acc, item) => {
          const date = new Date(item.dt * 1000);
          const day = date.toDateString();
          if (!acc[day]) {
            acc[day] = {
              date: date,
              temp: item.main.temp,
              weather: item.weather[0],
              items: []
            };
          }
          acc[day].items.push(item);
          return acc;
        }, {});
        
        // Convert to array and get 5 days
        const dailyForecast = Object.values(dailyData).slice(0, 5);
        setForecast(dailyForecast);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchForecast();
  }, [city]);

  const getDay = (date) => {
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  const getDate = (date) => {
    return date.getDate();
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
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="loading-shimmer-ultra"
            style={{
              height: '60px',
              borderRadius: '12px',
              background: 'var(--color-glass-hover)',
              border: '1px solid var(--color-border)'
            }}
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        textAlign: 'center', 
        color: 'var(--color-text-secondary)',
        padding: '20px'
      }}>
        Error: {error}
      </div>
    );
  }

  if (!forecast) {
    return (
      <div style={{ 
        textAlign: 'center', 
        color: 'var(--color-text-secondary)',
        padding: '20px'
      }}>
        No forecast data available
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
      {forecast.map((day, i) => (
        <motion.div
          key={i}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px',
            borderRadius: '12px',
            background: 'var(--color-glass-hover)',
            border: '1px solid var(--color-border)',
            transition: 'all 0.3s ease'
          }}
          whileHover={{
            scale: 1.02,
            background: 'var(--gradient-glass)',
            boxShadow: 'var(--shadow-md)'
          }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1, duration: 0.5 }}
        >
          {/* Day and Date */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ 
              fontSize: '14px', 
              fontWeight: '600',
              color: 'var(--color-text-secondary)',
              minWidth: '40px'
            }}>
              {getDate(day.date)}
            </div>
            <div style={{ 
              fontSize: '14px', 
              fontWeight: '600',
              color: 'var(--color-text)',
              minWidth: '30px'
            }}>
              {getDay(day.date)}
            </div>
          </div>

          {/* Weather Icon */}
          <div style={{ 
            fontSize: '20px',
            margin: '0 12px'
          }}>
            {getWeatherIcon(day.weather.id)}
          </div>

          {/* Temperature */}
          <div style={{ 
            fontSize: '16px',
            fontWeight: '700',
            color: 'var(--color-accent)',
            textShadow: '0 0 10px rgba(0, 212, 255, 0.6)'
          }}>
            {Math.round(day.temp)}°
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default DayForecast;