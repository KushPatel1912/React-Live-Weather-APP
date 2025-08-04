import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { ThemeContext } from '../index';

const Settings = () => {
  const { theme, setTheme } = useContext(ThemeContext);
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div 
      style={{ 
        width: '100%', 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: '24px',
        minHeight: '100vh'
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Page Header */}
      <motion.div
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        style={{ marginBottom: '48px', textAlign: 'center' }}
      >
        <motion.h1 
          style={{ 
            fontSize: '48px',
            fontWeight: '900',
            color: 'var(--color-accent)',
            textShadow: '0 0 40px rgba(0, 212, 255, 0.8)',
            letterSpacing: '-1px',
            marginBottom: '16px'
          }}
          whileHover={{ 
            scale: 1.02,
            textShadow: '0 0 50px rgba(0, 212, 255, 1)'
          }}
          transition={{ duration: 0.3 }}
        >
          Settings
        </motion.h1>
        <motion.p
          style={{
            fontSize: '18px',
            color: 'var(--color-text-secondary)',
            fontWeight: '500'
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          Customize your weather experience
        </motion.p>
      </motion.div>
      
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '32px'
        }}
      >
        {/* Theme Section */}
        <motion.div 
          className="glass-card"
          style={{
            padding: '40px',
            borderRadius: '28px',
            background: 'var(--gradient-glass)',
            backdropFilter: 'blur(30px)',
            border: '1px solid var(--color-border)',
            position: 'relative',
            overflow: 'hidden'
          }}
          variants={itemVariants}
          whileHover={{ 
            scale: 1.02,
            boxShadow: 'var(--shadow-lg)'
          }}
          transition={{ duration: 0.3 }}
        >
          {/* Animated background elements */}
          <motion.div
            style={{
              position: 'absolute',
              top: '10%',
              right: '10%',
              width: '80px',
              height: '80px',
              background: 'var(--gradient-neon)',
              borderRadius: '50%',
              opacity: 0.1,
              filter: 'blur(20px)'
            }}
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />

          <motion.h2 
            style={{ 
              fontSize: '28px',
              fontWeight: '800',
              color: 'var(--color-accent)',
              marginBottom: '32px',
              textShadow: '0 0 30px rgba(0, 212, 255, 0.6)',
              letterSpacing: '-0.5px'
            }}
          >
            🎨 Theme
          </motion.h2>
          
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            <motion.button
              style={{ 
                flex: 1,
                minWidth: '160px',
                padding: '20px 24px',
                border: '2px solid var(--color-border)',
                borderRadius: '20px',
                background: theme === 'light' ? 'var(--gradient-neon)' : 'var(--gradient-glass)',
                backdropFilter: 'blur(30px)',
                color: theme === 'light' ? 'white' : 'var(--color-text)',
                fontWeight: '700',
                fontSize: '18px',
                cursor: 'pointer',
                transition: 'all var(--transition-medium)',
                position: 'relative',
                overflow: 'hidden'
              }}
              onClick={() => setTheme('light')}
              whileHover={{ 
                scale: 1.05,
                boxShadow: 'var(--shadow-lg), var(--shadow-neon)',
                borderColor: 'var(--color-accent)'
              }}
              whileTap={{ scale: 0.95 }}
            >
              <span style={{ fontSize: '24px', marginRight: '12px' }}>☀️</span>
              Light Mode
            </motion.button>
            
            <motion.button
              style={{ 
                flex: 1,
                minWidth: '160px',
                padding: '20px 24px',
                border: '2px solid var(--color-border)',
                borderRadius: '20px',
                background: theme === 'dark' ? 'var(--gradient-neon)' : 'var(--gradient-glass)',
                backdropFilter: 'blur(30px)',
                color: theme === 'dark' ? 'white' : 'var(--color-text)',
                fontWeight: '700',
                fontSize: '18px',
                cursor: 'pointer',
                transition: 'all var(--transition-medium)',
                position: 'relative',
                overflow: 'hidden'
              }}
              onClick={() => setTheme('dark')}
              whileHover={{ 
                scale: 1.05,
                boxShadow: 'var(--shadow-lg), var(--shadow-neon)',
                borderColor: 'var(--color-accent)'
              }}
              whileTap={{ scale: 0.95 }}
            >
              <span style={{ fontSize: '24px', marginRight: '12px' }}>🌙</span>
              Dark Mode
            </motion.button>
          </div>
        </motion.div>

        {/* Preferences Section */}
        <motion.div 
          className="glass-card"
          style={{
            padding: '40px',
            borderRadius: '28px',
            background: 'var(--gradient-glass)',
            backdropFilter: 'blur(30px)',
            border: '1px solid var(--color-border)',
            position: 'relative',
            overflow: 'hidden'
          }}
          variants={itemVariants}
          whileHover={{ 
            scale: 1.02,
            boxShadow: 'var(--shadow-lg)'
          }}
          transition={{ duration: 0.3 }}
        >
          {/* Animated background elements */}
          <motion.div
            style={{
              position: 'absolute',
              bottom: '10%',
              left: '10%',
              width: '60px',
              height: '60px',
              background: 'var(--gradient-neon)',
              borderRadius: '50%',
              opacity: 0.1,
              filter: 'blur(15px)'
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.15, 0.1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />

          <motion.h2 
            style={{ 
              fontSize: '28px',
              fontWeight: '800',
              color: 'var(--color-accent)',
              marginBottom: '32px',
              textShadow: '0 0 30px rgba(0, 212, 255, 0.6)',
              letterSpacing: '-0.5px'
            }}
          >
            ⚙️ Preferences
          </motion.h2>
          
          <div style={{ 
            display: 'flex',
            flexDirection: 'column',
            gap: '20px'
          }}>
            {[
              { icon: '🌡️', label: 'Temperature Units', value: 'Celsius' },
              { icon: '💨', label: 'Wind Speed', value: 'km/h' },
              { icon: '📏', label: 'Distance', value: 'Kilometers' },
              { icon: '⏰', label: 'Time Format', value: '24-hour' }
            ].map((item, index) => (
              <motion.div
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px 20px',
                  borderRadius: '16px',
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
                transition={{ delay: index * 0.1, duration: 0.4 }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '20px' }}>{item.icon}</span>
                  <span style={{ 
                    fontSize: '16px',
                    fontWeight: '600',
                    color: 'var(--color-text)'
                  }}>
                    {item.label}
                  </span>
                </div>
                <span style={{ 
                  fontSize: '16px',
                  fontWeight: '500',
                  color: 'var(--color-text-secondary)'
                }}>
                  {item.value}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* General Info Section */}
        <motion.div 
          className="glass-card"
          style={{
            padding: '40px',
            borderRadius: '28px',
            background: 'var(--gradient-glass)',
            backdropFilter: 'blur(30px)',
            border: '1px solid var(--color-border)',
            position: 'relative',
            overflow: 'hidden',
            gridColumn: '1 / -1'
          }}
          variants={itemVariants}
          whileHover={{ 
            scale: 1.02,
            boxShadow: 'var(--shadow-lg)'
          }}
          transition={{ duration: 0.3 }}
        >
          {/* Animated background elements */}
          <motion.div
            style={{
              position: 'absolute',
              top: '20%',
              right: '20%',
              width: '100px',
              height: '100px',
              background: 'var(--gradient-neon)',
              borderRadius: '50%',
              opacity: 0.08,
              filter: 'blur(25px)'
            }}
            animate={{
              scale: [1, 1.4, 1],
              opacity: [0.08, 0.12, 0.08],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />

          <motion.h2 
            style={{ 
              fontSize: '28px',
              fontWeight: '800',
              color: 'var(--color-accent)',
              marginBottom: '32px',
              textShadow: '0 0 30px rgba(0, 212, 255, 0.6)',
              letterSpacing: '-0.5px'
            }}
          >
            General Info
          </motion.h2>
          
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '24px'
          }}>
            {[
              { icon: '🌟', label: 'App Version', value: 'Live Weather App v2.0', highlight: true },
              { icon: '🌐', label: 'API Source', value: 'OpenWeatherMap API' },
              { icon: '⚛️', label: 'Built With', value: 'React & Framer Motion' },
              { icon: '🗺️', label: 'Maps', value: 'Interactive maps by Leaflet' }
            ].map((item, index) => (
              <motion.div
                key={index}
                style={{
                  padding: '20px 24px',
                  borderRadius: '20px',
                  background: 'var(--color-glass-hover)',
                  border: '1px solid var(--color-border)',
                  transition: 'all 0.3s ease'
                }}
                whileHover={{
                  scale: 1.03,
                  background: 'var(--gradient-glass)',
                  boxShadow: 'var(--shadow-md)'
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  <span style={{ fontSize: '24px' }}>{item.icon}</span>
                  <span style={{ 
                    fontSize: '14px',
                    fontWeight: '600',
                    color: 'var(--color-text-secondary)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    {item.label}
                  </span>
                </div>
                <div style={{ 
                  fontSize: '16px',
                  fontWeight: item.highlight ? '700' : '500',
                  color: item.highlight ? 'var(--color-accent)' : 'var(--color-text)',
                  textShadow: item.highlight ? '0 0 10px rgba(0, 212, 255, 0.5)' : 'none'
                }}>
                  {item.value}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Settings;