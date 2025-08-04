import React from 'react';
import { useWeather } from '../hooks/useWeather';
import './WeatherHeader.css';

const WeatherHeader = ({ city }) => {
  const { current, loading, error } = useWeather(city.lat, city.lon);

  if (loading) return <div className="weather-header loading">Loading weather data...</div>;
  if (error) return <div className="weather-header error">{error}</div>;
  if (!current) return null;

  const date = new Date();
  const formattedDate = date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  });

  return (
    <div className="weather-header">
      <div className="location">
        <h1>{city.name}, {city.country}</h1>
        <p className="date">{formattedDate}</p>
      </div>
      
      <div className="current-weather">
        <div className="temperature">
          <h2>{Math.round(current.main.temp)}°</h2>
          <p>Feels like {Math.round(current.main.feels_like)}°</p>
        </div>
        <div className="condition">
          <img 
            src={`http://openweathermap.org/img/wn/${current.weather[0].icon}@2x.png`}
            alt={current.weather[0].description}
          />
          <p>{current.weather[0].main}</p>
        </div>
      </div>
    </div>
  );
};

export default WeatherHeader;