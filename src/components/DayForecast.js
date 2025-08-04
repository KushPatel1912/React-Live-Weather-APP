import React from 'react';
import { useWeather } from '../hooks/useWeather';
import './DayForecast.css';

const DayForecast = ({ city }) => {
  const { daily, loading, error } = useWeather(city.lat, city.lon);

  if (loading) return <div className="forecast loading">Loading forecast...</div>;
  if (error) return <div className="forecast error">{error}</div>;
  if (!daily) return null;

  return (
    <div className="day-forecast">
      {daily.slice(0, 10).map((day, index) => {
        const date = new Date(day.dt * 1000);
        const dayName = index === 0 
          ? 'Today' 
          : index === 1 
            ? 'Tomorrow' 
            : date.toLocaleDateString('en-US', { weekday: 'short' });

        return (
          <div key={day.dt} className="forecast-day">
            <span className="day">{dayName}</span>
            <img 
              src={`http://openweathermap.org/img/wn/${day.weather[0].icon}.png`}
              alt={day.weather[0].description}
            />
            <div className="temps">
              <span className="high">{Math.round(day.temp.max)}°</span>
              <span className="low">{Math.round(day.temp.min)}°</span>
            </div>
            <div className="condition">{day.weather[0].main}</div>
          </div>
        );
      })}
    </div>
  );
};

export default DayForecast;