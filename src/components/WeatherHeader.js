import React, { useEffect, useState } from 'react';

const WeatherHeader = ({ city }) => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      setLoading(true);
      setError(null);
      try {
        const apiKey = process.env.REACT_APP_WEATHER_API_KEY;
        let url;
        if (city && city.lat && city.lon) {
          url = `https://api.openweathermap.org/data/2.5/weather?lat=${city.lat}&lon=${city.lon}&appid=${apiKey}&units=metric`;
        } else {
          url = `https://api.openweathermap.org/data/2.5/weather?q=Bengaluru&appid=${apiKey}&units=metric`;
        }
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch weather');
        const data = await response.json();
        setWeather(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchWeather();
  }, [city]);

  return (
    <div className="card" style={{ background: '#232336', border: 'none' }}>
      <h2 className="mb-4">Current Weather</h2>
      {loading && <div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div>}
      {error && <div className="alert alert-danger">{error}</div>}
      {weather && (
        <div>
          <h3>{city?.name || weather.name}, {city?.country || weather.sys.country}</h3>
          <h1 className="display-4">{Math.round(weather.main.temp)}&deg;C</h1>
          <p className="lead mb-1">Feels like: {Math.round(weather.main.feels_like)}&deg;C</p>
          <p className="mb-0">Condition: {weather.weather[0].main}</p>
        </div>
      )}
    </div>
  );
};

export default WeatherHeader;