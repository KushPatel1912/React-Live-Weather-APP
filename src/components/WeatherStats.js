import React from 'react';
import { useWeather } from '../hooks/useWeather';
import { FaWind, FaThermometerHalf, FaCloud, FaTint, FaSun, FaEye, FaMoon } from 'react-icons/fa';
import './WeatherStats.css';

const formatTime = (timestamp) => {
  return new Date(timestamp * 1000).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};

const timeUntil = (timestamp) => {
  const now = Date.now() / 1000;
  let diff = timestamp - now;
  if (diff < 0) diff += 24 * 3600; // next day
  const hours = Math.floor(diff / 3600);
  const mins = Math.floor((diff % 3600) / 60);
  return `${hours}h ${mins}m`;
};

const WeatherStats = ({ city }) => {
  const { current, loading, error } = useWeather(city.lat, city.lon);

  if (loading) return <div className="weather-stats loading">Loading weather stats...</div>;
  if (error) return <div className="weather-stats error">{error}</div>;
  if (!current) return null;

  const stats = [
    {
      icon: <FaThermometerHalf />,
      label: 'Feels Like',
      value: `${Math.round(current.main.feels_like)}°`,
      subtext: 'Current'
    },
    {
      icon: <FaWind />,
      label: 'Wind',
      value: `${Math.round(current.wind.speed * 3.6)} km/h`,
      subtext: 'Current'
    },
    {
      icon: <FaCloud />,
      label: 'Clouds',
      value: `${current.clouds.all}%`,
      subtext: 'Coverage'
    },
    {
      icon: <FaTint />,
      label: 'Humidity',
      value: `${current.main.humidity}%`,
      subtext: 'Current'
    },
    {
      icon: <FaSun />,
      label: 'Pressure',
      value: `${current.main.pressure} hPa`,
      subtext: 'Current'
    },
    {
      icon: <FaEye />,
      label: 'Visibility',
      value: `${(current.visibility / 1000).toFixed(1)} km`,
      subtext: 'Current'
    }
  ];

  if (current.sys?.sunrise && current.sys?.sunset) {
    stats.push(
      {
        icon: <FaSun />,
        label: 'Sunrise',
        value: formatTime(current.sys.sunrise),
        subtext: `in ${timeUntil(current.sys.sunrise)}`
      },
      {
        icon: <FaMoon />,
        label: 'Sunset',
        value: formatTime(current.sys.sunset),
        subtext: `in ${timeUntil(current.sys.sunset)}`
      }
    );
  }

  return (
    <div className="weather-stats">
      {stats.map((stat, index) => (
        <div key={index} className="stat-item">
          <div className="icon">{stat.icon}</div>
          <div className="label">{stat.label}</div>
          <div className="value">{stat.value}</div>
          <div className="subtext">{stat.subtext}</div>
        </div>
      ))}
    </div>
  );
};

export default WeatherStats;