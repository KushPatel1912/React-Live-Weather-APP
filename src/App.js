import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import Settings from './pages/Settings';
import Maps from './pages/Maps';
import LocationListPage from './pages/LocationListPage';
import { FaCloudSun, FaMapMarkerAlt, FaMap, FaCog } from 'react-icons/fa';

function App() {
  const [theme, setTheme] = useState('dark');

  return (
    <Router>
      <div className={`app-container ${theme}`}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/location" element={<LocationListPage />} />
          <Route path="/maps" element={<Maps />} />
          <Route path="/settings" element={<Settings theme={theme} onThemeChange={setTheme} />} />
        </Routes>
        
        <nav className="bottom-nav">
          <NavLink to="/" className={({ isActive }) => 'bottom-nav-btn' + (isActive ? ' active' : '')} end>
            <FaCloudSun size={22} />
            <span>Weather</span>
          </NavLink>
          <NavLink to="/location" className={({ isActive }) => 'bottom-nav-btn' + (isActive ? ' active' : '')}>
            <FaMapMarkerAlt size={22} />
            <span>Location</span>
          </NavLink>
          <NavLink to="/maps" className={({ isActive }) => 'bottom-nav-btn' + (isActive ? ' active' : '')}>
            <FaMap size={22} />
            <span>Maps</span>
          </NavLink>
          <NavLink to="/settings" className={({ isActive }) => 'bottom-nav-btn' + (isActive ? ' active' : '')}>
            <FaCog size={22} />
            <span>Settings</span>
          </NavLink>
        </nav>
      </div>
    </Router>
  );
}

export default App;
