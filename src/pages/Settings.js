import React, { useContext } from 'react';
import { ThemeContext } from '../index';
import { FaUser, FaCog, FaSun, FaMoon } from 'react-icons/fa';
import { FaSliders } from 'react-icons/fa6';
import './Settings.css';

const Settings = () => {
  const { theme, setTheme } = useContext(ThemeContext);
  const cityInfo = {
    name: 'Bengaluru',
    country: 'India',
    temp: 13,
    weather: 'Thunderstorm',
    feelsLike: 12
  };

  return (
    <div className="settings-page">
      <div className="weather-header-mini">
        <h1>{cityInfo.name}, {cityInfo.country}</h1>
        <div className="weather-mini">
          <span className="temp">{cityInfo.temp}°</span>
          <span className="condition">{cityInfo.weather}</span>
          <span className="feels">Feels like {cityInfo.feelsLike}°</span>
        </div>
      </div>

      <div className="settings-section">
        <button className="settings-button">
          <FaUser className="icon" />
          <span>General info</span>
          <span className="arrow">›</span>
        </button>

        <button className="settings-button">
          <FaCog className="icon" />
          <span>Settings</span>
          <span className="arrow">›</span>
        </button>

        <button className="settings-button">
          <FaSliders className="icon" />
          <span>Preferences</span>
          <span className="arrow">›</span>
        </button>
      </div>

      <div className="theme-section">
        <h2>Theme</h2>
        <div className="theme-buttons">
          <button 
            className={`theme-button${theme === 'light' ? ' active' : ''}`}
            onClick={() => setTheme('light')}
          >
            <FaSun className="icon" />
            <span>Light Mode</span>
          </button>
          <button 
            className={`theme-button${theme === 'dark' ? ' active' : ''}`}
            onClick={() => setTheme('dark')}
          >
            <FaMoon className="icon" />
            <span>Dark Mode</span>
          </button>
        </div>
      </div>

      <div className="info-section">
        <div>
          <h3>Coming Soon</h3>
          <p className="text-muted">Units, wind speed, and more preferences</p>
        </div>
        <div>
          <h3>About</h3>
          <p className="text-muted">
            Live Weather App v1.0<br />
            Powered by OpenWeatherMap & Leaflet
          </p>
        </div>
      </div>
    </div>
  );
};

export default Settings;