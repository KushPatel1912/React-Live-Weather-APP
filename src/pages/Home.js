import React, { useState } from 'react';
import WeatherHeader from '../components/WeatherHeader';
import WeatherStats from '../components/WeatherStats';
import LocationList from '../components/LocationList';
import HourlyForecast from '../components/HourlyForecast';
import DayForecast from '../components/DayForecast';

const TABS = [
  { key: 'hourly', label: 'Hourly' },
  { key: '10days', label: '10 Days' },
  { key: 'monthly', label: 'Monthly' },
];

const Home = () => {
  const [activeTab, setActiveTab] = useState('hourly');
  const [selectedCity, setSelectedCity] = useState({
    name: 'Bengaluru',
    country: 'IN',
    lat: 12.9716,
    lon: 77.5946,
  });

  return (
    <div style={{ maxWidth: 500, margin: '0 auto', paddingBottom: 80 }}>
      <LocationList onSelect={setSelectedCity} />
      <WeatherHeader city={selectedCity} />
      <div className="tabs">
        {TABS.map(tab => (
          <button
            key={tab.key}
            className={`tab-btn${activeTab === tab.key ? ' active' : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <WeatherStats city={selectedCity} />
      <div style={{ marginTop: 24 }}>
        {/* Tab content */}
        {activeTab === 'hourly' && <HourlyForecast city={selectedCity} />}
        {activeTab === '10days' && <DayForecast city={selectedCity} />}
        {activeTab === 'monthly' && (
          <div className="card" style={{ minHeight: 180 }}>
            <h3 style={{ color: 'var(--color-accent)' }}>Monthly Forecast (Coming Soon)</h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;