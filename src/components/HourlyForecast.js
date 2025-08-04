import React from 'react';
import { useWeather } from '../hooks/useWeather';
import './HourlyForecast.css';

const HourlyForecast = ({ city }) => {
  const { hourly, loading, error } = useWeather(city.lat, city.lon);

  if (loading) return <div className="forecast loading">Loading forecast...</div>;
  if (error) return <div className="forecast error">{error}</div>;
  if (!hourly) return null;

  return (
    <div className="hourly-forecast">
      <div className="forecast-scroll">
        {hourly.slice(0, 24).map((hour, index) => {
          const date = new Date(hour.dt * 1000);
          return (
            <div key={hour.dt} className="forecast-hour">
              <span className="time">
                {index === 0 ? 'Now' : date.getHours() + ':00'}
              </span>
              <img 
                src={`http://openweathermap.org/img/wn/${hour.weather[0].icon}@2x.png`}
                alt={hour.weather[0].description}
                className="weather-icon"
              />
              <span className="temp">{Math.round(hour.temp)}°</span>
              <span className="condition">{hour.weather[0].main}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HourlyForecast;