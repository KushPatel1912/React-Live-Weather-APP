import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import Settings from './pages/Settings';
import Maps from './pages/Maps';
import { FaCloudSun, FaMapMarkerAlt, FaMap, FaCog } from 'react-icons/fa';

function App() {
  return (
    <Router>
      <nav style={{ display: 'flex', justifyContent: 'center', gap: '2rem', padding: '1rem', background: 'var(--color-accent-light)' }}>
        <NavLink to="/" style={{ color: 'inherit', textDecoration: 'none' }}>Home</NavLink>
        <NavLink to="/settings" style={{ color: 'inherit', textDecoration: 'none' }}>Settings</NavLink>
        <NavLink to="/maps" style={{ color: 'inherit', textDecoration: 'none' }}>Maps</NavLink>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/maps" element={<Maps />} />
      </Routes>
      <div className="bottom-nav">
        <NavLink to="/" className={({ isActive }) => 'bottom-nav-btn' + (isActive ? ' active' : '')} end>
          <FaCloudSun size={22} />
          <span style={{ fontSize: 12 }}>Weather</span>
        </NavLink>
        <NavLink to="/location" className={({ isActive }) => 'bottom-nav-btn' + (isActive ? ' active' : '')}>
          <FaMapMarkerAlt size={22} />
          <span style={{ fontSize: 12 }}>Location</span>
        </NavLink>
        <NavLink to="/maps" className={({ isActive }) => 'bottom-nav-btn' + (isActive ? ' active' : '')}>
          <FaMap size={22} />
          <span style={{ fontSize: 12 }}>Maps</span>
        </NavLink>
        <NavLink to="/settings" className={({ isActive }) => 'bottom-nav-btn' + (isActive ? ' active' : '')}>
          <FaCog size={22} />
          <span style={{ fontSize: 12 }}>Settings</span>
        </NavLink>
      </div>
    </Router>
  );
}

export default App;
