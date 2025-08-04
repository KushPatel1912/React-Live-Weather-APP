import React, { useState } from 'react';
import WeatherHeader from '../components/WeatherHeader';
import WeatherStats from '../components/WeatherStats';
import HourlyForecast from '../components/HourlyForecast';
import DayForecast from '../components/DayForecast';
import MonthlyForecast from '../components/MonthlyForecast';
import './Home.css';

const TABS = [
  { key: 'hourly', label: 'Hourly' },
  { key: '10days', label: '10 Days' },
  { key: 'monthly', label: 'Monthly' }
];

const Home = () => {
  const [activeTab, setActiveTab] = useState('hourly');
  const [selectedCity, setSelectedCity] = useState({
    name: 'Bengaluru',
    country: 'IN',
    lat: 12.9716,
    lon: 77.5946
  });

  const renderForecast = () => {
    switch (activeTab) {
      case 'hourly':
        return <HourlyForecast city={selectedCity} />;
      case '10days':
        return <DayForecast city={selectedCity} />;
      case 'monthly':
        return <MonthlyForecast city={selectedCity} />;
      default:
        return null;
    }
  };

  return (
    <div className="home-page">
      <WeatherHeader city={selectedCity} />
      <div className="tabs">
        {TABS.map(tab => (
          <button
            key={tab.key}
            className={`tab-button ${activeTab === tab.key ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {renderForecast()}
      <WeatherStats city={selectedCity} />
    </div>
  );
};

export default Home;