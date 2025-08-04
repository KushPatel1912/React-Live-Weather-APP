import React, { useContext } from 'react';
import { ThemeContext } from '../index';

const Settings = () => {
  const { theme, setTheme } = useContext(ThemeContext);
  return (
    <div style={{ maxWidth: 500, margin: '0 auto', paddingBottom: 80 }}>
      <div className="card" style={{ textAlign: 'left' }}>
        <h2 style={{ color: 'var(--color-accent)', marginBottom: 24 }}>Settings</h2>
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontWeight: 500, marginBottom: 8 }}>Theme</div>
          <div style={{ display: 'flex', gap: 16 }}>
            <button
              className={`tab-btn${theme === 'light' ? ' active' : ''}`}
              style={{ minWidth: 100 }}
              onClick={() => setTheme('light')}
            >
              Light Mode
            </button>
            <button
              className={`tab-btn${theme === 'dark' ? ' active' : ''}`}
              style={{ minWidth: 100 }}
              onClick={() => setTheme('dark')}
            >
              Dark Mode
            </button>
          </div>
        </div>
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontWeight: 500, marginBottom: 8 }}>Preferences</div>
          <div style={{ color: 'var(--color-muted)' }}>
            (Units, wind speed, etc. — coming soon)
          </div>
        </div>
        <div>
          <div style={{ fontWeight: 500, marginBottom: 8 }}>General Info</div>
          <div style={{ color: 'var(--color-muted)' }}>
            Live Weather App v1.0<br />Powered by OpenWeatherMap & Leaflet
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;