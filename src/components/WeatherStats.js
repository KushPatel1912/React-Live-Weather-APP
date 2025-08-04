import React, { useEffect, useState } from 'react';

const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;

function formatTime(ts, timezoneOffset) {
  const date = new Date((ts + timezoneOffset) * 1000);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function timeUntil(ts, timezoneOffset) {
  const now = Date.now() / 1000;
  const event = ts + timezoneOffset;
  let diff = event - now;
  if (diff < 0) diff += 24 * 3600; // next day
  const hours = Math.floor(diff / 3600);
  const mins = Math.floor((diff % 3600) / 60);
  return `${hours > 0 ? hours + 'h ' : ''}${mins}m`;
}

const WeatherStats = ({ city }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError(null);
      setStats(null);
      try {
        if (!city?.lat || !city?.lon) throw new Error('No city selected');
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/onecall?lat=${city.lat}&lon=${city.lon}&exclude=minutely,hourly,daily,alerts&appid=${API_KEY}&units=metric`
        );
        if (!res.ok) throw new Error('Failed to fetch weather stats');
        const data = await res.json();
        setStats({
          wind: data.current.wind_speed,
          rain: data.current.rain ? data.current.rain['1h'] : 0,
          pressure: data.current.pressure,
          uv: data.current.uvi,
          sunrise: data.current.sunrise,
          sunset: data.current.sunset,
          humidity: data.current.humidity,
          visibility: data.current.visibility,
          timezone_offset: data.timezone_offset,
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [city]);

  return (
    <div className="weather-stats-grid">
      {loading && <div style={{ color: 'var(--color-muted)', width: '100%' }}>Loading...</div>}
      {error && <div style={{ color: 'var(--color-muted)', width: '100%' }}>{error}</div>}
      {!loading && !error && stats && (
        <>
          <div className="weather-stat-card">
            <div className="stat-label">Wind speed</div>
            <div className="stat-value">{stats.wind} km/h</div>
            <div className="stat-sub">Current</div>
          </div>
          <div className="weather-stat-card">
            <div className="stat-label">Rain (last 1h)</div>
            <div className="stat-value">{stats.rain} mm</div>
            <div className="stat-sub">Current</div>
          </div>
          <div className="weather-stat-card">
            <div className="stat-label">Pressure</div>
            <div className="stat-value">{stats.pressure} hPa</div>
            <div className="stat-sub">Current</div>
          </div>
          <div className="weather-stat-card">
            <div className="stat-label">UV Index</div>
            <div className="stat-value">{stats.uv}</div>
            <div className="stat-sub">Current</div>
          </div>
          <div className="weather-stat-card">
            <div className="stat-label">Sunrise</div>
            <div className="stat-value">{formatTime(stats.sunrise, stats.timezone_offset)}</div>
            <div className="stat-sub">in {timeUntil(stats.sunrise, stats.timezone_offset)}</div>
          </div>
          <div className="weather-stat-card">
            <div className="stat-label">Sunset</div>
            <div className="stat-value">{formatTime(stats.sunset, stats.timezone_offset)}</div>
            <div className="stat-sub">in {timeUntil(stats.sunset, stats.timezone_offset)}</div>
          </div>
          <div className="weather-stat-card">
            <div className="stat-label">Humidity</div>
            <div className="stat-value">{stats.humidity}%</div>
            <div className="stat-sub">Current</div>
          </div>
          <div className="weather-stat-card">
            <div className="stat-label">Visibility</div>
            <div className="stat-value">{(stats.visibility / 1000).toFixed(1)} km</div>
            <div className="stat-sub">Current</div>
          </div>
        </>
      )}
    </div>
  );
};

export default WeatherStats;