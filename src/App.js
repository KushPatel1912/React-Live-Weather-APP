import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import Settings from './pages/Settings';
import Maps from './pages/Maps';

function App() {
  return (
    <Router>
      <nav style={{ display: 'flex', justifyContent: 'center', gap: '2rem', padding: '1rem', background: '#bbdefb' }}>
        <Link to="/">Home</Link>
        <Link to="/settings">Settings</Link>
        <Link to="/maps">Maps</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/maps" element={<Maps />} />
      </Routes>
    </Router>
  );
}

export default App;
