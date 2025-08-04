import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import WeatherMap from '../components/WeatherMap';

const defaultCity = {
  name: 'Bengaluru',
  country: 'IN',
  lat: 12.9716,
  lon: 77.5946,
};

const Maps = () => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [recentLocations, setRecentLocations] = useState([]);
  const [locationWeather, setLocationWeather] = useState({});
  const [locationForecast, setLocationForecast] = useState({});
  const [showDetailedWeather, setShowDetailedWeather] = useState(false);
  const [detailedLocation, setDetailedLocation] = useState(null);
  const [activeTab, setActiveTab] = useState('current');

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    
    // Add to recent locations
    setRecentLocations(prev => {
      const filtered = prev.filter(loc => 
        loc.lat !== location.lat || loc.lon !== location.lon
      );
      return [location, ...filtered.slice(0, 4)]; // Keep only 5 recent
    });

    // Fetch weather for the selected location
    fetchWeatherForLocation(location);
  };

  const fetchWeatherForLocation = async (location) => {
    try {
      const apiKey = process.env.REACT_APP_WEATHER_API_KEY;
      
      // Fetch current weather
      const weatherResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lon}&appid=${apiKey}&units=metric`
      );
      
      if (weatherResponse.ok) {
        const weather = await weatherResponse.json();
        setLocationWeather(prev => ({
          ...prev,
          [`${location.lat}-${location.lon}`]: weather
        }));
      }

      // Fetch 5-day forecast
      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${location.lat}&lon=${location.lon}&appid=${apiKey}&units=metric`
      );
      
      if (forecastResponse.ok) {
        const forecast = await forecastResponse.json();
        setLocationForecast(prev => ({
          ...prev,
          [`${location.lat}-${location.lon}`]: forecast
        }));
      }
    } catch (error) {
      console.error('Error fetching weather:', error);
    }
  };

  const handleRecentLocationClick = async (location) => {
    setSelectedLocation(location);
    setDetailedLocation(location);
    setShowDetailedWeather(true);
    setActiveTab('current');
    
    // Fetch weather if not already cached
    const weatherKey = `${location.lat}-${location.lon}`;
    if (!locationWeather[weatherKey]) {
      await fetchWeatherForLocation(location);
    }
  };

  const closeDetailedWeather = () => {
    setShowDetailedWeather(false);
    setDetailedLocation(null);
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getDailyForecast = (forecastData) => {
    if (!forecastData || !forecastData.list) return [];
    
    const dailyData = {};
    forecastData.list.forEach(item => {
      const date = new Date(item.dt * 1000).toDateString();
      if (!dailyData[date]) {
        dailyData[date] = {
          date: item.dt,
          temp: item.main.temp,
          min: item.main.temp_min,
          max: item.main.temp_max,
          weather: item.weather[0],
          humidity: item.main.humidity,
          wind: item.wind.speed
        };
      } else {
        // Update min/max temperatures
        if (item.main.temp_min < dailyData[date].min) {
          dailyData[date].min = item.main.temp_min;
        }
        if (item.main.temp_max > dailyData[date].max) {
          dailyData[date].max = item.main.temp_max;
        }
      }
    });
    
    return Object.values(dailyData).slice(0, 5); // Return first 5 days
  };

  return (
    <motion.div 
      style={{ paddingBottom: 120 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <motion.h1 
          className="glass-card"
          style={{ 
            color: 'var(--color-accent)', 
            marginBottom: 32, 
            padding: '24px 32px',
            textAlign: 'center',
            fontSize: '32px',
            fontWeight: '800',
            textShadow: '0 0 30px rgba(0, 212, 255, 0.8)'
          }}
          whileHover={{ scale: 1.02 }}
        >
          Interactive Weather Map
        </motion.h1>
      </motion.div>
      
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        <WeatherMap 
          city={defaultCity} 
          onLocationSelect={handleLocationSelect}
        />
      </motion.div>
      
      {/* Selected Location Info */}
      {selectedLocation && (
        <motion.div
          className="glass-card"
          style={{ 
            padding: '32px', 
            margin: '32px 16px 0 16px',
            textAlign: 'center'
          }}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <motion.h2 
            style={{ 
              color: 'var(--color-accent)', 
              marginBottom: 16, 
              fontSize: '28px',
              fontWeight: '700',
              textShadow: '0 0 20px rgba(0, 212, 255, 0.5)'
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            Selected Location
          </motion.h2>
          
          <motion.div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '24px',
              marginTop: '24px',
              flexWrap: 'wrap'
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.6 }}
          >
            <motion.div
              className="glass-card"
              style={{ 
                padding: '20px 24px',
                border: '1px solid var(--color-border)',
                borderRadius: '20px',
                background: 'var(--gradient-glass)',
                backdropFilter: 'blur(30px)',
                minWidth: '200px'
              }}
              whileHover={{ 
                scale: 1.05,
                boxShadow: 'var(--shadow-lg), var(--shadow-neon)'
              }}
              whileTap={{ scale: 0.95 }}
            >
              <div style={{ fontSize: '14px', color: 'var(--color-text-secondary)', marginBottom: '8px' }}>
                City
              </div>
              <div style={{ fontSize: '20px', fontWeight: '700', color: 'var(--color-text)' }}>
                {selectedLocation.name}
              </div>
            </motion.div>
            
            <motion.div
              className="glass-card"
              style={{ 
                padding: '20px 24px',
                border: '1px solid var(--color-border)',
                borderRadius: '20px',
                background: 'var(--gradient-glass)',
                backdropFilter: 'blur(30px)',
                minWidth: '200px'
              }}
              whileHover={{ 
                scale: 1.05,
                boxShadow: 'var(--shadow-lg), var(--shadow-neon)'
              }}
              whileTap={{ scale: 0.95 }}
            >
              <div style={{ fontSize: '14px', color: 'var(--color-text-secondary)', marginBottom: '8px' }}>
                Country
              </div>
              <div style={{ fontSize: '20px', fontWeight: '700', color: 'var(--color-text)' }}>
                {selectedLocation.country}
              </div>
            </motion.div>
            
            <motion.div
              className="glass-card"
              style={{ 
                padding: '20px 24px',
                border: '1px solid var(--color-border)',
                borderRadius: '20px',
                background: 'var(--gradient-glass)',
                backdropFilter: 'blur(30px)',
                minWidth: '200px'
              }}
              whileHover={{ 
                scale: 1.05,
                boxShadow: 'var(--shadow-lg), var(--shadow-neon)'
              }}
              whileTap={{ scale: 0.95 }}
            >
              <div style={{ fontSize: '14px', color: 'var(--color-text-secondary)', marginBottom: '8px' }}>
                Coordinates
              </div>
              <div style={{ fontSize: '16px', fontWeight: '600', color: 'var(--color-text)' }}>
                {selectedLocation.lat.toFixed(4)}°, {selectedLocation.lon.toFixed(4)}°
              </div>
            </motion.div>
          </motion.div>

          {/* Weather Display for Selected Location */}
          {locationWeather[`${selectedLocation.lat}-${selectedLocation.lon}`] && (
            <motion.div
              style={{
                marginTop: '24px',
                padding: '24px',
                background: 'var(--gradient-glass)',
                borderRadius: '20px',
                border: '1px solid var(--color-border)',
                backdropFilter: 'blur(30px)'
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.6 }}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '16px'
              }}>
                <div>
                  <div style={{ 
                    fontSize: '18px', 
                    fontWeight: '600',
                    color: 'var(--color-text)',
                    marginBottom: '4px'
                  }}>
                    Current Weather
                  </div>
                  <div style={{ 
                    fontSize: '14px', 
                    color: 'var(--color-text-secondary)'
                  }}>
                    {locationWeather[`${selectedLocation.lat}-${selectedLocation.lon}`].weather[0].main}
                  </div>
                </div>
                
                <div style={{ textAlign: 'right' }}>
                  <div style={{ 
                    fontSize: '28px', 
                    fontWeight: '800',
                    color: 'var(--color-accent)',
                    textShadow: '0 0 20px rgba(0, 212, 255, 0.5)'
                  }}>
                    {Math.round(locationWeather[`${selectedLocation.lat}-${selectedLocation.lon}`].main.temp)}°C
                  </div>
                  <div style={{ 
                    fontSize: '12px', 
                    color: 'var(--color-text-secondary)'
                  }}>
                    Feels like {Math.round(locationWeather[`${selectedLocation.lat}-${selectedLocation.lon}`].main.feels_like)}°C
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      )}
      
      {/* Recent Locations */}
      {recentLocations.length > 0 && (
        <motion.div
          className="glass-card"
          style={{ 
            padding: '32px', 
            margin: '32px 16px 0 16px',
            textAlign: 'left'
          }}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <motion.h2 
            style={{ 
              color: 'var(--color-accent)', 
              marginBottom: 24, 
              fontSize: '28px',
              fontWeight: '700',
              textShadow: '0 0 20px rgba(0, 212, 255, 0.5)'
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0, duration: 0.6 }}
          >
            Recent Locations
          </motion.h2>
          
          <motion.div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '16px'
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.6 }}
          >
            {recentLocations.map((location, index) => {
              const weatherKey = `${location.lat}-${location.lon}`;
              const weather = locationWeather[weatherKey];
              
              return (
                <motion.div
                  key={weatherKey}
                  className="glass-card"
                  style={{ 
                    padding: '20px',
                    border: '1px solid var(--color-border)',
                    borderRadius: '16px',
                    background: 'var(--gradient-glass)',
                    backdropFilter: 'blur(30px)',
                    cursor: 'pointer'
                  }}
                  whileHover={{ 
                    scale: 1.02,
                    boxShadow: 'var(--shadow-md)',
                    borderColor: 'rgba(0, 212, 255, 0.3)'
                  }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleRecentLocationClick(location)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.4 + index * 0.1, duration: 0.4 }}
                >
                  <div style={{ 
                    fontSize: '18px', 
                    fontWeight: '600', 
                    color: 'var(--color-text)',
                    marginBottom: '8px'
                  }}>
                    {location.name}
                  </div>
                  <div style={{ 
                    fontSize: '14px', 
                    color: 'var(--color-text-secondary)',
                    marginBottom: '8px'
                  }}>
                    {location.country}
                  </div>
                  <div style={{ 
                    fontSize: '12px', 
                    color: 'var(--color-text-secondary)',
                    opacity: 0.8,
                    marginBottom: '12px'
                  }}>
                    {location.lat.toFixed(4)}°, {location.lon.toFixed(4)}°
                  </div>
                  
                  {/* Weather Info */}
                  {weather && (
                    <div style={{
                      padding: '12px',
                      background: 'var(--color-glass-hover)',
                      borderRadius: '12px',
                      marginTop: '8px'
                    }}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <div>
                          <div style={{ 
                            fontSize: '14px', 
                            color: 'var(--color-text-secondary)',
                            marginBottom: '4px'
                          }}>
                            {weather.weather[0].main}
                          </div>
                        </div>
                        <div style={{ 
                          fontSize: '20px', 
                          fontWeight: '700',
                          color: 'var(--color-accent)'
                        }}>
                          {Math.round(weather.main.temp)}°C
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>
      )}

      {/* Detailed Weather Dashboard Modal */}
      <AnimatePresence>
        {showDetailedWeather && detailedLocation && (
          <motion.div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.8)',
              backdropFilter: 'blur(10px)',
              zIndex: 1000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px'
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="glass-card"
              style={{
                maxWidth: '800px',
                width: '100%',
                maxHeight: '90vh',
                overflow: 'auto',
                padding: '48px',
                borderRadius: '28px',
                position: 'relative'
              }}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              {/* Close Button */}
              <motion.button
                onClick={closeDetailedWeather}
                style={{
                  position: 'absolute',
                  top: '20px',
                  right: '20px',
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  color: 'var(--color-text)',
                  cursor: 'pointer',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'var(--color-glass-hover)',
                  backdropFilter: 'blur(10px)'
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                ✕
              </motion.button>

              {/* Tab Navigation */}
              <motion.div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '12px',
                  marginBottom: '32px',
                  padding: '12px',
                  background: 'var(--gradient-glass)',
                  borderRadius: '24px',
                  border: '1px solid var(--color-border)'
                }}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                <motion.button
                  onClick={() => setActiveTab('current')}
                  style={{
                    padding: '16px 24px',
                    borderRadius: '16px',
                    border: 'none',
                    background: activeTab === 'current' ? 'var(--gradient-neon)' : 'transparent',
                    color: activeTab === 'current' ? 'white' : 'var(--color-text-secondary)',
                    fontWeight: '600',
                    fontSize: '16px',
                    cursor: 'pointer',
                    transition: 'all var(--transition-medium)'
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Current Weather
                </motion.button>
                <motion.button
                  onClick={() => setActiveTab('forecast')}
                  style={{
                    padding: '16px 24px',
                    borderRadius: '16px',
                    border: 'none',
                    background: activeTab === 'forecast' ? 'var(--gradient-neon)' : 'transparent',
                    color: activeTab === 'forecast' ? 'white' : 'var(--color-text-secondary)',
                    fontWeight: '600',
                    fontSize: '16px',
                    cursor: 'pointer',
                    transition: 'all var(--transition-medium)'
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  5 Days Forecast
                </motion.button>
              </motion.div>

              {/* Current Weather Content */}
              {activeTab === 'current' && locationWeather[`${detailedLocation.lat}-${detailedLocation.lon}`] && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4 }}
                >
                  <motion.h2
                    style={{
                      fontSize: '36px',
                      fontWeight: '800',
                      color: 'var(--color-accent)',
                      marginBottom: '32px',
                      textAlign: 'center',
                      textShadow: '0 0 30px rgba(0, 212, 255, 0.8)'
                    }}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                  >
                    Current Weather
                  </motion.h2>

                  <motion.h3
                    style={{
                      fontSize: '28px',
                      fontWeight: '700',
                      marginBottom: '24px',
                      color: 'var(--color-text)',
                      textAlign: 'center'
                    }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                  >
                    {detailedLocation.name}, {detailedLocation.country}
                  </motion.h3>

                  {/* Main Temperature Display */}
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
                    transition={{ delay: 0.6, duration: 0.8 }}
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
                      {Math.round(locationWeather[`${detailedLocation.lat}-${detailedLocation.lon}`].main.temp)}&deg;
                    </motion.h1>

                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '16px'
                    }}>
                      <motion.img
                        src={`https://openweathermap.org/img/wn/${locationWeather[`${detailedLocation.lat}-${detailedLocation.lon}`].weather[0].icon}@4x.png`}
                        alt={locationWeather[`${detailedLocation.lat}-${detailedLocation.lon}`].weather[0].main}
                        style={{ width: '120px', height: '120px' }}
                        whileHover={{
                          scale: 1.1,
                          rotate: 5,
                          filter: 'drop-shadow(0 0 20px rgba(0, 212, 255, 0.5))'
                        }}
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
                        {locationWeather[`${detailedLocation.lat}-${detailedLocation.lon}`].weather[0].main}
                      </motion.p>
                    </div>
                  </motion.div>

                  {/* Weather Details Grid */}
                  <motion.div
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      gap: '48px',
                      flexWrap: 'wrap'
                    }}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.8 }}
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
                        {Math.round(locationWeather[`${detailedLocation.lat}-${detailedLocation.lon}`].main.feels_like)}&deg;C
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
                        {locationWeather[`${detailedLocation.lat}-${detailedLocation.lon}`].main.humidity}%
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
                        {Math.round(locationWeather[`${detailedLocation.lat}-${detailedLocation.lon}`].wind?.speed * 3.6 || 0)} km/h
                      </div>
                    </motion.div>
                  </motion.div>
                </motion.div>
              )}

              {/* 5 Days Forecast Content */}
              {activeTab === 'forecast' && locationForecast[`${detailedLocation.lat}-${detailedLocation.lon}`] && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4 }}
                >
                  <motion.h2
                    style={{
                      fontSize: '36px',
                      fontWeight: '800',
                      color: 'var(--color-accent)',
                      marginBottom: '32px',
                      textAlign: 'center',
                      textShadow: '0 0 30px rgba(0, 212, 255, 0.8)'
                    }}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                  >
                    5 Days Forecast
                  </motion.h2>

                  <motion.h3
                    style={{
                      fontSize: '28px',
                      fontWeight: '700',
                      marginBottom: '32px',
                      color: 'var(--color-text)',
                      textAlign: 'center'
                    }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                  >
                    {detailedLocation.name}, {detailedLocation.country}
                  </motion.h3>

                  {/* Forecast List */}
                  <motion.div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '16px'
                    }}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                  >
                    {getDailyForecast(locationForecast[`${detailedLocation.lat}-${detailedLocation.lon}`]).map((day, index) => (
                      <motion.div
                        key={day.date}
                        className="glass-card"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '20px',
                          padding: '20px 24px',
                          borderRadius: '20px',
                          border: '1px solid var(--color-border)',
                          background: 'var(--gradient-glass)',
                          backdropFilter: 'blur(30px)',
                          cursor: 'pointer'
                        }}
                        whileHover={{
                          scale: 1.02,
                          boxShadow: 'var(--shadow-md)',
                          borderColor: 'rgba(0, 212, 255, 0.3)'
                        }}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8 + index * 0.1, duration: 0.4 }}
                      >
                        <div style={{ flex: 1 }}>
                          <div style={{
                            fontSize: '18px',
                            fontWeight: '600',
                            color: 'var(--color-text)',
                            marginBottom: '4px'
                          }}>
                            {formatDate(day.date)}
                          </div>
                          <div style={{
                            fontSize: '14px',
                            color: 'var(--color-text-secondary)'
                          }}>
                            {day.weather.main}
                          </div>
                        </div>

                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '16px'
                        }}>
                          <motion.img
                            src={`https://openweathermap.org/img/wn/${day.weather.icon}@2x.png`}
                            alt={day.weather.main}
                            style={{ width: '60px', height: '60px' }}
                            whileHover={{
                              scale: 1.1,
                              filter: 'drop-shadow(0 0 10px rgba(0, 212, 255, 0.5))'
                            }}
                          />
                        </div>

                        <div style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'flex-end',
                          gap: '4px'
                        }}>
                          <div style={{
                            fontSize: '24px',
                            fontWeight: '700',
                            color: 'var(--color-accent)',
                            textShadow: '0 0 10px rgba(0, 212, 255, 0.5)'
                          }}>
                            {Math.round(day.max)}°C
                          </div>
                          <div style={{
                            fontSize: '16px',
                            color: 'var(--color-text-secondary)'
                          }}>
                            {Math.round(day.min)}°C
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Maps;