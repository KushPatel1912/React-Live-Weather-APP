import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import './App.css';
import Home from './pages/Home';
import Settings from './pages/Settings';
import Maps from './pages/Maps';



// Floating Particles Component
const FloatingParticles = () => (
  <div className="particles">
    {[...Array(9)].map((_, i) => (
      <div key={i} className="particle" style={{ top: `${Math.random() * 100}%` }}></div>
    ))}
  </div>
);

function App() {
  return (
    <Router>
      <FloatingParticles />
      <motion.nav 
        style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: '2rem', 
          padding: '1rem', 
          background: 'var(--gradient-glass)',
          backdropFilter: 'blur(30px)',
          borderBottom: '1px solid var(--color-border)',
          position: 'sticky',
          top: 0,
          zIndex: 50
        }}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <NavLink 
          to="/" 
          style={{ 
            color: 'inherit', 
            textDecoration: 'none',
            fontWeight: '600',
            transition: 'all var(--transition-medium)',
            padding: '8px 16px',
            borderRadius: '12px'
          }}
          className={({ isActive }) => isActive ? 'active' : ''}
        >
          Home
        </NavLink>
        <NavLink 
          to="/maps" 
          style={{ 
            color: 'inherit', 
            textDecoration: 'none',
            fontWeight: '600',
            transition: 'all var(--transition-medium)',
            padding: '8px 16px',
            borderRadius: '12px'
          }}
          className={({ isActive }) => isActive ? 'active' : ''}
        >
          Maps
        </NavLink>
        <NavLink 
          to="/settings" 
          style={{ 
            color: 'inherit', 
            textDecoration: 'none',
            fontWeight: '600',
            transition: 'all var(--transition-medium)',
            padding: '8px 16px',
            borderRadius: '12px'
          }}
          className={({ isActive }) => isActive ? 'active' : ''}
        >
          Settings
        </NavLink>
       
      </motion.nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/maps" element={<Maps />} />
        <Route path="/settings" element={<Settings />} />
        

      </Routes>
      
    </Router>
  );
}

export default App;
